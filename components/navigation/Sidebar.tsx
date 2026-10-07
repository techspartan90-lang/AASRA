'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  LogIn,
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
          TOP: BRAND & LUXURY MINIMAL EMBLEM
         ========================================================================= */}
      <div className="flex flex-col border-b border-[#474747]/30 dark:border-white/10 px-3.5 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-3 text-left group cursor-pointer overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-[#FD1053] rounded-xl p-1 transition ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="MANAS SURAKSHA - Mind Protection"
          >
            {/* Minimal Luxury Emblem */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#333333] via-[#474747] to-[#1E1E1E] text-white shadow-md ring-1 ring-white/15 group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD1053] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FD1053] shadow-[0_0_6px_#FD1053]" />
              </span>
            </div>

            {/* Brand Title & Subtitle when expanded */}
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white uppercase truncate">
                    MANAS SURAKSHA
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 text-[11px] text-[#D6D6D6]">
                  <span className="font-medium tracking-wide">Mind Protection</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                    GOV CARE
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
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/15">
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

        {/* Staff Workspaces Section */}
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
      <div className="border-t border-[#474747]/30 dark:border-white/10 bg-[#252525]/60 p-2.5 space-y-2">
        {/* Day / Night Theme Toggle */}
        <ThemeToggle isCollapsed={isCollapsed} />

        {/* Support Scenarios & Reset Trigger */}
        {!isCollapsed ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
              title="Explore Guided Support Scenarios & Realistic Personas"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Support Scenarios</span>
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              title="Reset case information to default baseline"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-[#D6D6D6] hover:text-white border border-white/10 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              title="Support Scenarios (6 Realistic Personas)"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        )}

        {/* User Role / Profile Pill & Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex w-full items-center rounded-xl border border-white/10 bg-white/5 p-1.5 transition hover:bg-white/10 hover:border-[#FD1053]/30 cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title={`Active Role: ${ROLE_LABELS[role]}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FD1053]/15 text-[#FD1053] font-bold text-xs border border-[#FD1053]/30">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">
                    {currentUser?.name || 'Active User'}
                  </p>
                  <p className="text-[10px] text-[#A3A3A3] truncate">
                    {ROLE_LABELS[role]}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronDown className="h-3.5 w-3.5 text-white/50 shrink-0" />
            )}
          </button>

          {/* Quick Role Switcher Dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-white/15 bg-[#252525] p-1.5 shadow-2xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3]">
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
                        ? 'bg-[#FD1053]/15 text-[#FD1053] font-bold'
                        : 'text-[#D6D6D6] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{ROLE_LABELS[r]}</span>
                    {role === r && <span className="h-1.5 w-1.5 rounded-full bg-[#FD1053] shadow-[0_0_6px_#FD1053]" />}
                  </button>
                )
              )}
              <div className="mt-1 pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#FD1053] font-semibold hover:bg-[#FD1053]/10 rounded-lg transition cursor-pointer"
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
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold text-[#A3A3A3] hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition cursor-pointer ${
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
