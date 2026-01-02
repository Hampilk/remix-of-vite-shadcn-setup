import { ComponentMeta } from './component';

// ============================================================================
// Core Types
// ============================================================================

/**
 * 2D position coordinates for component placement
 */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/**
 * Size constraints for components
 */
export interface Size {
  readonly width?: string | number;
  readonly height?: string | number;
  readonly minWidth?: string | number;
  readonly maxWidth?: string | number;
  readonly minHeight?: string | number;
  readonly maxHeight?: string | number;
}

/**
 * Spacing configuration using CSS box model
 */
export interface Spacing {
  readonly padding?: string;
  readonly paddingTop?: string;
  readonly paddingRight?: string;
  readonly paddingBottom?: string;
  readonly paddingLeft?: string;
  readonly margin?: string;
  readonly marginTop?: string;
  readonly marginRight?: string;
  readonly marginBottom?: string;
  readonly marginLeft?: string;
  readonly gap?: string;
}

/**
 * Color palette for component theming
 */
export interface ColorScheme {
  readonly backgroundColor?: string;
  readonly textColor?: string;
  readonly borderColor?: string;
  readonly accentColor?: string;
  readonly hoverColor?: string;
  readonly focusColor?: string;
}

/**
 * Border styling properties
 */
export interface BorderStyle {
  readonly borderWidth?: string;
  readonly borderRadius?: string;
  readonly borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  readonly borderTopWidth?: string;
  readonly borderRightWidth?: string;
  readonly borderBottomWidth?: string;
  readonly borderLeftWidth?: string;
}

/**
 * Typography configuration
 */
export interface Typography {
  readonly fontSize?: string;
  readonly fontWeight?: string | number;
  readonly fontFamily?: string;
  readonly lineHeight?: string | number;
  readonly letterSpacing?: string;
  readonly textAlign?: 'left' | 'center' | 'right' | 'justify';
  readonly textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  readonly textDecoration?: string;
}

/**
 * Visual effects and transformations
 */
export interface VisualEffects {
  readonly opacity?: number;
  readonly shadow?: string;
  readonly blur?: number;
  readonly backdropBlur?: number;
  readonly brightness?: number;
  readonly contrast?: number;
  readonly saturate?: number;
  readonly saturation?: number;
  readonly hueRotate?: number;
  readonly grayscale?: number;
  readonly invert?: number;
}

/**
 * 2D/3D transformations
 */
export interface Transform {
  readonly scale?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly rotate?: number;
  readonly rotateX?: number;
  readonly rotateY?: number;
  readonly rotateZ?: number;
  readonly translateX?: string | number;
  readonly translateY?: string | number;
  readonly skewX?: number;
  readonly skewY?: number;
  readonly perspective?: number;
}

/**
 * Animation and transition settings
 */
export interface Animation {
  readonly duration?: string;
  readonly delay?: string;
  readonly timingFunction?: string;
  readonly iterationCount?: number | 'infinite';
  readonly direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  readonly fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// ============================================================================
// Component Properties
// ============================================================================

/**
 * Comprehensive component instance properties
 * Combines all styling, behavior, and content options
 */
export interface InstanceProps extends 
  Partial<Size>,
  Partial<Spacing>,
  Partial<ColorScheme>,
  Partial<BorderStyle>,
  Partial<Typography>,
  Partial<VisualEffects>,
  Partial<Transform>,
  Partial<Animation> {
  
  // Content
  readonly text?: string;
  readonly children?: string | React.ReactNode;
  readonly placeholder?: string;
  readonly value?: string | number | boolean;
  
  // Direct rotation for inspector (degrees)
  readonly rotation?: number;
  
  // Component-specific variants
  readonly variant?: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // State
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly selected?: boolean;
  readonly error?: boolean;
  
  // Layout
  readonly display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  readonly flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  readonly justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  readonly alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  readonly gridTemplateColumns?: string;
  readonly gridTemplateRows?: string;
  
  // Overflow
  readonly overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  readonly overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  readonly overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  
  // Cursor
  readonly cursor?: 'auto' | 'pointer' | 'move' | 'text' | 'wait' | 'not-allowed' | 'grab' | 'grabbing';
  
  // Custom properties for extensibility
  readonly [key: string]: any;
}

// ============================================================================
// Effects System
// ============================================================================

/**
 * Available effect types
 */
export type EffectType = 'glow' | 'glass' | 'neomorph' | 'clay' | 'gradient' | 'pattern' | 'parallax';

/**
 * Base effect configuration
 */
export interface BaseEffectConfig {
  readonly type: EffectType;
  readonly enabled: boolean;
  readonly intensity?: number;
  readonly blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

/**
 * Glow effect settings
 */
export interface GlowEffectSettings {
  readonly color: string;
  readonly spread: number;
  readonly blur: number;
  readonly intensity: number;
}

/**
 * Glass morphism effect settings
 */
export interface GlassEffectSettings {
  readonly blur: number;
  readonly opacity: number;
  readonly saturation: number;
  readonly border: boolean;
}

/**
 * Neomorphism effect settings
 */
export interface NeomorphEffectSettings {
  readonly distance: number;
  readonly intensity: number;
  readonly lightAngle: number;
  readonly concave: boolean;
}

/**
 * Clay morphism effect settings
 */
export interface ClayEffectSettings {
  readonly depth: number;
  readonly smoothness: number;
  readonly lightColor: string;
  readonly shadowColor: string;
}

/**
 * Type-safe effect configuration with discriminated union
 */
export type EffectConfig = 
  | (BaseEffectConfig & { type: 'glow'; settings: GlowEffectSettings })
  | (BaseEffectConfig & { type: 'glass'; settings: GlassEffectSettings })
  | (BaseEffectConfig & { type: 'neomorph'; settings: NeomorphEffectSettings })
  | (BaseEffectConfig & { type: 'clay'; settings: ClayEffectSettings })
  | (BaseEffectConfig & { type: EffectType; settings: Record<string, unknown> });

// ============================================================================
// Component States
// ============================================================================

/**
 * Available component interaction states
 */
export type ComponentStateType = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'error';

/**
 * State-specific property overrides
 */
export type StateProps = Partial<InstanceProps>;

/**
 * Complete state configuration map
 */
export type ComponentStates = {
  readonly default: StateProps;
} & Partial<Record<Exclude<ComponentStateType, 'default'>, StateProps>>;

// ============================================================================
// Component Instance
// ============================================================================

/**
 * Metadata for component tracking and organization
 */
export interface ComponentMetadata {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
  readonly tags?: readonly string[];
  readonly category?: string;
  readonly author?: string;
}

/**
 * Complete component instance definition
 * Represents a placed component with all its properties and states
 */
export interface ComponentInstance {
  // Identification
  readonly id: string;
  readonly componentId: string;
  readonly name: string;
  
  // Positioning
  readonly position: Position;
  readonly zIndex: number;
  readonly rotation?: number;
  
  // Styling & Behavior
  readonly props: InstanceProps;
  readonly effects: readonly EffectConfig[];
  readonly states: ComponentStates;
  
  // Visibility & Interaction
  readonly locked: boolean;
  readonly visible: boolean;
  readonly selectable: boolean;
  
  // Grouping & Hierarchy
  readonly parentId?: string;
  readonly children?: readonly string[];
  readonly groupId?: string;
  
  // Metadata
  readonly metadata?: ComponentMetadata;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Deep partial for nested property updates
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Component instance with required fields for creation
 */
export type ComponentInstanceCreate = Pick<
  ComponentInstance,
  'componentId' | 'name' | 'position'
> & Partial<Omit<ComponentInstance, 'id' | 'componentId' | 'name' | 'position'>>;

/**
 * Component instance update payload
 */
export type ComponentInstanceUpdate = DeepPartial<
  Omit<ComponentInstance, 'id' | 'componentId'>
>;

/**
 * Serializable component instance for storage/transfer
 */
export type SerializableComponentInstance = Omit<ComponentInstance, 'metadata'> & {
  readonly metadata?: Omit<ComponentMetadata, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: string;
    readonly updatedAt: string;
  };
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is a valid Position
 */
export function isPosition(value: unknown): value is Position {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof (value as Position).x === 'number' &&
    typeof (value as Position).y === 'number'
  );
}

/**
 * Check if a value is a valid ComponentInstance
 */
export function isComponentInstance(value: unknown): value is ComponentInstance {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'componentId' in value &&
    'name' in value &&
    'position' in value &&
    'props' in value &&
    typeof (value as ComponentInstance).id === 'string' &&
    typeof (value as ComponentInstance).componentId === 'string' &&
    typeof (value as ComponentInstance).name === 'string' &&
    isPosition((value as ComponentInstance).position)
  );
}

/**
 * Check if effect config matches a specific type
 */
export function isEffectType<T extends EffectType>(
  effect: EffectConfig,
  type: T
): effect is Extract<EffectConfig, { type: T }> {
  return effect.type === type;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default component instance values
 */
export const DEFAULT_INSTANCE_PROPS: InstanceProps = {
  width: 'auto',
  height: 'auto',
  opacity: 1,
  disabled: false,
  visible: true,
} as const;

/**
 * Default component states
 */
export const DEFAULT_COMPONENT_STATES: ComponentStates = {
  default: {},
} as const;

/**
 * Z-index layers for component stacking
 */
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 100,
  CONTROLS: 200,
  OVERLAY: 300,
  MODAL: 400,
  TOOLTIP: 500,
} as const;
