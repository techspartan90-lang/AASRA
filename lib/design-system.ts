/**
 * PHASE 17: COMPLETE DESIGN SYSTEM & MOTION SYSTEM
 * 
 * Visual Language:
 * - Healthcare (reassurance, safety, clinical calm)
 * - Public Service (statutory authority, democratic transparency)
 * - Trust & Privacy (DPDPA 2023 compliance, cryptographic provenance)
 * - Human Dignity (trauma-informed, anti-stigmatizing language)
 * - Calm Technology (no flashing sirens or panic-inducing counters)
 * 
 * Breakpoints:
 * - Mobile: < 640px (sm)
 * - Tablet: 640px - 1023px (md)
 * - Laptop: 1024px - 1279px (lg)
 * - Desktop: 1280px - 1535px (xl)
 * - Large Desktop: 1536px+ (2xl)
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
    primary: {
      light: '#4f46e5',
      dark: '#818cf8',
      hover: '#4338ca',
    },
    healthcare: {
      emerald: '#059669',
      teal: '#0d9488',
      surface: '#f0fdf4',
      border: '#a7f3d0',
    },
    neutral: {
      pageLight: '#f8fafc',
      pageDark: '#0b1324',
      surfaceLight: '#ffffff',
      surfaceDark: '#121d33',
      borderLight: '#e2e8f0',
      borderDark: '#23324d',
      textPrimaryLight: '#0f172a',
      textPrimaryDark: '#f8fafc',
      textMutedLight: '#475569',
      textMutedDark: '#94a3b8',
    },
    status: {
      low: { text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
      medium: { text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' },
      high: { text: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800' },
      critical: { text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800' },
    },
  },
  typography: {
    hero: 'text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight',
    sectionTitle: 'text-lg sm:text-xl font-bold tracking-tight',
    cardTitle: 'text-sm sm:text-base font-semibold',
    body: 'text-xs sm:text-sm leading-relaxed',
    eyebrow: 'text-[10px] sm:text-xs font-bold uppercase tracking-wider',
    meta: 'text-[11px] text-slate-500 dark:text-slate-400 font-medium',
  },
  radii: {
    control: 'rounded-xl',
    card: 'rounded-2xl sm:rounded-3xl',
    pill: 'rounded-full',
  },
};

// ============================================================================
// 3. FRAMER MOTION TRANSITION PRESETS (RESPECTS REDUCED MOTION)
// ============================================================================

/**
 * Checks if reduced motion is preferred in browser environment.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Page Fade & Gentle Y-Offset Transition
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
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
    y: 10,
  },
  visible: (customIndex: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
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
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: {
      duration: 0.15,
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
 * Standard Reduced-Motion Safe Props Helper
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
