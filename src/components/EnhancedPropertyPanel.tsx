import { useState, useEffect } from 'react';
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
import {
  Type, Palette, Box, Layers, Move, RotateCw, 
  Sun, Sparkles, Settings2, Maximize, AlignCenter,
  MousePointer2, Square
} from 'lucide-react';

interface EnhancedPropertyPanelProps {
  instance: ComponentInstance | null;
  onUpdateProps: (props: Partial<InstanceProps>) => void;
  onUpdateInstance: (updates: Partial<ComponentInstance>) => void;
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

const NumberInput = ({
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

export const EnhancedPropertyPanel = ({ 
  instance, 
  onUpdateProps,
  onUpdateInstance,
}: EnhancedPropertyPanelProps) => {
  const [openSections, setOpenSections] = useState<string[]>(['content', 'appearance', 'size']);

  if (!instance) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
        <MousePointer2 className="h-8 w-8 mb-3 opacity-50" />
        <p className="text-sm">Select a component to edit properties</p>
        <p className="text-xs text-slate-600 mt-1">Click on any component in the canvas</p>
      </div>
    );
  }

  const component = getComponentById(instance.componentId);
  const props = instance.props;

  return (
    <div className="space-y-4">
      {/* Component Header */}
      <div className="flex items-center gap-3 p-3 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Box className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            value={instance.name}
            onChange={(e) => onUpdateInstance({ name: e.target.value })}
            className="h-7 text-sm font-medium bg-transparent border-none px-0 focus-visible:ring-0"
          />
          <p className="text-xs text-slate-500 truncate">{component?.description}</p>
        </div>
      </div>

      {/* Property Sections */}
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

            <NumberInput
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
            <NumberInput
              label="Scale"
              value={(props.scale ?? 1) * 100}
              onChange={(value) => onUpdateProps({ scale: value / 100 })}
              min={10}
              max={200}
              unit="%"
            />
            <NumberInput
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

      {/* Position Info */}
      <div className="p-3 bg-neutral-800/20 rounded-lg border border-neutral-700/30">
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
