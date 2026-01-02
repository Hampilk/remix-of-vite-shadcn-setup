import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BorderControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'none'];
const borderWidths = ['0', '1', '2', '4', '8'];
const borderRadii = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: 'full', label: 'Full' },
];

const sides = [
  { key: 't', label: 'T' },
  { key: 'r', label: 'R' },
  { key: 'b', label: 'B' },
  { key: 'l', label: 'L' },
] as const;

export const BorderControls = ({ state, onChange }: BorderControlsProps) => {
  const updateBorder = (key: keyof typeof state.border, value: any) => {
    onChange({
      border: {
        ...state.border,
        [key]: value,
      },
    });
  };

  const toggleSide = (side: 't' | 'r' | 'b' | 'l') => {
    const newActiveSides = { ...state.border.activeSides, [side]: !state.border.activeSides[side] };
    const allActive = newActiveSides.t && newActiveSides.r && newActiveSides.b && newActiveSides.l;
    onChange({
      border: {
        ...state.border,
        activeSides: { ...newActiveSides, all: allActive },
      },
    });
  };

  const toggleAll = () => {
    const newValue = !state.border.activeSides.all;
    onChange({
      border: {
        ...state.border,
        activeSides: { all: newValue, t: newValue, r: newValue, b: newValue, l: newValue },
      },
    });
  };

  return (
    <CollapsibleSection title="Border" icon={<Square className="w-3.5 h-3.5" />} defaultOpen>
      <div className="space-y-3">
        {/* Border Color */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Color
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-8 w-full flex items-center gap-2 px-3 text-xs rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: state.border.color }}
                />
                <span className="font-mono text-muted-foreground">{state.border.color}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker
                color={state.border.color}
                onChange={(color) => updateBorder('color', color)}
              />
              <Input
                value={state.border.color}
                onChange={(e) => updateBorder('color', e.target.value)}
                className="mt-2 h-8 text-xs font-mono"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Width & Style */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Width
            </label>
            <Select value={state.border.width} onValueChange={(v) => updateBorder('width', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {borderWidths.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Style
            </label>
            <Select value={state.border.style} onValueChange={(v) => updateBorder('style', v)}>
              <SelectTrigger className="h-8 text-xs capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {borderStyles.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Border Radius */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Radius
          </label>
          <div className="flex flex-wrap gap-1">
            {borderRadii.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateBorder('radius', value)}
                className={cn(
                  'px-2.5 py-1.5 text-[10px] font-medium rounded-md border transition-colors',
                  state.border.radius === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-secondary/50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Sides */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Active Sides
          </label>
          <div className="flex gap-1">
            <button
              onClick={toggleAll}
              className={cn(
                'px-3 py-1.5 text-[10px] font-medium rounded-md border transition-colors',
                state.border.activeSides.all
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-secondary/50'
              )}
            >
              ALL
            </button>
            {sides.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleSide(key)}
                className={cn(
                  'flex-1 py-1.5 text-[10px] font-medium rounded-md border transition-colors',
                  state.border.activeSides[key]
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-secondary/50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ring */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Ring Width
            </label>
            <Select value={state.border.ringWidth} onValueChange={(v) => updateBorder('ringWidth', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {['0', '1', '2', '4', '8'].map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Ring Color
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-8 w-full flex items-center gap-2 px-2 text-xs rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors">
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: state.border.ringColor }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <HexColorPicker
                  color={state.border.ringColor}
                  onChange={(color) => updateBorder('ringColor', color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
