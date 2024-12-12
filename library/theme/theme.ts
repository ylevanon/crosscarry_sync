export const theme = {
  colors: {
    primary: {
      DEFAULT: '#DC1E1E', // The vibrant red from your logo
      light: '#E64646',
      dark: '#B01818',
    },
    neutral: {
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  typography: {
    fonts: {
      regular: 'LemonMilkRegular',
      italic: 'LemonMilkRegularItalic',
      light: 'LemonMilkLight',
      lightItalic: 'LemonMilkLightItalic',
      medium: 'LemonMilkMedium',
      mediumItalic: 'LemonMilkMediumItalic',
      bold: 'LemonMilkBold',
      boldItalic: 'LemonMilkBoldItalic',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  },
} as const;

export type Theme = typeof theme;

// Type helpers
export type ThemeColors = Theme['colors'];
export type ThemeSpacing = Theme['spacing'];
export type ThemeBorderRadius = Theme['borderRadius'];
export type ThemeTypography = Theme['typography'];
