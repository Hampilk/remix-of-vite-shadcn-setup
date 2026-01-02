import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image } from 'lucide-react';
import { ColorPicker } from './ColorPicker/ColorPicker';

interface AppearanceControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const blendModes = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

export const AppearanceControls = ({ state, onChange }: AppearanceControlsProps) => {
  const updateAppearance = (key: keyof typeof state.appearance, value: any) => {
    onChange({
      appearance: {
        ...state.appearance,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Appearance" icon={<Palette className="w-3.5 h-3.5" />} defaultOpen>
      <div className="space-y-3">
        {/* Background Color */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Background
          </label>
          <ColorPicker
            value={state.appearance.backgroundColor}
            onChange={(v) => updateAppearance('backgroundColor', v)}
          />
        </div>

        {/* Background Image */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Image className="w-3 h-3" />
            Background Image
          </label>
          <Input
            value={state.appearance.backgroundImage}
            onChange={(e) => updateAppearance('backgroundImage', e.target.value)}
            placeholder="url(...)"
            className="h-8 text-xs"
          />
        </div>

        {/* Blend Mode */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Blend Mode
          </label>
          <Select
            value={state.appearance.blendMode}
            onValueChange={(v) => updateAppearance('blendMode', v)}
          >
            <SelectTrigger className="h-8 text-xs capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-[200px]">
              {blendModes.map((mode) => (
                <SelectItem key={mode} value={mode} className="capitalize">
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CollapsibleSection>
  );
};
