import { ComponentMeta } from '@/types/component';

/**
 * Comprehensive catalog of shadcn/ui components with metadata
 * @description Central registry for all available UI components with categorization,
 * variants, and default configurations
 */
export const componentCatalog: Readonly<ComponentMeta[]> = [
  // ============================================================================
  // FORMS - Interactive elements for user input
  // ============================================================================
  {
    id: 'button',
    name: 'Button',
    category: 'forms',
    description: 'Interactive button with multiple variants and sizes for user actions',
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    defaultProps: { variant: 'default', size: 'default' },
    importPath: '@/components/ui/button',
    tags: ['interactive', 'action', 'clickable'],
  },
  {
    id: 'input',
    name: 'Input',
    category: 'forms',
    description: 'Single-line text input field for user data entry with validation support',
    defaultProps: { type: 'text', placeholder: 'Enter text...' },
    importPath: '@/components/ui/input',
    tags: ['text', 'field', 'form'],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'forms',
    description: 'Multi-line text input for longer content with automatic resize',
    defaultProps: { placeholder: 'Enter text...', rows: 3 },
    importPath: '@/components/ui/textarea',
    tags: ['text', 'multiline', 'form'],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'forms',
    description: 'Binary toggle selection with check mark indicator',
    defaultProps: {},
    importPath: '@/components/ui/checkbox',
    tags: ['selection', 'toggle', 'binary'],
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    category: 'forms',
    description: 'Mutually exclusive single selection from multiple options',
    defaultProps: {},
    importPath: '@/components/ui/radio-group',
    tags: ['selection', 'single', 'group'],
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'forms',
    description: 'Toggle switch for binary on/off states with smooth animation',
    defaultProps: {},
    importPath: '@/components/ui/switch',
    tags: ['toggle', 'binary', 'animated'],
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'forms',
    description: 'Range input for selecting numeric values within bounds',
    defaultProps: { defaultValue: [50], max: 100, min: 0, step: 1 },
    importPath: '@/components/ui/slider',
    tags: ['range', 'numeric', 'input'],
  },
  {
    id: 'select',
    name: 'Select',
    category: 'forms',
    description: 'Dropdown selection from predefined options with search capability',
    defaultProps: {},
    importPath: '@/components/ui/select',
    tags: ['dropdown', 'selection', 'options'],
  },
  {
    id: 'label',
    name: 'Label',
    category: 'forms',
    description: 'Accessible label for form elements with proper ARIA support',
    defaultProps: {},
    importPath: '@/components/ui/label',
    tags: ['accessibility', 'form', 'text'],
  },
  {
    id: 'input-otp',
    name: 'Input OTP',
    category: 'forms',
    description: 'One-time password input with individual character slots',
    defaultProps: { maxLength: 6 },
    importPath: '@/components/ui/input-otp',
    tags: ['security', 'authentication', 'code'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'forms',
    description: 'Interactive date picker calendar with range selection support',
    defaultProps: { mode: 'single' },
    importPath: '@/components/ui/calendar',
    tags: ['date', 'picker', 'time'],
  },
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'forms',
    description: 'Two-state button that can be toggled between pressed/unpressed',
    variants: ['default', 'outline'],
    defaultProps: {},
    importPath: '@/components/ui/toggle',
    tags: ['button', 'toggle', 'state'],
  },
  {
    id: 'toggle-group',
    name: 'Toggle Group',
    category: 'forms',
    description: 'Group of toggles for single or multiple selection',
    defaultProps: { type: 'single' },
    importPath: '@/components/ui/toggle-group',
    tags: ['selection', 'group', 'toggle'],
  },

  // ============================================================================
  // LAYOUT - Structural components for organizing content
  // ============================================================================
  {
    id: 'card',
    name: 'Card',
    category: 'layout',
    description: 'Flexible container with header, content, and footer sections',
    defaultProps: {},
    importPath: '@/components/ui/card',
    tags: ['container', 'panel', 'section'],
  },
  {
    id: 'separator',
    name: 'Separator',
    category: 'layout',
    description: 'Visual divider between content sections with orientation support',
    defaultProps: { orientation: 'horizontal' },
    importPath: '@/components/ui/separator',
    tags: ['divider', 'line', 'visual'],
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio',
    category: 'layout',
    description: 'Maintains consistent aspect ratio for responsive content',
    defaultProps: { ratio: 16 / 9 },
    importPath: '@/components/ui/aspect-ratio',
    tags: ['responsive', 'ratio', 'media'],
  },
  {
    id: 'scroll-area',
    name: 'Scroll Area',
    category: 'layout',
    description: 'Custom scrollable container with styled scrollbars',
    defaultProps: {},
    importPath: '@/components/ui/scroll-area',
    tags: ['scroll', 'overflow', 'container'],
  },
  {
    id: 'resizable',
    name: 'Resizable',
    category: 'layout',
    description: 'Resizable panel groups with interactive drag handles',
    defaultProps: {},
    importPath: '@/components/ui/resizable',
    tags: ['panel', 'resize', 'layout'],
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    category: 'layout',
    description: 'Expandable and collapsible content section with animation',
    defaultProps: {},
    importPath: '@/components/ui/collapsible',
    tags: ['expand', 'collapse', 'animated'],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'layout',
    description: 'Vertically stacked collapsible sections for content organization',
    defaultProps: { type: 'single', collapsible: true },
    importPath: '@/components/ui/accordion',
    tags: ['collapse', 'expand', 'stack'],
  },
  {
    id: 'carousel',
    name: 'Carousel',
    category: 'layout',
    description: 'Slideshow component for cycling through content with navigation',
    defaultProps: {},
    importPath: '@/components/ui/carousel',
    tags: ['slider', 'slideshow', 'navigation'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'layout',
    description: 'Application sidebar with collapsible sections and navigation',
    defaultProps: {},
    importPath: '@/components/ui/sidebar',
    tags: ['navigation', 'panel', 'menu'],
  },

  // ============================================================================
  // NAVIGATION - Components for app navigation and routing
  // ============================================================================
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    description: 'Tabbed interface for switching between related content views',
    defaultProps: {},
    importPath: '@/components/ui/tabs',
    tags: ['switch', 'views', 'content'],
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Navigation trail showing current location in hierarchy',
    defaultProps: {},
    importPath: '@/components/ui/breadcrumb',
    tags: ['path', 'trail', 'location'],
  },
  {
    id: 'navigation-menu',
    name: 'Navigation Menu',
    category: 'navigation',
    description: 'Primary navigation component with dropdown and mega menu support',
    defaultProps: {},
    importPath: '@/components/ui/navigation-menu',
    tags: ['menu', 'dropdown', 'primary'],
  },
  {
    id: 'menubar',
    name: 'Menubar',
    category: 'navigation',
    description: 'Horizontal menu bar with nested menu support',
    defaultProps: {},
    importPath: '@/components/ui/menubar',
    tags: ['menu', 'horizontal', 'bar'],
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    category: 'navigation',
    description: 'Contextual menu activated by trigger element',
    defaultProps: {},
    importPath: '@/components/ui/dropdown-menu',
    tags: ['menu', 'dropdown', 'context'],
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    category: 'navigation',
    description: 'Right-click contextual menu with keyboard shortcuts',
    defaultProps: {},
    importPath: '@/components/ui/context-menu',
    tags: ['menu', 'rightclick', 'context'],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'navigation',
    description: 'Page navigation controls for paginated content',
    defaultProps: {},
    importPath: '@/components/ui/pagination',
    tags: ['pages', 'navigation', 'list'],
  },
  {
    id: 'command',
    name: 'Command',
    category: 'navigation',
    description: 'Command palette with fuzzy search and keyboard shortcuts',
    defaultProps: {},
    importPath: '@/components/ui/command',
    tags: ['search', 'palette', 'shortcuts'],
  },

  // ============================================================================
  // DATA DISPLAY - Components for presenting information
  // ============================================================================
  {
    id: 'table',
    name: 'Table',
    category: 'data-display',
    description: 'Structured data presentation in rows and columns with sorting',
    defaultProps: {},
    importPath: '@/components/ui/table',
    tags: ['data', 'grid', 'rows'],
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'data-display',
    description: 'Small status indicator or label for categorization',
    variants: ['default', 'secondary', 'destructive', 'outline'],
    defaultProps: { variant: 'default' },
    importPath: '@/components/ui/badge',
    tags: ['status', 'label', 'indicator'],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'data-display',
    description: 'User profile image with fallback initials or icon',
    defaultProps: {},
    importPath: '@/components/ui/avatar',
    tags: ['profile', 'image', 'user'],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'data-display',
    description: 'Loading placeholder with pulse animation',
    defaultProps: {},
    importPath: '@/components/ui/skeleton',
    tags: ['loading', 'placeholder', 'animation'],
  },
  {
    id: 'chart',
    name: 'Chart',
    category: 'data-display',
    description: 'Data visualization charts powered by Recharts',
    defaultProps: {},
    importPath: '@/components/ui/chart',
    tags: ['visualization', 'graph', 'data'],
  },

  // ============================================================================
  // FEEDBACK - Components for user feedback and notifications
  // ============================================================================
  {
    id: 'alert',
    name: 'Alert',
    category: 'feedback',
    description: 'Attention-grabbing message display for important information',
    variants: ['default', 'destructive'],
    defaultProps: { variant: 'default' },
    importPath: '@/components/ui/alert',
    tags: ['message', 'notification', 'warning'],
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'feedback',
    description: 'Brief notification message with auto-dismiss',
    defaultProps: {},
    importPath: '@/components/ui/toast',
    tags: ['notification', 'message', 'temporary'],
  },
  {
    id: 'progress',
    name: 'Progress',
    category: 'feedback',
    description: 'Visual progress bar indicator for long-running operations',
    defaultProps: { value: 50 },
    importPath: '@/components/ui/progress',
    tags: ['loading', 'bar', 'indicator'],
  },
  {
    id: 'sonner',
    name: 'Sonner',
    category: 'feedback',
    description: 'Modern toast notification system with stacking support',
    defaultProps: {},
    importPath: '@/components/ui/sonner',
    tags: ['toast', 'notification', 'stack'],
  },

  // ============================================================================
  // OVERLAY - Modal and floating components
  // ============================================================================
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'overlay',
    description: 'Modal dialog window for focused content and actions',
    defaultProps: {},
    importPath: '@/components/ui/dialog',
    tags: ['modal', 'popup', 'window'],
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    category: 'overlay',
    description: 'Confirmation dialog requiring explicit user action',
    defaultProps: {},
    importPath: '@/components/ui/alert-dialog',
    tags: ['modal', 'confirm', 'alert'],
  },
  {
    id: 'sheet',
    name: 'Sheet',
    category: 'overlay',
    description: 'Sliding panel from screen edge with configurable side',
    defaultProps: { side: 'right' },
    importPath: '@/components/ui/sheet',
    tags: ['panel', 'slide', 'drawer'],
  },
  {
    id: 'drawer',
    name: 'Drawer',
    category: 'overlay',
    description: 'Mobile-optimized bottom sheet with swipe gestures',
    defaultProps: {},
    importPath: '@/components/ui/drawer',
    tags: ['mobile', 'sheet', 'bottom'],
  },
  {
    id: 'popover',
    name: 'Popover',
    category: 'overlay',
    description: 'Floating content panel with smart positioning',
    defaultProps: {},
    importPath: '@/components/ui/popover',
    tags: ['floating', 'panel', 'popup'],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'overlay',
    description: 'Informative popup on hover with configurable delay',
    defaultProps: {},
    importPath: '@/components/ui/tooltip',
    tags: ['hint', 'hover', 'info'],
  },
  {
    id: 'hover-card',
    name: 'Hover Card',
    category: 'overlay',
    description: 'Rich preview card displayed on hover interaction',
    defaultProps: {},
    importPath: '@/components/ui/hover-card',
    tags: ['preview', 'hover', 'card'],
  },
] as const;

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

export const COMPONENT_CATEGORIES = {
  forms: 'Forms',
  layout: 'Layout',
  navigation: 'Navigation',
  'data-display': 'Data Display',
  feedback: 'Feedback',
  overlay: 'Overlay',
} as const;

export type ComponentCategory = keyof typeof COMPONENT_CATEGORIES;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Retrieves a component by its unique identifier
 * @param id - Component identifier
 * @returns Component metadata or undefined if not found
 */
export const getComponentById = (id: string): ComponentMeta | undefined => {
  return componentCatalog.find((comp) => comp.id === id);
};

/**
 * Retrieves all components belonging to a specific category
 * @param category - Component category
 * @returns Array of components in the category
 */
export const getComponentsByCategory = (
  category: ComponentCategory
): ComponentMeta[] => {
  return componentCatalog.filter((comp) => comp.category === category);
};

/**
 * Searches components by name, description, category, or tags
 * @param query - Search query string
 * @returns Array of matching components sorted by relevance
 */
export const searchComponents = (query: string): ComponentMeta[] => {
  if (!query.trim()) return [...componentCatalog];

  const lowerQuery = query.toLowerCase();
  const matches = componentCatalog
    .map((comp) => {
      let score = 0;

      // Exact name match gets highest score
      if (comp.name.toLowerCase() === lowerQuery) score += 100;
      // Name starts with query
      else if (comp.name.toLowerCase().startsWith(lowerQuery)) score += 50;
      // Name contains query
      else if (comp.name.toLowerCase().includes(lowerQuery)) score += 25;

      // Description match
      if (comp.description.toLowerCase().includes(lowerQuery)) score += 10;

      // Category match
      if (comp.category.toLowerCase().includes(lowerQuery)) score += 15;

      // Tags match
      if (comp.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        score += 20;
      }

      return { component: comp, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ component }) => component);

  return matches;
};

/**
 * Groups components by category
 * @returns Object with categories as keys and component arrays as values
 */
export const getComponentsByCategories = (): Record<
  ComponentCategory,
  ComponentMeta[]
> => {
  return componentCatalog.reduce(
    (acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    },
    {} as Record<ComponentCategory, ComponentMeta[]>
  );
};

/**
 * Gets all available component tags
 * @returns Array of unique tags across all components
 */
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  componentCatalog.forEach((comp) => {
    comp.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

/**
 * Filters components by tag
 * @param tag - Tag to filter by
 * @returns Array of components with the specified tag
 */
export const getComponentsByTag = (tag: string): ComponentMeta[] => {
  return componentCatalog.filter((comp) =>
    comp.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
};
