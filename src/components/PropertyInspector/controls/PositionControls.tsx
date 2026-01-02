import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crosshair } from 'lucide-react';

interface PositionControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const positionTypes = ['static', 'relative', 'absolute', 'fixed', 'sticky'];

export const PositionControls = ({ state, onChange }: PositionControlsProps) => {
  const updatePosition = (key: keyof typeof state.position, value: string) => {
    onChange({
      position: {
        ...state.position,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Position" icon={<Crosshair className="w-3.5 h-3.5" />}>
      <div className="space-y-3">
        {/* Position Type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Type
          </label>
          <Select
            value={state.position.type}
            onValueChange={(v) => updatePosition('type', v)}
          >
            <SelectTrigger className="h-8 text-xs capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              {positionTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offset Values */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Top
            </label>
            <Input
              value={state.position.top}
              onChange={(e) => updatePosition('top', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Right
            </label>
            <Input
              value={state.position.right}
              onChange={(e) => updatePosition('right', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Bottom
            </label>
            <Input
              value={state.position.bottom}
              onChange={(e) => updatePosition('bottom', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Left
            </label>
            <Input
              value={state.position.left}
              onChange={(e) => updatePosition('left', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Z-Index */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Z-Index
          </label>
          <Input
            value={state.position.zIndex}
            onChange={(e) => updatePosition('zIndex', e.target.value)}
            placeholder="auto"
            className="h-8 text-xs"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
