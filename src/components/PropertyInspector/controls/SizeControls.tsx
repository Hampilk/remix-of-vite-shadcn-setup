import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Ruler } from 'lucide-react';

interface SizeControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

export const SizeControls = ({ state, onChange }: SizeControlsProps) => {
  const updateSize = (key: keyof typeof state.size, value: string) => {
    onChange({
      size: {
        ...state.size,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Size" icon={<Ruler className="w-3.5 h-3.5" />}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Width
            </label>
            <Input
              value={state.size.width}
              onChange={(e) => updateSize('width', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Height
            </label>
            <Input
              value={state.size.height}
              onChange={(e) => updateSize('height', e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Max Width
            </label>
            <Input
              value={state.size.maxWidth}
              onChange={(e) => updateSize('maxWidth', e.target.value)}
              placeholder="none"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Max Height
            </label>
            <Input
              value={state.size.maxHeight}
              onChange={(e) => updateSize('maxHeight', e.target.value)}
              placeholder="none"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};
