import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { componentCatalog, searchComponents, getComponentsByCategory } from '@/data/componentCatalog';
import { categories } from '@/data/categoryConfig';
import { ComponentMeta, ComponentCategory } from '@/types/component';
import { 
  Search, 
  FormInput, 
  LayoutGrid, 
  Navigation, 
  Table2, 
  MessageSquare, 
  Layers, 
  Component,
  X
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  forms: FormInput,
  layout: LayoutGrid,
  navigation: Navigation,
  'data-display': Table2,
  feedback: MessageSquare,
  overlay: Layers,
  other: Component,
};

interface ComponentBrowserProps {
  onSelectComponent: (component: ComponentMeta) => void;
  selectedComponentId?: string;
}

export const ComponentBrowser = ({ onSelectComponent, selectedComponentId }: ComponentBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');

  const filteredComponents = useMemo(() => {
    let results = componentCatalog;
    
    if (searchQuery) {
      results = searchComponents(searchQuery);
    }
    
    if (activeCategory !== 'all') {
      results = results.filter(comp => comp.category === activeCategory);
    }
    
    return results;
  }, [searchQuery, activeCategory]);

  const groupedComponents = useMemo(() => {
    if (activeCategory !== 'all') {
      return { [activeCategory]: filteredComponents };
    }
    
    return filteredComponents.reduce((acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, ComponentMeta[]>);
  }, [filteredComponents, activeCategory]);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950/80 border border-neutral-800/80 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/70">
        <h3 className="text-sm font-semibold text-slate-100 mb-3">Component Library</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-neutral-900/50 border-neutral-700/50 text-slate-200 placeholder:text-slate-500"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 border-b border-neutral-800/50">
        <div className="overflow-x-auto">
          <div className="flex gap-1.5">
            <Badge
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                  : 'hover:bg-neutral-800/50'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              All ({componentCatalog.length})
            </Badge>
            {categories.map(cat => {
              const count = componentCatalog.filter(c => c.category === cat.id).length;
              const Icon = categoryIcons[cat.id];
              return (
                <Badge
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  className={`cursor-pointer whitespace-nowrap transition-all flex items-center gap-1 ${
                    activeCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                      : 'hover:bg-neutral-800/50'
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {cat.name} ({count})
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category}>
              {activeCategory === 'all' && (
                <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  {getCategoryName(category)}
                </h4>
              )}
              <div className="grid grid-cols-2 gap-2">
                {components.map(comp => {
                  const isSelected = selectedComponentId === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => onSelectComponent(comp)}
                      className={`group relative p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20'
                          : 'bg-neutral-900/30 border-neutral-800/50 hover:bg-neutral-800/50 hover:border-neutral-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-amber-500/20' : 'bg-neutral-800/50'
                        }`}>
                          <Component className={`h-4 w-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                            {comp.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {comp.description}
                          </p>
                        </div>
                      </div>
                      {comp.variants && comp.variants.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {comp.variants.slice(0, 3).map(v => (
                            <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800/50 text-slate-500">
                              {v}
                            </span>
                          ))}
                          {comp.variants.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800/50 text-slate-500">
                              +{comp.variants.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredComponents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No components found</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-amber-400"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-neutral-800/50 bg-neutral-950/50">
        <p className="text-xs text-slate-500">
          {filteredComponents.length} of {componentCatalog.length} components
        </p>
      </div>
    </div>
  );
};
