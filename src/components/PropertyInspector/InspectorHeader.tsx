import { RotateCcw, Undo2, Redo2, Copy, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { InspectorState } from '@/hooks/useInspectorStore';

type TabMode = 'EDIT' | 'PROMPT' | 'CODE';

interface InspectorHeaderProps {
  componentName?: string;
  activeTab: TabMode;
  onTabChange: (tab: TabMode) => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  state: InspectorState;
}

export const InspectorHeader = ({
  componentName = 'Inspector',
  activeTab,
  onTabChange,
  onReset,
  onUndo,
  onRedo,
  onSave,
  canUndo,
  canRedo,
  state,
}: InspectorHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const generateCSS = useCallback((): string => {
    const lines: string[] = [];
    
    // Classes
    if (state.classes.length > 0) {
      lines.push(`/* Tailwind Classes */`);
      lines.push(state.classes.join(' '));
      lines.push('');
    }

    lines.push(`/* Inline Styles */`);

    // Transform
    const transforms: string[] = [];
    if (state.transforms.translateX !== 0) transforms.push(`translateX(${state.transforms.translateX}px)`);
    if (state.transforms.translateY !== 0) transforms.push(`translateY(${state.transforms.translateY}px)`);
    if (state.transforms.rotate !== 0) transforms.push(`rotate(${state.transforms.rotate}deg)`);
    if (state.transforms.scale !== 100) transforms.push(`scale(${state.transforms.scale / 100})`);
    if (state.transforms.skewX !== 0) transforms.push(`skewX(${state.transforms.skewX}deg)`);
    if (state.transforms.skewY !== 0) transforms.push(`skewY(${state.transforms.skewY}deg)`);
    if (transforms.length > 0) {
      lines.push(`transform: ${transforms.join(' ')};`);
    }

    // 3D Transform
    if (state.transforms3D.perspective > 0) {
      lines.push(`perspective: ${state.transforms3D.perspective}px;`);
    }

    // Filter
    const filters: string[] = [];
    if (state.effects.blur > 0) filters.push(`blur(${state.effects.blur}px)`);
    if (state.effects.brightness !== 100) filters.push(`brightness(${state.effects.brightness}%)`);
    if (state.effects.saturation !== 100) filters.push(`saturate(${state.effects.saturation}%)`);
    if (state.effects.hueRotate !== 0) filters.push(`hue-rotate(${state.effects.hueRotate}deg)`);
    if (state.effects.grayscale > 0) filters.push(`grayscale(${state.effects.grayscale}%)`);
    if (state.effects.invert > 0) filters.push(`invert(${state.effects.invert}%)`);
    if (filters.length > 0) {
      lines.push(`filter: ${filters.join(' ')};`);
    }

    // Backdrop filter
    if (state.effects.backdropBlur > 0) {
      lines.push(`backdrop-filter: blur(${state.effects.backdropBlur}px);`);
    }

    // Opacity
    if (state.opacity !== 100) {
      lines.push(`opacity: ${state.opacity / 100};`);
    }

    return lines.join('\n');
  }, [state]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css);
    setCopied(true);
    toast({ title: 'Copied!', description: 'CSS copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  }, [generateCSS]);

  return (
    <div className="flex items-center justify-between border-b border-border py-2 px-3 bg-secondary/30 flex-shrink-0">
      <div className="flex items-center gap-2">
        <h3 className="text-xs uppercase font-medium text-muted-foreground tracking-wide">
          {componentName}
        </h3>
        <div className="flex border border-border rounded-md overflow-hidden">
          {(['EDIT', 'PROMPT', 'CODE'] as TabMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                'px-2.5 py-1 text-[9px] font-medium transition-colors cursor-pointer',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-secondary',
                tab !== 'EDIT' && 'border-l border-border'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onReset}
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={handleCopy}
          title="Copy CSS"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-6 w-6 rounded-full', !canUndo && 'opacity-40')}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-6 w-6 rounded-full', !canRedo && 'opacity-40')}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onSave}
          title="Save to History (Ctrl+S)"
        >
          <Save className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
