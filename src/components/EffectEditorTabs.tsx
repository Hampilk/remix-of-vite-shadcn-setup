import { useEffects } from '@/contexts/EffectContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { GlowEditor } from './GlowEditor';
import { GlassEditor } from './GlassEditor';
import { NeomorphEditor } from './NeomorphEditor';
import { ClayEditor } from './ClayEditor';
import { HistoryTimeline } from './HistoryTimeline';
import { Sparkles, Square, Layers, Box } from 'lucide-react';
import { useState } from 'react';

export const EffectEditorTabs = () => {
  const { state } = useEffects();
  const [activeTab, setActiveTab] = useState<string>('glow');

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-zinc-900/50 border border-zinc-800/80 h-11">
          <TabsTrigger 
            value="glow" 
            className="gap-1.5 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-200"
            disabled={!state.activeEffects.glow}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Glow
          </TabsTrigger>
          <TabsTrigger 
            value="glass" 
            className="gap-1.5 text-xs data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-200"
            disabled={!state.activeEffects.glass}
          >
            <Square className="w-3.5 h-3.5" />
            Glass
          </TabsTrigger>
          <TabsTrigger 
            value="neomorph" 
            className="gap-1.5 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-200"
            disabled={!state.activeEffects.neomorph}
          >
            <Layers className="w-3.5 h-3.5" />
            Neomorph
          </TabsTrigger>
          <TabsTrigger 
            value="clay" 
            className="gap-1.5 text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-200"
            disabled={!state.activeEffects.clay}
          >
            <Box className="w-3.5 h-3.5" />
            Clay
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <TabsContent value="glow" className="mt-0">
            <GlowEditor />
          </TabsContent>
          <TabsContent value="glass" className="mt-0">
            <GlassEditor />
          </TabsContent>
          <TabsContent value="neomorph" className="mt-0">
            <NeomorphEditor />
          </TabsContent>
          <TabsContent value="clay" className="mt-0">
            <ClayEditor />
          </TabsContent>
        </div>
      </Tabs>

      <HistoryTimeline />
    </div>
  );
};
