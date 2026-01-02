import { InspectorState } from '@/hooks/useInspectorStore';
import { CollapsibleSection } from '../CollapsibleSection';
import { RangeSlider } from '../RangeSlider';
import { Move, RotateCw, Maximize, Zap, Box } from 'lucide-react';

interface TransformControlsProps {
  state: InspectorState;
  onChange: (updates: Partial<InspectorState>) => void;
}

export const TransformControls = ({ state, onChange }: TransformControlsProps) => {
  const updateTransform = (key: keyof typeof state.transforms, value: number) => {
    onChange({
      transforms: {
        ...state.transforms,
        [key]: value,
      },
    });
  };

  const updateTransform3D = (key: keyof typeof state.transforms3D, value: number) => {
    onChange({
      transforms3D: {
        ...state.transforms3D,
        [key]: value,
      },
    });
  };

  return (
    <>
      {/* 2D Transforms */}
      <CollapsibleSection title="Transforms" icon={<Move className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <RangeSlider
              icon={<Move className="w-3 h-3" />}
              label="Translate X"
              value={state.transforms.translateX}
              onChange={(v) => updateTransform('translateX', v)}
              min={-200}
              max={200}
              unit="px"
            />
            <RangeSlider
              icon={<Move className="w-3 h-3" />}
              label="Translate Y"
              value={state.transforms.translateY}
              onChange={(v) => updateTransform('translateY', v)}
              min={-200}
              max={200}
              unit="px"
            />
          </div>

          <RangeSlider
            icon={<RotateCw className="w-3 h-3" />}
            label="Rotate"
            value={state.transforms.rotate}
            onChange={(v) => updateTransform('rotate', v)}
            min={-180}
            max={180}
            unit="°"
          />

          <RangeSlider
            icon={<Maximize className="w-3 h-3" />}
            label="Scale"
            value={state.transforms.scale}
            onChange={(v) => updateTransform('scale', v)}
            min={0}
            max={200}
            unit="%"
          />

          <div className="grid grid-cols-2 gap-3">
            <RangeSlider
              icon={<Zap className="w-3 h-3" />}
              label="Skew X"
              value={state.transforms.skewX}
              onChange={(v) => updateTransform('skewX', v)}
              min={-45}
              max={45}
              unit="°"
            />
            <RangeSlider
              icon={<Zap className="w-3 h-3" />}
              label="Skew Y"
              value={state.transforms.skewY}
              onChange={(v) => updateTransform('skewY', v)}
              min={-45}
              max={45}
              unit="°"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* 3D Transforms */}
      <CollapsibleSection title="3D Transforms" icon={<Box className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          <RangeSlider
            label="Perspective"
            value={state.transforms3D.perspective}
            onChange={(v) => updateTransform3D('perspective', v)}
            min={0}
            max={2000}
            step={10}
            unit="px"
          />

          <div className="grid grid-cols-3 gap-2">
            <RangeSlider
              label="Rotate X"
              value={state.transforms3D.rotateX}
              onChange={(v) => updateTransform3D('rotateX', v)}
              min={-180}
              max={180}
              unit="°"
            />
            <RangeSlider
              label="Rotate Y"
              value={state.transforms3D.rotateY}
              onChange={(v) => updateTransform3D('rotateY', v)}
              min={-180}
              max={180}
              unit="°"
            />
            <RangeSlider
              label="Rotate Z"
              value={state.transforms3D.rotateZ}
              onChange={(v) => updateTransform3D('rotateZ', v)}
              min={-180}
              max={180}
              unit="°"
            />
          </div>
        </div>
      </CollapsibleSection>
    </>
  );
};
