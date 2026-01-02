import { useState } from 'react';
import { ColorPickerValue, DEFAULT_COLOR_PICKER_VALUE } from '@/hooks/useInspectorStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HexColorPicker } from 'react-colorful';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '../../RangeSlider';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: ColorPickerValue;
  onChange: (value: ColorPickerValue) => void;
  onClose?: () => void;
}

const gradientPresets = [
  { name: 'Ocean', from: '#667eea', via: '#764ba2', to: '#f093fb' },
  { name: 'Sunset', from: '#fa709a', via: '#fee140', to: '#fa8c16' },
  { name: 'Forest', from: '#134e5e', via: '#71b280', to: '#a8e063' },
  { name: 'Purple', from: '#667eea', via: '#764ba2', to: '#6B8DD6' },
  { name: 'Fire', from: '#f12711', via: '#f5af19', to: '#f12711' },
  { name: 'Cool', from: '#2193b0', via: '#6dd5ed', to: '#2193b0' },
];

const getBackgroundPreview = (value: ColorPickerValue): string => {
  if (value.type === 'solid') {
    return value.color;
  }
  if (value.type === 'linear') {
    const { from, via, to, direction } = value.gradient;
    return `linear-gradient(${direction}deg, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }
  if (value.type === 'radial') {
    const { from, via, to, radialPosition } = value.gradient;
    return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }
  if (value.type === 'conic') {
    const { from, via, to, conicAngle } = value.gradient;
    return `conic-gradient(from ${conicAngle}deg, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }
  return value.color;
};

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [activeStop, setActiveStop] = useState<'from' | 'via' | 'to'>('from');

  const updateGradient = (updates: Partial<typeof value.gradient>) => {
    onChange({
      ...value,
      gradient: {
        ...value.gradient,
        ...updates,
      },
    });
  };

  const updateGradientStop = (stop: 'from' | 'via' | 'to', updates: Partial<typeof value.gradient.from>) => {
    onChange({
      ...value,
      gradient: {
        ...value.gradient,
        [stop]: {
          ...value.gradient[stop],
          ...updates,
        },
      },
    });
  };

  const applyPreset = (preset: typeof gradientPresets[0]) => {
    onChange({
      ...value,
      gradient: {
        ...value.gradient,
        from: { color: preset.from, position: 0 },
        via: { color: preset.via, position: 50 },
        to: { color: preset.to, position: 100 },
      },
    });
  };

  const backgroundPreview = getBackgroundPreview(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-10 w-full flex items-center gap-2 px-3 text-xs rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors">
          <div
            className="w-6 h-6 rounded-md border border-border"
            style={{ background: backgroundPreview }}
          />
          <div className="flex-1 text-left">
            <span className="text-muted-foreground capitalize">{value.type}</span>
            {value.type === 'solid' && (
              <span className="ml-2 font-mono text-xs">{value.color}</span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
        <Tabs
          value={value.type}
          onValueChange={(v) => onChange({ ...value, type: v as ColorPickerValue['type'] })}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b border-border">
            <TabsTrigger value="solid" className="text-[10px] rounded-none">Solid</TabsTrigger>
            <TabsTrigger value="linear" className="text-[10px] rounded-none">Linear</TabsTrigger>
            <TabsTrigger value="radial" className="text-[10px] rounded-none">Radial</TabsTrigger>
            <TabsTrigger value="conic" className="text-[10px] rounded-none">Conic</TabsTrigger>
          </TabsList>

          {/* Solid Color Tab */}
          <TabsContent value="solid" className="p-3 space-y-3 mt-0">
            <HexColorPicker
              color={value.color}
              onChange={(color) => onChange({ ...value, color })}
              className="!w-full"
            />
            <div className="flex gap-2">
              <Input
                value={value.color}
                onChange={(e) => onChange({ ...value, color: e.target.value })}
                className="h-8 text-xs font-mono flex-1"
              />
              <div
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: value.color }}
              />
            </div>
            <RangeSlider
              label="Opacity"
              value={value.opacity}
              onChange={(opacity) => onChange({ ...value, opacity })}
              min={0}
              max={100}
              unit="%"
            />
          </TabsContent>

          {/* Linear Gradient Tab */}
          <TabsContent value="linear" className="p-3 space-y-3 mt-0">
            {/* Preview */}
            <div
              className="h-12 rounded-md border border-border"
              style={{ background: backgroundPreview }}
            />

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Presets
              </label>
              <div className="flex gap-1 flex-wrap">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="w-8 h-8 rounded-md border border-border hover:border-primary transition-colors"
                    style={{
                      background: `linear-gradient(135deg, ${preset.from}, ${preset.via}, ${preset.to})`,
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Stop Selector */}
            <div className="flex gap-1">
              {(['from', 'via', 'to'] as const).map((stop) => (
                <button
                  key={stop}
                  onClick={() => setActiveStop(stop)}
                  className={cn(
                    'flex-1 h-8 text-[10px] font-medium uppercase rounded-md border transition-colors',
                    activeStop === stop
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-secondary/50'
                  )}
                >
                  {stop}
                </button>
              ))}
            </div>

            {/* Color Picker for Active Stop */}
            <HexColorPicker
              color={value.gradient[activeStop].color}
              onChange={(color) => updateGradientStop(activeStop, { color })}
              className="!w-full"
            />

            <div className="flex gap-2">
              <Input
                value={value.gradient[activeStop].color}
                onChange={(e) => updateGradientStop(activeStop, { color: e.target.value })}
                className="h-8 text-xs font-mono flex-1"
              />
              <Input
                type="number"
                value={value.gradient[activeStop].position}
                onChange={(e) => updateGradientStop(activeStop, { position: Number(e.target.value) })}
                className="h-8 text-xs w-16"
                min={0}
                max={100}
              />
            </div>

            {/* Direction */}
            <RangeSlider
              label="Direction"
              value={value.gradient.direction}
              onChange={(direction) => updateGradient({ direction })}
              min={0}
              max={360}
              unit="°"
            />
          </TabsContent>

          {/* Radial Gradient Tab */}
          <TabsContent value="radial" className="p-3 space-y-3 mt-0">
            <div
              className="h-12 rounded-md border border-border"
              style={{ background: backgroundPreview }}
            />

            <div className="flex gap-1">
              {(['from', 'via', 'to'] as const).map((stop) => (
                <button
                  key={stop}
                  onClick={() => setActiveStop(stop)}
                  className={cn(
                    'flex-1 h-8 text-[10px] font-medium uppercase rounded-md border transition-colors',
                    activeStop === stop
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-secondary/50'
                  )}
                >
                  {stop}
                </button>
              ))}
            </div>

            <HexColorPicker
              color={value.gradient[activeStop].color}
              onChange={(color) => updateGradientStop(activeStop, { color })}
              className="!w-full"
            />

            <div className="grid grid-cols-2 gap-2">
              <RangeSlider
                label="Center X"
                value={value.gradient.radialPosition.x}
                onChange={(x) => updateGradient({ radialPosition: { ...value.gradient.radialPosition, x } })}
                min={0}
                max={100}
                unit="%"
              />
              <RangeSlider
                label="Center Y"
                value={value.gradient.radialPosition.y}
                onChange={(y) => updateGradient({ radialPosition: { ...value.gradient.radialPosition, y } })}
                min={0}
                max={100}
                unit="%"
              />
            </div>
          </TabsContent>

          {/* Conic Gradient Tab */}
          <TabsContent value="conic" className="p-3 space-y-3 mt-0">
            <div
              className="h-12 rounded-md border border-border"
              style={{ background: backgroundPreview }}
            />

            <div className="flex gap-1">
              {(['from', 'via', 'to'] as const).map((stop) => (
                <button
                  key={stop}
                  onClick={() => setActiveStop(stop)}
                  className={cn(
                    'flex-1 h-8 text-[10px] font-medium uppercase rounded-md border transition-colors',
                    activeStop === stop
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-secondary/50'
                  )}
                >
                  {stop}
                </button>
              ))}
            </div>

            <HexColorPicker
              color={value.gradient[activeStop].color}
              onChange={(color) => updateGradientStop(activeStop, { color })}
              className="!w-full"
            />

            <RangeSlider
              label="Angle"
              value={value.gradient.conicAngle}
              onChange={(conicAngle) => updateGradient({ conicAngle })}
              min={0}
              max={360}
              unit="°"
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
