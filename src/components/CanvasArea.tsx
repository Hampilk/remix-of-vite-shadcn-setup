import { useRef, useState, useCallback, useMemo, memo, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ComponentInstance, Position } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComponentEffects, generateEffectStyles, getDefaultEffects } from '@/components/ComponentEffectEditor';
import { 
  MousePointer2, 
  Move, 
  Lock, 
  Trash2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Copy, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface CanvasAreaProps {
  instances: ComponentInstance[];
  selectedIds: string[];
  onSelectInstance: (id: string, multi?: boolean) => void;
  onUpdatePosition: (id: string, position: Position) => void;
  onDeleteInstance: (id: string) => void;
  onDuplicateInstance?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onClearSelection: () => void;
  onAddComponent: (componentId: string, position: Position) => void;
}

interface RenderComponentProps {
  instance: ComponentInstance;
}

interface CanvasToolbarProps {
  instanceCount: number;
  selectedCount: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen?: () => void;
}

interface ComponentControlsProps {
  instance: ComponentInstance;
  isSelected: boolean;
  hasEffects: boolean;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate?: (e: React.MouseEvent) => void;
  onToggleLock?: (e: React.MouseEvent) => void;
}

interface DraggableInstanceProps {
  instance: ComponentInstance;
  isSelected: boolean;
  hasEffects: boolean;
  onDrag: (e: DraggableEvent, data: DraggableData) => void;
  onSelect: (multi: boolean) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onToggleLock?: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const GRID_SIZE = 20;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const DEFAULT_COMPONENT_OFFSET = { x: 50, y: 20 };
const SNAP_THRESHOLD = 10;

const CANVAS_STYLES = {
  grid: {
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  },
} as const;

const KEYBOARD_SHORTCUTS = {
  DELETE: ['Delete', 'Backspace'],
  DUPLICATE: ['d'],
  SELECT_ALL: ['a'],
  DESELECT: ['Escape'],
  UNDO: ['z'],
  REDO: ['y'],
  ZOOM_IN: ['+', '='],
  ZOOM_OUT: ['-'],
  ZOOM_RESET: ['0'],
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

const hasActiveEffects = (instance: ComponentInstance): boolean => {
  if (!instance.effects || typeof instance.effects !== 'object') return false;
  const effects = instance.effects as unknown as ComponentEffects;
  if (!effects.glow) return false;
  return Object.values(effects).some(e => e?.enabled);
};

const getInstanceEffects = (instance: ComponentInstance): ComponentEffects => {
  if (instance.effects && typeof instance.effects === 'object' && 'glow' in instance.effects) {
    return instance.effects as unknown as ComponentEffects;
  }
  return getDefaultEffects();
};

const calculateDropPosition = (
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  zoom: number = 1,
  offset = DEFAULT_COMPONENT_OFFSET
): Position => ({
  x: (clientX - canvasRect.left) / zoom - offset.x,
  y: (clientY - canvasRect.top) / zoom - offset.y,
});

const snapToGrid = (value: number, gridSize: number = GRID_SIZE): number => {
  return Math.round(value / gridSize) * gridSize;
};

const getBorderRadius = (radius: string | undefined): string | undefined => {
  if (!radius) return undefined;
  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '2px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  };
  return radiusMap[radius] || radius;
};

const getBoxShadow = (shadow: string | undefined): string | undefined => {
  if (!shadow || shadow === 'none') return undefined;
  const shadowMap: Record<string, string> = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  };
  return shadowMap[shadow] || shadow;
};

// ============================================================================
// Component Renderer
// ============================================================================

const ComponentRenderer = memo<RenderComponentProps>(({ instance }) => {
  const comp = getComponentById(instance.componentId);
  if (!comp) return null;

  const { props } = instance;
  const effects = getInstanceEffects(instance);
  const effectStyles = generateEffectStyles(effects);
  const hasEffects = Object.values(effects).some(e => e.enabled);

  const transforms: string[] = [];
  
  if (props.perspective) {
    transforms.push(`perspective(${props.perspective}px)`);
  }
  
  if (props.translateX || props.translateY) {
    transforms.push(`translate(${props.translateX || 0}px, ${props.translateY || 0}px)`);
  }
  if (props.rotation || props.rotate) {
    transforms.push(`rotate(${props.rotation || props.rotate}deg)`);
  }
  if (props.scale && props.scale !== 1) {
    transforms.push(`scale(${props.scale})`);
  }
  if (props.skewX) transforms.push(`skewX(${props.skewX}deg)`);
  if (props.skewY) transforms.push(`skewY(${props.skewY}deg)`);
  if (props.rotateX) transforms.push(`rotateX(${props.rotateX}deg)`);
  if (props.rotateY) transforms.push(`rotateY(${props.rotateY}deg)`);
  if (props.rotateZ) transforms.push(`rotateZ(${props.rotateZ}deg)`);

  const filters: string[] = [];
  if (props.blur) filters.push(`blur(${props.blur}px)`);
  if (props.brightness && props.brightness !== 100) filters.push(`brightness(${props.brightness}%)`);
  if (props.saturation && props.saturation !== 100) filters.push(`saturate(${props.saturation}%)`);
  if (props.saturate && props.saturate !== 100) filters.push(`saturate(${props.saturate}%)`);
  if (props.hueRotate) filters.push(`hue-rotate(${props.hueRotate}deg)`);
  if (props.grayscale) filters.push(`grayscale(${props.grayscale}%)`);
  if (props.invert) filters.push(`invert(${props.invert}%)`);
  if (props.contrast && props.contrast !== 100) filters.push(`contrast(${props.contrast}%)`);

  const customStyles: React.CSSProperties = {
    width: props.width || undefined,
    height: props.height || undefined,
    maxWidth: props.maxWidth as string || undefined,
    maxHeight: props.maxHeight as string || undefined,
    backgroundColor: props.backgroundImage ? undefined : (props.backgroundColor || undefined),
    backgroundImage: props.backgroundImage || undefined,
    color: props.textColor || undefined,
    borderColor: props.borderColor || undefined,
    borderWidth: props.borderWidth || undefined,
    borderStyle: (props.borderWidth || props.borderColor) ? (props.borderStyle as React.CSSProperties['borderStyle'] || 'solid') : undefined,
    borderRadius: getBorderRadius(props.borderRadius),
    paddingTop: props.paddingTop || undefined,
    paddingRight: props.paddingRight || undefined,
    paddingBottom: props.paddingBottom || undefined,
    paddingLeft: props.paddingLeft || undefined,
    marginTop: props.marginTop || undefined,
    marginRight: props.marginRight || undefined,
    marginBottom: props.marginBottom || undefined,
    marginLeft: props.marginLeft || undefined,
    gap: props.gap || undefined,
    fontFamily: props.fontFamily ? `var(--font-${props.fontFamily}, ${props.fontFamily})` : undefined,
    fontSize: props.fontSize ? `var(--text-${props.fontSize}, ${props.fontSize})` : undefined,
    fontWeight: props.fontWeight || undefined,
    letterSpacing: props.letterSpacing || undefined,
    lineHeight: props.lineHeight || undefined,
    textAlign: props.textAlign as React.CSSProperties['textAlign'] || undefined,
    display: props.display || undefined,
    flexDirection: props.flexDirection || undefined,
    justifyContent: props.justifyContent || undefined,
    alignItems: props.alignItems || undefined,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    filter: filters.length > 0 ? filters.join(' ') : undefined,
    backdropFilter: props.backdropBlur ? `blur(${props.backdropBlur}px)` : undefined,
    opacity: props.opacity ?? 1,
    boxShadow: getBoxShadow(props.shadow),
  };

  const baseStyle: React.CSSProperties = {
    ...customStyles,
    ...effectStyles,
  };

  const commonProps = {
    style: baseStyle,
    disabled: props.disabled,
    className: cn(hasEffects && 'transition-all duration-300'),
  };

  const componentMap: Record<string, JSX.Element> = {
    button: (
      <Button 
        variant={props.variant as any || 'default'} 
        size={props.size as any || 'default'}
        {...commonProps}
      >
        {props.text || 'Button'}
      </Button>
    ),
    input: (
      <Input 
        placeholder={props.text || 'Enter text...'}
        style={{ ...baseStyle, width: props.width || '200px' }}
        disabled={props.disabled}
      />
    ),
    textarea: (
      <Textarea 
        placeholder={props.text || 'Enter text...'}
        style={{ ...baseStyle, width: props.width || '200px', height: props.height || '80px' }}
        disabled={props.disabled}
      />
    ),
    badge: (
      <Badge variant={props.variant as any || 'default'} style={baseStyle}>
        {props.text || 'Badge'}
      </Badge>
    ),
    card: (
      <Card style={{ ...baseStyle, width: props.width || '280px' }}>
        <CardHeader>
          <CardTitle className="text-base">{props.text || 'Card Title'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card content goes here.</p>
        </CardContent>
      </Card>
    ),
    checkbox: (
      <div className="flex items-center gap-2" style={baseStyle}>
        <Checkbox id={instance.id} disabled={props.disabled} />
        <Label htmlFor={instance.id}>{props.text || 'Checkbox'}</Label>
      </div>
    ),
    switch: (
      <div className="flex items-center gap-2" style={baseStyle}>
        <Switch id={instance.id} disabled={props.disabled} />
        <Label htmlFor={instance.id}>{props.text || 'Switch'}</Label>
      </div>
    ),
    slider: (
      <div style={{ ...baseStyle, width: props.width || '200px' }}>
        <Slider defaultValue={[50]} max={100} step={1} disabled={props.disabled} />
      </div>
    ),
    progress: (
      <div style={{ ...baseStyle, width: props.width || '200px' }}>
        <Progress value={50} />
      </div>
    ),
    alert: (
      <Alert style={{ ...baseStyle, width: props.width || '320px' }} variant={props.variant as any}>
        <AlertTitle>{props.text || 'Alert Title'}</AlertTitle>
        <AlertDescription>This is an alert description.</AlertDescription>
      </Alert>
    ),
    separator: <Separator style={{ ...baseStyle, width: props.width || '200px' }} />,
    skeleton: (
      <div className="space-y-2" style={{ ...baseStyle, width: props.width || '200px' }}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ),
    label: <Label style={baseStyle}>{props.text || 'Label'}</Label>,
    toggle: (
      <Toggle variant={props.variant as any} style={baseStyle}>
        {props.text || 'Toggle'}
      </Toggle>
    ),
    tabs: (
      <Tabs defaultValue="tab1" style={{ ...baseStyle, width: props.width || '300px' }}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="p-2 text-sm">Tab 1 content</TabsContent>
        <TabsContent value="tab2" className="p-2 text-sm">Tab 2 content</TabsContent>
        <TabsContent value="tab3" className="p-2 text-sm">Tab 3 content</TabsContent>
      </Tabs>
    ),
  };

  return componentMap[instance.componentId] || (
    <div 
      className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50 text-sm text-slate-400" 
      style={baseStyle}
    >
      {comp.name}
    </div>
  );
}, (prev, next) => {
  return (
    prev.instance.id === next.instance.id &&
    prev.instance.props === next.instance.props &&
    prev.instance.effects === next.instance.effects &&
    prev.instance.zIndex === next.instance.zIndex
  );
});

ComponentRenderer.displayName = 'ComponentRenderer';

// ============================================================================
// Component Controls
// ============================================================================

const ComponentControls = memo<ComponentControlsProps>(({ 
  instance, 
  isSelected, 
  hasEffects,
  onDelete,
  onDuplicate,
  onToggleLock,
}) => {
  const controlButtons = useMemo(() => [
    {
      icon: Move,
      className: 'drag-handle cursor-move hover:bg-neutral-700/90',
      ariaLabel: 'Drag component',
      show: true,
    },
    {
      icon: Sparkles,
      className: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
      ariaLabel: 'Effects active',
      show: hasEffects,
    },
    {
      icon: instance.locked ? Lock : Eye,
      className: 'bg-amber-500/20 border-amber-500/30 text-amber-400 cursor-pointer hover:bg-amber-500/30',
      onClick: onToggleLock,
      ariaLabel: instance.locked ? 'Locked' : 'Unlocked',
      show: true,
    },
    {
      icon: Copy,
      className: 'bg-blue-500/20 border-blue-500/30 text-blue-400 cursor-pointer hover:bg-blue-500/30',
      onClick: onDuplicate,
      ariaLabel: 'Duplicate component',
      show: !!onDuplicate,
    },
    {
      icon: Trash2,
      className: 'bg-red-500/20 border-red-500/30 text-red-400 cursor-pointer hover:bg-red-500/30',
      onClick: onDelete,
      ariaLabel: 'Delete component',
      show: true,
    },
  ], [hasEffects, instance.locked, onToggleLock, onDuplicate, onDelete]);

  return (
    <div 
      className={cn(
        'absolute -top-8 left-0 flex items-center gap-1 transition-opacity duration-200',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}
    >
      {controlButtons.map((btn, idx) => {
        if (!btn.show) return null;
        
        const Icon = btn.icon;
        const isClickable = btn.onClick !== undefined;
        
        return isClickable ? (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              btn.onClick?.(e);
            }}
            className={cn(
              'p-1 rounded border border-neutral-700/50 transition-colors',
              btn.className
            )}
            aria-label={btn.ariaLabel}
          >
            <Icon className="h-3 w-3" />
          </button>
        ) : (
          <div
            key={idx}
            className={cn(
              'p-1 rounded border border-neutral-700/50',
              btn.className
            )}
            aria-label={btn.ariaLabel}
          >
            <Icon className="h-3 w-3" />
          </div>
        );
      })}
      
      <div className="px-2 py-1 rounded bg-neutral-800/90 border border-neutral-700/50 text-xs text-slate-300 font-medium">
        {instance.name}
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.instance.id === next.instance.id &&
    prev.instance.name === next.instance.name &&
    prev.instance.locked === next.instance.locked &&
    prev.isSelected === next.isSelected &&
    prev.hasEffects === next.hasEffects
  );
});

ComponentControls.displayName = 'ComponentControls';

// ============================================================================
// Canvas Toolbar
// ============================================================================

const CanvasToolbar = memo<CanvasToolbarProps>(({ 
  instanceCount, 
  selectedCount,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
}) => (
  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 text-xs text-slate-400">
      <span className="font-medium">{instanceCount} komponens</span>
      {selectedCount > 0 && (
        <>
          <span className="text-neutral-600">•</span>
          <span className="text-amber-400 font-medium">{selectedCount} kiválasztva</span>
        </>
      )}
    </div>

    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50">
      <button
        onClick={onZoomOut}
        disabled={zoom <= MIN_ZOOM}
        className={cn(
          'p-1 rounded hover:bg-neutral-700/50 transition-colors',
          zoom <= MIN_ZOOM && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5 text-slate-400" />
      </button>
      
      <button
        onClick={onResetZoom}
        className="px-2 py-0.5 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors"
      >
        {Math.round(zoom * 100)}%
      </button>
      
      <button
        onClick={onZoomIn}
        disabled={zoom >= MAX_ZOOM}
        className={cn(
          'p-1 rounded hover:bg-neutral-700/50 transition-colors',
          zoom >= MAX_ZOOM && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {onFitToScreen && (
        <>
          <div className="w-px h-4 bg-neutral-700/50 mx-1" />
          <button
            onClick={onFitToScreen}
            className="p-1 rounded hover:bg-neutral-700/50 transition-colors"
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </>
      )}
    </div>
  </div>
));

CanvasToolbar.displayName = 'CanvasToolbar';

// ============================================================================
// Draggable Instance
// ============================================================================

const DraggableInstance = memo<DraggableInstanceProps>(({
  instance,
  isSelected,
  hasEffects,
  onDrag,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleLock,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={instance.position}
      onStop={onDrag}
      disabled={instance.locked}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        ref={nodeRef}
        className={cn(
          'absolute group',
          instance.locked && 'cursor-not-allowed'
        )}
        style={{ zIndex: instance.zIndex }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(e.shiftKey || e.metaKey);
        }}
      >
        <div
          className={cn(
            'relative p-1 rounded-lg transition-all duration-200',
            isSelected
              ? 'ring-2 ring-amber-500/50 ring-offset-1 ring-offset-neutral-950 shadow-lg'
              : 'hover:ring-1 hover:ring-neutral-600/50'
          )}
        >
          <div className="pointer-events-none">
            <ComponentRenderer instance={instance} />
          </div>

          <ComponentControls
            instance={instance}
            isSelected={isSelected}
            hasEffects={hasEffects}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onDuplicate={onDuplicate ? (e) => {
              e.stopPropagation();
              onDuplicate();
            } : undefined}
            onToggleLock={onToggleLock ? (e) => {
              e.stopPropagation();
              onToggleLock();
            } : undefined}
          />
        </div>
      </div>
    </Draggable>
  );
}, (prev, next) => {
  return (
    prev.instance.id === next.instance.id &&
    prev.instance.position.x === next.instance.position.x &&
    prev.instance.position.y === next.instance.position.y &&
    prev.instance.locked === next.instance.locked &&
    prev.instance.zIndex === next.instance.zIndex &&
    prev.isSelected === next.isSelected &&
    prev.hasEffects === next.hasEffects
  );
});

DraggableInstance.displayName = 'DraggableInstance';

// ============================================================================
// Empty State
// ============================================================================

const EmptyState = memo(() => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
    <div className="relative mb-4">
      <MousePointer2 className="h-12 w-12 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
    </div>
    <h3 className="text-base font-medium text-slate-400 mb-1">Üres vászon</h3>
    <p className="text-sm text-slate-600">Húzd ide a komponenseket vagy válassz a könyvtárból</p>
    <p className="text-xs text-slate-700 mt-1">Kattints egy komponensre a böngészőben a hozzáadáshoz</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

// ============================================================================
// Main Component
// ============================================================================

export const CanvasArea = ({
  instances,
  selectedIds,
  onSelectInstance,
  onUpdatePosition,
  onDeleteInstance,
  onDuplicateInstance,
  onToggleLock,
  onToggleVisibility,
  onClearSelection,
  onAddComponent,
}: CanvasAreaProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [snapToGridEnabled, setSnapToGridEnabled] = useState(false);

  const visibleInstances = useMemo(
    () => instances.filter(instance => instance.visible),
    [instances]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (KEYBOARD_SHORTCUTS.DELETE.includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        selectedIds.forEach(id => onDeleteInstance(id));
      }

      if (isModifier && KEYBOARD_SHORTCUTS.DUPLICATE.includes(key) && selectedIds.length > 0 && onDuplicateInstance) {
        e.preventDefault();
        selectedIds.forEach(id => onDuplicateInstance(id));
      }

      if (isModifier && KEYBOARD_SHORTCUTS.SELECT_ALL.includes(key)) {
        e.preventDefault();
        visibleInstances.forEach(instance => onSelectInstance(instance.id, true));
      }

      if (KEYBOARD_SHORTCUTS.DESELECT.includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        onClearSelection();
      }

      if (isModifier && KEYBOARD_SHORTCUTS.ZOOM_IN.includes(key)) {
        e.preventDefault();
        setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
      }

      if (isModifier && KEYBOARD_SHORTCUTS.ZOOM_OUT.includes(key)) {
        e.preventDefault();
        setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
      }

      if (isModifier && KEYBOARD_SHORTCUTS.ZOOM_RESET.includes(key)) {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, visibleInstances, onDeleteInstance, onDuplicateInstance, onSelectInstance, onClearSelection]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onClearSelection();
    }
  }, [onClearSelection]);

  const handleDrag = useCallback((id: string) => 
    (_e: DraggableEvent, data: DraggableData) => {
      const position = snapToGridEnabled 
        ? { x: snapToGrid(data.x), y: snapToGrid(data.y) }
        : { x: data.x, y: data.y };
      onUpdatePosition(id, position);
    },
    [onUpdatePosition, snapToGridEnabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const componentId = e.dataTransfer.getData('componentId');
    if (componentId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = calculateDropPosition(e.clientX, e.clientY, rect, zoom);
      onAddComponent(componentId, position);
    }
  }, [onAddComponent, zoom]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!canvasRef.current || visibleInstances.length === 0) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    visibleInstances.forEach(instance => {
      const x = instance.position.x;
      const y = instance.position.y;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + 200);
      maxY = Math.max(maxY, y + 100);
    });
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const padding = 50;
    
    const scaleX = (canvasRect.width - padding * 2) / contentWidth;
    const scaleY = (canvasRect.height - padding * 2) / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, MAX_ZOOM);
    
    setZoom(Math.max(newZoom, MIN_ZOOM));
  }, [visibleInstances]);

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative w-full h-full min-h-[500px] rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden',
        isDragOver 
          ? 'border-amber-500/50 bg-amber-500/5' 
          : 'border-neutral-800/50 bg-neutral-900/30'
      )}
      style={CANVAS_STYLES.grid}
    >
      {visibleInstances.length === 0 && <EmptyState />}

      <div 
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top left',
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`
        }}
      >
        {visibleInstances.map(instance => (
          <DraggableInstance
            key={instance.id}
            instance={instance}
            isSelected={selectedIds.includes(instance.id)}
            hasEffects={hasActiveEffects(instance)}
            onDrag={handleDrag(instance.id)}
            onSelect={(multi) => onSelectInstance(instance.id, multi)}
            onDelete={() => onDeleteInstance(instance.id)}
            onDuplicate={onDuplicateInstance ? () => onDuplicateInstance(instance.id) : undefined}
            onToggleLock={onToggleLock ? () => onToggleLock(instance.id) : undefined}
          />
        ))}
      </div>

      <CanvasToolbar
        instanceCount={instances.length}
        selectedCount={selectedIds.length}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitToScreen={handleFitToScreen}
      />
    </div>
  );
};
