import { useEffects } from '@/contexts/EffectContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';

export const GlassEditor = () => {
  const { state, updateGlassSettings } = useEffects();
  const { glassSettings } = state;
  const [tintInput, setTintInput] = useState(glassSettings.tint);

  const handleTintChange = (color: string) => {
    setTintInput(color);
    updateGlassSettings({ tint: color });
  };

  return (
    <div className="space-y-6">
      {/* Blur */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Backdrop Blur</span>
          <span>{glassSettings.blur}px</span>
        </div>
        <Slider
          value={[glassSettings.blur]}
          onValueChange={([val]) => updateGlassSettings({ blur: val })}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Background Opacity</span>
          <span>{glassSettings.opacity}%</span>
        </div>
        <Slider
          value={[glassSettings.opacity]}
          onValueChange={([val]) => updateGlassSettings({ opacity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Saturation Boost</span>
          <span>{glassSettings.saturation}%</span>
        </div>
        <Slider
          value={[glassSettings.saturation]}
          onValueChange={([val]) => updateGlassSettings({ saturation: val })}
          min={0}
          max={200}
          step={1}
          className="w-full"
        />
      </div>

      {/* Border Width */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Border Width</span>
          <span>{glassSettings.borderWidth}px</span>
        </div>
        <Slider
          value={[glassSettings.borderWidth]}
          onValueChange={([val]) => updateGlassSettings({ borderWidth: val })}
          min={0}
          max={4}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Border Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Border Opacity</span>
          <span>{glassSettings.borderOpacity}%</span>
        </div>
        <Slider
          value={[glassSettings.borderOpacity]}
          onValueChange={([val]) => updateGlassSettings({ borderOpacity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Tint Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Tint Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: glassSettings.tint }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{tintInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker color={glassSettings.tint} onChange={handleTintChange} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tint Strength */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Tint Strength</span>
          <span>{glassSettings.tintStrength}%</span>
        </div>
        <Slider
          value={[glassSettings.tintStrength]}
          onValueChange={([val]) => updateGlassSettings({ tintStrength: val })}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
