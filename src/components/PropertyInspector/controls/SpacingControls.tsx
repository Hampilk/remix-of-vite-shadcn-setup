import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { RangeSlider } from '../RangeSlider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Space, Grid } from 'lucide-react';

interface SpacingControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const spacingValues = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32'];

export const SpacingControls = ({ state, onChange }: SpacingControlsProps) => {
  const updatePadding = (key: keyof typeof state.padding, value: number) => {
    onChange({
      padding: {
        ...state.padding,
        [key]: value,
      },
    });
  };

  const updateMargin = (key: keyof typeof state.margin, value: number) => {
    onChange({
      margin: {
        ...state.margin,
        [key]: value,
      },
    });
  };

  const updateSpacing = (key: keyof typeof state.spacing, value: string) => {
    onChange({
      spacing: {
        ...state.spacing,
        [key]: value,
      },
    });
  };

  return (
    <>
      {/* Padding */}
      <CollapsibleSection title="Padding" icon={<Space className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <RangeSlider
              label="Left"
              value={state.padding.l}
              onChange={(v) => updatePadding('l', v)}
              min={0}
              max={64}
              unit="px"
            />
            <RangeSlider
              label="Right"
              value={state.padding.r}
              onChange={(v) => updatePadding('r', v)}
              min={0}
              max={64}
              unit="px"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RangeSlider
              label="Top"
              value={state.padding.t}
              onChange={(v) => updatePadding('t', v)}
              min={0}
              max={64}
              unit="px"
            />
            <RangeSlider
              label="Bottom"
              value={state.padding.b}
              onChange={(v) => updatePadding('b', v)}
              min={0}
              max={64}
              unit="px"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Margin */}
      <CollapsibleSection title="Margin" icon={<Space className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-2 gap-3">
          <RangeSlider
            label="X (Horizontal)"
            value={state.margin.x}
            onChange={(v) => updateMargin('x', v)}
            min={0}
            max={64}
            unit="px"
          />
          <RangeSlider
            label="Y (Vertical)"
            value={state.margin.y}
            onChange={(v) => updateMargin('y', v)}
            min={0}
            max={64}
            unit="px"
          />
        </div>
      </CollapsibleSection>

      {/* Spacing */}
      <CollapsibleSection title="Spacing" icon={<Grid className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Space X
              </label>
              <Select value={state.spacing.spaceX} onValueChange={(v) => updateSpacing('spaceX', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[200px]">
                  {spacingValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Space Y
              </label>
              <Select value={state.spacing.spaceY} onValueChange={(v) => updateSpacing('spaceY', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[200px]">
                  {spacingValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Gap X
              </label>
              <Select value={state.spacing.gapX} onValueChange={(v) => updateSpacing('gapX', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[200px]">
                  {spacingValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Gap Y
              </label>
              <Select value={state.spacing.gapY} onValueChange={(v) => updateSpacing('gapY', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[200px]">
                  {spacingValues.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </>
  );
};
