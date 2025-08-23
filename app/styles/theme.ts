// Centralized theme configuration
export const theme = {
  colors: {
    // Base colors
    white: '#ffffff',
    black: '#000000',
    
    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    
    // Primary colors (Blue)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    // Success colors (Green)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    
    // Warning colors (Yellow/Orange)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    
    // Error colors (Red)
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    
    // Info colors (Blue variants)
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    }
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem'
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }]
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  },
  
  animation: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  // Component-specific theme tokens
  components: {
    button: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.625rem 1rem',
        lg: '0.75rem 1.5rem'
      },
      fontSize: {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem'
      }
    },
    
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: '0.5rem 0.75rem',
      borderWidth: '1px',
      focusRing: '2px'
    },
    
    card: {
      padding: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem'
      },
      borderWidth: '1px',
      borderRadius: '0.5rem'
    },
    
    modal: {
      backdropBlur: 'blur(4px)',
      maxWidth: {
        sm: '24rem',
        md: '32rem',
        lg: '48rem',
        xl: '64rem'
      }
    }
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const

// Theme utilities
export const getThemeValue = (path: string) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme)
}

// CSS custom properties for theme integration
export const cssVariables = {
  light: {
    '--color-background': theme.colors.white,
    '--color-foreground': theme.colors.gray[900],
    '--color-muted': theme.colors.gray[100],
    '--color-muted-foreground': theme.colors.gray[500],
    '--color-border': theme.colors.gray[200],
    '--color-input': theme.colors.gray[100],
    '--color-primary': theme.colors.primary[600],
    '--color-primary-foreground': theme.colors.white,
    '--color-secondary': theme.colors.gray[100],
    '--color-secondary-foreground': theme.colors.gray[900],
    '--color-accent': theme.colors.gray[100],
    '--color-accent-foreground': theme.colors.gray[900],
    '--color-destructive': theme.colors.error[600],
    '--color-destructive-foreground': theme.colors.white,
    '--color-success': theme.colors.success[600],
    '--color-warning': theme.colors.warning[600],
    '--color-info': theme.colors.info[600]
  },
  dark: {
    '--color-background': theme.colors.gray[950],
    '--color-foreground': theme.colors.gray[50],
    '--color-muted': theme.colors.gray[800],
    '--color-muted-foreground': theme.colors.gray[400],
    '--color-border': theme.colors.gray[700],
    '--color-input': theme.colors.gray[800],
    '--color-primary': theme.colors.primary[500],
    '--color-primary-foreground': theme.colors.white,
    '--color-secondary': theme.colors.gray[800],
    '--color-secondary-foreground': theme.colors.gray[50],
    '--color-accent': theme.colors.gray[800],
    '--color-accent-foreground': theme.colors.gray[50],
    '--color-destructive': theme.colors.error[500],
    '--color-destructive-foreground': theme.colors.white,
    '--color-success': theme.colors.success[500],
    '--color-warning': theme.colors.warning[500],
    '--color-info': theme.colors.info[500]
  }
}

// Type definitions for theme
export type Theme = typeof theme
export type ThemeColors = keyof typeof theme.colors
export type ColorScale = keyof typeof theme.colors.gray
export type ComponentSize = 'sm' | 'md' | 'lg'