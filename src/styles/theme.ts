export const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#dbeafe',
    secondary: '#64748b',
    secondaryHover: '#475569',
    success: '#16a34a',
    successLight: '#dcfce7',
    warning: '#d97706',
    warningLight: '#fef3c7',
    danger: '#dc2626',
    dangerLight: '#fee2e2',
    info: '#0891b2',
    infoLight: '#cffafe',

    bg: '#f8fafc',
    bgCard: '#ffffff',
    bgSidebar: '#1e293b',
    bgInput: '#ffffff',

    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    textOnDark: '#f8fafc',
    textOnPrimary: '#ffffff',

    border: '#e2e8f0',
    borderFocus: '#2563eb',
    borderError: '#dc2626',

    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  sidebar: {
    width: '260px',
    collapsedWidth: '64px',
  },
} as const;

export type Theme = typeof theme;
