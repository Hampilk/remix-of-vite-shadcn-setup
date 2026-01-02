import { useState } from 'react';
import { ComponentInstance, InstanceProps } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ComponentEffects, getDefaultEffects } from '@/components/ComponentEffectEditor';
import { GlassSettings, NeomorphSettings, ClaySettings } from '@/contexts/EffectContext';
import { cn } from '@/lib/utils';
import {
  Type, Palette, Box, Maximize, Square, Move, RotateCw, 
  Settings, Sparkles, Code2, MousePointer2, ChevronDown,
  RefreshCw
} from 'lucide-react';

type InspectorTab = 'properties' | 'effects' | 'code';

interface UnifiedInspectorProps {
  instance: ComponentInstance | null;
  onUpdateProps: (props: Partial<InstanceProps>) => void;
  onUpdateInstance: (updates: Partial<ComponentInstance>) => void;
  onUpdateEffects: (effects: ComponentEffects) => void;
}

const ColorInput = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value?: string; 
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-slate-400">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full h-8 flex items-center gap-2 px-2 rounded-md border border-neutral-700/50 bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors">
          <div 
            className="w-5 h-5 rounded border border-neutral-600" 
            style={{ backgroundColor: value || 'transparent' }}
          />
          <span className="text-xs text-slate-300 flex-1 text-left truncate">
            {value || 'None'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700" align="start">
        <HexColorPicker color={value || '#ffffff'} onChange={onChange} />
        <div className="mt-2 flex gap-1">
          <Input 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            className="h-7 text-xs font-mono"
            placeholder="#000000"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => onChange('')}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

const NumberSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
}: {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="text-xs text-slate-400">{label}</Label>
      <span className="text-xs text-slate-500">{value ?? min}{unit}</span>
    </div>
    <Slider
      value={[value ?? min]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
  </div>
);

// Effect toggle button component
const EffectToggle = ({
  type,
  label,
  enabled,
  onToggle,
  color,
}: {
  type: string;
  label: string;
  enabled: boolean;
  onToggle: () => void;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    sky: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    purple: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
    rose: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
        enabled 
          ? colorClasses[color] 
          : "bg-neutral-800/30 text-slate-500 border-neutral-700/30 hover:bg-neutral-700/50"
      )}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const UnifiedInspector = ({ 
  instance, 
  onUpdateProps,
  onUpdateInstance,
  onUpdateEffects,
}: UnifiedInspectorProps) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('properties');
  const [openSections, setOpenSections] = useState<string[]>(['content', 'appearance', 'size']);
  const [activeEffectTab, setActiveEffectTab] = useState<'glow' | 'glass' | 'neomorph' | 'clay'>('glow');

  if (!instance) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
        <MousePointer2 className="h-8 w-8 mb-3 opacity-50" />
        <p className="text-sm">Válassz ki egy komponenst</p>
        <p className="text-xs text-slate-600 mt-1">az inspektorhoz</p>
      </div>
    );
  }

  const component = getComponentById(instance.componentId);
  const props = instance.props;

  // Get effects with defaults merged
  const defaultEffects = getDefaultEffects();
  const effects: ComponentEffects = instance?.effects 
    ? {
        glow: { ...defaultEffects.glow, ...(instance.effects as any).glow },
        glass: { ...defaultEffects.glass, ...(instance.effects as any).glass },
        neomorph: { ...defaultEffects.neomorph, ...(instance.effects as any).neomorph },
        clay: { ...defaultEffects.clay, ...(instance.effects as any).clay },
      }
    : defaultEffects;

  const toggleEffect = (type: 'glow' | 'glass' | 'neomorph' | 'clay') => {
    const newEffects = {
      ...effects,
      [type]: { ...effects[type], enabled: !effects[type].enabled },
    };
    onUpdateEffects(newEffects);
  };

  const updateGlowSettings = (settings: Partial<typeof effects.glow.settings>) => {
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

  const activeEffectsCount = [effects.glow, effects.glass, effects.neomorph, effects.clay].filter(e => e.enabled).length;

  const generateCodeSnippet = () => {
    const propStrings: string[] = [];
    if (props.variant) propStrings.push(`variant="${props.variant}"`);
    if (props.size) propStrings.push(`size="${props.size}"`);
    if (props.disabled) propStrings.push('disabled');
    
    const propsStr = propStrings.length > 0 ? ` ${propStrings.join(' ')}` : '';
    const text = props.text || component?.name || 'Component';
    
    return `<${component?.name || 'Component'}${propsStr}>\n  ${text}\n</${component?.name || 'Component'}>`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Header */}
      <div className="p-3 border-b border-neutral-800/50">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InspectorTab)}>
          <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/80 grid grid-cols-3">
            <TabsTrigger 
              value="properties" 
              className="gap-1.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
            >
              <Settings className="w-3.5 h-3.5" />
            </TabsTrigger>
            <TabsTrigger 
              value="effects" 
              className="gap-1.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200 relative"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {activeEffectsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeEffectsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="gap-1.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
            >
              <Code2 className="w-3.5 h-3.5" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Component Header */}
      <div className="p-3 border-b border-neutral-800/30">
        <div className="flex items-center gap-3 p-3 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Box className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={instance.name}
              onChange={(e) => onUpdateInstance({ name: e.target.value })}
              className="h-6 text-sm font-medium bg-transparent border-none px-0 focus-visible:ring-0"
            />
            <p className="text-xs text-slate-500 truncate">{component?.description}</p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="p-3 space-y-1">
            <Accordion 
              type="multiple" 
              value={openSections} 
              onValueChange={setOpenSections}
              className="space-y-1"
            >
              {/* Content */}
              <AccordionItem value="content" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Type className="h-3.5 w-3.5 text-amber-400" />
                    Content
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Text</Label>
                    <Input
                      value={props.text || ''}
                      onChange={(e) => onUpdateProps({ text: e.target.value })}
                      placeholder="Enter text..."
                      className="h-8 text-xs"
                    />
                  </div>

                  {component?.variants && component.variants.length > 0 && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Variant</Label>
                      <Select
                        value={props.variant || component.variants[0]}
                        onValueChange={(value) => onUpdateProps({ variant: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {component.variants.map((variant) => (
                            <SelectItem key={variant} value={variant} className="text-xs">
                              {variant.charAt(0).toUpperCase() + variant.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-400">Disabled</Label>
                    <Switch
                      checked={props.disabled || false}
                      onCheckedChange={(checked) => onUpdateProps({ disabled: checked })}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Appearance */}
              <AccordionItem value="appearance" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Palette className="h-3.5 w-3.5 text-amber-400" />
                    Appearance
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ColorInput
                      label="Background"
                      value={props.backgroundColor}
                      onChange={(value) => onUpdateProps({ backgroundColor: value })}
                    />
                    <ColorInput
                      label="Text Color"
                      value={props.textColor}
                      onChange={(value) => onUpdateProps({ textColor: value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ColorInput
                      label="Border"
                      value={props.borderColor}
                      onChange={(value) => onUpdateProps({ borderColor: value })}
                    />
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Border Width</Label>
                      <Input
                        value={props.borderWidth || ''}
                        onChange={(e) => onUpdateProps({ borderWidth: e.target.value })}
                        placeholder="1px"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Border Radius</Label>
                    <Input
                      value={props.borderRadius || ''}
                      onChange={(e) => onUpdateProps({ borderRadius: e.target.value })}
                      placeholder="0.375rem"
                      className="h-8 text-xs"
                    />
                  </div>

                  <NumberSlider
                    label="Opacity"
                    value={(props.opacity ?? 1) * 100}
                    onChange={(value) => onUpdateProps({ opacity: value / 100 })}
                    min={0}
                    max={100}
                    unit="%"
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Size */}
              <AccordionItem value="size" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Maximize className="h-3.5 w-3.5 text-amber-400" />
                    Size
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Width</Label>
                      <Input
                        value={props.width || ''}
                        onChange={(e) => onUpdateProps({ width: e.target.value })}
                        placeholder="auto"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Height</Label>
                      <Input
                        value={props.height || ''}
                        onChange={(e) => onUpdateProps({ height: e.target.value })}
                        placeholder="auto"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Spacing */}
              <AccordionItem value="spacing" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Square className="h-3.5 w-3.5 text-amber-400" />
                    Spacing
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Padding</Label>
                      <Input
                        value={props.padding || ''}
                        onChange={(e) => onUpdateProps({ padding: e.target.value })}
                        placeholder="0"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Margin</Label>
                      <Input
                        value={props.margin || ''}
                        onChange={(e) => onUpdateProps({ margin: e.target.value })}
                        placeholder="0"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Typography */}
              <AccordionItem value="typography" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Type className="h-3.5 w-3.5 text-amber-400" />
                    Typography
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Font Size</Label>
                      <Input
                        value={props.fontSize || ''}
                        onChange={(e) => onUpdateProps({ fontSize: e.target.value })}
                        placeholder="14px"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Font Weight</Label>
                      <Select
                        value={String(props.fontWeight || 'normal')}
                        onValueChange={(value) => onUpdateProps({ fontWeight: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['normal', 'medium', 'semibold', 'bold'].map((weight) => (
                            <SelectItem key={weight} value={weight} className="text-xs">
                              {weight.charAt(0).toUpperCase() + weight.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Transform */}
              <AccordionItem value="transform" className="border-none">
                <AccordionTrigger className="py-2 px-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 hover:no-underline">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <RotateCw className="h-3.5 w-3.5 text-amber-400" />
                    Transform
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-1 space-y-3">
                  <NumberSlider
                    label="Scale"
                    value={(props.scale ?? 1) * 100}
                    onChange={(value) => onUpdateProps({ scale: value / 100 })}
                    min={10}
                    max={200}
                    unit="%"
                  />
                  <NumberSlider
                    label="Rotate"
                    value={props.rotate ?? 0}
                    onChange={(value) => onUpdateProps({ rotate: value })}
                    min={-180}
                    max={180}
                    unit="°"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="p-3 space-y-4">
            {/* Effect Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <EffectToggle type="glow" label="Glow" enabled={effects.glow.enabled} onToggle={() => toggleEffect('glow')} color="amber" />
              <EffectToggle type="glass" label="Glass" enabled={effects.glass.enabled} onToggle={() => toggleEffect('glass')} color="sky" />
              <EffectToggle type="neomorph" label="Neomorph" enabled={effects.neomorph.enabled} onToggle={() => toggleEffect('neomorph')} color="purple" />
              <EffectToggle type="clay" label="Clay" enabled={effects.clay.enabled} onToggle={() => toggleEffect('clay')} color="rose" />
            </div>

            {/* Effect Settings */}
            <Tabs value={activeEffectTab} onValueChange={(v) => setActiveEffectTab(v as any)}>
              <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/80 grid grid-cols-4">
                <TabsTrigger value="glow" className="text-xs data-[state=active]:bg-amber-500/20">Glow</TabsTrigger>
                <TabsTrigger value="glass" className="text-xs data-[state=active]:bg-sky-500/20">Glass</TabsTrigger>
                <TabsTrigger value="neomorph" className="text-xs data-[state=active]:bg-purple-500/20">Neo</TabsTrigger>
                <TabsTrigger value="clay" className="text-xs data-[state=active]:bg-rose-500/20">Clay</TabsTrigger>
              </TabsList>

              <TabsContent value="glow" className="mt-4 space-y-4">
                {effects.glow.enabled ? (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-full h-8 flex items-center gap-2 px-2 rounded-md border border-neutral-700/50 bg-neutral-800/50">
                            <div className="w-5 h-5 rounded border border-neutral-600" style={{ backgroundColor: effects.glow.settings.color }} />
                            <span className="text-xs text-slate-300">{effects.glow.settings.color}</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3 bg-neutral-900 border-neutral-700">
                          <HexColorPicker color={effects.glow.settings.color} onChange={(c) => updateGlowSettings({ color: c })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <NumberSlider label="Intensity" value={effects.glow.settings.intensity} onChange={(v) => updateGlowSettings({ intensity: v })} max={100} unit="%" />
                    <NumberSlider label="Blur" value={effects.glow.settings.blur} onChange={(v) => updateGlowSettings({ blur: v })} max={50} unit="px" />
                    <NumberSlider label="Spread" value={effects.glow.settings.spread} onChange={(v) => updateGlowSettings({ spread: v })} max={30} unit="px" />
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">Enable Glow effect to edit settings</p>
                )}
              </TabsContent>

              <TabsContent value="glass" className="mt-4 space-y-4">
                {effects.glass.enabled ? (
                  <>
                    <NumberSlider label="Blur" value={effects.glass.settings.blur} onChange={(v) => updateGlassSettings({ blur: v })} max={30} unit="px" />
                    <NumberSlider label="Opacity" value={effects.glass.settings.opacity} onChange={(v) => updateGlassSettings({ opacity: v })} max={100} unit="%" />
                    <NumberSlider label="Saturation" value={effects.glass.settings.saturation} onChange={(v) => updateGlassSettings({ saturation: v })} max={200} unit="%" />
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">Enable Glass effect to edit settings</p>
                )}
              </TabsContent>

              <TabsContent value="neomorph" className="mt-4 space-y-4">
                {effects.neomorph.enabled ? (
                  <>
                    <NumberSlider label="Distance" value={effects.neomorph.settings.distance} onChange={(v) => updateNeomorphSettings({ distance: v })} min={5} max={30} unit="px" />
                    <NumberSlider label="Blur" value={effects.neomorph.settings.blur} onChange={(v) => updateNeomorphSettings({ blur: v })} min={10} max={60} unit="px" />
                    <NumberSlider label="Intensity" value={effects.neomorph.settings.intensity} onChange={(v) => updateNeomorphSettings({ intensity: v })} max={100} unit="%" />
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">Enable Neomorph effect to edit settings</p>
                )}
              </TabsContent>

              <TabsContent value="clay" className="mt-4 space-y-4">
                {effects.clay.enabled ? (
                  <>
                    <NumberSlider label="Depth" value={effects.clay.settings.depth} onChange={(v) => updateClaySettings({ depth: v })} min={5} max={25} unit="px" />
                    <NumberSlider label="Spread" value={effects.clay.settings.spread} onChange={(v) => updateClaySettings({ spread: v })} max={20} unit="px" />
                    <NumberSlider label="Border Radius" value={effects.clay.settings.borderRadius} onChange={(v) => updateClaySettings({ borderRadius: v })} min={8} max={40} unit="px" />
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">Enable Clay effect to edit settings</p>
                )}
              </TabsContent>
            </Tabs>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-2"
              onClick={() => onUpdateEffects(getDefaultEffects())}
            >
              <RefreshCw className="h-3 w-3" />
              Reset All Effects
            </Button>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="p-3 space-y-3">
            <Label className="text-xs text-slate-400">Component Code</Label>
            <pre className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {generateCodeSnippet()}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                navigator.clipboard.writeText(generateCodeSnippet());
              }}
            >
              Copy Code
            </Button>
          </div>
        )}
      </div>

      {/* Position Footer */}
      <div className="p-3 border-t border-neutral-800/50 bg-neutral-900/30">
        <div className="flex items-center gap-2 mb-2">
          <Move className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Position</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">X:</span>
            <span className="text-slate-300 font-mono">{Math.round(instance.position.x)}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Y:</span>
            <span className="text-slate-300 font-mono">{Math.round(instance.position.y)}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};
