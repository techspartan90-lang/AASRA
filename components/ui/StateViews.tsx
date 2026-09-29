'use client';

import React, { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  WifiOff,
  FolderOpen,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 1. LOADING STATE COMPONENT
// ============================================================================
export interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export function LoadingState({
  message = 'Securing clinical context and encrypting transmission...',
  subMessage = 'Please wait while we verify authentication and session integrity.',
  size = 'md',
  fullPage = false,
}: LoadingStateProps) {
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto"
    >
      <div className="relative flex items-center justify-center">
        <Loader2
          className={`${spinnerSizes[size]} text-emerald-600 dark:text-emerald-400 animate-spin`}
          aria-hidden="true"
        />
        <span className="sr-only">Loading content...</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {message}
        </h3>
        {subMessage && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
}

// ============================================================================
// 2. EMPTY STATE COMPONENT
// ============================================================================
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title = 'No Records Currently Available',
  description = 'There are no active records matching the selected filters or timeframe.',
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/40"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto shadow-xs">
        {icon || <FolderOpen className="w-7 h-7" aria-hidden="true" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. ERROR STATE COMPONENT (NEVER EXPOSES RAW STACK TRACES TO USERS)
// ============================================================================
export interface ErrorStateProps {
  title?: string;
  userMessage?: string;
  errorReferenceId?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export function ErrorState({
  title = 'Unable to Complete Request',
  userMessage = 'A temporary service interruption occurred while processing your request. Your confidential case records remain secure and uncompromised.',
  errorReferenceId,
  onRetry,
  onGoHome,
}: ErrorStateProps) {
  const generatedId = React.useId().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const refId = errorReferenceId || `ERR-${generatedId || 'SEC404'}`;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-6 sm:p-8 max-w-lg mx-auto space-y-4 text-center shadow-xs"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {userMessage}
        </p>
      </div>

      {/* Sanitized reference without exposing any server stack trace */}
      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 inline-block">
        Incident Reference: <span className="font-bold text-slate-700 dark:text-slate-300">{refId}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. SUCCESS STATE COMPONENT
// ============================================================================
export interface SuccessStateProps {
  title?: string;
  message?: string;
  confirmationCode?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessState({
  title = 'Action Successfully Completed',
  message = 'Your submission has been securely recorded and protected in accordance with privacy policies.',
  confirmationCode,
  actionLabel = 'Continue',
  onAction,
}: SuccessStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 sm:p-8 max-w-lg mx-auto space-y-4 text-center shadow-xs"
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {confirmationCode && (
        <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40 py-1 px-3 rounded-xl inline-block font-semibold">
          Receipt: {confirmationCode}
        </div>
      )}

      {onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. OFFLINE STATE & OFFLINE BANNER COMPONENT
// ============================================================================
export interface OfflineStateProps {
  onRetry?: () => void;
  cachedItemsCount?: number;
}

export function OfflineState({ onRetry, cachedItemsCount = 0 }: OfflineStateProps) {
  return (
    <div
      role="region"
      aria-label="Offline Mode Active"
      className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 p-6 sm:p-8 max-w-lg mx-auto space-y-4 text-center shadow-xs"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
        <WifiOff className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Offline Mode Active
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          You are currently disconnected from the network. Any check-ins or notes you enter are saved safely on this device and will automatically sync when connectivity is restored.
        </p>
      </div>

      {cachedItemsCount > 0 && (
        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{cachedItemsCount} encrypted items stored locally</span>
        </div>
      )}

      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold mx-auto transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Connectivity</span>
          </button>
        </div>
      )}
    </div>
  );
}

function subscribeOnlineStatus(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return typeof window !== 'undefined' ? !window.navigator.onLine : false;
}

/**
 * Universal Non-Intrusive Offline Sticky Banner
 */
export function OfflineBanner() {
  const isOffline = React.useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    () => false
  );

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="w-full bg-[#FFF7FA] text-[#111111] dark:bg-[#111116] dark:text-white px-4 py-2 text-xs flex items-center justify-center gap-2 border-b border-[#F1D5DE] dark:border-[#2A2028] shadow-xs"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#F472B6] animate-pulse" />
      <span className="font-bold">Offline Mode:</span>
      <span className="text-[#64748B] dark:text-[#B8B8C2]">
        You are working offline. Your changes are safely cached in encrypted local storage.
      </span>
    </div>
  );
}
