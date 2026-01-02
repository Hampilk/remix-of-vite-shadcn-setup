import { InspectorState, TransformState, Transform3DState, EffectsState } from '@/hooks/useInspectorStore';
import { cn } from '@/lib/utils';

interface PreviewBoxProps {
  state: InspectorState;
}

const getTransformStyle = (transforms: TransformState, transforms3D: Transform3DState): string => {
  const parts: string[] = [];

  if (transforms3D.perspective > 0) {
    parts.push(`perspective(${transforms3D.perspective}px)`);
  }
  if (transforms.translateX !== 0) {
    parts.push(`translateX(${transforms.translateX}px)`);
  }
  if (transforms.translateY !== 0) {
    parts.push(`translateY(${transforms.translateY}px)`);
  }
  if (transforms.rotate !== 0) {
    parts.push(`rotate(${transforms.rotate}deg)`);
  }
  if (transforms.scale !== 100) {
    parts.push(`scale(${transforms.scale / 100})`);
  }
  if (transforms.skewX !== 0) {
    parts.push(`skewX(${transforms.skewX}deg)`);
  }
  if (transforms.skewY !== 0) {
    parts.push(`skewY(${transforms.skewY}deg)`);
  }
  if (transforms3D.rotateX !== 0) {
    parts.push(`rotateX(${transforms3D.rotateX}deg)`);
  }
  if (transforms3D.rotateY !== 0) {
    parts.push(`rotateY(${transforms3D.rotateY}deg)`);
  }
  if (transforms3D.rotateZ !== 0) {
    parts.push(`rotateZ(${transforms3D.rotateZ}deg)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
};

const getFilterStyle = (effects: EffectsState): string => {
  const parts: string[] = [];

  if (effects.blur > 0) {
    parts.push(`blur(${effects.blur}px)`);
  }
  if (effects.brightness !== 100) {
    parts.push(`brightness(${effects.brightness}%)`);
  }
  if (effects.saturation !== 100) {
    parts.push(`saturate(${effects.saturation}%)`);
  }
  if (effects.hueRotate !== 0) {
    parts.push(`hue-rotate(${effects.hueRotate}deg)`);
  }
  if (effects.grayscale > 0) {
    parts.push(`grayscale(${effects.grayscale}%)`);
  }
  if (effects.invert > 0) {
    parts.push(`invert(${effects.invert}%)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
};

const getBackdropFilterStyle = (effects: EffectsState): string => {
  if (effects.backdropBlur > 0) {
    return `blur(${effects.backdropBlur}px)`;
  }
  return 'none';
};

const getShadowClass = (shadow: string): string => {
  const shadowMap: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };
  return shadowMap[shadow] || '';
};

const getBackgroundStyle = (state: InspectorState): string => {
  const { appearance } = state;
  const bg = appearance.backgroundColor;

  if (bg.type === 'solid') {
    return bg.color;
  }

  if (bg.type === 'linear') {
    const { from, via, to, direction } = bg.gradient;
    return `linear-gradient(${direction}deg, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }

  if (bg.type === 'radial') {
    const { from, via, to, radialPosition } = bg.gradient;
    return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }

  if (bg.type === 'conic') {
    const { from, via, to, conicAngle } = bg.gradient;
    return `conic-gradient(from ${conicAngle}deg, ${from.color} ${from.position}%, ${via.color} ${via.position}%, ${to.color} ${to.position}%)`;
  }

  return bg.color;
};

const getBorderRadiusStyle = (radius: string): string => {
  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '2px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  };
  return radiusMap[radius] || radius;
};

export const PreviewBox = ({ state }: PreviewBoxProps) => {
  const transformStyle = getTransformStyle(state.transforms, state.transforms3D);
  const filterStyle = getFilterStyle(state.effects);
  const backdropFilterStyle = getBackdropFilterStyle(state.effects);
  const shadowClass = getShadowClass(state.effects.shadow);
  const backgroundStyle = getBackgroundStyle(state);
  const borderRadiusStyle = getBorderRadiusStyle(state.border.radius);

  const previewStyle: React.CSSProperties = {
    transform: transformStyle !== 'none' ? transformStyle : undefined,
    filter: filterStyle !== 'none' ? filterStyle : undefined,
    backdropFilter: backdropFilterStyle !== 'none' ? backdropFilterStyle : undefined,
    opacity: state.opacity / 100,
    background: backgroundStyle,
    borderRadius: borderRadiusStyle,
    borderColor: state.border.color,
    borderWidth: state.border.activeSides.all ? `${state.border.width}px` : undefined,
    borderStyle: state.border.style,
    color: state.typography.textColor,
    textAlign: state.typography.textAlign as 'left' | 'center' | 'right' | 'justify',
    padding: `${state.padding.t}px ${state.padding.r}px ${state.padding.b}px ${state.padding.l}px`,
    margin: `${state.margin.y}px ${state.margin.x}px`,
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Preview
        </span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="relative bg-[#1a1a2e] rounded-md p-6 min-h-[120px] flex items-center justify-center overflow-hidden">
        {/* Checkerboard pattern for transparency */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          }}
        />
        <div
          className={cn('relative transition-all duration-200', shadowClass)}
          style={previewStyle}
        >
          <span className="px-4 py-2 whitespace-nowrap">
            {state.textContent || 'Preview'}
          </span>
        </div>
      </div>
    </div>
  );
};
