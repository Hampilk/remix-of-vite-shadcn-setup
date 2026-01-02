import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ComponentInstance, InstanceProps } from '@/types/componentInstance';

// ============================================================================
// Types
// ============================================================================

export interface TransformState {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
}

export interface Transform3DState {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  perspective: number;
}

export interface EffectsState {
  shadow: string;
  blur: number;
  backdropBlur: number;
  hueRotate: number;
  saturation: number;
  brightness: number;
  grayscale: number;
  invert: number;
  liquidGlass: boolean;
  alphaMask: number;
  angle: number;
}

export interface SpacingState {
  spaceX: string;
  spaceY: string;
  gapX: string;
  gapY: string;
}

export interface AlignmentState {
  justifyContent: string;
  alignItems: string;
}

export interface BorderState {
  color: string;
  width: string;
  style: string;
  ringColor: string;
  ringWidth: string;
  radius: string;
  activeSides: {
    all: boolean;
    t: boolean;
    r: boolean;
    b: boolean;
    l: boolean;
  };
}

export interface ColorPickerValue {
  type: 'solid' | 'linear' | 'radial' | 'conic';
  color: string;
  opacity: number;
  gradient: {
    from: { color: string; position: number };
    via: { color: string; position: number };
    to: { color: string; position: number };
    direction: number;
    radialPosition: { x: number; y: number };
    conicAngle: number;
  };
}

export interface InspectorState {
  classes: string[];
  textContent: string;
  padding: { l: number; t: number; r: number; b: number };
  margin: { x: number; y: number };
  size: { width: string; height: string; maxWidth: string; maxHeight: string };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    textAlign: string;
  };
  transforms: TransformState;
  transforms3D: Transform3DState;
  border: BorderState;
  effects: EffectsState;
  opacity: number;
  appearance: {
    blendMode: string;
    backgroundColor: ColorPickerValue;
    backgroundImage: string;
  };
  position: {
    type: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
    zIndex: string;
  };
  spacing: SpacingState;
  alignment: AlignmentState;
  familyElements: string[];
  embed: string;
  link: string;
  inlineCSS: string;
  elementId: string;
}

interface HistoryEntry {
  state: InspectorState;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_HISTORY_SIZE = 50;
const BATCH_DELAY_MS = 16; // ~60fps
const DEBOUNCE_HISTORY_MS = 300;

export const DEFAULT_COLOR_PICKER_VALUE: ColorPickerValue = {
  type: 'solid',
  color: '#3b82f6',
  opacity: 100,
  gradient: {
    from: { color: '#3b82f6', position: 0 },
    via: { color: '#8b5cf6', position: 50 },
    to: { color: '#ec4899', position: 100 },
    direction: 90,
    radialPosition: { x: 50, y: 50 },
    conicAngle: 0,
  },
};

export const DEFAULT_INSPECTOR_STATE: InspectorState = {
  classes: [],
  textContent: 'Sample Text',
  padding: { l: 16, t: 16, r: 16, b: 16 },
  margin: { x: 0, y: 0 },
  size: { width: 'auto', height: 'auto', maxWidth: '', maxHeight: '' },
  typography: {
    fontFamily: 'sans',
    fontSize: 'base',
    fontWeight: 'normal',
    textColor: '#ffffff',
    textAlign: 'left',
  },
  transforms: {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 100,
    skewX: 0,
    skewY: 0,
  },
  transforms3D: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 0,
  },
  border: {
    color: '#374151',
    width: '1',
    style: 'solid',
    ringColor: '#3b82f6',
    ringWidth: '0',
    radius: 'md',
    activeSides: { all: true, t: true, r: true, b: true, l: true },
  },
  effects: {
    shadow: 'none',
    blur: 0,
    backdropBlur: 0,
    hueRotate: 0,
    saturation: 100,
    brightness: 100,
    grayscale: 0,
    invert: 0,
    liquidGlass: false,
    alphaMask: 100,
    angle: 0,
  },
  opacity: 100,
  appearance: {
    blendMode: 'normal',
    backgroundColor: { ...DEFAULT_COLOR_PICKER_VALUE },
    backgroundImage: '',
  },
  position: {
    type: 'relative',
    top: '',
    right: '',
    bottom: '',
    left: '',
    zIndex: '',
  },
  spacing: {
    spaceX: '0',
    spaceY: '0',
    gapX: '0',
    gapY: '0',
  },
  alignment: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  familyElements: [],
  embed: '',
  link: '',
  inlineCSS: '',
  elementId: '',
};

// ============================================================================
// Helper Functions
// ============================================================================

function parseSpacing(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  const match = String(value).match(/^(-?\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(String(value)) || 0;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

// ============================================================================
// Converters
// ============================================================================

export function instanceToInspectorState(instance: ComponentInstance | null): InspectorState {
  if (!instance) return deepClone(DEFAULT_INSPECTOR_STATE);

  const props = instance.props;

  return {
    ...deepClone(DEFAULT_INSPECTOR_STATE),
    classes: [],
    textContent: props.text || '',
    padding: {
      l: parseSpacing(props.paddingLeft) || parseSpacing(props.padding) || 16,
      t: parseSpacing(props.paddingTop) || parseSpacing(props.padding) || 16,
      r: parseSpacing(props.paddingRight) || parseSpacing(props.padding) || 16,
      b: parseSpacing(props.paddingBottom) || parseSpacing(props.padding) || 16,
    },
    margin: {
      x: parseSpacing(props.marginLeft) || parseSpacing(props.marginRight) || 0,
      y: parseSpacing(props.marginTop) || parseSpacing(props.marginBottom) || 0,
    },
    size: {
      width: String(props.width || 'auto'),
      height: String(props.height || 'auto'),
      maxWidth: String(props.maxWidth || ''),
      maxHeight: String(props.maxHeight || ''),
    },
    typography: {
      fontFamily: props.fontFamily || 'sans',
      fontSize: props.fontSize || 'base',
      fontWeight: String(props.fontWeight || 'normal'),
      textColor: props.textColor || '#ffffff',
      textAlign: props.textAlign || 'left',
    },
    transforms: {
      translateX: parseNumber(props.translateX) || 0,
      translateY: parseNumber(props.translateY) || 0,
      rotate: props.rotate || props.rotation || 0,
      scale: (props.scale || 1) * 100,
      skewX: props.skewX || 0,
      skewY: props.skewY || 0,
    },
    transforms3D: {
      rotateX: props.rotateX || 0,
      rotateY: props.rotateY || 0,
      rotateZ: props.rotateZ || 0,
      perspective: props.perspective || 0,
    },
    border: {
      color: props.borderColor || '#374151',
      width: String(parseSpacing(props.borderWidth) || 1),
      style: props.borderStyle || 'solid',
      ringColor: '#3b82f6',
      ringWidth: '0',
      radius: props.borderRadius || 'md',
      activeSides: { all: true, t: true, r: true, b: true, l: true },
    },
    effects: {
      shadow: props.shadow || 'none',
      blur: props.blur || 0,
      backdropBlur: props.backdropBlur || 0,
      hueRotate: props.hueRotate || 0,
      saturation: props.saturation ?? props.saturate ?? 100,
      brightness: props.brightness || 100,
      grayscale: props.grayscale || 0,
      invert: props.invert || 0,
      liquidGlass: false,
      alphaMask: 100,
      angle: 0,
    },
    opacity: (props.opacity ?? 1) * 100,
    appearance: {
      blendMode: 'normal',
      backgroundColor: {
        ...deepClone(DEFAULT_COLOR_PICKER_VALUE),
        color: props.backgroundColor || '#3b82f6',
      },
      backgroundImage: '',
    },
    position: {
      type: 'relative',
      top: '',
      right: '',
      bottom: '',
      left: '',
      zIndex: String(instance.zIndex || ''),
    },
    spacing: {
      spaceX: '0',
      spaceY: '0',
      gapX: props.gap || '0',
      gapY: props.gap || '0',
    },
    alignment: {
      justifyContent: props.justifyContent || 'flex-start',
      alignItems: props.alignItems || 'flex-start',
    },
    familyElements: [],
    embed: '',
    link: '',
    inlineCSS: '',
    elementId: instance.id,
  };
}

function colorPickerValueToCSS(value: ColorPickerValue): { 
  backgroundColor?: string; 
  backgroundImage?: string;
} {
  if (value.type === 'solid') {
    return { backgroundColor: value.color };
  }

  const { gradient } = value;
  const colorStops = `${gradient.from.color} ${gradient.from.position}%, ${gradient.via.color} ${gradient.via.position}%, ${gradient.to.color} ${gradient.to.position}%`;

  switch (value.type) {
    case 'linear':
      return { backgroundImage: `linear-gradient(${gradient.direction}deg, ${colorStops})` };
    case 'radial':
      return { backgroundImage: `radial-gradient(circle at ${gradient.radialPosition.x}% ${gradient.radialPosition.y}%, ${colorStops})` };
    case 'conic':
      return { backgroundImage: `conic-gradient(from ${gradient.conicAngle}deg at ${gradient.radialPosition.x}% ${gradient.radialPosition.y}%, ${colorStops})` };
    default:
      return { backgroundColor: value.color };
  }
}

export function inspectorStateToProps(state: InspectorState): Partial<InstanceProps> {
  const bgStyles = colorPickerValueToCSS(state.appearance.backgroundColor);
  
  return {
    text: state.textContent,
    padding: `${state.padding.t}px`,
    paddingTop: `${state.padding.t}px`,
    paddingRight: `${state.padding.r}px`,
    paddingBottom: `${state.padding.b}px`,
    paddingLeft: `${state.padding.l}px`,
    marginTop: `${state.margin.y}px`,
    marginBottom: `${state.margin.y}px`,
    marginLeft: `${state.margin.x}px`,
    marginRight: `${state.margin.x}px`,
    width: state.size.width === 'auto' ? undefined : state.size.width,
    height: state.size.height === 'auto' ? undefined : state.size.height,
    maxWidth: state.size.maxWidth || undefined,
    maxHeight: state.size.maxHeight || undefined,
    fontFamily: state.typography.fontFamily,
    fontSize: state.typography.fontSize,
    fontWeight: state.typography.fontWeight,
    textColor: state.typography.textColor,
    textAlign: state.typography.textAlign as InstanceProps['textAlign'],
    translateX: state.transforms.translateX,
    translateY: state.transforms.translateY,
    rotate: state.transforms.rotate,
    rotation: state.transforms.rotate,
    scale: state.transforms.scale / 100,
    skewX: state.transforms.skewX,
    skewY: state.transforms.skewY,
    rotateX: state.transforms3D.rotateX,
    rotateY: state.transforms3D.rotateY,
    rotateZ: state.transforms3D.rotateZ,
    perspective: state.transforms3D.perspective,
    borderColor: state.border.color,
    borderWidth: `${state.border.width}px`,
    borderStyle: state.border.style as InstanceProps['borderStyle'],
    borderRadius: state.border.radius,
    shadow: state.effects.shadow,
    blur: state.effects.blur,
    backdropBlur: state.effects.backdropBlur,
    hueRotate: state.effects.hueRotate,
    saturation: state.effects.saturation,
    saturate: state.effects.saturation,
    brightness: state.effects.brightness,
    grayscale: state.effects.grayscale,
    invert: state.effects.invert,
    opacity: state.opacity / 100,
    backgroundColor: bgStyles.backgroundColor,
    backgroundImage: bgStyles.backgroundImage,
    gap: state.spacing.gapX,
    justifyContent: state.alignment.justifyContent as InstanceProps['justifyContent'],
    alignItems: state.alignment.alignItems as InstanceProps['alignItems'],
  };
}

// ============================================================================
// Hook
// ============================================================================

export interface UseInspectorStoreReturn {
  state: InspectorState;
  setState: React.Dispatch<React.SetStateAction<InspectorState>>;
  updateState: (updater: (prev: InspectorState) => InspectorState) => void;
  batchUpdate: (updates: Partial<InspectorState>) => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  reset: () => void;
  pushToHistory: () => void;
  clearHistory: () => void;
}

interface UseInspectorStoreOptions {
  instance?: ComponentInstance | null;
  onUpdateProps?: (props: Partial<InstanceProps>) => void;
  enableAutoHistory?: boolean;
  historyDebounceMs?: number;
}

export function useInspectorStore(options: UseInspectorStoreOptions = {}): UseInspectorStoreReturn {
  const { 
    instance, 
    onUpdateProps,
    enableAutoHistory = true,
    historyDebounceMs = DEBOUNCE_HISTORY_MS
  } = options;
  
  const [state, setStateInternal] = useState<InspectorState>(() => 
    instanceToInspectorState(instance)
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  
  const instanceIdRef = useRef<string | null>(null);
  const isUpdatingRef = useRef(false);
  const batchTimeoutRef = useRef<number | null>(null);
  const historyTimeoutRef = useRef<number | null>(null);
  const pendingPropsRef = useRef<Partial<InstanceProps> | null>(null);
  const lastPropsRef = useRef<Partial<InstanceProps> | null>(null);

  // Sync state when instance changes
  useEffect(() => {
    if (instance?.id !== instanceIdRef.current) {
      instanceIdRef.current = instance?.id || null;
      isUpdatingRef.current = true;
      
      const newState = instanceToInspectorState(instance);
      setStateInternal(newState);
      setHistory([]);
      setFuture([]);
      lastPropsRef.current = null;
      
      requestAnimationFrame(() => {
        isUpdatingRef.current = false;
      });
    }
  }, [instance?.id]);

  // Batched props update effect
  useEffect(() => {
    if (pendingPropsRef.current && onUpdateProps && !isUpdatingRef.current) {
      const props = pendingPropsRef.current;
      
      // Only update if props actually changed
      if (!shallowEqual(props, lastPropsRef.current)) {
        onUpdateProps(props);
        lastPropsRef.current = props;
      }
      
      pendingPropsRef.current = null;
    }
  });

  // Auto history effect
  useEffect(() => {
    if (!enableAutoHistory) return;

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = window.setTimeout(() => {
      if (!isUpdatingRef.current) {
        pushToHistory();
      }
    }, historyDebounceMs);

    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, [state, enableAutoHistory, historyDebounceMs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, []);

  // Queue props update
  const queuePropsUpdate = useCallback((newState: InspectorState) => {
    if (!isUpdatingRef.current) {
      pendingPropsRef.current = inspectorStateToProps(newState);
    }
  }, []);

  // Standard setState
  const setState = useCallback<React.Dispatch<React.SetStateAction<InspectorState>>>(
    (action) => {
      setStateInternal((prev) => {
        const newState = typeof action === 'function' ? action(prev) : action;
        queuePropsUpdate(newState);
        return newState;
      });
    },
    [queuePropsUpdate]
  );

  // Optimized updateState
  const updateState = useCallback((updater: (prev: InspectorState) => InspectorState) => {
    setState(updater);
  }, [setState]);

  // Batch update for multiple changes at once
  const batchUpdate = useCallback((updates: Partial<InspectorState>) => {
    setState(prev => {
      const newState = { ...prev };
      
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          (newState as any)[key] = updates[key];
        }
      }
      
      return newState;
    });
  }, [setState]);

  // Push to history
  const pushToHistory = useCallback(() => {
    setHistory(prev => {
      const newEntry: HistoryEntry = {
        state: deepClone(state),
        timestamp: Date.now(),
      };
      
      // Check if state actually changed
      if (prev.length > 0) {
        const lastEntry = prev[prev.length - 1];
        if (shallowEqual(lastEntry.state, state)) {
          return prev;
        }
      }
      
      const newHistory = [...prev, newEntry];
      return newHistory.slice(-MAX_HISTORY_SIZE);
    });
    setFuture([]);
  }, [state]);

  // Undo
  const undo = useCallback((): boolean => {
    if (history.length === 0) return false;

    const previousEntry = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    setFuture(prev => [{
      state: deepClone(state),
      timestamp: Date.now()
    }, ...prev].slice(0, MAX_HISTORY_SIZE));
    
    setHistory(newHistory);
    
    isUpdatingRef.current = true;
    setStateInternal(previousEntry.state);
    queuePropsUpdate(previousEntry.state);
    
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
    });

    return true;
  }, [history, state, queuePropsUpdate]);

  // Redo
  const redo = useCallback((): boolean => {
    if (future.length === 0) return false;

    const nextEntry = future[0];
    const newFuture = future.slice(1);

    setHistory(prev => [...prev, {
      state: deepClone(state),
      timestamp: Date.now()
    }].slice(-MAX_HISTORY_SIZE));
    
    setFuture(newFuture);
    
    isUpdatingRef.current = true;
    setStateInternal(nextEntry.state);
    queuePropsUpdate(nextEntry.state);
    
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
    });

    return true;
  }, [future, state, queuePropsUpdate]);

  // Reset
  const reset = useCallback(() => {
    pushToHistory();
    const newState = instanceToInspectorState(instance);
    setState(newState);
  }, [pushToHistory, setState, instance]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setFuture([]);
  }, []);

  // Memoize return value
  return useMemo(() => ({
    state,
    setState,
    updateState,
    batchUpdate,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    reset,
    pushToHistory,
    clearHistory,
  }), [
    state,
    setState,
    updateState,
    batchUpdate,
    undo,
    redo,
    history.length,
    future.length,
    reset,
    pushToHistory,
    clearHistory
  ]);
}
