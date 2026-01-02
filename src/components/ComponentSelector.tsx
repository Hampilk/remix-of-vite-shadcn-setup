import { ComponentMeta } from '@/types/component';
import { ComponentInstance, Position } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { Plus } from 'lucide-react';

interface ComponentSelectorProps {
  onAddComponent: (componentId: string, position?: Position) => void;
  recentComponents?: string[];
}

export const ComponentSelector = ({ onAddComponent, recentComponents = [] }: ComponentSelectorProps) => {
  const quickAddComponents = [
    'button',
    'input',
    'card',
    'badge',
    'tabs',
  ];

  const componentsToShow = recentComponents.length > 0 
    ? recentComponents.slice(0, 5) 
    : quickAddComponents;

  return (
    <div className="flex items-center gap-2 p-2 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
      <span className="text-xs text-slate-500 px-2">Quick add:</span>
      {componentsToShow.map(compId => {
        const comp = getComponentById(compId);
        if (!comp) return null;
        
        return (
          <button
            key={compId}
            onClick={() => onAddComponent(compId)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md bg-neutral-800/50 text-slate-300 hover:bg-neutral-700/50 hover:text-slate-100 transition-colors border border-neutral-700/30"
          >
            <Plus className="h-3 w-3" />
            {comp.name}
          </button>
        );
      })}
    </div>
  );
};
