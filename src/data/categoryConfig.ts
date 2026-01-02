import { CategoryInfo } from '@/types/component';
import type { LucideIcon } from 'lucide-react';

/**
 * Category configuration for component organization
 * @description Defines visual and semantic properties for each component category
 */

// ============================================================================
// CATEGORY IDENTIFIERS
// ============================================================================

export const CATEGORY_IDS = {
  FORMS: 'forms',
  LAYOUT: 'layout',
  NAVIGATION: 'navigation',
  DATA_DISPLAY: 'data-display',
  FEEDBACK: 'feedback',
  OVERLAY: 'overlay',
  OTHER: 'other',
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

export const categories: Readonly<CategoryInfo[]> = [
  {
    id: CATEGORY_IDS.FORMS,
    name: 'Forms',
    icon: 'FormInput',
    description: 'Input elements, buttons, and form controls',
    longDescription:
      'Interactive form components for collecting user input, including text fields, buttons, checkboxes, and specialized inputs like date pickers and OTP fields.',
    color: 'blue',
    keywords: ['input', 'button', 'form', 'field', 'control', 'selection'],
    componentCount: 0, // Will be populated dynamically
  },
  {
    id: CATEGORY_IDS.LAYOUT,
    name: 'Layout',
    icon: 'LayoutGrid',
    description: 'Cards, containers, and structural elements',
    longDescription:
      'Structural components for organizing content and creating responsive layouts, including cards, separators, collapsible sections, and scroll containers.',
    color: 'purple',
    keywords: ['container', 'card', 'grid', 'section', 'structure', 'panel'],
    componentCount: 0,
  },
  {
    id: CATEGORY_IDS.NAVIGATION,
    name: 'Navigation',
    icon: 'Navigation',
    description: 'Menus, tabs, breadcrumbs, and navigation aids',
    longDescription:
      'Navigation components for moving through application content, including menus, tabs, breadcrumbs, pagination, and command palettes.',
    color: 'green',
    keywords: ['menu', 'nav', 'tab', 'breadcrumb', 'route', 'link'],
    componentCount: 0,
  },
  {
    id: CATEGORY_IDS.DATA_DISPLAY,
    name: 'Data Display',
    icon: 'Table2',
    description: 'Tables, badges, avatars, and data presentation',
    longDescription:
      'Components for displaying structured and unstructured data, including tables, badges, avatars, charts, and loading states.',
    color: 'orange',
    keywords: ['table', 'data', 'badge', 'avatar', 'chart', 'display'],
    componentCount: 0,
  },
  {
    id: CATEGORY_IDS.FEEDBACK,
    name: 'Feedback',
    icon: 'MessageSquare',
    description: 'Alerts, toasts, progress indicators',
    longDescription:
      'Components for providing feedback to users about system status, actions, and progress, including alerts, toasts, and progress bars.',
    color: 'yellow',
    keywords: ['alert', 'toast', 'notification', 'progress', 'message'],
    componentCount: 0,
  },
  {
    id: CATEGORY_IDS.OVERLAY,
    name: 'Overlay',
    icon: 'Layers',
    description: 'Dialogs, sheets, popovers, and modals',
    longDescription:
      'Overlay components that appear above main content, including modals, dialogs, sheets, popovers, tooltips, and context menus.',
    color: 'red',
    keywords: ['modal', 'dialog', 'popup', 'tooltip', 'sheet', 'drawer'],
    componentCount: 0,
  },
  {
    id: CATEGORY_IDS.OTHER,
    name: 'Other',
    icon: 'Component',
    description: 'Miscellaneous utility components',
    longDescription:
      'Additional utility components that don\'t fit into other categories but provide valuable functionality.',
    color: 'gray',
    keywords: ['utility', 'misc', 'helper', 'tool'],
    componentCount: 0,
  },
] as const;

// ============================================================================
// CATEGORY COLOR SCHEME
// ============================================================================

export const CATEGORY_COLORS: Record<string, { 
  bg: string; 
  text: string; 
  border: string;
  hover: string;
}> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900/50',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-800',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/50',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Retrieves category information by its unique identifier
 * @param id - Category identifier
 * @returns Category info or undefined if not found
 * @example
 * ```ts
 * const category = getCategoryById('forms');
 * console.log(category?.name); // "Forms"
 * ```
 */
export const getCategoryById = (id: string): CategoryInfo | undefined => {
  return categories.find((cat) => cat.id === id);
};

/**
 * Retrieves category name by its identifier
 * @param id - Category identifier
 * @returns Category name or empty string if not found
 */
export const getCategoryName = (id: string): string => {
  return getCategoryById(id)?.name ?? '';
};

/**
 * Retrieves category icon by its identifier
 * @param id - Category identifier
 * @returns Icon name or default icon if not found
 */
export const getCategoryIcon = (id: string): string | LucideIcon => {
  return getCategoryById(id)?.icon ?? 'Component';
};

/**
 * Retrieves category color scheme
 * @param id - Category identifier
 * @returns Tailwind color classes for the category
 */
export const getCategoryColors = (id: string) => {
  const category = getCategoryById(id);
  const colorKey = category?.color ?? 'gray';
  return CATEGORY_COLORS[colorKey];
};

/**
 * Checks if a category exists
 * @param id - Category identifier to check
 * @returns True if category exists, false otherwise
 */
export const categoryExists = (id: string): boolean => {
  return categories.some((cat) => cat.id === id);
};

/**
 * Searches categories by name, description, or keywords
 * @param query - Search query string
 * @returns Array of matching categories sorted by relevance
 */
export const searchCategories = (query: string): CategoryInfo[] => {
  if (!query.trim()) return [...categories];

  const lowerQuery = query.toLowerCase();
  const matches = categories
    .map((cat) => {
      let score = 0;

      // Exact name match
      if (cat.name.toLowerCase() === lowerQuery) score += 100;
      // Name contains query
      else if (cat.name.toLowerCase().includes(lowerQuery)) score += 50;

      // Description match
      if (cat.description.toLowerCase().includes(lowerQuery)) score += 25;

      // Long description match
      if (cat.longDescription?.toLowerCase().includes(lowerQuery)) score += 15;

      // Keywords match
      if (cat.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery))) {
        score += 30;
      }

      return { category: cat, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ category }) => category);

  return matches;
};

/**
 * Gets all category IDs as an array
 * @returns Array of all category identifiers
 */
export const getAllCategoryIds = (): CategoryId[] => {
  return categories.map((cat) => cat.id as CategoryId);
};

/**
 * Gets categories sorted by component count (requires component data)
 * @param componentCounts - Object mapping category IDs to component counts
 * @returns Categories sorted by count in descending order
 */
export const getCategoriesByPopularity = (
  componentCounts: Record<string, number>
): CategoryInfo[] => {
  return [...categories]
    .map((cat) => ({
      ...cat,
      componentCount: componentCounts[cat.id] ?? 0,
    }))
    .sort((a, b) => b.componentCount - a.componentCount);
};

/**
 * Groups categories by a custom property
 * @param groupBy - Property to group by (e.g., 'color')
 * @returns Object with groups as keys and category arrays as values
 */
export const groupCategoriesBy = (
  groupBy: keyof CategoryInfo
): Record<string, CategoryInfo[]> => {
  return categories.reduce(
    (acc, cat) => {
      const key = String(cat[groupBy] ?? 'other');
      if (!acc[key]) acc[key] = [];
      acc[key].push(cat);
      return acc;
    },
    {} as Record<string, CategoryInfo[]>
  );
};

/**
 * Validates if a string is a valid category ID
 * @param id - String to validate
 * @returns True if valid category ID, false otherwise
 */
export const isValidCategoryId = (id: string): id is CategoryId => {
  return Object.values(CATEGORY_IDS).includes(id as CategoryId);
};

// ============================================================================
// STATISTICS & METADATA
// ============================================================================

/**
 * Gets total number of categories
 * @returns Total category count
 */
export const getTotalCategories = (): number => categories.length;

/**
 * Gets category statistics
 * @param componentCounts - Component counts per category
 * @returns Statistics object with various metrics
 */
export const getCategoryStatistics = (
  componentCounts: Record<string, number>
) => {
  const totalComponents = Object.values(componentCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    componentCount: componentCounts[cat.id] ?? 0,
  }));

  const mostPopular = categoriesWithCounts.reduce((prev, curr) =>
    curr.componentCount > prev.componentCount ? curr : prev
  );

  const averageComponents =
    totalComponents / categories.length;

  return {
    totalCategories: categories.length,
    totalComponents,
    averageComponents: Math.round(averageComponents * 10) / 10,
    mostPopularCategory: mostPopular,
    categoriesWithCounts,
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { CategoryInfo } from '@/types/component';
