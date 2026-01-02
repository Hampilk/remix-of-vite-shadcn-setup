import { useEffects } from '@/contexts/EffectContext';
import { Slider } from './ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type SurfaceTexture = 'smooth' | 'matte' | 'glossy';

const textures: { value: SurfaceTexture; label: string; description: string }[] = [
  { value: 'smooth', label: 'Smooth', description: 'Clean plastic look' },
  { value: 'matte', label: 'Matte', description: 'Soft clay surface' },
  { value: 'glossy', label: 'Glossy', description: 'Shiny ceramic' },
];

export const ClayEditor = () => {
  const { state, updateClaySettings } = useEffects();
  const { claySettings } = state;
  const [highlightInput, setHighlightInput] = useState(claySettings.highlightColor);
  const [shadowInput, setShadowInput] = useState(claySettings.shadowColor);
  const [bgColorInput, setBgColorInput] = useState(claySettings.backgroundColor || '#ffffff');

  return (
    <div className="space-y-6">
      {/* Background Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Base Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: bgColorInput }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{bgColorInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={bgColorInput} 
                onChange={(c) => { 
                  setBgColorInput(c); 
                  updateClaySettings({ backgroundColor: c }); 
                }} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Background Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Base Opacity</span>
          <span>{claySettings.backgroundOpacity || 100}%</span>
        </div>
        <Slider
          value={[claySettings.backgroundOpacity || 100]}
          onValueChange={([val]) => updateClaySettings({ backgroundOpacity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="border-t border-zinc-800 pt-6" />

      {/* Blur Intensity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Backdrop Blur</span>
          <span>{claySettings.blur || 5}px</span>
        </div>
        <Slider
          value={[claySettings.blur || 5]}
          onValueChange={([val]) => updateClaySettings({ blur: val })}
          min={0}
          max={25}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          Creates the soft, frosted glass effect behind the clay surface
        </p>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Border Radius</span>
          <span>{claySettings.borderRadius}px</span>
        </div>
        <Slider
          value={[claySettings.borderRadius]}
          onValueChange={([val]) => updateClaySettings({ borderRadius: val })}
          min={8}
          max={50}
          step={1}
          className="w-full"
        />
      </div>

      <div className="border-t border-zinc-800 pt-6" />

      {/* External Shadow Depth */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Shadow Depth</span>
          <span>{claySettings.depth}px</span>
        </div>
        <Slider
          value={[claySettings.depth]}
          onValueChange={([val]) => updateClaySettings({ depth: val })}
          min={0}
          max={70}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          Distance and size of the external drop shadow
        </p>
      </div>

      {/* Shadow Spread */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Shadow Blur</span>
          <span>{claySettings.spread}px</span>
        </div>
        <Slider
          value={[claySettings.spread]}
          onValueChange={([val]) => updateClaySettings({ spread: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          Softness and spread of the drop shadow
        </p>
      </div>

      {/* Shadow Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Shadow Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: shadowInput }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{shadowInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={shadowInput} 
                onChange={(c) => { 
                  setShadowInput(c); 
                  updateClaySettings({ shadowColor: c }); 
                }} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Shadow Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Shadow Opacity</span>
          <span>{claySettings.shadowOpacity || 50}%</span>
        </div>
        <Slider
          value={[claySettings.shadowOpacity || 50]}
          onValueChange={([val]) => updateClaySettings({ shadowOpacity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="border-t border-zinc-800 pt-6" />

      {/* Inner Shadow Depth */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Inner Shadow</span>
          <span>{claySettings.innerShadowDepth || 8}px</span>
        </div>
        <Slider
          value={[claySettings.innerShadowDepth || 8]}
          onValueChange={([val]) => updateClaySettings({ innerShadowDepth: val })}
          min={0}
          max={20}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          Creates depth by adding shadow inside the shape
        </p>
      </div>

      {/* Inner Shadow Blur */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Inner Shadow Blur</span>
          <span>{claySettings.innerShadowBlur || 16}px</span>
        </div>
        <Slider
          value={[claySettings.innerShadowBlur || 16]}
          onValueChange={([val]) => updateClaySettings({ innerShadowBlur: val })}
          min={0}
          max={40}
          step={1}
          className="w-full"
        />
      </div>

      {/* Inner Shadow Opacity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Inner Shadow Opacity</span>
          <span>{claySettings.innerShadowOpacity || 60}%</span>
        </div>
        <Slider
          value={[claySettings.innerShadowOpacity || 60]}
          onValueChange={([val]) => updateClaySettings({ innerShadowOpacity: val })}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <div className="border-t border-zinc-800 pt-6" />

      {/* Highlight Intensity */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Inner Highlight</span>
          <span>{claySettings.highlightIntensity || 11}px</span>
        </div>
        <Slider
          value={[claySettings.highlightIntensity || 11]}
          onValueChange={([val]) => updateClaySettings({ highlightIntensity: val })}
          min={0}
          max={40}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          The bright shine effect on the top of the clay surface
        </p>
      </div>

      {/* Highlight Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Highlight Color</span>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1 pr-3 h-8 cursor-pointer hover:border-zinc-700 transition-colors">
                <div 
                  className="w-6 h-6 rounded-md border border-white/20"
                  style={{ backgroundColor: highlightInput }}
                />
                <span className="text-xs text-zinc-300 font-mono uppercase">{highlightInput}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-800" align="end">
              <HexColorPicker 
                color={highlightInput} 
                onChange={(c) => { 
                  setHighlightInput(c); 
                  updateClaySettings({ highlightColor: c }); 
                }} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6" />

      {/* Surface Texture */}
      <div className="space-y-3">
        <span className="text-xs text-zinc-500 font-medium">Surface Texture</span>
        <div className="grid grid-cols-3 gap-2">
          {textures.map((texture) => (
            <button
              key={texture.value}
              onClick={() => updateClaySettings({ surfaceTexture: texture.value })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                claySettings.surfaceTexture === texture.value
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              )}
            >
              <span className={cn(
                "text-xs font-medium mb-0.5",
                claySettings.surfaceTexture === texture.value
                  ? "text-amber-300"
                  : "text-zinc-400"
              )}>
                {texture.label}
              </span>
              <span className={cn(
                "text-[9px] text-center leading-tight",
                claySettings.surfaceTexture === texture.value
                  ? "text-amber-400/70"
                  : "text-zinc-600"
              )}>
                {texture.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bend Angle */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span className="font-medium">Bend Angle</span>
          <span>{claySettings.bendAngle}°</span>
        </div>
        <Slider
          value={[claySettings.bendAngle]}
          onValueChange={([val]) => updateClaySettings({ bendAngle: val })}
          min={-20}
          max={20}
          step={1}
          className="w-full"
        />
        <p className="text-[10px] text-zinc-600 leading-tight">
          Creates a 3D perspective tilt effect
        </p>
      </div>
    </div>
  );
};
