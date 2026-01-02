import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { RangeSlider } from '../RangeSlider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Eye, Droplet, Sun, Contrast, FlipHorizontal } from 'lucide-react';

interface EffectsControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
];

export const EffectsControls = ({ state, onChange }: EffectsControlsProps) => {
  const updateEffects = (key: keyof typeof state.effects, value: any) => {
    onChange({
      effects: {
        ...state.effects,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Effects" icon={<Sparkles className="w-3.5 h-3.5" />} defaultOpen>
      <div className="space-y-3">
        {/* Shadow */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Shadow
          </label>
          <Select
            value={state.effects.shadow}
            onValueChange={(v) => updateEffects('shadow', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              {shadowOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opacity */}
        <RangeSlider
          icon={<Eye className="w-3 h-3" />}
          label="Opacity"
          value={state.opacity}
          onChange={(v) => onChange({ opacity: v })}
          min={0}
          max={100}
          unit="%"
        />

        {/* Blur */}
        <RangeSlider
          icon={<Droplet className="w-3 h-3" />}
          label="Blur"
          value={state.effects.blur}
          onChange={(v) => updateEffects('blur', v)}
          min={0}
          max={50}
          unit="px"
        />

        {/* Backdrop Blur */}
        <RangeSlider
          icon={<Droplet className="w-3 h-3" />}
          label="Backdrop Blur"
          value={state.effects.backdropBlur}
          onChange={(v) => updateEffects('backdropBlur', v)}
          min={0}
          max={50}
          unit="px"
        />

        {/* Brightness */}
        <RangeSlider
          icon={<Sun className="w-3 h-3" />}
          label="Brightness"
          value={state.effects.brightness}
          onChange={(v) => updateEffects('brightness', v)}
          min={0}
          max={200}
          unit="%"
        />

        {/* Saturation */}
        <RangeSlider
          icon={<Sun className="w-3 h-3" />}
          label="Saturation"
          value={state.effects.saturation}
          onChange={(v) => updateEffects('saturation', v)}
          min={0}
          max={200}
          unit="%"
        />

        {/* Hue Rotate */}
        <RangeSlider
          icon={<Contrast className="w-3 h-3" />}
          label="Hue Rotate"
          value={state.effects.hueRotate}
          onChange={(v) => updateEffects('hueRotate', v)}
          min={0}
          max={360}
          unit="°"
        />

        {/* Grayscale */}
        <RangeSlider
          icon={<FlipHorizontal className="w-3 h-3" />}
          label="Grayscale"
          value={state.effects.grayscale}
          onChange={(v) => updateEffects('grayscale', v)}
          min={0}
          max={100}
          unit="%"
        />

        {/* Invert */}
        <RangeSlider
          icon={<FlipHorizontal className="w-3 h-3" />}
          label="Invert"
          value={state.effects.invert}
          onChange={(v) => updateEffects('invert', v)}
          min={0}
          max={100}
          unit="%"
        />

        {/* Liquid Glass Toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Liquid Glass
          </span>
          <Switch
            checked={state.effects.liquidGlass}
            onCheckedChange={(v) => updateEffects('liquidGlass', v)}
          />
        </div>

        {/* Alpha Mask */}
        <RangeSlider
          label="Alpha Mask"
          value={state.effects.alphaMask}
          onChange={(v) => updateEffects('alphaMask', v)}
          min={0}
          max={100}
          unit="%"
        />
      </div>
    </CollapsibleSection>
  );
};
