import { useState, useMemo } from 'react';
import { ComponentInstance, InstanceProps } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MousePointer, Hand, Focus, Ban, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

interface StatePreviewProps {
  instance: ComponentInstance | null;
  onUpdateState: (state: ComponentState, props: Partial<InstanceProps>) => void;
}

interface StateDefinition {
  id: ComponentState;
  label: string;
  icon: React.ElementType;
  description: string;
  shortcut?: string;
}

const STATE_DEFINITIONS: readonly StateDefinition[] = [
  { id: 'default', label: 'Default', icon: MousePointer, description: 'Normal resting state', shortcut: '1' },
  { id: 'hover', label: 'Hover', icon: Hand, description: 'Mouse pointer over element', shortcut: '2' },
  { id: 'active', label: 'Active', icon: MousePointer, description: 'Pressed or clicked state', shortcut: '3' },
  { id: 'focus', label: 'Focus', icon: Focus, description: 'Keyboard focus state', shortcut: '4' },
  { id: 'disabled', label: 'Disabled', icon: Ban, description: 'Non-interactive state', shortcut: '5' },
] as const;

interface MergedProps extends InstanceProps {
  [key: string]: any;
}

const getStateStyles = (activeState: ComponentState): React.CSSProperties => {
  const stateStyles: Record<ComponentState, React.CSSProperties> = {
    default: {},
    hover: {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    active: {
      transform: 'scale(0.98)',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    focus: {
      outline: '2px solid hsl(var(--ring))',
      outlineOffset: '2px',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  };

  return stateStyles[activeState] || {};
};

const ComponentRenderer = ({ 
  instance, 
  activeState,
  mergedProps,
}: { 
  instance: ComponentInstance; 
  activeState: ComponentState;
  mergedProps: MergedProps;
}) => {
  const comp = getComponentById(instance.componentId);
  if (!comp) return null;

  const baseStyle: React.CSSProperties = {
    width: mergedProps.width || 'auto',
    height: mergedProps.height || 'auto',
    opacity: mergedProps.opacity ?? 1,
    backgroundColor: mergedProps.backgroundColor,
    color: mergedProps.textColor,
    borderColor: mergedProps.borderColor,
    borderRadius: mergedProps.borderRadius,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ...getStateStyles(activeState),
  };

  const isDisabled = activeState === 'disabled';
  const isFocused = activeState === 'focus';
  const focusClass = isFocused ? 'ring-2 ring-ring ring-offset-2' : '';

  const buttonVariant = (mergedProps.variant as 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary') || 'default';
  const buttonSize = (['default', 'sm', 'lg', 'icon'].includes(mergedProps.size || '') ? mergedProps.size : 'default') as 'default' | 'sm' | 'lg' | 'icon';

  const componentMap: Record<string, JSX.Element> = {
    button: (
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        style={baseStyle}
        disabled={isDisabled}
        className={focusClass}
      >
        {mergedProps.text || 'Button'}
      </Button>
    ),
    input: (
      <Input 
        placeholder={mergedProps.text || 'Enter text...'}
        style={{ ...baseStyle, width: mergedProps.width || '200px' }}
        disabled={isDisabled}
        className={cn(focusClass, 'transition-all')}
      />
    ),
    card: (
      <Card style={{ ...baseStyle, width: mergedProps.width || '200px' }}>
        <CardHeader className="p-3">
          <CardTitle className="text-sm">{mergedProps.text || 'Card Title'}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-muted-foreground">Card content area</p>
        </CardContent>
      </Card>
    ),
    badge: (
      <Badge 
        variant={(mergedProps.variant as 'default' | 'destructive' | 'outline' | 'secondary') || 'default'}
        style={baseStyle}
      >
        {mergedProps.text || 'Badge'}
      </Badge>
    ),
    switch: (
      <Switch 
        disabled={isDisabled}
        className={focusClass}
      />
    ),
    checkbox: (
      <div className="flex items-center gap-2">
        <Checkbox 
          disabled={isDisabled}
          className={focusClass}
        />
        <Label className={cn('transition-opacity', isDisabled && 'opacity-50')}>
          {mergedProps.text || 'Checkbox Label'}
        </Label>
      </div>
    ),
  };

  return componentMap[instance.componentId] || (
    <div 
      style={baseStyle}
      className="px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 text-sm text-slate-400"
    >
      {comp.name}
    </div>
  );
};

const StateTab = ({ 
  state, 
  isActive, 
  onClick 
}: { 
  state: StateDefinition; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const Icon = state.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isActive
          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
          : 'bg-neutral-800/50 text-slate-400 border border-neutral-700/50 hover:bg-neutral-700/50 hover:text-slate-300 hover:border-neutral-600/50'
      )}
      aria-pressed={isActive}
      aria-label={`${state.label} state`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{state.label}</span>
      {state.shortcut && (
        <kbd className="ml-1 px-1 py-0.5 text-[10px] bg-black/20 rounded">
          {state.shortcut}
        </kbd>
      )}
    </button>
  );
};

const StatePropertyDisplay = ({ activeState }: { activeState: ComponentState }) => {
  const properties = useMemo(() => {
    const props: Record<ComponentState, { transform: string; opacity: string; shadow: string }> = {
      default: { transform: 'none', opacity: '1.0', shadow: 'none' },
      hover: { transform: 'scale(1.02)', opacity: '1.0', shadow: '0 4px 12px rgba(0,0,0,0.15)' },
      active: { transform: 'scale(0.98)', opacity: '1.0', shadow: 'inset 0 2px 4px' },
      focus: { transform: 'none', opacity: '1.0', shadow: 'ring' },
      disabled: { transform: 'none', opacity: '0.5', shadow: 'none' },
    };
    return props[activeState];
  }, [activeState]);

  return (
    <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/30">
      <h4 className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" />
        Active State Properties
      </h4>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <PropertyItem label="Transform" value={properties.transform} />
        <PropertyItem label="Opacity" value={properties.opacity} />
        <PropertyItem label="Shadow" value={properties.shadow} />
      </div>
    </div>
  );
};

const PropertyItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-slate-500 text-[10px] uppercase tracking-wide">{label}</span>
    <code className="text-slate-200 font-mono text-xs bg-black/20 px-1.5 py-0.5 rounded">
      {value}
    </code>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 text-slate-500">
    <div className="relative mb-4">
      <MousePointer className="h-12 w-12 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
    </div>
    <h3 className="text-base font-medium text-slate-400 mb-1">No Component Selected</h3>
    <p className="text-sm text-slate-600">Select a component to preview its states</p>
  </div>
);

export const StatePreview = ({ instance, onUpdateState }: StatePreviewProps) => {
  const [activeState, setActiveState] = useState<ComponentState>('default');

  const mergedProps = useMemo<MergedProps>(() => {
    if (!instance) return {} as MergedProps;
    const stateProps = instance.states[activeState] || {};
    return { ...instance.props, ...stateProps };
  }, [instance, activeState]);

  if (!instance) {
    return <EmptyState />;
  }

  const activeStateInfo = STATE_DEFINITIONS.find(s => s.id === activeState);

  return (
    <div className="space-y-6 p-4">
      {/* State Selection Tabs */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300">Component States</h3>
        <div className="flex flex-wrap gap-2">
          {STATE_DEFINITIONS.map((state) => (
            <StateTab
              key={state.id}
              state={state}
              isActive={activeState === state.id}
              onClick={() => setActiveState(state.id)}
            />
          ))}
        </div>
        {activeStateInfo && (
          <p className="text-xs text-slate-500 italic px-1">
            {activeStateInfo.description}
          </p>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="relative bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 rounded-xl border border-neutral-800/50 p-12 min-h-[160px] flex items-center justify-center backdrop-blur-sm">
        <ComponentRenderer 
          instance={instance} 
          activeState={activeState}
          mergedProps={mergedProps}
        />
        
        {/* State Badge Indicator */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="outline" 
            className="text-[10px] uppercase tracking-wider font-semibold bg-black/30 backdrop-blur-sm"
          >
            {activeState}
          </Badge>
        </div>
      </div>

      {/* State Properties Display */}
      <StatePropertyDisplay activeState={activeState} />

      {/* All States Overview */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">States Overview</h4>
        <div className="grid grid-cols-5 gap-2">
          {STATE_DEFINITIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveState(id)}
              className={cn(
                'group relative p-3 rounded-lg border transition-all duration-200',
                'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring',
                activeState === id
                  ? 'border-amber-500/50 bg-amber-500/10 shadow-lg'
                  : 'border-neutral-700/50 bg-neutral-800/30 hover:bg-neutral-700/40 hover:border-neutral-600/50'
              )}
              aria-label={`Preview ${label} state`}
            >
              <div className="flex items-center justify-center h-12 overflow-hidden">
                <div className="transform scale-[0.6] origin-center pointer-events-none">
                  <ComponentRenderer 
                    instance={instance} 
                    activeState={id}
                    mergedProps={{ ...instance.props, ...(instance.states[id] || {}) }}
                  />
                </div>
              </div>
              <p className={cn(
                'text-[10px] text-center mt-2 font-medium transition-colors',
                activeState === id ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-400'
              )}>
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
