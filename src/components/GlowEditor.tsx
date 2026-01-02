import { useState } from 'react';
import { useEffects } from '@/contexts/EffectContext';
import { ChevronDown, Code, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const GlowEditor = () => {
  const { state, togglePower, updateGlowSettings, updateBlurSettings, resetBlurPosition, generateCSS } = useEffects();
  const [shapeOpen, setShapeOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(true);
  const [codeOpen, setCodeOpen] = useState(false);
  const [hexInput, setHexInput] = useState(state.glowSettings.baseColor);

  const handleColorChange = (color: string) => {
    setHexInput(color);
    updateGlowSettings({ baseColor: color });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      updateGlowSettings({ baseColor: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Glow Settings</h2>
          <p className="text-xs text-zinc-500">CSS Progressive Blur</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Power</span>
          <Switch
            checked={state.powerOn}
            onCheckedChange={togglePower}
            className={cn(
              "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
              "border border-white/10"
            )}
          />
        </div>
      </div>

      {/* Theme Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400">Theme Mode</label>
        <Select defaultValue="dark">
          <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-300 h-9 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark Mode</SelectItem>
            <SelectItem value="light">Light Mode</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Base Color */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-400">Base Color</label>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                  style={{ backgroundColor: state.glowSettings.baseColor }}
                />
                <input 
                  type="text" 
                  className="bg-transparent border-none outline-none text-xs text-zinc-300 w-16 uppercase font-mono"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker color={state.glowSettings.baseColor} onChange={handleColorChange} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {/* Lightness */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Lightness</span>
              <span>{state.glowSettings.lightness}%</span>
            </div>
            <div className="relative h-4 w-full">
              <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-white opacity-20" />
              </div>
              <Slider
                value={[state.glowSettings.lightness]}
                onValueChange={([val]) => updateGlowSettings({ lightness: val })}
                min={0}
                max={100}
                step={1}
                className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
              />
            </div>
          </div>

          {/* Chroma */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Chroma</span>
              <span>{state.glowSettings.chroma.toFixed(3)}</span>
            </div>
            <div className="relative h-4 w-full">
              <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-amber-500 opacity-20" />
              </div>
              <Slider
                value={[state.glowSettings.chroma * 1000]}
                onValueChange={([val]) => updateGlowSettings({ chroma: val / 1000 })}
                min={0}
                max={400}
                step={1}
                className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
              />
            </div>
          </div>

          {/* Hue */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Hue</span>
              <span>{state.glowSettings.hue}°</span>
            </div>
            <div className="relative h-4 w-full">
              <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
                <div 
                  className="absolute inset-0 opacity-80"
                  style={{ 
                    background: 'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)' 
                  }}
                />
              </div>
              <Slider
                value={[state.glowSettings.hue]}
                onValueChange={([val]) => updateGlowSettings({ hue: val })}
                min={0}
                max={360}
                step={1}
                className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shape Configuration */}
      <Collapsible open={shapeOpen} onOpenChange={setShapeOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors group">
          <span>Shape configuration</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", shapeOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-3">
          <p className="text-xs text-zinc-500">Shape controls coming soon...</p>
        </CollapsibleContent>
      </Collapsible>

      {/* Background blur */}
      <div className="pt-4 border-t border-white/5">
        <Collapsible open={blurOpen} onOpenChange={setBlurOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors group">
            <span>Background blur</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", blurOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            {/* Horizontal */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Horizontal (X)</span>
                <span>{state.blurSettings.x}px</span>
              </div>
              <Slider
                value={[state.blurSettings.x]}
                onValueChange={([val]) => updateBlurSettings({ x: val })}
                min={-800}
                max={-350}
                step={10}
                className="w-full"
              />
            </div>

            {/* Vertical */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Vertical (Y)</span>
                <span>{state.blurSettings.y}px</span>
              </div>
              <Slider
                value={[state.blurSettings.y]}
                onValueChange={([val]) => updateBlurSettings({ y: val })}
                min={-1400}
                max={-600}
                step={10}
                className="w-full"
              />
            </div>

            {/* Reset Position Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetBlurPosition}
              className="w-full mt-2 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Reset Position
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer */}
      <div className="pt-2 flex flex-col gap-4">
        <div className="text-xs text-zinc-600 flex justify-center gap-4">
          <span>Simulating CSS <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-500">backdrop-filter</code> & <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-500">mask-image</code></span>
        </div>
        
        <Collapsible open={codeOpen} onOpenChange={setCodeOpen}>
          <CollapsibleTrigger className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full py-2 group">
            <Code className="w-3 h-3" />
            <span className="border-b border-transparent group-hover:border-zinc-500/50">View CSS Code</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", codeOpen && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-400 overflow-x-auto">
              {generateCSS()}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
