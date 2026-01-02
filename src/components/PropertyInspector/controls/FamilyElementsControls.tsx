import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { Layers } from 'lucide-react';

interface FamilyElementsControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

export const FamilyElementsControls = ({ state, onChange }: FamilyElementsControlsProps) => {
  return (
    <CollapsibleSection title="Family Elements" icon={<Layers className="w-3.5 h-3.5" />}>
      <div className="space-y-2">
        {state.familyElements.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic">No parent elements</p>
        ) : (
          <div className="space-y-1">
            {state.familyElements.map((el, idx) => (
              <div
                key={idx}
                className="text-[10px] px-2 py-1 bg-secondary/50 rounded-md text-muted-foreground"
              >
                {el}
              </div>
            ))}
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};
