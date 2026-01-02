import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type ShapePreset = 'sharp' | 'rounded' | 'full';
export type SolidStyle = 'color' | 'inverse' | 'contrast';
export type EffectStyle = 'flat' | 'plastic';
export type SurfaceStyle = 'filled' | 'translucent';
export type DataStyle = 'categorical' | 'divergent' | 'sequential';
export type TransitionStyle = 'all' | 'micro' | 'macro' | 'none';
export type NeutralColor = 'slate' | 'gray' | 'zinc';

export interface ColorPalette {
  primary: string;
  accent: string;
  neutral: NeutralColor;
}

export interface ThemeState {
  mode: ThemeMode;
  shape: ShapePreset;
  colors: ColorPalette;
  solidStyle: SolidStyle;
  effectStyle: EffectStyle;
  surface: SurfaceStyle;
  scaling: number;
  dataStyle: DataStyle;
  transition: TransitionStyle;
  depthEffect: boolean;
  noiseEffect: boolean;
  borderWidth: number;
  fieldBaseSize: number;
  selectorBaseSize: number;
}

export interface ThemeContextType {
  theme: ThemeState;
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>;
  updateTheme: (updates: Partial<ThemeState>) => void;
  resetTheme: () => void;
  isSystemDark: boolean;
  effectiveMode: 'light' | 'dark';
  exportTheme: () => string;
  importTheme: (jsonString: string) => boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'theme-customizer' as const;

const RADIUS_MAP: Record<ShapePreset, string> = {
  sharp: '0',
  rounded: '0.5rem',
  full: '9999px',
} as const;

export const DEFAULT_THEME: Readonly<ThemeState> = {
  mode: 'system',
  shape: 'rounded',
  colors: {
    primary: '217 91% 60%',
    accent: '142 76% 36%',
    neutral: 'slate',
  },
  solidStyle: 'color',
  effectStyle: 'flat',
  surface: 'translucent',
  scaling: 100,
  dataStyle: 'categorical',
  transition: 'all',
  depthEffect: false,
  noiseEffect: false,
  borderWidth: 1,
  fieldBaseSize: 4,
  selectorBaseSize: 4,
} as const;

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Loads theme from localStorage with error handling
 */
const loadThemeFromStorage = (): ThemeState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_THEME };

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_THEME, ...parsed };
  } catch (error) {
    console.error('Failed to load theme from storage:', error);
    return { ...DEFAULT_THEME };
  }
};

/**
 * Saves theme to localStorage with error handling
 */
const saveThemeToStorage = (theme: ThemeState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme to storage:', error);
  }
};

/**
 * Checks if user prefers dark mode
 */
const getSystemDarkPreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Applies theme to document root
 */
const applyThemeToDOM = (theme: ThemeState, isSystemDark: boolean): void => {
  const root = document.documentElement;

  // Apply theme mode
  root.classList.remove('light', 'dark');
  const effectiveMode = theme.mode === 'system' 
    ? (isSystemDark ? 'dark' : 'light')
    : theme.mode;
  root.classList.add(effectiveMode);

  // Apply CSS custom properties
  const cssVariables: Record<string, string> = {
    '--radius': RADIUS_MAP[theme.shape],
    '--primary': theme.colors.primary,
    '--accent': theme.colors.accent,
    '--theme-scaling': `${theme.scaling}%`,
    '--border-width': `${theme.borderWidth}px`,
    '--field-base-size': `${theme.fieldBaseSize}`,
    '--selector-base-size': `${theme.selectorBaseSize}`,
  };

  Object.entries(cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Apply data attributes for styling hooks
  root.dataset.shape = theme.shape;
  root.dataset.solidStyle = theme.solidStyle;
  root.dataset.effectStyle = theme.effectStyle;
  root.dataset.surface = theme.surface;
  root.dataset.dataStyle = theme.dataStyle;
  root.dataset.transition = theme.transition;
  root.dataset.depthEffect = String(theme.depthEffect);
  root.dataset.noiseEffect = String(theme.noiseEffect);
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [theme, setTheme] = useState<ThemeState>(loadThemeFromStorage);
  const [isSystemDark, setIsSystemDark] = useState(getSystemDarkPreference);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme changes
  useEffect(() => {
    saveThemeToStorage(theme);
    applyThemeToDOM(theme, isSystemDark);
  }, [theme, isSystemDark]);

  // Calculate effective mode
  const effectiveMode = useMemo<'light' | 'dark'>(() => {
    return theme.mode === 'system' 
      ? (isSystemDark ? 'dark' : 'light')
      : theme.mode;
  }, [theme.mode, isSystemDark]);

  // Actions
  const updateTheme = useCallback((updates: Partial<ThemeState>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme({ ...DEFAULT_THEME });
  }, []);

  const exportTheme = useCallback((): string => {
    return JSON.stringify(theme, null, 2);
  }, [theme]);

  const importTheme = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const validatedTheme = { ...DEFAULT_THEME, ...parsed };
      setTheme(validatedTheme);
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }, []);

  // Context value
  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      updateTheme,
      resetTheme,
      isSystemDark,
      effectiveMode,
      exportTheme,
      importTheme,
    }),
    [theme, updateTheme, resetTheme, isSystemDark, effectiveMode, exportTheme, importTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
