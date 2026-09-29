'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  CORE_NAVIGATION_ITEMS,
  STAFF_WORKSPACES,
  NavigationItem,
} from './navigation-config';
import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';
import { ThemeToggle } from './ThemeToggle';
import {
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  RotateCcw,
  UserCheck,
  ChevronDown,
  LogIn,
  HeartPulse,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  victim: 'Survivor / Citizen',
  counsellor: 'Welfare Counsellor',
  district_officer: 'District Officer',
  state_admin: 'State Administrator',
  national_admin: 'National Admin',
};

export function Sidebar({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const {
    role,
    setRole,
    currentUser,
    setIsDemoModalOpen,
    resetDemoData,
    setIsLoginModalOpen,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const isStaffRole = role !== 'victim';

  const handleItemClick = (item: NavigationItem) => {
    if (item.id === 'support' && isStaffRole) {
      onNavigate('cases');
    } else {
      onNavigate(item.id);
    }
  };

  // Determine active item id
  const resolveIsActive = (itemId: string) => {
    if (itemId === 'dashboard') {
      return currentView === 'dashboard' || currentView === 'home';
    }
    if (itemId === 'support') {
      return currentView === 'support' || (isStaffRole && currentView === 'cases');
    }
    if (itemId === 'public') {
      return currentView === 'public';
    }
    return currentView === itemId;
  };

  return (
    <aside
      aria-label="Main Navigation Sidebar"
      className={`fixed top-0 left-0 z-30 h-screen glass-sidebar flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-[76px]' : 'w-[272px]'
      }`}
    >
      {/* =========================================================================
          TOP: BRAND & LOGO
         ========================================================================= */}
      <div className="flex flex-col border-b border-[#F1D5DE] dark:border-[#2A2028] px-3.5 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-3 text-left group cursor-pointer overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-[#B91C1C] rounded-xl p-1 transition ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="MANAS SURAKSHA - Mind Protection"
          >
            {/* Brand Logo Emblem */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B91C1C] to-[#991B1B] text-white shadow-md ring-1 ring-[#F1D5DE] dark:from-[#B91C1C] dark:to-[#EC4899] dark:ring-[#2A2028] group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            {/* Brand Title & Subtitle when expanded */}
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-[#111111] dark:text-white uppercase truncate">
                    MANAS SURAKSHA
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 text-[11px] text-[#64748B] dark:text-[#B8B8C2]">
                  <span className="font-medium tracking-wide">Mind Protection</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FFF0F5] text-[#B91C1C] border border-[#F1D5DE] dark:bg-[#1E1420] dark:text-[#F472B6] dark:border-[#3E1F32]">
                    Gov Care
                  </span>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MIDDLE: NAVIGATION ITEMS (SCROLLABLE)
         ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-[#F1D5DE] dark:scrollbar-thumb-[#2A2028]">
        {/* Core 8 Navigation Items */}
        <SidebarSection isCollapsed={isCollapsed}>
          {CORE_NAVIGATION_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={resolveIsActive(item.id)}
              isCollapsed={isCollapsed}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </SidebarSection>

        {/* Staff Workspaces Section (for Caseworkers, Officers, Admins) */}
        {isStaffRole && (
          <SidebarSection title="Clinical & Governance" isCollapsed={isCollapsed}>
            {STAFF_WORKSPACES.map(item => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                isCollapsed={isCollapsed}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </SidebarSection>
        )}
      </div>

      {/* =========================================================================
          BOTTOM: UTILITIES, THEME, DEMO MODE & COLLAPSE TRIGGER
         ========================================================================= */}
      <div className="border-t border-[#F1D5DE] dark:border-[#2A2028] bg-[#FFF7FA]/60 dark:bg-[#0E0E13]/80 p-2.5 space-y-2">
        {/* Day / Night Theme Toggle */}
        <ThemeToggle isCollapsed={isCollapsed} />

        {/* Demo Mode & Scenario Trigger */}
        {!isCollapsed ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 text-xs font-bold transition cursor-pointer"
              title="Launch Guided Demo & 6 Realistic Scenarios"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">Demo Scenarios</span>
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              title="Reset synthetic demo data to default baseline"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-[#F1D5DE] dark:bg-[#17171D] dark:text-slate-200 dark:border-[#2A2028] dark:hover:bg-[#22141F] transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 transition cursor-pointer"
              title="Demo Scenarios (6 Realistic Personas)"
            >
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </button>
          </div>
        )}

        {/* User Role / Profile Pill & Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex w-full items-center rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] p-1.5 transition hover:bg-[#FFF0F5] dark:hover:bg-[#22141F] cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title={`Active Role: ${ROLE_LABELS[role]}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FCE7F3] text-[#B91C1C] dark:bg-[#2A1522] dark:text-[#F472B6] font-bold text-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <p className="text-[11px] font-bold text-[#111111] dark:text-white truncate">
                    {currentUser?.name || 'Active User'}
                  </p>
                  <p className="text-[10px] text-[#64748B] dark:text-[#B8B8C2] truncate">
                    {ROLE_LABELS[role]}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {/* Quick Role Switcher Dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] p-1.5 shadow-xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#B8B8C2]">
                Switch Active Persona
              </div>
              {(['victim', 'counsellor', 'district_officer', 'state_admin', 'national_admin'] as UserRole[]).map(
                r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
                      role === r
                        ? 'bg-[#FCE7F3] text-[#B91C1C] font-bold dark:bg-[#2A1522] dark:text-[#F472B6]'
                        : 'text-[#242424] hover:bg-slate-100 dark:text-[#B8B8C2] dark:hover:bg-[#22141F]'
                    }`}
                  >
                    <span>{ROLE_LABELS[r]}</span>
                    {role === r && <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C] dark:bg-[#EC4899]" />}
                  </button>
                )
              )}
              <div className="mt-1 pt-1 border-t border-[#F1D5DE] dark:border-[#2A2028]">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#B91C1C] dark:text-[#F472B6] font-semibold hover:bg-[#FFF0F5] dark:hover:bg-[#2A1522] rounded-lg transition cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Secure Login Modal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold text-[#64748B] hover:text-[#111111] hover:bg-white dark:text-[#B8B8C2] dark:hover:text-white dark:hover:bg-[#17171D] border border-transparent hover:border-[#F1D5DE] dark:hover:border-[#2A2028] transition cursor-pointer ${
            isCollapsed ? 'px-0' : ''
          }`}
          title={isCollapsed ? 'Expand navigation (Ctrl+[)' : 'Collapse navigation (Ctrl+[)'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span className="truncate">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
