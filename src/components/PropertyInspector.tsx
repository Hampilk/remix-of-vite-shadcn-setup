/**
 * Advanced Property Inspector
 * A professional, Figma-inspired property inspector panel for editing CSS properties in real-time.
 * 
 * Features:
 * - Visual CSS Editing with intuitive controls
 * - Real-time Preview with live updates
 * - Keyboard Shortcuts (Ctrl+Z/Ctrl+Shift+Z for undo/redo, Ctrl+S to save)
 * - CSS Export to clipboard
 * - Advanced Color Picker with solid colors and gradients (linear, radial, conic)
 * - Full sync with selected component instances
 */

import { ComponentInstance, InstanceProps } from '@/types/componentInstance';
import { AdvancedPropertyInspector } from './PropertyInspector/AdvancedPropertyInspector';

interface PropertyInspectorProps {
  instance: ComponentInstance | null;
  onUpdateProps: (props: Partial<InstanceProps>) => void;
  onUpdateInstance: (updates: Partial<ComponentInstance>) => void;
}

/**
 * PropertyInspector component - now uses the advanced Figma-inspired inspector
 * with full bidirectional sync with selected components
 */
export const PropertyInspector = ({ 
  instance, 
  onUpdateProps, 
  onUpdateInstance 
}: PropertyInspectorProps) => {
  return (
    <AdvancedPropertyInspector
      instance={instance}
      onUpdateProps={onUpdateProps}
      onUpdateInstance={onUpdateInstance}
    />
  );
};
