import { useEffects } from '@/contexts/EffectContext';
import { Paintbrush, Move } from 'lucide-react';
import Draggable from 'react-draggable';
import { useRef, useState } from 'react';

export const PhonePreview = () => {
  const { state, getOklchColor, updateBlurSettings } = useEffects();
  const oklchColor = getOklchColor();
  const { x, y } = state.blurSettings;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const noiseUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>";

  // Convert blur settings to draggable position (offset from default)
  const defaultX = -590;
  const defaultY = -1070;
  const dragX = x - defaultX;
  const dragY = y - defaultY;

  const handleDrag = (_: any, data: { x: number; y: number }) => {
    updateBlurSettings({
      x: defaultX + data.x,
      y: defaultY + data.y,
    });
  };

  // Calculate glass effect styles
  const glassStyle = state.activeEffects.glass ? {
    backdropFilter: `blur(${state.glassSettings.blur}px) saturate(${state.glassSettings.saturation}%)`,
    backgroundColor: `${state.glassSettings.tint}${Math.round(state.glassSettings.opacity * 2.55).toString(16).padStart(2, '0')}`,
    border: `${state.glassSettings.borderWidth}px solid rgba(255,255,255,${state.glassSettings.borderOpacity / 100})`,
  } : {};

  // Calculate neomorph effect styles
  const getNeomorphShadow = () => {
    if (!state.activeEffects.neomorph) return {};
    const { distance, blur, intensity, lightSource, surfaceColor, shape } = state.neomorphSettings;
    const angle = (lightSource * Math.PI) / 180;
    const lightX = Math.round(Math.cos(angle) * distance);
    const lightY = Math.round(Math.sin(angle) * distance);
    const darkX = -lightX;
    const darkY = -lightY;
    const lightOpacity = intensity / 100 * 0.5;
    const darkOpacity = intensity / 100;

    let inset = '';
    if (shape === 'pressed') inset = 'inset ';
    else if (shape === 'concave') inset = 'inset ';

    return {
      backgroundColor: surfaceColor,
      boxShadow: `${inset}${lightX}px ${lightY}px ${blur}px rgba(255,255,255,${lightOpacity}), ${inset}${darkX}px ${darkY}px ${blur}px rgba(0,0,0,${darkOpacity})`,
    };
  };

  // Calculate clay effect styles
  const getClayStyle = () => {
    if (!state.activeEffects.clay) return {};
    const { depth, spread, borderRadius, highlightColor, shadowColor, surfaceTexture, bendAngle } = state.claySettings;
    
    let gradient = '';
    switch (surfaceTexture) {
      case 'glossy':
        gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}40 0%, transparent 50%, ${shadowColor}20 100%)`;
        break;
      case 'matte':
        gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}20 0%, transparent 100%)`;
        break;
      default:
        gradient = `linear-gradient(${135 + bendAngle}deg, ${highlightColor}30 0%, transparent 60%, ${shadowColor}10 100%)`;
    }

    return {
      borderRadius: `${borderRadius}px`,
      boxShadow: `0 ${depth}px ${spread}px ${shadowColor}60, 0 ${depth * 0.5}px ${spread * 0.5}px ${shadowColor}40`,
      background: gradient,
    };
  };

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div 
        className="absolute -inset-10 opacity-70 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at top, ${state.glowSettings.baseColor}80, transparent 60%)`
        }}
      />
      
      {/* Phone frame */}
      <div className="relative rounded-[2.4rem] bg-neutral-900/90 border border-neutral-800/80 shadow-[0_26px_80px_rgba(0,0,0,0.95)] p-2.5">
        <div 
          className="relative w-[375px] h-[812px] rounded-[40px] overflow-hidden shadow-2xl border-4 transition-colors duration-500 bg-[#050505] border-zinc-900"
        >
          {/* Draggable Glow layers */}
          {state.powerOn && state.activeEffects.glow && (
            <Draggable
              nodeRef={nodeRef}
              position={{ x: dragX, y: dragY }}
              onDrag={handleDrag}
              onStart={() => setIsDragging(true)}
              onStop={() => setIsDragging(false)}
            >
              <div 
                ref={nodeRef}
                className="absolute w-[1700px] h-[2400px] cursor-move z-[1]"
                style={{
                  maskImage: 'linear-gradient(black 30%, transparent 100%)',
                  transform: 'scale(0.9)',
                  opacity: isDragging ? 0.7 : 1,
                  transition: isDragging ? 'none' : 'opacity 0.2s',
                  left: `${defaultX}px`,
                  top: `${defaultY}px`,
                }}
              >
                {/* Drag indicator */}
                <div className={`absolute top-[800px] left-[750px] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                  <Move className="w-3 h-3 text-white/60" />
                  <span className="text-[10px] text-white/60">Drag to move</span>
                </div>

                <div 
                  className="absolute top-[400px] left-[300px] w-[1800px] rounded-full opacity-40 mix-blend-screen pointer-events-none"
                  style={{
                    backgroundColor: oklchColor,
                    height: '1140px',
                    filter: 'blur(180px)',
                  }}
                />
                <div 
                  className="absolute top-[600px] left-[460px] w-[1300px] h-[1300px] rounded-full opacity-60 mix-blend-screen pointer-events-none"
                  style={{
                    backgroundColor: oklchColor,
                    filter: 'blur(120px)',
                  }}
                />
                <div 
                  className="absolute top-[700px] left-[560px] w-[1000px] h-[800px] rounded-full mix-blend-screen pointer-events-none"
                  style={{
                    backgroundColor: oklchColor,
                    filter: 'blur(60px)',
                    opacity: 1,
                  }}
                />
                <div 
                  className="absolute top-[800px] left-[700px] w-[600px] h-[440px] rounded-full mix-blend-normal pointer-events-none"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    filter: 'blur(80px)',
                    opacity: 0.4,
                  }}
                />
              </div>
            </Draggable>
          )}

          {/* Glass effect overlay */}
          {state.powerOn && state.activeEffects.glass && (
            <div 
              className="absolute inset-0 z-[2] pointer-events-none"
              style={glassStyle}
            />
          )}

          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-overlay"
            style={{
              backgroundImage: `url("${noiseUrl}")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 200px',
              opacity: 0.35,
            }}
          />

          {/* Content */}
          <div className="absolute bottom-0 w-full p-8 pb-12 flex flex-col gap-6 z-10">
            {/* Icon with effects */}
            <div 
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
              style={{
                ...getNeomorphShadow(),
                ...getClayStyle(),
              }}
            >
              <Paintbrush className="w-5 h-5 text-white/80" />
            </div>

            {/* Text */}
            <div>
              <div className="text-xs font-medium tracking-widest uppercase mb-2 text-white/60">
                Collaboration Hub
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-4 text-white">
                Get More Done Together
              </h1>
              <p className="text-sm leading-relaxed text-white/60">
                Stay aligned, share ideas, and keep every project moving smoothly.
              </p>
            </div>

            {/* Buttons with effects */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-medium bg-white text-black hover:bg-white/90 transition-colors"
                style={{
                  ...getNeomorphShadow(),
                  ...getClayStyle(),
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16.92 9.1875C16.92 8.6025 16.8675 8.04 16.77 7.5H9V10.695H13.44C13.245 11.7225 12.66 12.5925 11.7825 13.1775V15.255H14.46C16.02 13.815 16.92 11.7 16.92 9.1875Z" fill="#4285F4"/>
                  <path d="M9 17.25C11.2275 17.25 13.095 16.515 14.46 15.255L11.7825 13.1775C11.0475 13.6725 10.11 13.9725 9 13.9725C6.855 13.9725 5.0325 12.525 4.38 10.575H1.635V12.705C2.9925 15.3975 5.775 17.25 9 17.25Z" fill="#34A853"/>
                  <path d="M4.38 10.5675C4.215 10.0725 4.1175 9.5475 4.1175 9C4.1175 8.4525 4.215 7.9275 4.38 7.4325V5.3025H1.635C1.0725 6.4125 0.75 7.665 0.75 9C0.75 10.335 1.0725 11.5875 1.635 12.6975L3.7725 11.0325L4.38 10.5675Z" fill="#FBBC05"/>
                  <path d="M9 4.035C10.215 4.035 11.295 4.455 12.1575 5.265L14.52 2.9025C13.0875 1.5675 11.2275 0.75 9 0.75C5.775 0.75 2.9925 2.6025 1.635 5.3025L4.38 7.4325C5.0325 5.4825 6.855 4.035 9 4.035Z" fill="#EA4335"/>
                </svg>
                Continue With Google
              </button>
              <button 
                className="w-full h-12 rounded-full flex items-center justify-center font-medium bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                style={{
                  ...getNeomorphShadow(),
                  ...getClayStyle(),
                }}
              >
                Skip
              </button>
            </div>
          </div>

          {/* Footer link */}
          <a 
            href="https://ap.cx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] z-10 opacity-50 hover:opacity-80 text-white/50 transition-opacity"
          >
            ap.cx
          </a>
        </div>
      </div>
    </div>
  );
};
