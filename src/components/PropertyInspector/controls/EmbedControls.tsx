import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Input } from '@/components/ui/input';
import { Paperclip } from 'lucide-react';

interface EmbedControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

export const EmbedControls = ({ state, onChange }: EmbedControlsProps) => {
  return (
    <CollapsibleSection title="Embed" icon={<Paperclip className="w-3.5 h-3.5" />}>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Asset URL
          </label>
          <Input
            value={state.embed}
            onChange={(e) => onChange({ embed: e.target.value })}
            placeholder="https://..."
            className="h-8 text-xs"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
