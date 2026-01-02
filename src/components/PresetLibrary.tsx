import { useState, useEffect } from 'react';
import { ComponentInstance, InstanceProps } from '@/types/componentInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Plus,
  Palette,
  Star,
  Clock,
  Download,
  Upload
} from 'lucide-react';

export interface ComponentPreset {
  id: string;
  name: string;
  componentId: string;
  props: InstanceProps;
  createdAt: number;
  isFavorite: boolean;
}

interface PresetLibraryProps {
  selectedInstance: ComponentInstance | null;
  onApplyPreset: (props: InstanceProps) => void;
}

const STORAGE_KEY = 'component-presets';

export const PresetLibrary = ({ selectedInstance, onApplyPreset }: PresetLibraryProps) => {
  const [presets, setPresets] = useState<ComponentPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load presets:', e);
      }
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const handleSavePreset = () => {
    if (!selectedInstance || !newPresetName.trim()) {
      toast.error('Please select a component and enter a name');
      return;
    }

    const newPreset: ComponentPreset = {
      id: Math.random().toString(36).substring(2, 11),
      name: newPresetName.trim(),
      componentId: selectedInstance.componentId,
      props: { ...selectedInstance.props },
      createdAt: Date.now(),
      isFavorite: false,
    };

    setPresets(prev => [newPreset, ...prev]);
    setNewPresetName('');
    setIsDialogOpen(false);
    toast.success('Preset saved successfully!');
  };

  const handleDeletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
    toast.success('Preset deleted');
  };

  const handleToggleFavorite = (id: string) => {
    setPresets(prev => 
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    );
  };

  const handleApplyPreset = (preset: ComponentPreset) => {
    if (!selectedInstance) {
      toast.error('Please select a component first');
      return;
    }
    if (selectedInstance.componentId !== preset.componentId) {
      toast.error(`This preset is for ${preset.componentId}, not ${selectedInstance.componentId}`);
      return;
    }
    onApplyPreset(preset.props);
    toast.success('Preset applied!');
  };

  const handleExportPresets = () => {
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component-presets.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Presets exported!');
  };

  const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setPresets(prev => [...imported, ...prev]);
          toast.success(`Imported ${imported.length} presets!`);
        }
      } catch (e) {
        toast.error('Failed to import presets');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredPresets = presets.filter(p => 
    filter === 'all' ? true : p.isFavorite
  );

  const componentPresets = selectedInstance
    ? filteredPresets.filter(p => p.componentId === selectedInstance.componentId)
    : filteredPresets;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Preset Library</h3>
        <div className="flex gap-1">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportPresets}
              className="hidden"
            />
            <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
              <span>
                <Upload className="h-3 w-3" />
              </span>
            </Button>
          </label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={handleExportPresets}
            disabled={presets.length === 0}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Save New Preset */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full gap-2" 
            size="sm"
            disabled={!selectedInstance}
          >
            <Plus className="h-3.5 w-3.5" />
            Save Current as Preset
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle>Save Preset</DialogTitle>
            <DialogDescription>
              Save the current component settings as a reusable preset.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Preset Name</label>
              <Input
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="My awesome style"
                className="bg-neutral-800 border-neutral-700"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Palette className="h-3.5 w-3.5" />
              <span>Component: {selectedInstance?.componentId}</span>
            </div>
            <Button onClick={handleSavePreset} className="w-full gap-2">
              <Save className="h-3.5 w-3.5" />
              Save Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
              : 'bg-neutral-800/50 text-slate-400 border border-neutral-700/50 hover:bg-neutral-700/50'
          }`}
        >
          <FolderOpen className="h-3 w-3 inline mr-1.5" />
          All ({presets.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'favorites'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
              : 'bg-neutral-800/50 text-slate-400 border border-neutral-700/50 hover:bg-neutral-700/50'
          }`}
        >
          <Star className="h-3 w-3 inline mr-1.5" />
          Favorites
        </button>
      </div>

      {/* Presets List */}
      <ScrollArea className="h-[300px]">
        {componentPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Palette className="h-8 w-8 mb-3 opacity-50" />
            <p className="text-sm">No presets yet</p>
            <p className="text-xs text-slate-600 mt-1">
              {selectedInstance 
                ? 'Save the current component settings as a preset'
                : 'Select a component to view matching presets'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {componentPresets.map((preset) => (
              <div
                key={preset.id}
                className="group p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/30 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {preset.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {preset.componentId}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleToggleFavorite(preset.id)}
                    >
                      <Star className={`h-3 w-3 ${preset.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      onClick={() => handleDeletePreset(preset.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={() => handleApplyPreset(preset)}
                  disabled={!selectedInstance || selectedInstance.componentId !== preset.componentId}
                >
                  Apply Preset
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
