/**
 * MANAS SURAKSHA DESIGN SYSTEM TOKENS & VISUAL ENGINE
 * 
 * Core Palette:
 * - Primary Graphite: #474747
 * - Deep Charcoal: #333333
 * - Signature Accent: #FD1053
 * 
 * Supporting Palette:
 * - Light surfaces: #F7F7F8, #F2F2F3, #FFFFFF
 * - Dark surfaces: #252525, #1E1E1E, #151515
 * - Text on dark: #FFFFFF, #F5F5F5, #D6D6D6
 * - Text on light: #333333, #474747
 * - Borders: rgba(71,71,71,0.15)
 * - Accent border: rgba(253,16,83,0.35)
 * - Accent glow: rgba(253,16,83,0.25)
 */

import { Variants } from 'framer-motion';

// ============================================================================
// 1. RESPONSIVE BREAKPOINT CONSTANTS
// ============================================================================
export const BREAKPOINTS = {
  mobile: 640,       // sm
  tablet: 1024,      // md / lg threshold
  laptop: 1280,      // lg / xl threshold
  desktop: 1536,     // xl / 2xl threshold
  largeDesktop: 1920,
} as const;

export type BreakpointKey = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'largeDesktop';

// ============================================================================
// 2. DESIGN SYSTEM COLOR & TYPOGRAPHY TOKENS
// ============================================================================
export const DESIGN_TOKENS = {
  colors: {
    // Primary Luxury Identity
    graphite: '#474747',
    charcoal: '#333333',
    accent: '#FD1053',
    accentGlow: 'rgba(253, 16, 83, 0.25)',
    accentBorder: 'rgba(253, 16, 83, 0.35)',
    accentSubtleBg: 'rgba(253, 16, 83, 0.10)',

    // Backwards-compatible aliases for existing components & tests
    primary: {
      light: '#FD1053',
      dark: '#FD1053',
      hover: '#e00b46',
    },
    healthcare: {
      emerald: '#059669',
      teal: '#0d9488',
      surface: '#f0fdf4',
      border: '#a7f3d0',
    },
    neutral: {
      pageLight: '#F7F7F8',
      pageDark: '#151515',
      surfaceLight: '#FFFFFF',
      surfaceDark: '#1E1E1E',
      borderLight: 'rgba(71,71,71,0.15)',
      borderDark: 'rgba(255,255,255,0.10)',
      textPrimaryLight: '#333333',
      textPrimaryDark: '#FFFFFF',
      textMutedLight: '#474747',
      textMutedDark: '#D6D6D6',
    },

    // Surfaces
    surface: {
      lightBg: '#F7F7F8',
      lightElevated: '#FFFFFF',
      lightCard: '#F2F2F3',
      darkBg: '#151515',
      darkElevated: '#252525',
      darkCard: '#1E1E1E',
      darkPrimary: '#333333',
      darkSecondary: '#474747',
    },

    // Typography
    text: {
      lightPrimary: '#333333',
      lightSecondary: '#474747',
      lightMuted: '#6B7280',
      darkPrimary: '#FFFFFF',
      darkSecondary: '#F5F5F5',
      darkMuted: '#D6D6D6',
    },

    // Borders
    border: {
      light: 'rgba(71, 71, 71, 0.15)',
      dark: 'rgba(255, 255, 255, 0.10)',
      darkGraphite: 'rgba(71, 71, 71, 0.40)',
      accent: 'rgba(253, 16, 83, 0.35)',
    },

    // Status Levels
    status: {
      elevated: {
        text: 'text-[#FD1053]',
        bg: 'bg-[#FD1053]/10',
        border: 'border-[#FD1053]/35',
        dot: 'bg-[#FD1053]',
      },
      critical: {
        text: 'text-[#FD1053]',
        bg: 'bg-[#FD1053]/10',
        border: 'border-[#FD1053]/35',
        dot: 'bg-[#FD1053]',
      },
      high: {
        text: 'text-[#FD1053]',
        bg: 'bg-[#FD1053]/10',
        border: 'border-[#FD1053]/35',
        dot: 'bg-[#FD1053]',
      },
      medium: {
        text: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      },
      stable: {
        text: 'text-[#474747] dark:text-[#D6D6D6]',
        bg: 'bg-[#474747]/10 dark:bg-white/5',
        border: 'border-[#474747]/20 dark:border-white/10',
        dot: 'bg-[#474747] dark:bg-[#D6D6D6]',
      },
      low: {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      },
    },
  },

  typography: {
    hero: 'text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight',
    sectionTitle: 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight',
    cardTitle: 'text-base sm:text-lg font-semibold',
    body: 'text-sm sm:text-base leading-relaxed',
    meta: 'text-xs sm:text-sm font-medium',
    eyebrow: 'text-[11px] font-bold uppercase tracking-wider',
  },

  radii: {
    control: 'rounded-xl',
    card: 'rounded-2xl sm:rounded-3xl',
    pill: 'rounded-full',
  },

  shadows: {
    soft: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
    darkElevated: '0 10px 30px -5px rgba(0, 0, 0, 0.45)',
    accentGlow: '0 0 25px -4px rgba(253, 16, 83, 0.35)',
  },
};

// ============================================================================
// 3. FRAMER MOTION TRANSITION PRESETS (RESPECTS REDUCED MOTION)
// ============================================================================

export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Luxury Smooth Page Fade & Gentle Y-Offset Transition
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

/**
 * Card Staggered Entrance Variants
 */
export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (customIndex: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: customIndex * 0.04,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * Modal Dialog Spring & Backdrop Fade
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

export const modalDialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: {
      duration: 0.16,
      ease: 'easeIn',
    },
  },
};

/**
 * Chart Container Smooth Transition
 */
export const chartTransitionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * Safe Props Helper for Framer Motion
 */
export function getSafeMotionProps(variants: Variants) {
  if (isReducedMotionPreferred()) {
    return {
      initial: { opacity: 1, y: 0, scale: 1 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0 },
    };
  }
  return {
    variants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
  };
}
