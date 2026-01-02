import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import {
  type HistoryState,
  pushToHistory,
  undoHistory,
  redoHistory,
  jumpToHistory,
  useKeyboardShortcuts,
} from '@/hooks/useHistory';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay';
export type ThemeModeType = 'dark' | 'light' | 'auto';
export type NeomorphShape = 'flat' | 'concave' | 'convex' | 'pressed';
export type SurfaceTexture = 'smooth' | 'matte' | 'glossy';

export interface GlowSettings {
  lightness: number;
  chroma: number;
  hue: number;
  baseColor: string;
}

export interface BlurSettings {
  x: number;
  y: number;
}

export interface GlassSettings {
  blur: number;
  opacity: number;
  saturation: number;
  borderWidth: number;
  borderOpacity: number;
  tint: string;
  tintStrength: number;
}

export interface NeomorphSettings {
  distance: number;
  blur: number;
  intensity: number;
  shape: NeomorphShape;
  lightSource: number;
  surfaceColor: string;
}

export interface ClaySettings {
  depth: number;
  spread: number;
  borderRadius: number;
  highlightColor: string;
  shadowColor: string;
  surfaceTexture: SurfaceTexture;
  bendAngle: number;
  // Extended settings for ClayEditor
  backgroundColor?: string;
  backgroundOpacity?: number;
  blur?: number;
  shadowOpacity?: number;
  innerShadowDepth?: number;
  innerShadowBlur?: number;
  innerShadowOpacity?: number;
  highlightIntensity?: number;
}

export interface EffectState {
  powerOn: boolean;
  activeEffects: Record<EffectType, boolean>;
  themeMode: ThemeModeType;
  glowSettings: GlowSettings;
  blurSettings: BlurSettings;
  glassSettings: GlassSettings;
  neomorphSettings: NeomorphSettings;
  claySettings: ClaySettings;
}

export interface EffectContextType {
  state: EffectState;
  togglePower: () => void;
  toggleEffect: (effect: EffectType) => void;
  setThemeMode: (mode: ThemeModeType) => void;
  updateGlowSettings: (settings: Partial<GlowSettings>) => void;
  updateBlurSettings: (settings: Partial<BlurSettings>) => void;
  updateGlassSettings: (settings: Partial<GlassSettings>) => void;
  updateNeomorphSettings: (settings: Partial<NeomorphSettings>) => void;
  updateClaySettings: (settings: Partial<ClaySettings>) => void;
  resetBlurPosition: () => void;
  resetAllSettings: () => void;
  getActiveEffectsCount: () => number;
  getOklchColor: () => string;
  generateCSS: () => string;
  exportSettings: () => string;
  importSettings: (jsonString: string) => boolean;
  // History
  history: HistoryState<EffectState>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  jumpToHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

// ============================================================================
// CONSTANTS & DEFAULTS
// ============================================================================

const EFFECT_STORAGE_KEY = 'effect-editor' as const;

const DEFAULT_GLOW_SETTINGS: Readonly<GlowSettings> = {
  lightness: 78,
  chroma: 0.18,
  hue: 70,
  baseColor: '#FF9F00',
} as const;

const DEFAULT_BLUR_SETTINGS: Readonly<BlurSettings> = {
  x: -590,
  y: -1070,
} as const;

const DEFAULT_GLASS_SETTINGS: Readonly<GlassSettings> = {
  blur: 12,
  opacity: 20,
  saturation: 120,
  borderWidth: 1,
  borderOpacity: 20,
  tint: '#ffffff',
  tintStrength: 10,
} as const;

const DEFAULT_NEOMORPH_SETTINGS: Readonly<NeomorphSettings> = {
  distance: 10,
  blur: 30,
  intensity: 50,
  shape: 'flat',
  lightSource: 145,
  surfaceColor: '#2a2a2a',
} as const;

const DEFAULT_CLAY_SETTINGS: Readonly<ClaySettings> = {
  depth: 10,
  spread: 10,
  borderRadius: 24,
  highlightColor: '#ffffff',
  shadowColor: '#000000',
  surfaceTexture: 'smooth',
  bendAngle: 0,
} as const;

export const DEFAULT_EFFECT_STATE: Readonly<EffectState> = {
  powerOn: true,
  activeEffects: {
    glow: true,
    glass: false,
    neomorph: false,
    clay: false,
  },
  themeMode: 'dark',
  glowSettings: DEFAULT_GLOW_SETTINGS,
  blurSettings: DEFAULT_BLUR_SETTINGS,
  glassSettings: DEFAULT_GLASS_SETTINGS,
  neomorphSettings: DEFAULT_NEOMORPH_SETTINGS,
  claySettings: DEFAULT_CLAY_SETTINGS,
} as const;

// ============================================================================
// CONTEXT
// ============================================================================

const EffectContext = createContext<EffectContextType | undefined>(undefined);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Loads effect state from localStorage
 */
const loadEffectStateFromStorage = (): EffectState => {
  try {
    const stored = localStorage.getItem(EFFECT_STORAGE_KEY);
    if (!stored) return { ...DEFAULT_EFFECT_STATE };

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_EFFECT_STATE, ...parsed };
  } catch (error) {
    console.error('Failed to load effect state from storage:', error);
    return { ...DEFAULT_EFFECT_STATE };
  }
};

/**
 * Saves effect state to localStorage
 */
const saveEffectStateToStorage = (state: EffectState): void => {
  try {
    localStorage.setItem(EFFECT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save effect state to storage:', error);
  }
};

/**
 * Generates a human-readable label for history entries
 */
const generateHistoryLabel = (
  action: string,
  effect?: EffectType,
  setting?: string
): string => {
  if (effect && setting) {
    return `${effect.charAt(0).toUpperCase() + effect.slice(1)}: ${setting}`;
  }
  return action;
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const EffectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // History state management
  const [historyState, setHistoryState] = useState<HistoryState<EffectState>>(() => {
    const initialState = loadEffectStateFromStorage();
    return {
      past: [],
      present: initialState,
      future: [],
    };
  });

  const state = historyState.present;

  // Persist state to localStorage
  useEffect(() => {
    saveEffectStateToStorage(state);
  }, [state]);

  // History management
  const pushHistory = useCallback((newState: EffectState, label: string) => {
    setHistoryState((prev) => pushToHistory(prev, newState, label));
  }, []);

  const undo = useCallback(() => {
    setHistoryState((prev) => undoHistory(prev) || prev);
  }, []);

  const redo = useCallback(() => {
    setHistoryState((prev) => redoHistory(prev) || prev);
  }, []);

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  // Setup keyboard shortcuts
  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  const jumpToHistoryEntry = useCallback((id: string) => {
    setHistoryState((prev) => jumpToHistory(prev, id) || prev);
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  // State update actions
  const togglePower = useCallback(() => {
    const newState = { ...state, powerOn: !state.powerOn };
    pushHistory(newState, `Power ${newState.powerOn ? 'on' : 'off'}`);
  }, [state, pushHistory]);

  const toggleEffect = useCallback(
    (effect: EffectType) => {
      const isEnabled = !state.activeEffects[effect];
      const newState = {
        ...state,
        activeEffects: {
          ...state.activeEffects,
          [effect]: isEnabled,
        },
      };
      pushHistory(
        newState,
        generateHistoryLabel(isEnabled ? 'enabled' : 'disabled', effect)
      );
    },
    [state, pushHistory]
  );

  const setThemeMode = useCallback(
    (mode: ThemeModeType) => {
      const newState = { ...state, themeMode: mode };
      pushHistory(newState, `Theme mode: ${mode}`);
    },
    [state, pushHistory]
  );

  const updateGlowSettings = useCallback(
    (settings: Partial<GlowSettings>) => {
      const newState = {
        ...state,
        glowSettings: { ...state.glowSettings, ...settings },
      };
      const settingKey = Object.keys(settings)[0];
      pushHistory(newState, generateHistoryLabel('changed', 'glow', settingKey));
    },
    [state, pushHistory]
  );

  const updateBlurSettings = useCallback(
    (settings: Partial<BlurSettings>) => {
      const newState = {
        ...state,
        blurSettings: { ...state.blurSettings, ...settings },
      };
      pushHistory(newState, 'Blur position adjusted');
    },
    [state, pushHistory]
  );

  const updateGlassSettings = useCallback(
    (settings: Partial<GlassSettings>) => {
      const newState = {
        ...state,
        glassSettings: { ...state.glassSettings, ...settings },
      };
      const settingKey = Object.keys(settings)[0];
      pushHistory(newState, generateHistoryLabel('changed', 'glass', settingKey));
    },
    [state, pushHistory]
  );

  const updateNeomorphSettings = useCallback(
    (settings: Partial<NeomorphSettings>) => {
      const newState = {
        ...state,
        neomorphSettings: { ...state.neomorphSettings, ...settings },
      };
      const settingKey = Object.keys(settings)[0];
      pushHistory(newState, generateHistoryLabel('changed', 'neomorph', settingKey));
    },
    [state, pushHistory]
  );

  const updateClaySettings = useCallback(
    (settings: Partial<ClaySettings>) => {
      const newState = {
        ...state,
        claySettings: { ...state.claySettings, ...settings },
      };
      const settingKey = Object.keys(settings)[0];
      pushHistory(newState, generateHistoryLabel('changed', 'clay', settingKey));
    },
    [state, pushHistory]
  );

  const resetBlurPosition = useCallback(() => {
    const newState = {
      ...state,
      blurSettings: { ...DEFAULT_BLUR_SETTINGS },
    };
    pushHistory(newState, 'Blur position reset');
  }, [state, pushHistory]);

  const resetAllSettings = useCallback(() => {
    pushHistory({ ...DEFAULT_EFFECT_STATE }, 'All settings reset');
  }, [pushHistory]);

  // Computed values and utilities
  const getActiveEffectsCount = useCallback(() => {
    return Object.values(state.activeEffects).filter(Boolean).length;
  }, [state.activeEffects]);

  const getOklchColor = useCallback(() => {
    const { lightness, chroma, hue } = state.glowSettings;
    return `oklch(${(lightness / 100).toFixed(2)} ${chroma.toFixed(3)} ${hue})`;
  }, [state.glowSettings]);

  const generateCSS = useCallback(() => {
    const oklch = getOklchColor();
    const { x, y } = state.blurSettings;

    return `.glow-effect {
  background-color: ${oklch};
  filter: blur(180px);
  opacity: ${state.powerOn ? 1 : 0};
  transition: opacity 0.3s ease;
}

.phone-preview {
  --glow-color: ${oklch};
  --blur-x: ${x}px;
  --blur-y: ${y}px;
}

${state.activeEffects.glass ? `.glass-effect {
  backdrop-filter: blur(${state.glassSettings.blur}px);
  background: rgba(255, 255, 255, ${state.glassSettings.opacity / 100});
  border: ${state.glassSettings.borderWidth}px solid rgba(255, 255, 255, ${state.glassSettings.borderOpacity / 100});
}` : ''}`;
  }, [getOklchColor, state]);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importSettings = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        const validatedState = { ...DEFAULT_EFFECT_STATE, ...parsed };
        pushHistory(validatedState, 'Settings imported');
        return true;
      } catch (error) {
        console.error('Failed to import settings:', error);
        return false;
      }
    },
    [pushHistory]
  );

  // Context value
  const value = useMemo<EffectContextType>(
    () => ({
      state,
      togglePower,
      toggleEffect,
      setThemeMode,
      updateGlowSettings,
      updateBlurSettings,
      updateGlassSettings,
      updateNeomorphSettings,
      updateClaySettings,
      resetBlurPosition,
      resetAllSettings,
      getActiveEffectsCount,
      getOklchColor,
      generateCSS,
      exportSettings,
      importSettings,
      history: historyState,
      undo,
      redo,
      canUndo,
      canRedo,
      jumpToHistoryEntry,
      clearHistory,
    }),
    [
      state,
      togglePower,
      toggleEffect,
      setThemeMode,
      updateGlowSettings,
      updateBlurSettings,
      updateGlassSettings,
      updateNeomorphSettings,
      updateClaySettings,
      resetBlurPosition,
      resetAllSettings,
      getActiveEffectsCount,
      getOklchColor,
      generateCSS,
      exportSettings,
      importSettings,
      historyState,
      undo,
      redo,
      canUndo,
      canRedo,
      jumpToHistoryEntry,
      clearHistory,
    ]
  );

  return (
    <EffectContext.Provider value={value}>
      {children}
    </EffectContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access effect context
 * @throws Error if used outside EffectProvider
 */
export const useEffects = (): EffectContextType => {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectProvider');
  }
  return context;
};
