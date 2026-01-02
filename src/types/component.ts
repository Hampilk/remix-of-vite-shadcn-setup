import type { LucideIcon } from 'lucide-react';

// ============================================================================
// Component Categories
// ============================================================================

/**
 * Available component categories for organization
 */
export const COMPONENT_CATEGORIES = [
  'forms',
  'layout',
  'navigation',
  'data-display',
  'feedback',
  'overlay',
  'media',
  'typography',
  'charts',
  'other',
] as const;

export type ComponentCategory = typeof COMPONENT_CATEGORIES[number];

/**
 * Category metadata for UI display
 */
export interface CategoryInfo {
  readonly id: ComponentCategory;
  readonly name: string;
  readonly icon: string | LucideIcon;
  readonly description: string;
  readonly longDescription?: string;
  readonly color?: string;
  readonly order?: number;
  readonly keywords?: readonly string[];
  readonly componentCount?: number;
}

/**
 * Predefined category information
 */
export const CATEGORY_INFO_MAP: Record<ComponentCategory, Omit<CategoryInfo, 'id'>> = {
  forms: {
    name: 'Forms',
    icon: 'FormInput',
    description: 'Input fields, buttons, and form controls',
    color: 'blue',
    order: 1,
    keywords: ['input', 'button', 'checkbox', 'radio', 'select', 'form'],
  },
  layout: {
    name: 'Layout',
    icon: 'Layout',
    description: 'Containers, grids, and structural components',
    color: 'purple',
    order: 2,
    keywords: ['container', 'grid', 'flex', 'stack', 'divider'],
  },
  navigation: {
    name: 'Navigation',
    icon: 'Menu',
    description: 'Menus, tabs, breadcrumbs, and navigation elements',
    color: 'green',
    order: 3,
    keywords: ['menu', 'tabs', 'breadcrumb', 'navbar', 'sidebar'],
  },
  'data-display': {
    name: 'Data Display',
    icon: 'Database',
    description: 'Tables, lists, cards, and data visualization',
    color: 'cyan',
    order: 4,
    keywords: ['table', 'list', 'card', 'avatar', 'badge', 'tag'],
  },
  feedback: {
    name: 'Feedback',
    icon: 'MessageSquare',
    description: 'Alerts, notifications, and user feedback components',
    color: 'orange',
    order: 5,
    keywords: ['alert', 'notification', 'toast', 'snackbar', 'message'],
  },
  overlay: {
    name: 'Overlay',
    icon: 'Layers',
    description: 'Modals, dialogs, popovers, and overlay elements',
    color: 'pink',
    order: 6,
    keywords: ['modal', 'dialog', 'popover', 'tooltip', 'drawer'],
  },
  media: {
    name: 'Media',
    icon: 'Image',
    description: 'Images, videos, icons, and media components',
    color: 'red',
    order: 7,
    keywords: ['image', 'video', 'audio', 'icon', 'avatar'],
  },
  typography: {
    name: 'Typography',
    icon: 'Type',
    description: 'Text, headings, and typographic elements',
    color: 'indigo',
    order: 8,
    keywords: ['text', 'heading', 'paragraph', 'link', 'code'],
  },
  charts: {
    name: 'Charts',
    icon: 'BarChart',
    description: 'Data visualization and chart components',
    color: 'emerald',
    order: 9,
    keywords: ['chart', 'graph', 'plot', 'visualization'],
  },
  other: {
    name: 'Other',
    icon: 'Box',
    description: 'Miscellaneous and utility components',
    color: 'gray',
    order: 10,
    keywords: ['utility', 'misc', 'other'],
  },
} as const;

// ============================================================================
// Component Variants
// ============================================================================

/**
 * Common variant types across components
 */
// ComponentVariants can be a simple string array for backwards compatibility
export type ComponentVariants = readonly string[];

export interface ComponentVariantsDetailed {
  readonly visual?: readonly string[];
  readonly size?: readonly string[];
  readonly state?: readonly string[];
  readonly layout?: readonly string[];
}

/**
 * Detailed variant configuration
 */
export interface VariantConfig {
  readonly name: string;
  readonly value: string;
  readonly description?: string;
  readonly preview?: string;
  readonly default?: boolean;
}

// ============================================================================
// Component Properties
// ============================================================================

/**
 * Property type definitions
 */
export type PropType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'enum'
  | 'color'
  | 'size'
  | 'icon'
  | 'function';

/**
 * Property configuration for component props
 */
export interface PropConfig {
  readonly type: PropType;
  readonly label: string;
  readonly description?: string;
  readonly defaultValue?: unknown;
  readonly required?: boolean;
  readonly options?: readonly string[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly placeholder?: string;
  readonly category?: string;
}

/**
 * Typed default props
 */
export type DefaultProps = Record<string, unknown>;

// ============================================================================
// Component Documentation
// ============================================================================

/**
 * Example usage for documentation
 */
export interface ComponentExample {
  readonly name: string;
  readonly description?: string;
  readonly code: string;
  readonly props?: Record<string, unknown>;
  readonly preview?: string;
}

/**
 * Component documentation
 */
export interface ComponentDocumentation {
  readonly overview?: string;
  readonly usage?: string;
  readonly examples?: readonly ComponentExample[];
  readonly accessibility?: string;
  readonly bestPractices?: readonly string[];
  readonly relatedComponents?: readonly string[];
  readonly changelog?: readonly {
    readonly version: string;
    readonly date: string;
    readonly changes: readonly string[];
  }[];
}

// ============================================================================
// Component Metadata
// ============================================================================

/**
 * Component compatibility information
 */
export interface ComponentCompatibility {
  readonly browsers?: readonly string[];
  readonly frameworks?: readonly string[];
  readonly minVersion?: string;
  readonly experimental?: boolean;
  readonly deprecated?: boolean;
  readonly deprecationMessage?: string;
}

/**
 * Component performance hints
 */
export interface ComponentPerformance {
  readonly renderCost?: 'low' | 'medium' | 'high';
  readonly memoryCost?: 'low' | 'medium' | 'high';
  readonly virtualizable?: boolean;
  readonly lazy?: boolean;
}

/**
 * Component tags for search and filtering - simple string array
 */
export type ComponentTags = readonly string[];

export interface ComponentTagsDetailed {
  readonly keywords?: readonly string[];
  readonly aliases?: readonly string[];
  readonly searchTerms?: readonly string[];
}

/**
 * Complete component metadata
 */
export interface ComponentMeta {
  // Identity
  readonly id: string;
  readonly name: string;
  readonly displayName?: string;
  readonly version?: string;
  
  // Organization
  readonly category: ComponentCategory;
  readonly subcategory?: string;
  readonly tags?: ComponentTags;
  
  // Description
  readonly description: string;
  readonly longDescription?: string;
  readonly icon?: string | LucideIcon;
  
  // Configuration
  readonly variants?: ComponentVariants;
  readonly variantConfigs?: Record<string, readonly VariantConfig[]>;
  readonly defaultProps?: DefaultProps;
  readonly propConfigs?: Record<string, PropConfig>;
  
  // Technical
  readonly importPath: string;
  readonly exportName?: string;
  readonly dependencies?: readonly string[];
  readonly peerDependencies?: readonly string[];
  
  // Status
  readonly status?: 'stable' | 'beta' | 'alpha' | 'deprecated';
  readonly compatibility?: ComponentCompatibility;
  readonly performance?: ComponentPerformance;
  
  // Documentation
  readonly documentation?: ComponentDocumentation;
  readonly externalDocs?: string;
  
  // Metadata
  readonly author?: string;
  readonly license?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  
  // UI Configuration
  readonly preview?: {
    readonly width?: number;
    readonly height?: number;
    readonly scale?: number;
    readonly backgroundColor?: string;
  };
  
  // Feature flags
  readonly features?: {
    readonly interactive?: boolean;
    readonly responsive?: boolean;
    readonly themeable?: boolean;
    readonly accessible?: boolean;
    readonly animatable?: boolean;
  };
}

// ============================================================================
// Component Collection
// ============================================================================

/**
 * Collection of related components
 */
export interface ComponentCollection {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon?: string | LucideIcon;
  readonly components: readonly string[];
  readonly featured?: boolean;
  readonly order?: number;
}

/**
 * Component library metadata
 */
export interface ComponentLibrary {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly components: readonly ComponentMeta[];
  readonly collections?: readonly ComponentCollection[];
  readonly categories?: readonly CategoryInfo[];
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Component filter criteria
 */
export interface ComponentFilter {
  readonly category?: ComponentCategory;
  readonly categories?: readonly ComponentCategory[];
  readonly search?: string;
  readonly tags?: readonly string[];
  readonly status?: ComponentMeta['status'][];
  readonly featured?: boolean;
}

/**
 * Component sort options
 */
export type ComponentSortBy = 
  | 'name'
  | 'category'
  | 'popularity'
  | 'recent'
  | 'alphabetical';

/**
 * Component search result
 */
export interface ComponentSearchResult {
  readonly component: ComponentMeta;
  readonly score: number;
  readonly matches: {
    readonly field: string;
    readonly value: string;
  }[];
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is a valid ComponentCategory
 */
export function isComponentCategory(value: unknown): value is ComponentCategory {
  return typeof value === 'string' && COMPONENT_CATEGORIES.includes(value as ComponentCategory);
}

/**
 * Check if a value is a valid ComponentMeta
 */
export function isComponentMeta(value: unknown): value is ComponentMeta {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'category' in value &&
    'description' in value &&
    'importPath' in value &&
    typeof (value as ComponentMeta).id === 'string' &&
    typeof (value as ComponentMeta).name === 'string' &&
    isComponentCategory((value as ComponentMeta).category) &&
    typeof (value as ComponentMeta).description === 'string' &&
    typeof (value as ComponentMeta).importPath === 'string'
  );
}

/**
 * Check if component is deprecated
 */
export function isComponentDeprecated(component: ComponentMeta): boolean {
  return component.status === 'deprecated' || component.compatibility?.deprecated === true;
}

/**
 * Check if component is experimental
 */
export function isComponentExperimental(component: ComponentMeta): boolean {
  return component.status === 'alpha' || component.status === 'beta' || component.compatibility?.experimental === true;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get category info by ID
 */
export function getCategoryInfo(categoryId: ComponentCategory): CategoryInfo {
  return {
    id: categoryId,
    ...CATEGORY_INFO_MAP[categoryId],
  };
}

/**
 * Get all category info objects
 */
export function getAllCategoryInfo(): CategoryInfo[] {
  return COMPONENT_CATEGORIES.map(getCategoryInfo).sort((a, b) => 
    (a.order ?? 999) - (b.order ?? 999)
  );
}

/**
 * Filter components by criteria
 */
export function filterComponents(
  components: readonly ComponentMeta[],
  filter: ComponentFilter
): ComponentMeta[] {
  return components.filter(component => {
    // Category filter
    if (filter.category && component.category !== filter.category) {
      return false;
    }
    
    if (filter.categories && !filter.categories.includes(component.category)) {
      return false;
    }
    
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesName = component.name.toLowerCase().includes(searchLower);
      const matchesDescription = component.description.toLowerCase().includes(searchLower);
      const matchesKeywords = component.tags?.some(k => 
        k.toLowerCase().includes(searchLower)
      );
      
      if (!matchesName && !matchesDescription && !matchesKeywords) {
        return false;
      }
    }
    
    // Status filter
    if (filter.status && component.status && !filter.status.includes(component.status)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Sort components
 */
export function sortComponents(
  components: readonly ComponentMeta[],
  sortBy: ComponentSortBy
): ComponentMeta[] {
  const sorted = [...components];
  
  switch (sortBy) {
    case 'name':
    case 'alphabetical':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'category':
      return sorted.sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name);
      });
    
    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt || new Date(0);
        const dateB = b.updatedAt || b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    
    default:
      return sorted;
  }
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default component meta values
 */
export const DEFAULT_COMPONENT_META: Partial<ComponentMeta> = {
  status: 'stable',
  version: '1.0.0',
  features: {
    interactive: true,
    responsive: true,
    themeable: true,
    accessible: true,
    animatable: false,
  },
} as const;
