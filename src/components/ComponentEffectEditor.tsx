import { useState } from 'react';
import { ComponentInstance, EffectConfig } from '@/types/componentInstance';
import { GlassSettings, NeomorphSettings, ClaySettings } from '@/contexts/EffectContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  GlassWater, 
  Layers, 
  Palette, 
  MousePointer2,
  RotateCcw
} from 'lucide-react';

export type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay';

export interface GlowEffectSettings {
  color: string;
  intensity: number;
  blur: number;
  spread: number;
}

export interface ComponentEffects {
  glow: { enabled: boolean; settings: GlowEffectSettings };
  glass: { enabled: boolean; settings: GlassSettings };
  neomorph: { enabled: boolean; settings: NeomorphSettings };
  clay: { enabled: boolean; settings: ClaySettings };
}

const defaultGlowSettings: GlowEffectSettings = {
  color: '#fbbf24',
  intensity: 50,
  blur: 20,
  spread: 0,
};

const defaultGlassSettings: GlassSettings = {
  blur: 12,
  opacity: 20,
  saturation: 120,
  borderWidth: 1,
  borderOpacity: 20,
  tint: '#ffffff',
  tintStrength: 10,
};

const defaultNeomorphSettings: NeomorphSettings = {
  distance: 10,
  blur: 30,
  intensity: 50,
  shape: 'flat',
  lightSource: 145,
  surfaceColor: '#2a2a2a',
};

const defaultClaySettings: ClaySettings = {
  depth: 10,
  spread: 10,
  borderRadius: 24,
  highlightColor: '#ffffff',
  shadowColor: '#000000',
  surfaceTexture: 'smooth',
  bendAngle: 0,
};

export const getDefaultEffects = (): ComponentEffects => ({
  glow: { enabled: false, settings: defaultGlowSettings },
  glass: { enabled: false, settings: defaultGlassSettings },
  neomorph: { enabled: false, settings: defaultNeomorphSettings },
  clay: { enabled: false, settings: defaultClaySettings },
});

interface ComponentEffectEditorProps {
  instance: ComponentInstance | null;
  onUpdateEffects: (effects: ComponentEffects) => void;
}

const effectConfig = [
  { type: 'glow' as EffectType, label: 'Glow', icon: Sparkles, color: 'amber', description: 'Fényes árnyék effekt' },
  { type: 'glass' as EffectType, label: 'Glass', icon: GlassWater, color: 'sky', description: 'Üveg hatás blur-rel' },
  { type: 'neomorph' as EffectType, label: 'Neomorph', icon: Layers, color: 'purple', description: 'Puha domborítás' },
  { type: 'clay' as EffectType, label: 'Clay', icon: Palette, color: 'rose', description: 'Agyag textúra' },
];

const colorClasses: Record<string, { bg: string; text: string; glow: string }> = {
  amber: { bg: 'bg-amber-400/15', text: 'text-amber-300', glow: 'shadow-[0_0_25px_rgba(251,191,36,0.55)]' },
  sky: { bg: 'bg-sky-400/10', text: 'text-sky-300', glow: 'shadow-[0_0_25px_rgba(56,189,248,0.55)]' },
  purple: { bg: 'bg-purple-400/10', text: 'text-purple-300', glow: 'shadow-[0_0_25px_rgba(192,132,252,0.55)]' },
  rose: { bg: 'bg-rose-400/10', text: 'text-rose-300', glow: 'shadow-[0_0_25px_rgba(251,113,133,0.55)]' },
};

export const ComponentEffectEditor = ({ instance, onUpdateEffects }: ComponentEffectEditorProps) => {
  const [activeTab, setActiveTab] = useState<EffectType>('glow');
  
  // Parse effects from instance or use defaults, merging with defaults to ensure all properties exist
  const defaultEffects = getDefaultEffects();
  const effects: ComponentEffects = instance?.effects 
    ? {
        glow: { ...defaultEffects.glow, ...(instance.effects as any).glow },
        glass: { ...defaultEffects.glass, ...(instance.effects as any).glass },
        neomorph: { ...defaultEffects.neomorph, ...(instance.effects as any).neomorph },
        clay: { ...defaultEffects.clay, ...(instance.effects as any).clay },
      }
    : defaultEffects;

  if (!instance) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
        <MousePointer2 className="h-8 w-8 mb-3 opacity-50" />
        <p className="text-sm">Válassz ki egy komponenst</p>
        <p className="text-xs text-slate-600 mt-1">az effektek szerkesztéséhez</p>
      </div>
    );
  }

  const toggleEffect = (type: EffectType) => {
    const newEffects = {
      ...effects,
      [type]: { ...effects[type], enabled: !effects[type].enabled },
    };
    onUpdateEffects(newEffects);
  };

  const updateGlowSettings = (settings: Partial<GlowEffectSettings>) => {
    const newEffects = {
      ...effects,
      glow: { ...effects.glow, settings: { ...effects.glow.settings, ...settings } },
    };
    onUpdateEffects(newEffects);
  };

  const updateGlassSettings = (settings: Partial<GlassSettings>) => {
    const newEffects = {
      ...effects,
      glass: { ...effects.glass, settings: { ...effects.glass.settings, ...settings } },
    };
    onUpdateEffects(newEffects);
  };

  const updateNeomorphSettings = (settings: Partial<NeomorphSettings>) => {
    const newEffects = {
      ...effects,
      neomorph: { ...effects.neomorph, settings: { ...effects.neomorph.settings, ...settings } },
    };
    onUpdateEffects(newEffects);
  };

  const updateClaySettings = (settings: Partial<ClaySettings>) => {
    const newEffects = {
      ...effects,
      clay: { ...effects.clay, settings: { ...effects.clay.settings, ...settings } },
    };
    onUpdateEffects(newEffects);
  };

  const resetEffects = () => {
    onUpdateEffects(getDefaultEffects());
  };

  const activeCount = Object.values(effects).filter(e => e.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
        <div>
          <p className="text-sm font-medium text-slate-200">{instance.name}</p>
          <p className="text-xs text-slate-500">{activeCount} effekt aktív</p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetEffects} className="h-7 px-2">
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Effect Toggles */}
      <div className="space-y-1.5">
        {effectConfig.map(({ type, label, icon: Icon, color, description }) => {
          const isActive = effects[type].enabled;
          const colors = colorClasses[color];
          
          return (
            <button
              key={type}
              onClick={() => toggleEffect(type)}
              className={cn(
                "group w-full flex items-center justify-between rounded-xl transition-all",
                isActive 
                  ? `p-[1px] ${colors.glow}`
                  : "border border-neutral-800/80 bg-neutral-900/80 hover:bg-neutral-800/70"
              )}
              style={isActive ? {
                background: `linear-gradient(90deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                '--tw-gradient-from': `hsl(var(--${color}-500) / 0.8)`,
                '--tw-gradient-to': `hsl(var(--${color}-400) / 0.6)`,
              } as React.CSSProperties : undefined}
            >
              <div className={cn(
                "flex-1 flex items-center justify-between px-3 py-2.5",
                isActive && "rounded-[0.70rem] bg-neutral-950/95"
              )}>
                <div className="flex items-center gap-2.5">
                  <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-lg", colors.bg, colors.text)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-100">{label}</p>
                    <p className="text-xs text-slate-400">{description}</p>
                  </div>
                </div>
                <div className={cn(
                  "relative inline-flex h-5 w-10 items-center rounded-full transition-colors",
                  isActive ? "bg-amber-400" : "bg-neutral-700"
                )}>
                  <span className={cn(
                    "inline-block h-4 w-4 rounded-full bg-neutral-950 shadow transition-transform",
                    isActive ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Effect Settings */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EffectType)}>
        <TabsList className="w-full grid grid-cols-4 bg-neutral-900/50 border border-neutral-800/80 h-10">
          {effectConfig.map(({ type, label, icon: Icon, color }) => (
            <TabsTrigger
              key={type}
              value={type}
              disabled={!effects[type].enabled}
              className={`gap-1 text-xs data-[state=active]:bg-${color}-500/20 data-[state=active]:text-${color}-200`}
            >
              <Icon className="w-3 h-3" />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Glow Settings */}
        <TabsContent value="glow" className="mt-4 space-y-4">
          {effects.glow.enabled ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Szín</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1 pr-3 h-8">
                      <div 
                        className="w-6 h-6 rounded-md border border-white/20"
                        style={{ backgroundColor: effects.glow.settings.color }}
                      />
                      <span className="text-xs font-mono text-slate-300">{effects.glow.settings.color}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700">
                    <HexColorPicker 
                      color={effects.glow.settings.color} 
                      onChange={(c) => updateGlowSettings({ color: c })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Intenzitás</span>
                  <span>{effects.glow.settings.intensity}%</span>
                </div>
                <Slider
                  value={[effects.glow.settings.intensity]}
                  onValueChange={([v]) => updateGlowSettings({ intensity: v })}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Blur</span>
                  <span>{effects.glow.settings.blur}px</span>
                </div>
                <Slider
                  value={[effects.glow.settings.blur]}
                  onValueChange={([v]) => updateGlowSettings({ blur: v })}
                  min={0}
                  max={50}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Spread</span>
                  <span>{effects.glow.settings.spread}px</span>
                </div>
                <Slider
                  value={[effects.glow.settings.spread]}
                  onValueChange={([v]) => updateGlowSettings({ spread: v })}
                  min={-10}
                  max={20}
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Kapcsold be a Glow effektet a szerkesztéshez</p>
          )}
        </TabsContent>

        {/* Glass Settings */}
        <TabsContent value="glass" className="mt-4 space-y-4">
          {effects.glass.enabled ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Backdrop Blur</span>
                  <span>{effects.glass.settings.blur}px</span>
                </div>
                <Slider
                  value={[effects.glass.settings.blur]}
                  onValueChange={([v]) => updateGlassSettings({ blur: v })}
                  min={0}
                  max={50}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Opacity</span>
                  <span>{effects.glass.settings.opacity}%</span>
                </div>
                <Slider
                  value={[effects.glass.settings.opacity]}
                  onValueChange={([v]) => updateGlassSettings({ opacity: v })}
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Tint</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1 pr-3 h-8">
                      <div 
                        className="w-6 h-6 rounded-md border border-white/20"
                        style={{ backgroundColor: effects.glass.settings.tint }}
                      />
                      <span className="text-xs font-mono text-slate-300">{effects.glass.settings.tint}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700">
                    <HexColorPicker 
                      color={effects.glass.settings.tint} 
                      onChange={(c) => updateGlassSettings({ tint: c })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Tint Strength</span>
                  <span>{effects.glass.settings.tintStrength}%</span>
                </div>
                <Slider
                  value={[effects.glass.settings.tintStrength]}
                  onValueChange={([v]) => updateGlassSettings({ tintStrength: v })}
                  min={0}
                  max={50}
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Kapcsold be a Glass effektet a szerkesztéshez</p>
          )}
        </TabsContent>

        {/* Neomorph Settings */}
        <TabsContent value="neomorph" className="mt-4 space-y-4">
          {effects.neomorph.enabled ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Distance</span>
                  <span>{effects.neomorph.settings.distance}px</span>
                </div>
                <Slider
                  value={[effects.neomorph.settings.distance]}
                  onValueChange={([v]) => updateNeomorphSettings({ distance: v })}
                  min={5}
                  max={30}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Blur</span>
                  <span>{effects.neomorph.settings.blur}px</span>
                </div>
                <Slider
                  value={[effects.neomorph.settings.blur]}
                  onValueChange={([v]) => updateNeomorphSettings({ blur: v })}
                  min={10}
                  max={60}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Intensity</span>
                  <span>{effects.neomorph.settings.intensity}%</span>
                </div>
                <Slider
                  value={[effects.neomorph.settings.intensity]}
                  onValueChange={([v]) => updateNeomorphSettings({ intensity: v })}
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Surface Color</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1 pr-3 h-8">
                      <div 
                        className="w-6 h-6 rounded-md border border-white/20"
                        style={{ backgroundColor: effects.neomorph.settings.surfaceColor }}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700">
                    <HexColorPicker 
                      color={effects.neomorph.settings.surfaceColor} 
                      onChange={(c) => updateNeomorphSettings({ surfaceColor: c })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Kapcsold be a Neomorph effektet a szerkesztéshez</p>
          )}
        </TabsContent>

        {/* Clay Settings */}
        <TabsContent value="clay" className="mt-4 space-y-4">
          {effects.clay.enabled ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Depth</span>
                  <span>{effects.clay.settings.depth}px</span>
                </div>
                <Slider
                  value={[effects.clay.settings.depth]}
                  onValueChange={([v]) => updateClaySettings({ depth: v })}
                  min={5}
                  max={20}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Spread</span>
                  <span>{effects.clay.settings.spread}px</span>
                </div>
                <Slider
                  value={[effects.clay.settings.spread]}
                  onValueChange={([v]) => updateClaySettings({ spread: v })}
                  min={0}
                  max={30}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Border Radius</span>
                  <span>{effects.clay.settings.borderRadius}px</span>
                </div>
                <Slider
                  value={[effects.clay.settings.borderRadius]}
                  onValueChange={([v]) => updateClaySettings({ borderRadius: v })}
                  min={8}
                  max={40}
                />
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">Kapcsold be a Clay effektet a szerkesztéshez</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Generate CSS styles for effects
export const generateEffectStyles = (effects: ComponentEffects): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  
  if (effects.glow.enabled) {
    const { color, intensity, blur, spread } = effects.glow.settings;
    const alpha = intensity / 100;
    styles.boxShadow = `0 0 ${blur}px ${spread}px ${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }
  
  if (effects.glass.enabled) {
    const { blur, opacity, tint, tintStrength } = effects.glass.settings;
    styles.backdropFilter = `blur(${blur}px)`;
    styles.WebkitBackdropFilter = `blur(${blur}px)`;
    const bgAlpha = opacity / 100;
    const tintAlpha = tintStrength / 100;
    styles.backgroundColor = `${tint}${Math.round(tintAlpha * bgAlpha * 255).toString(16).padStart(2, '0')}`;
  }
  
  if (effects.neomorph.enabled) {
    const { distance, blur, intensity, surfaceColor, lightSource } = effects.neomorph.settings;
    const angle = (lightSource * Math.PI) / 180;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const alpha = intensity / 100;
    styles.boxShadow = `${x}px ${y}px ${blur}px rgba(0,0,0,${alpha * 0.5}), ${-x}px ${-y}px ${blur}px rgba(255,255,255,${alpha * 0.1})`;
    styles.backgroundColor = surfaceColor;
  }
  
  if (effects.clay.enabled) {
    const { depth, spread, borderRadius, highlightColor, shadowColor } = effects.clay.settings;
    styles.borderRadius = `${borderRadius}px`;
    styles.boxShadow = `0 ${depth}px ${spread}px ${shadowColor}40, inset 0 -2px 4px ${shadowColor}20, inset 0 2px 4px ${highlightColor}30`;
  }
  
  return styles;
};
