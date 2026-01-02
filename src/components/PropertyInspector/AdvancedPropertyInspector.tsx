import { useState, useCallback, useEffect } from 'react';
import { useInspectorStore, InspectorState, inspectorStateToProps } from '@/hooks/useInspectorStore';
import { InspectorHeader } from './InspectorHeader';
import { PreviewBox } from './PreviewBox';
import { CollapsibleSection } from './CollapsibleSection';
import {
  TypographyControls,
  BorderControls,
  EffectsControls,
  TransformControls,
  PositionControls,
  SizeControls,
  SpacingControls,
  AlignmentControls,
  AppearanceControls,
  EmbedControls,
  FamilyElementsControls,
} from './controls';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Laptop, Link2, Hash, FileCode, Send, MousePointer2 } from 'lucide-react';
import { ComponentInstance, InstanceProps } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

interface AdvancedPropertyInspectorProps {
  instance?: ComponentInstance | null;
  onUpdateProps?: (props: Partial<InstanceProps>) => void;
  onUpdateInstance?: (updates: Partial<ComponentInstance>) => void;
}

export const AdvancedPropertyInspector = ({
  instance,
  onUpdateProps,
  onUpdateInstance,
}: AdvancedPropertyInspectorProps) => {
  const { state, setState, undo, redo, canUndo, canRedo, reset, pushToHistory } = useInspectorStore({
    instance,
    onUpdateProps,
  });
  const [activeTab, setActiveTab] = useState<TabMode>('EDIT');
  const [promptText, setPromptText] = useState('');
  const [codeText, setCodeText] = useState('');

  const component = instance ? getComponentById(instance.componentId) : null;

  // Generate CSS code for CODE tab
  useEffect(() => {
    if (activeTab === 'CODE') {
      const css = generateCSSFromState(state);
      setCodeText(css);
    }
  }, [activeTab, state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (!e.ctrlKey && !e.metaKey) return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        pushToHistory();
        toast({ title: 'Mentve', description: 'Állapot mentve az előzményekbe.' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, pushToHistory]);

  const updateState = useCallback(
    (updates: Partial<InspectorState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    [setState]
  );

  const handleReset = () => {
    reset();
    toast({ title: 'Visszaállítva', description: 'Inspector értékek visszaállítva.' });
  };

  const handleSave = () => {
    pushToHistory();
    toast({ title: 'Mentve', description: 'Állapot mentve az előzményekbe.' });
  };

  // Show empty state if no instance
  if (!instance) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
        <MousePointer2 className="h-8 w-8 mb-3 opacity-50" />
        <p className="text-sm">Válassz egy komponenst</p>
        <p className="text-xs text-muted-foreground/60 mt-1">az inspector megnyitásához</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg w-full max-h-full flex flex-col overflow-hidden">
      <InspectorHeader
        componentName={component?.name || 'Advanced Inspector'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={handleReset}
        onUndo={undo}
        onRedo={redo}
        onSave={handleSave}
        canUndo={canUndo}
        canRedo={canRedo}
        state={state}
      />

      <div className="flex-1 overflow-y-auto scrollbar-dark">
        {activeTab === 'PROMPT' ? (
          <div className="p-4 space-y-3">
            <label className="text-xs font-medium text-muted-foreground block">
              Írd le, mit szeretnél megváltoztatni:
            </label>
            <Textarea
              placeholder="Sötétítsd el, adj hozzá glow effektet, növeld a paddinget..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-[120px] text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!promptText.trim()} className="gap-2">
                <Send className="w-3 h-3" />
                Alkalmaz
              </Button>
              <Button variant="outline" onClick={() => setPromptText('')}>
                Törlés
              </Button>
            </div>
          </div>
        ) : activeTab === 'CODE' ? (
          <div className="p-4">
            <Textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="min-h-[400px] font-mono text-xs resize-none bg-secondary/30"
              spellCheck={false}
              placeholder="/* Generált CSS itt jelenik meg */"
            />
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {/* Preview */}
            <div className="p-3">
              <PreviewBox state={state} />
            </div>

            {/* Breakpoint Selector */}
            <div className="flex items-center justify-between px-3 py-2 bg-secondary/20">
              <div className="flex border border-border rounded-md overflow-hidden">
                {['AUTO', '*', 'SM', 'MD', 'LG', 'XL'].map((bp, i) => (
                  <button
                    key={bp}
                    className={`px-2 py-1 text-[9px] font-medium ${
                      bp === 'AUTO'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground hover:bg-secondary'
                    } ${i > 0 ? 'border-l border-border' : ''}`}
                  >
                    {bp}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Laptop className="w-3 h-3" />
                Auto Breakpoint
              </span>
            </div>

            {/* Family Elements */}
            <FamilyElementsControls state={state} onChange={updateState} />

            {/* Link */}
            <CollapsibleSection title="Link" icon={<Link2 className="w-3.5 h-3.5" />}>
              <Input
                value={state.link}
                onChange={(e) => updateState({ link: e.target.value })}
                placeholder="https://..."
                className="h-8 text-xs"
              />
            </CollapsibleSection>

            {/* Text Content */}
            <CollapsibleSection title="Szöveg tartalom" defaultOpen>
              <Textarea
                value={state.textContent}
                onChange={(e) => updateState({ textContent: e.target.value })}
                placeholder="Írd be a szöveget..."
                rows={2}
                className="resize-none text-xs"
              />
            </CollapsibleSection>

            {/* Tailwind Classes */}
            <CollapsibleSection title="Tailwind Osztályok" icon={<FileCode className="w-3.5 h-3.5" />}>
              <Input
                value={state.classes.join(' ')}
                onChange={(e) => updateState({ classes: e.target.value.split(' ').filter(Boolean) })}
                placeholder="flex items-center gap-2..."
                className="h-8 text-xs font-mono"
              />
            </CollapsibleSection>

            {/* Inline CSS */}
            <CollapsibleSection title="Inline CSS">
              <Textarea
                value={state.inlineCSS}
                onChange={(e) => updateState({ inlineCSS: e.target.value })}
                placeholder="color: red; font-size: 14px;"
                rows={2}
                className="resize-none text-xs font-mono"
              />
            </CollapsibleSection>

            {/* Element ID */}
            <CollapsibleSection title="Elem ID" icon={<Hash className="w-3.5 h-3.5" />}>
              <Input
                value={state.elementId}
                onChange={(e) => updateState({ elementId: e.target.value })}
                placeholder="my-element"
                className="h-8 text-xs font-mono"
              />
            </CollapsibleSection>

            {/* Spacing Controls (Padding, Margin, Spacing) */}
            <SpacingControls state={state} onChange={updateState} />

            {/* Position */}
            <PositionControls state={state} onChange={updateState} />

            {/* Size */}
            <SizeControls state={state} onChange={updateState} />

            {/* Alignment */}
            <AlignmentControls state={state} onChange={updateState} />

            {/* Typography */}
            <TypographyControls state={state} onChange={updateState} />

            {/* Appearance */}
            <AppearanceControls state={state} onChange={updateState} />

            {/* Embed */}
            <EmbedControls state={state} onChange={updateState} />

            {/* Border */}
            <BorderControls state={state} onChange={updateState} />

            {/* Effects */}
            <EffectsControls state={state} onChange={updateState} />

            {/* Transforms */}
            <TransformControls state={state} onChange={updateState} />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate CSS from state
function generateCSSFromState(state: InspectorState): string {
  const lines: string[] = ['.component {'];
  
  // Size
  if (state.size.width !== 'auto') lines.push(`  width: ${state.size.width};`);
  if (state.size.height !== 'auto') lines.push(`  height: ${state.size.height};`);
  if (state.size.maxWidth) lines.push(`  max-width: ${state.size.maxWidth};`);
  if (state.size.maxHeight) lines.push(`  max-height: ${state.size.maxHeight};`);
  
  // Padding
  lines.push(`  padding: ${state.padding.t}px ${state.padding.r}px ${state.padding.b}px ${state.padding.l}px;`);
  
  // Margin
  if (state.margin.x || state.margin.y) {
    lines.push(`  margin: ${state.margin.y}px ${state.margin.x}px;`);
  }
  
  // Typography
  lines.push(`  font-family: var(--font-${state.typography.fontFamily});`);
  lines.push(`  font-size: var(--text-${state.typography.fontSize});`);
  lines.push(`  font-weight: ${state.typography.fontWeight};`);
  lines.push(`  color: ${state.typography.textColor};`);
  lines.push(`  text-align: ${state.typography.textAlign};`);
  
  // Background
  if (state.appearance.backgroundColor.type === 'solid') {
    lines.push(`  background-color: ${state.appearance.backgroundColor.color};`);
  }
  
  // Border
  if (state.border.width !== '0') {
    lines.push(`  border: ${state.border.width}px ${state.border.style} ${state.border.color};`);
    lines.push(`  border-radius: var(--radius-${state.border.radius});`);
  }
  
  // Opacity
  if (state.opacity !== 100) {
    lines.push(`  opacity: ${state.opacity / 100};`);
  }
  
  // Transform
  const transforms: string[] = [];
  if (state.transforms.translateX) transforms.push(`translateX(${state.transforms.translateX}px)`);
  if (state.transforms.translateY) transforms.push(`translateY(${state.transforms.translateY}px)`);
  if (state.transforms.rotate) transforms.push(`rotate(${state.transforms.rotate}deg)`);
  if (state.transforms.scale !== 100) transforms.push(`scale(${state.transforms.scale / 100})`);
  if (state.transforms.skewX) transforms.push(`skewX(${state.transforms.skewX}deg)`);
  if (state.transforms.skewY) transforms.push(`skewY(${state.transforms.skewY}deg)`);
  if (transforms.length > 0) {
    lines.push(`  transform: ${transforms.join(' ')};`);
  }
  
  // Filter
  const filters: string[] = [];
  if (state.effects.blur) filters.push(`blur(${state.effects.blur}px)`);
  if (state.effects.brightness !== 100) filters.push(`brightness(${state.effects.brightness}%)`);
  if (state.effects.saturation !== 100) filters.push(`saturate(${state.effects.saturation}%)`);
  if (state.effects.hueRotate) filters.push(`hue-rotate(${state.effects.hueRotate}deg)`);
  if (state.effects.grayscale) filters.push(`grayscale(${state.effects.grayscale}%)`);
  if (state.effects.invert) filters.push(`invert(${state.effects.invert}%)`);
  if (filters.length > 0) {
    lines.push(`  filter: ${filters.join(' ')};`);
  }
  
  // Backdrop filter
  if (state.effects.backdropBlur) {
    lines.push(`  backdrop-filter: blur(${state.effects.backdropBlur}px);`);
  }
  
  lines.push('}');
  
  return lines.join('\n');
}
