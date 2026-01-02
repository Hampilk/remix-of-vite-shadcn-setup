import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { cn } from '@/lib/utils';
import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Layout,
} from 'lucide-react';

interface AlignmentControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

const justifyOptions = [
  { value: 'flex-start', icon: AlignHorizontalJustifyStart, label: 'Start' },
  { value: 'center', icon: AlignHorizontalJustifyCenter, label: 'Center' },
  { value: 'flex-end', icon: AlignHorizontalJustifyEnd, label: 'End' },
  { value: 'space-between', icon: AlignHorizontalSpaceBetween, label: 'Between' },
  { value: 'space-around', icon: AlignHorizontalSpaceAround, label: 'Around' },
];

const alignOptions = [
  { value: 'flex-start', icon: AlignVerticalJustifyStart, label: 'Start' },
  { value: 'center', icon: AlignVerticalJustifyCenter, label: 'Center' },
  { value: 'flex-end', icon: AlignVerticalJustifyEnd, label: 'End' },
  { value: 'stretch', icon: Layout, label: 'Stretch' },
];

export const AlignmentControls = ({ state, onChange }: AlignmentControlsProps) => {
  const updateAlignment = (key: keyof typeof state.alignment, value: string) => {
    onChange({
      alignment: {
        ...state.alignment,
        [key]: value,
      },
    });
  };

  return (
    <CollapsibleSection title="Alignment" icon={<Layout className="w-3.5 h-3.5" />}>
      <div className="space-y-3">
        {/* Justify Content */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Justify Content
          </label>
          <div className="flex gap-1">
            {justifyOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateAlignment('justifyContent', value)}
                title={label}
                className={cn(
                  'flex-1 h-8 flex items-center justify-center rounded-md border transition-colors',
                  state.alignment.justifyContent === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-secondary/50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Align Items */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Align Items
          </label>
          <div className="flex gap-1">
            {alignOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateAlignment('alignItems', value)}
                title={label}
                className={cn(
                  'flex-1 h-8 flex items-center justify-center rounded-md border transition-colors',
                  state.alignment.alignItems === value
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
