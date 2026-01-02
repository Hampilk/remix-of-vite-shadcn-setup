import { useState, useRef } from 'react';
import { ComponentInstance } from '@/types/componentInstance';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor,
  RotateCcw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Grid3x3,
  Ruler,
  Eye,
  EyeOff,
  Download,
  Zap,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DeviceType = 'iphone-14' | 'iphone-14-pro-max' | 'ipad-pro' | 'ipad-mini' | 'macbook-pro' | 'imac' | 'samsung-s23' | 'custom';
type Orientation = 'portrait' | 'landscape';

interface DeviceConfig {
  id: DeviceType;
  name: string;
  icon: React.ElementType;
  width: number;
  height: number;
  category: 'phone' | 'tablet' | 'desktop';
  pixelRatio?: number;
  hasNotch?: boolean;
}

const devices: DeviceConfig[] = [
  // Phones
  { id: 'iphone-14', name: 'iPhone 14', icon: Smartphone, width: 390, height: 844, category: 'phone', pixelRatio: 3, hasNotch: true },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', icon: Smartphone, width: 430, height: 932, category: 'phone', pixelRatio: 3, hasNotch: true },
  { id: 'samsung-s23', name: 'Samsung S23', icon: Smartphone, width: 360, height: 780, category: 'phone', pixelRatio: 3 },
  
  // Tablets
  { id: 'ipad-mini', name: 'iPad Mini', icon: Tablet, width: 744, height: 1133, category: 'tablet', pixelRatio: 2 },
  { id: 'ipad-pro', name: 'iPad Pro 12.9"', icon: Tablet, width: 1024, height: 1366, category: 'tablet', pixelRatio: 2 },
  
  // Desktop
  { id: 'macbook-pro', name: 'MacBook Pro 16"', icon: Laptop, width: 1728, height: 1117, category: 'desktop', pixelRatio: 2 },
  { id: 'imac', name: 'iMac 24"', icon: Monitor, width: 1920, height: 1080, category: 'desktop', pixelRatio: 2 },
];

interface ResponsivePreviewProps {
  instances: ComponentInstance[];
  renderComponent: (instance: ComponentInstance) => React.ReactNode;
}

export const ResponsivePreview = ({ instances, renderComponent }: ResponsivePreviewProps) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('macbook-pro');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(800);
  const [scale, setScale] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [showBreakpoints, setShowBreakpoints] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentDevice = devices.find(d => d.id === activeDevice);
  const displayWidth = activeDevice === 'custom' ? customWidth : (currentDevice?.width || 1280);
  const displayHeight = activeDevice === 'custom' ? customHeight : (currentDevice?.height || 800);
  
  const finalWidth = orientation === 'landscape' ? displayHeight : displayWidth;
  const finalHeight = orientation === 'landscape' ? displayWidth : displayHeight;

  const handleRotate = () => {
    setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  const handleResetScale = () => setScale(100);
  
  const handleZoomIn = () => setScale(s => Math.min(200, s + 10));
  const handleZoomOut = () => setScale(s => Math.max(25, s - 10));

  const handleScreenshot = async () => {
    if (!previewRef.current) return;
    
    try {
      // This is a placeholder - in production you'd use html2canvas or similar
      toast.success('Screenshot feature requires html2canvas library');
    } catch (err) {
      toast.error('Failed to capture screenshot');
    }
  };

  const commonBreakpoints = [
    { name: 'xs', width: 320, color: 'bg-red-500' },
    { name: 'sm', width: 640, color: 'bg-orange-500' },
    { name: 'md', width: 768, color: 'bg-yellow-500' },
    { name: 'lg', width: 1024, color: 'bg-green-500' },
    { name: 'xl', width: 1280, color: 'bg-blue-500' },
    { name: '2xl', width: 1536, color: 'bg-purple-500' },
  ];

  const activeBreakpoint = [...commonBreakpoints]
    .reverse()
    .find(bp => finalWidth >= bp.width);

  return (
    <div className="flex flex-col h-full">
      {/* Main Toolbar */}
      <div className="space-y-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 mb-4">
        {/* Device Categories */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 w-20">Devices</span>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {['phone', 'tablet', 'desktop'].map(category => {
              const categoryDevices = devices.filter(d => d.category === category);
              const Icon = categoryDevices[0]?.icon || Smartphone;
              
              return (
                <div key={category} className="flex gap-1">
                  {categoryDevices.map(device => (
                    <button
                      key={device.id}
                      onClick={() => setActiveDevice(device.id)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                        activeDevice === device.id
                          ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                          : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                      )}
                      title={`${device.name} (${device.width}×${device.height})`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden lg:inline">{device.name}</span>
                      <span className="lg:hidden">{device.width}</span>
                    </button>
                  ))}
                </div>
              );
            })}
            
            <button
              onClick={() => setActiveDevice('custom')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                activeDevice === 'custom'
                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
              )}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Custom</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2.5", orientation === 'landscape' && "bg-zinc-800")}
              onClick={handleRotate}
              title="Toggle Orientation"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">{orientation === 'portrait' ? 'Portrait' : 'Landscape'}</span>
            </Button>

            <div className="h-4 w-px bg-zinc-700" />

            <Badge variant="outline" className="text-xs font-mono px-2 py-1">
              {finalWidth} × {finalHeight}
            </Badge>

            {currentDevice?.pixelRatio && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                @{currentDevice.pixelRatio}x
              </Badge>
            )}

            {activeBreakpoint && (
              <Badge 
                className={cn("text-[10px] px-1.5 py-0.5", activeBreakpoint.color, "text-white border-0")}
              >
                {activeBreakpoint.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={handleScreenshot}
              title="Capture Screenshot"
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>

            <div className="h-4 w-px bg-zinc-700 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", showGrid && "bg-zinc-800")}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", showRulers && "bg-zinc-800")}
              onClick={() => setShowRulers(!showRulers)}
              title="Toggle Rulers"
            >
              <Ruler className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", showBreakpoints && "bg-zinc-800")}
              onClick={() => setShowBreakpoints(!showBreakpoints)}
              title="Show Breakpoints"
            >
              <Zap className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", showDeviceFrame && "bg-zinc-800")}
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              title="Toggle Device Frame"
            >
              {showDeviceFrame ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Size Controls */}
      {activeDevice === 'custom' && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-zinc-400">Width</Label>
              <span className="text-xs text-zinc-500 font-mono">{customWidth}px</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCustomWidth(w => Math.max(320, w - 50))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Slider
                value={[customWidth]}
                onValueChange={([v]) => setCustomWidth(v)}
                min={320}
                max={2560}
                step={10}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCustomWidth(w => Math.min(2560, w + 50))}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-zinc-400">Height</Label>
              <span className="text-xs text-zinc-500 font-mono">{customHeight}px</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCustomHeight(h => Math.max(320, h - 50))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Slider
                value={[customHeight]}
                onValueChange={([v]) => setCustomHeight(v)}
                min={320}
                max={1600}
                step={10}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCustomHeight(h => Math.min(1600, h + 50))}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Control */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleZoomOut}
          disabled={scale <= 25}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-zinc-400 w-12">Zoom</span>
          <Slider
            value={[scale]}
            onValueChange={([v]) => setScale(v)}
            min={25}
            max={200}
            step={5}
            className="flex-1"
          />
        </div>

        <button
          onClick={handleResetScale}
          className="text-xs text-zinc-400 hover:text-zinc-200 font-mono w-12 text-right transition-colors"
          title="Reset to 100%"
        >
          {scale}%
        </button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleZoomIn}
          disabled={scale >= 200}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-gradient-to-br from-zinc-900/30 to-zinc-800/30 rounded-xl border border-zinc-800/50 p-8 relative">
        {/* Breakpoint Indicators */}
        {showBreakpoints && (
          <div className="absolute top-4 right-4 space-y-1">
            {commonBreakpoints.map(bp => (
              <div key={bp.name} className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  finalWidth >= bp.width ? bp.color : "bg-zinc-700"
                )} />
                <span className={cn(
                  "text-xs font-mono",
                  finalWidth >= bp.width ? "text-zinc-300" : "text-zinc-600"
                )}>
                  {bp.name}: {bp.width}px
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          ref={previewRef}
          className={cn(
            "relative bg-white rounded-lg overflow-hidden transition-all duration-300",
            showDeviceFrame && currentDevice?.category === 'phone' && "shadow-2xl",
            showDeviceFrame && currentDevice?.category === 'tablet' && "shadow-xl",
            showDeviceFrame && currentDevice?.category === 'desktop' && "shadow-lg"
          )}
          style={{
            width: finalWidth,
            height: finalHeight,
            transform: `scale(${scale / 100})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Device Frame */}
          {showDeviceFrame && (
            <>
              {/* Browser Chrome for Desktop */}
              {currentDevice?.category === 'desktop' && (
                <div className="h-10 bg-zinc-200 flex items-center px-4 gap-2 border-b border-zinc-300">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="bg-white rounded-md h-6 px-3 flex items-center text-xs text-zinc-500 border border-zinc-300">
                      <span className="text-zinc-400 mr-2">🔒</span>
                      preview.local
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded bg-zinc-300/50" />
                    <div className="w-6 h-6 rounded bg-zinc-300/50" />
                  </div>
                </div>
              )}

              {/* Phone Notch */}
              {currentDevice?.hasNotch && orientation === 'portrait' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-50" />
              )}

              {/* Phone Status Bar */}
              {currentDevice?.category === 'phone' && (
                <div className="h-6 bg-white flex items-center justify-between px-3 text-[10px] text-zinc-800 border-b border-zinc-200">
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-3 h-2 border border-zinc-400 rounded-sm" />
                    <span>100%</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Content Area */}
          <div 
            className="relative bg-zinc-50"
            style={{ 
              height: showDeviceFrame 
                ? currentDevice?.category === 'desktop' 
                  ? finalHeight - 40
                  : currentDevice?.category === 'phone'
                  ? finalHeight - 24
                  : finalHeight
                : finalHeight,
              backgroundImage: showGrid ? `
                linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
              ` : undefined,
              backgroundSize: showGrid ? '20px 20px' : undefined,
            }}
          >
            {/* Rulers */}
            {showRulers && (
              <>
                {/* Top Ruler */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-200 border-b border-zinc-300 flex text-[8px] text-zinc-600 font-mono">
                  {Array.from({ length: Math.ceil(finalWidth / 100) + 1 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[100px] border-l border-zinc-400 pl-0.5">
                      {i * 100}
                    </div>
                  ))}
                </div>

                {/* Left Ruler */}
                <div className="absolute top-0 left-0 bottom-0 w-4 bg-zinc-200 border-r border-zinc-300 text-[8px] text-zinc-600 font-mono">
                  {Array.from({ length: Math.ceil(finalHeight / 100) + 1 }).map((_, i) => (
                    <div key={i} className="h-[100px] border-t border-zinc-400 pt-0.5 pl-0.5">
                      {i * 100}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Components */}
            <div className={cn(showRulers && "ml-4 mt-4")}>
              {instances.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No components to preview</p>
                    <p className="text-xs text-zinc-500 mt-1">Add components to the canvas to see them here</p>
                  </div>
                </div>
              ) : (
                instances.map(instance => (
                  instance.visible && (
                    <div
                      key={instance.id}
                      className="absolute transition-all"
                      style={{
                        left: instance.position.x,
                        top: instance.position.y,
                        zIndex: instance.zIndex,
                      }}
                    >
                      {renderComponent(instance)}
                    </div>
                  )
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-zinc-500">
          <span>
            <span className="text-zinc-400 font-medium">{instances.length}</span> component{instances.length !== 1 ? 's' : ''}
          </span>
          <span className="text-zinc-700">•</span>
          <span>
            Device: <span className="text-zinc-400 font-medium">{currentDevice?.name || 'Custom'}</span>
          </span>
          <span className="text-zinc-700">•</span>
          <span>
            Orientation: <span className="text-zinc-400 font-medium capitalize">{orientation}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {commonBreakpoints.map(bp => (
            <div
              key={bp.name}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-mono transition-all",
                finalWidth >= bp.width
                  ? `${bp.color} text-white`
                  : "bg-zinc-800 text-zinc-600"
              )}
            >
              {bp.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
