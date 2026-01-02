import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EffectProvider } from '@/contexts/EffectContext';
import { ComponentBrowser } from '@/components/ComponentBrowser';
import { ComponentSelector } from '@/components/ComponentSelector';
import { CanvasArea } from '@/components/CanvasArea';
import { LayersPanel } from '@/components/LayersPanel';
import { UnifiedInspector } from '@/components/UnifiedInspector';
import { PropertyInspector } from '@/components/PropertyInspector';
import { StatePreview } from '@/components/StatePreview';
import { CodeExport } from '@/components/CodeExport';
import { PresetLibrary } from '@/components/PresetLibrary';
import { ResponsivePreview } from '@/components/ResponsivePreview';
import { ShortcutsHelp } from '@/components/ShortcutsHelp';
import { ComponentEffects, getDefaultEffects, generateEffectStyles } from '@/components/ComponentEffectEditor';
import { useComponentInstances } from '@/hooks/useComponentInstances';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ComponentMeta } from '@/types/component';
import { Position, InstanceProps, ComponentInstance } from '@/types/componentInstance';
import { ComponentState } from '@/components/StatePreview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getComponentById } from '@/data/componentCatalog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Layers, 
  Component,
  Eye,
  Palette,
  Monitor,
  Layout
} from 'lucide-react';

type LeftPanel = 'components' | 'layers';
type RightPanel = 'inspector' | 'advanced' | 'states' | 'presets';
type MainView = 'canvas' | 'responsive';

// Simple component renderer for responsive preview with effects
const SimpleComponentRenderer = ({ instance }: { instance: ComponentInstance }) => {
  const comp = getComponentById(instance.componentId);
  if (!comp) return null;

  const props = instance.props;
  
  // Get effects
  const effects: ComponentEffects = instance.effects && typeof instance.effects === 'object' && 'glow' in instance.effects
    ? (instance.effects as unknown as ComponentEffects)
    : getDefaultEffects();
  
  const effectStyles = generateEffectStyles(effects);

  switch (instance.componentId) {
    case 'button':
      return (
        <Button 
          variant={props.variant as any || 'default'} 
          size={props.size as any || 'default'}
          style={effectStyles}
        >
          {props.text || 'Button'}
        </Button>
      );
    case 'input':
      return <Input placeholder={props.text || 'Enter text...'} style={{ width: props.width || '200px', ...effectStyles }} />;
    case 'badge':
      return <Badge variant={props.variant as any || 'default'} style={effectStyles}>{props.text || 'Badge'}</Badge>;
    case 'card':
      return (
        <Card style={{ width: props.width || '280px', ...effectStyles }}>
          <CardHeader>
            <CardTitle className="text-base">{props.text || 'Card Title'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Card content</p>
          </CardContent>
        </Card>
      );
    case 'checkbox':
      return (
        <div className="flex items-center gap-2" style={effectStyles}>
          <Checkbox id={instance.id} />
          <Label htmlFor={instance.id}>{props.text || 'Checkbox'}</Label>
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center gap-2" style={effectStyles}>
          <Switch id={instance.id} />
          <Label htmlFor={instance.id}>{props.text || 'Switch'}</Label>
        </div>
      );
    default:
      return (
        <div className="p-4 bg-neutral-200 rounded-lg text-sm text-neutral-600" style={effectStyles}>
          {comp.name}
        </div>
      );
  }
};

const Index = () => {
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('components');
  const [rightPanel, setRightPanel] = useState<RightPanel>('inspector');
  const [mainView, setMainView] = useState<MainView>('canvas');
  const [recentComponents, setRecentComponents] = useState<string[]>([]);

  const {
    instances,
    selectedIds,
    clipboard,
    createInstance,
    deleteInstance,
    deleteSelected,
    updateInstance,
    updateInstanceProps,
    updateInstancePosition,
    selectInstance,
    clearSelection,
    selectAll,
    toggleVisibility,
    toggleLock,
    bringToFront,
    sendToBack,
    reorderInstances,
    duplicateInstance,
    copyInstance,
    pasteInstance,
  } = useComponentInstances();

  // Get the currently selected instance
  const selectedInstance = selectedIds.length === 1 
    ? instances.find(i => i.id === selectedIds[0]) || null
    : null;

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCopy: () => {
      if (selectedIds.length === 1) {
        copyInstance(selectedIds[0]);
        toast.success('Komponens másolva');
      }
    },
    onPaste: () => {
      if (clipboard) {
        pasteInstance();
        toast.success('Komponens beillesztve');
      }
    },
    onDelete: () => {
      if (selectedIds.length > 0) {
        deleteSelected();
        toast.success(`${selectedIds.length} komponens törölve`);
      }
    },
    onUndo: () => {
      toast.info('Visszavonás (hamarosan)');
    },
    onRedo: () => {
      toast.info('Újra (hamarosan)');
    },
    onSelectAll: () => {
      selectAll();
      toast.success(`${instances.length} komponens kiválasztva`);
    },
    onDuplicate: () => {
      if (selectedIds.length === 1) {
        duplicateInstance(selectedIds[0]);
        toast.success('Komponens duplikálva');
      }
    },
    onEscape: () => {
      clearSelection();
    },
    onSave: () => {
      toast.success('Változások mentve');
    },
    onBringToFront: () => {
      if (selectedIds.length === 1) {
        bringToFront(selectedIds[0]);
        toast.success('Előtérbe hozva');
      }
    },
    onSendToBack: () => {
      if (selectedIds.length === 1) {
        sendToBack(selectedIds[0]);
        toast.success('Háttérbe küldve');
      }
    },
  });

  const handleSelectComponent = (component: ComponentMeta) => {
    createInstance(component.id);
    
    setRecentComponents(prev => {
      const filtered = prev.filter(id => id !== component.id);
      return [component.id, ...filtered].slice(0, 5);
    });
  };

  const handleAddComponent = (componentId: string, position?: Position) => {
    createInstance(componentId, position);
    
    setRecentComponents(prev => {
      const filtered = prev.filter(id => id !== componentId);
      return [componentId, ...filtered].slice(0, 5);
    });
  };

  const handleUpdateProps = (props: Partial<InstanceProps>) => {
    if (selectedInstance) {
      updateInstanceProps(selectedInstance.id, props);
    }
  };

  const handleUpdateInstance = (updates: Partial<typeof selectedInstance>) => {
    if (selectedInstance && updates) {
      updateInstance(selectedInstance.id, updates);
    }
  };

  const handleUpdateState = (state: ComponentState, props: Partial<InstanceProps>) => {
    if (selectedInstance) {
      updateInstance(selectedInstance.id, {
        states: {
          ...selectedInstance.states,
          [state]: { ...selectedInstance.states[state], ...props },
        },
      });
    }
  };

  const handleApplyPreset = (props: InstanceProps) => {
    if (selectedInstance) {
      updateInstanceProps(selectedInstance.id, props);
    }
  };

  // Handle effect updates - THIS IS THE KEY FIX
  const handleUpdateEffects = (effects: ComponentEffects) => {
    if (selectedInstance) {
      updateInstance(selectedInstance.id, {
        effects: effects as any,
      });
      toast.success('Effektek frissítve');
    }
  };

  const renderComponent = useCallback((instance: ComponentInstance) => {
    return <SimpleComponentRenderer instance={instance} />;
  }, []);

  return (
    <ThemeProvider>
      <EffectProvider>
        <div className="min-h-screen flex bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-slate-100 antialiased">
          {/* Left Sidebar */}
          <aside className="w-80 min-w-[320px] border-r border-neutral-800/50 flex flex-col">
            {/* Panel Tabs */}
            <div className="p-3 border-b border-neutral-800/50">
              <Tabs value={leftPanel} onValueChange={(v) => setLeftPanel(v as LeftPanel)}>
                <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/80">
                  <TabsTrigger 
                    value="components" 
                    className="flex-1 gap-1.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                  >
                    <Component className="w-3.5 h-3.5" />
                    Könyvtár
                  </TabsTrigger>
                  <TabsTrigger 
                    value="layers" 
                    className="flex-1 gap-1.5 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Rétegek
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-3 overflow-hidden">
              {leftPanel === 'components' ? (
                <ComponentBrowser 
                  onSelectComponent={handleSelectComponent}
                  selectedComponentId={selectedIds.length === 1 ? instances.find(i => i.id === selectedIds[0])?.componentId : undefined}
                />
              ) : (
                <LayersPanel
                  instances={instances}
                  selectedIds={selectedIds}
                  onSelectInstance={selectInstance}
                  onToggleVisibility={toggleVisibility}
                  onToggleLock={toggleLock}
                  onDeleteInstance={deleteInstance}
                  onBringToFront={bringToFront}
                  onSendToBack={sendToBack}
                  onReorder={reorderInstances}
                />
              )}
            </div>
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 flex flex-col p-6">
            {/* Top Bar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">Komponens Tervező</h1>
                  <p className="text-sm text-slate-500">UI komponensek tervezése és testreszabása</p>
                </div>
                {/* View Toggle */}
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => setMainView('canvas')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      mainView === 'canvas'
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-neutral-800/50 text-slate-400 border border-neutral-700/50 hover:bg-neutral-700/50'
                    }`}
                  >
                    <Layout className="h-3.5 w-3.5" />
                    Vászon
                  </button>
                  <button
                    onClick={() => setMainView('responsive')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      mainView === 'responsive'
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-neutral-800/50 text-slate-400 border border-neutral-700/50 hover:bg-neutral-700/50'
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Reszponzív
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShortcutsHelp />
                <ComponentSelector 
                  onAddComponent={handleAddComponent}
                  recentComponents={recentComponents}
                />
              </div>
            </div>

            {/* Canvas or Responsive Preview */}
            <div className="flex-1">
              {mainView === 'canvas' ? (
                <CanvasArea
                  instances={instances}
                  selectedIds={selectedIds}
                  onSelectInstance={selectInstance}
                  onUpdatePosition={updateInstancePosition}
                  onDeleteInstance={deleteInstance}
                  onClearSelection={clearSelection}
                  onAddComponent={handleAddComponent}
                />
              ) : (
                <ResponsivePreview
                  instances={instances}
                  renderComponent={renderComponent}
                />
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 min-w-[320px] border-l border-neutral-800/50 flex flex-col">
            {/* Panel Tabs */}
            <div className="p-3 border-b border-neutral-800/50">
              <Tabs value={rightPanel} onValueChange={(v) => setRightPanel(v as RightPanel)}>
                <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/80 grid grid-cols-4">
                  <TabsTrigger 
                    value="inspector" 
                    className="gap-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                    title="Inspector"
                  >
                    Inspector
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="gap-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                    title="Advanced"
                  >
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger 
                    value="states" 
                    className="gap-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                    title="Állapotok"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </TabsTrigger>
                  <TabsTrigger 
                    value="presets" 
                    className="gap-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
                    title="Presetek"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {rightPanel === 'inspector' && (
                <UnifiedInspector 
                  instance={selectedInstance}
                  onUpdateProps={handleUpdateProps}
                  onUpdateInstance={handleUpdateInstance}
                  onUpdateEffects={handleUpdateEffects}
                />
              )}
              {rightPanel === 'advanced' && (
                <div className="p-3 overflow-auto h-full">
                  <PropertyInspector
                    instance={selectedInstance}
                    onUpdateProps={handleUpdateProps}
                    onUpdateInstance={handleUpdateInstance}
                  />
                </div>
              )}
              {rightPanel === 'states' && (
                <div className="p-3 overflow-auto h-full">
                  <StatePreview 
                    instance={selectedInstance}
                    onUpdateState={handleUpdateState}
                  />
                </div>
              )}
              {rightPanel === 'presets' && (
                <div className="p-3 overflow-auto h-full">
                  <PresetLibrary
                    selectedInstance={selectedInstance}
                    onApplyPreset={handleApplyPreset}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </EffectProvider>
    </ThemeProvider>
  );
};

export default Index;
