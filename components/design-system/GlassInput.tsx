'use client';

import React, { forwardRef } from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#474747] dark:text-[#D6D6D6]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#6B7280] dark:text-[#A3A3A3] flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`glass-input w-full px-4 py-2.5 text-sm sm:text-base outline-hidden transition ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-[#FD1053] focus:ring-2 focus:ring-[#FD1053]/40' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#6B7280] dark:text-[#A3A3A3]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-[#FD1053] flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{hint}</p>
        )}
      </div>
    );
  }
);
GlassInput.displayName = 'GlassInput';

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#474747] dark:text-[#D6D6D6]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`glass-input w-full px-4 py-3 text-sm sm:text-base outline-hidden transition resize-y min-h-[100px] ${
            error ? 'border-[#FD1053] focus:ring-2 focus:ring-[#FD1053]/40' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-[#FD1053] flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{hint}</p>
        )}
      </div>
    );
  }
);
GlassTextarea.displayName = 'GlassTextarea';
