import { useEffects } from '@/contexts/EffectContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type NeomorphShape = 'flat' | 'concave' | 'convex' | 'pressed';

const shapes: { value: NeomorphShape; label: string; icon: string }[] = [
  { value: 'flat', label: 'Flat', icon: '▬' },
  { value: 'concave', label: 'Concave', icon: '◠' },
  { value: 'convex', label: 'Convex', icon: '◡' },
  { value: 'pressed', label: 'Pressed', icon: '▼' },
];

export const NeomorphEditor = () => {
  const { state, updateNeomorphSettings } = useEffects();
  const { neomorphSettings } = state;
  const [colorInput, setColorInput] = useState(neomorphSettings.surfaceColor);

  const handleColorChange = (color: string) => {
    setColorInput(color);
    updateNeomorphSettings({ surfaceColor: color });
  };

  return (
    <div className="space-y-6">
      {/* Shape Selector */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-500">Shape</span>
        <div className="grid grid-cols-4 gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.value}
              onClick={() => updateNeomorphSettings({ shape: shape.value })}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                neomorphSettings.shape === shape.value
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
              )}
            >
              <span className="text-lg">{shape.icon}</span>
              <span className="text-[10px]">{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Light Source Angle */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Light Source</span>
          <span>{neomorphSettings.lightSource}°</span>
        </div>
        <div className="relative h-4 w-full">
          <div className="absolute inset-0 rounded-full bg-zinc-900 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: `conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #92400e, #d97706, #f59e0b, #fbbf24)`
              }}
            />
          </div>
          <Slider
            value={[neomorphSettings.lightSource]}
            onValueChange={([val]) => updateNeomorphSettings({ lightSource: val })}
            min={0}
            max={360}
            step={1}
            className="absolute inset-0 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent"
          />
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Shadow Distance</span>
          <span>{neomorphSettings.distance}px</span>
        </div>
        <Slider
          value={[neomorphSettings.distance]}
          onValueChange={([val]) => updateNeomorphSettings({ distance: val })}
          min={5}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      {/* Blur */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Shadow Blur</span>
          <span>{neomorphSettings.blur}px</span>
        </div>
        <Slider
          value={[neomorphSettings.blur]}
          onValueChange={([val]) => updateNeomorphSettings({ blur: val })}
          min={10}
          max={60}
          step={1}
          className="w-full"
        />
      </div>

      {/* Intensity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Shadow Intensity</span>
          <span>{neomorphSettings.intensity}%</span>
        </div>
        <Slider
          value={[neomorphSettings.intensity]}
          onValueChange={([val]) => updateNeomorphSettings({ intensity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Surface Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Surface Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: neomorphSettings.surfaceColor }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{colorInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker color={neomorphSettings.surfaceColor} onChange={handleColorChange} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
