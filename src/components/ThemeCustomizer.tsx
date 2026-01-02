import { useState } from 'react';
import { Sun, Moon, Monitor, Square, Circle, RectangleHorizontal, Palette, Settings2, Sparkles, Layers, Download, Upload, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useTheme, ThemeMode, ShapePreset, SolidStyle, EffectStyle, SurfaceStyle, DataStyle, TransitionStyle } from '@/contexts/ThemeContext';

const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '217 91% 60%';
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const ThemeCustomizer = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [openAccordions, setOpenAccordions] = useState<string[]>(['theme', 'shape', 'color']);

  const ColorSwatch = ({ color, label, onChange }: { color: string; label: string; onChange: (val: string) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-1 group">
          <div 
            className="w-8 h-8 rounded-lg border border-border shadow-sm group-hover:ring-2 ring-primary/50 transition-all"
            style={{ backgroundColor: `hsl(${color})` }}
          />
          <span className="text-[9px] text-muted-foreground">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <HexColorPicker color={hslToHex(color)} onChange={(hex) => onChange(hexToHsl(hex))} />
      </PopoverContent>
    </Popover>
  );

  const ToggleGroup = <T extends string>({ 
    options, 
    value, 
    onChange,
    renderOption
  }: { 
    options: T[]; 
    value: T; 
    onChange: (val: T) => void;
    renderOption?: (opt: T) => React.ReactNode;
  }) => (
    <div className="flex border border-border rounded-lg overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 px-3 py-1.5 text-[10px] font-medium transition-colors ${
            value === opt 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card text-muted-foreground hover:bg-secondary'
          }`}
        >
          {renderOption ? renderOption(opt) : opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );

  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-config.json';
    a.click();
  };

  const importTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const imported = JSON.parse(ev.target?.result as string);
            updateTheme(imported);
          } catch (err) {
            console.error('Invalid theme file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] w-80 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-2 px-4 bg-secondary/50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold text-foreground">Theme Customizer</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={importTheme} title="Import">
            <Upload className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={exportTheme} title="Export">
            <Download className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetTheme} title="Reset">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto flex-1">
        <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-2">
          {/* Theme Mode */}
          <AccordionItem value="theme" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5" />
                Theme
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="flex gap-2">
                {[
                  { mode: 'light' as ThemeMode, icon: Sun, label: 'Light' },
                  { mode: 'dark' as ThemeMode, icon: Moon, label: 'Dark' },
                  { mode: 'system' as ThemeMode, icon: Monitor, label: 'System' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => updateTheme({ mode })}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                      theme.mode === mode 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${theme.mode === mode ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Shape */}
          <AccordionItem value="shape" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Square className="w-3.5 h-3.5" />
                Shape
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="flex gap-2">
                {[
                  { shape: 'sharp' as ShapePreset, icon: Square, label: 'Sharp' },
                  { shape: 'rounded' as ShapePreset, icon: RectangleHorizontal, label: 'Rounded' },
                  { shape: 'full' as ShapePreset, icon: Circle, label: 'Full' },
                ].map(({ shape, icon: Icon, label }) => (
                  <button
                    key={shape}
                    onClick={() => updateTheme({ shape })}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                      theme.shape === shape 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${theme.shape === shape ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="color" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                Color
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Brand</span>
                <div className="flex gap-3">
                  <ColorSwatch 
                    color={theme.colors.primary} 
                    label="Primary" 
                    onChange={(val) => updateTheme({ colors: { ...theme.colors, primary: val } })}
                  />
                  <ColorSwatch 
                    color={theme.colors.accent} 
                    label="Accent" 
                    onChange={(val) => updateTheme({ colors: { ...theme.colors, accent: val } })}
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Neutral</span>
                <ToggleGroup 
                  options={['slate', 'gray', 'zinc'] as const}
                  value={theme.colors.neutral}
                  onChange={(val) => updateTheme({ colors: { ...theme.colors, neutral: val } })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Solid Style */}
          <AccordionItem value="solid" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Solid Style
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Style</span>
                <ToggleGroup 
                  options={['color', 'inverse', 'contrast'] as SolidStyle[]}
                  value={theme.solidStyle}
                  onChange={(val) => updateTheme({ solidStyle: val })}
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Effect</span>
                <ToggleGroup 
                  options={['flat', 'plastic'] as EffectStyle[]}
                  value={theme.effectStyle}
                  onChange={(val) => updateTheme({ effectStyle: val })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Effects */}
          <AccordionItem value="effects" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Effects
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium">Depth Effect</span>
                  <p className="text-[9px] text-muted-foreground">3D depth on fields</p>
                </div>
                <Switch 
                  checked={theme.depthEffect} 
                  onCheckedChange={(val) => updateTheme({ depthEffect: val })} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium">Noise Effect</span>
                  <p className="text-[9px] text-muted-foreground">Noise pattern on fields</p>
                </div>
                <Switch 
                  checked={theme.noiseEffect} 
                  onCheckedChange={(val) => updateTheme({ noiseEffect: val })} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Advanced */}
          <AccordionItem value="advanced" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" />
                Advanced
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-4">
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Surface</span>
                <ToggleGroup 
                  options={['filled', 'translucent'] as SurfaceStyle[]}
                  value={theme.surface}
                  onChange={(val) => updateTheme({ surface: val })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">Scaling</span>
                  <span className="text-[10px] font-medium">{theme.scaling}%</span>
                </div>
                <Slider 
                  value={[theme.scaling]} 
                  onValueChange={([val]) => updateTheme({ scaling: val })}
                  min={90}
                  max={110}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Data Style</span>
                <ToggleGroup 
                  options={['categorical', 'divergent', 'sequential'] as DataStyle[]}
                  value={theme.dataStyle}
                  onChange={(val) => updateTheme({ dataStyle: val })}
                  renderOption={(opt) => opt.slice(0, 3).toUpperCase()}
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Transition</span>
                <ToggleGroup 
                  options={['all', 'micro', 'macro', 'none'] as TransitionStyle[]}
                  value={theme.transition}
                  onChange={(val) => updateTheme({ transition: val })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">Border Width</span>
                  <span className="text-[10px] font-medium">{theme.borderWidth}px</span>
                </div>
                <Slider 
                  value={[theme.borderWidth]} 
                  onValueChange={([val]) => updateTheme({ borderWidth: val })}
                  min={0}
                  max={4}
                  step={1}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sizes */}
          <AccordionItem value="sizes" className="border border-border rounded-lg px-3">
            <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <RectangleHorizontal className="w-3.5 h-3.5" />
                Sizes
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 space-y-4">
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Fields (button, input, select, tab)</span>
                <div className="flex gap-1 mb-2">
                  {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
                    <div key={size} className="flex-1 text-center">
                      <div className="text-[9px] text-muted-foreground mb-1">{size}</div>
                      <div className="text-[10px] font-mono">{24 + i * 8}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Base Size</span>
                  <span className="text-[10px] font-medium">{theme.fieldBaseSize.toFixed(1)}px</span>
                </div>
                <Slider 
                  value={[theme.fieldBaseSize]} 
                  onValueChange={([val]) => updateTheme({ fieldBaseSize: val })}
                  min={2}
                  max={8}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mb-2 block">Selectors (checkbox, toggle, badge)</span>
                <div className="flex gap-1 mb-2">
                  {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
                    <div key={size} className="flex-1 text-center">
                      <div className="text-[9px] text-muted-foreground mb-1">{size}</div>
                      <div className="text-[10px] font-mono">{16 + i * 4}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Base Size</span>
                  <span className="text-[10px] font-medium">{theme.selectorBaseSize.toFixed(1)}px</span>
                </div>
                <Slider 
                  value={[theme.selectorBaseSize]} 
                  onValueChange={([val]) => updateTheme({ selectorBaseSize: val })}
                  min={2}
                  max={8}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
