import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentInstance } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Component
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayersPanelProps {
  instances: ComponentInstance[];
  selectedIds: string[];
  onSelectInstance: (id: string, multi?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteInstance: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const LayersPanel = ({
  instances,
  selectedIds,
  onSelectInstance,
  onToggleVisibility,
  onToggleLock,
  onDeleteInstance,
  onBringToFront,
  onSendToBack,
  onReorder,
}: LayersPanelProps) => {
  // Sort by zIndex descending (highest on top)
  const sortedInstances = [...instances].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="flex flex-col h-full bg-neutral-950/80 border border-neutral-800/80 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800/70">
        <h3 className="text-sm font-semibold text-slate-100">Layers</h3>
        <p className="text-xs text-slate-500 mt-0.5">{instances.length} component{instances.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Layer List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedInstances.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Component className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No components yet</p>
            </div>
          ) : (
            sortedInstances.map((instance, index) => {
              const isSelected = selectedIds.includes(instance.id);
              const comp = getComponentById(instance.componentId);
              
              return (
                <div
                  key={instance.id}
                  onClick={(e) => onSelectInstance(instance.id, e.shiftKey || e.metaKey)}
                  className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/30'
                      : 'hover:bg-neutral-800/50 border border-transparent'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab opacity-50 hover:opacity-100">
                    <GripVertical className="h-3.5 w-3.5 text-slate-500" />
                  </div>

                  {/* Component Icon */}
                  <div className={`h-6 w-6 rounded flex items-center justify-center ${
                    isSelected ? 'bg-amber-500/20' : 'bg-neutral-800/50'
                  }`}>
                    <Component className={`h-3 w-3 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${
                      isSelected ? 'text-amber-200' : 'text-slate-200'
                    }`}>
                      {instance.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {comp?.name}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Move Up/Down */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBringToFront(instance.id);
                      }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendToBack(instance.id);
                      }}
                      disabled={index === sortedInstances.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>

                    {/* Visibility */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(instance.id);
                      }}
                    >
                      {instance.visible ? (
                        <Eye className="h-3 w-3 text-slate-400" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-slate-500" />
                      )}
                    </Button>

                    {/* Lock */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(instance.id);
                      }}
                    >
                      {instance.locked ? (
                        <Lock className="h-3 w-3 text-amber-400" />
                      ) : (
                        <Unlock className="h-3 w-3 text-slate-400" />
                      )}
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteInstance(instance.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer with selection info */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 border-t border-neutral-800/50 bg-neutral-950/50">
          <p className="text-xs text-slate-400">
            {selectedIds.length} selected
          </p>
        </div>
      )}
    </div>
  );
};
