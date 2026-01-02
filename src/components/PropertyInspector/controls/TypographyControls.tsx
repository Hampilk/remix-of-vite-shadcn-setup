import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TypographyControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const fontFamilies = [
  { value: 'sans', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
];

const fontSizes = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'base', label: 'Base' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
  { value: '5xl', label: '5XL' },
  { value: '6xl', label: '6XL' },
  { value: '7xl', label: '7XL' },
  { value: '8xl', label: '8XL' },
  { value: '9xl', label: '9XL' },
];

const fontWeights = [
  { value: 'thin', label: 'Thin' },
  { value: 'extralight', label: 'Extra Light' },
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
  { value: 'extrabold', label: 'Extra Bold' },
  { value: 'black', label: 'Black' },
];

const alignments = [
  { value: 'left', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'right', icon: AlignRight },
  { value: 'justify', icon: AlignJustify },
];

export const TypographyControls = ({ state, onChange }: TypographyControlsProps) => {
  const updateTypography = (key: keyof typeof state.typography, value: string) => {
    onChange({
      typography: {
        ...state.typography,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Typography" icon={<Type className="w-3.5 h-3.5" />} defaultOpen>
      <div className="space-y-3">
        {/* Font Family */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Font Family
          </label>
          <Select
            value={state.typography.fontFamily}
            onValueChange={(v) => updateTypography('fontFamily', v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Size
            </label>
            <Select
              value={state.typography.fontSize}
              onValueChange={(v) => updateTypography('fontSize', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[200px]">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Weight
            </label>
            <Select
              value={state.typography.fontWeight}
              onValueChange={(v) => updateTypography('fontWeight', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[200px]">
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Text Color
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-8 w-full flex items-center gap-2 px-3 text-xs rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: state.typography.textColor }}
                />
                <span className="font-mono text-muted-foreground">
                  {state.typography.textColor}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker
                color={state.typography.textColor}
                onChange={(color) => updateTypography('textColor', color)}
              />
              <Input
                value={state.typography.textColor}
                onChange={(e) => updateTypography('textColor', e.target.value)}
                className="mt-2 h-8 text-xs font-mono"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Text Alignment */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Alignment
          </label>
          <div className="flex gap-1">
            {alignments.map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateTypography('textAlign', value)}
                className={cn(
                  'flex-1 h-8 flex items-center justify-center rounded-md border transition-colors',
                  state.typography.textAlign === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-secondary/50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
