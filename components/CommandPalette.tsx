'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  Search,
  X,
  FileText,
  Shield,
  PhoneCall,
  Mic,
  Users,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '@/types';

interface CommandPaletteProps {
  onSelectCase: (caseId: string) => void;
  onNavigate: (view: string) => void;
}

export function CommandPalette({ onSelectCase, onNavigate }: CommandPaletteProps) {
  const {
    cases,
    alerts,
    setRole,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    setIsReportModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredCases = cases.filter(c =>
    c.id.toLowerCase().includes(query.toLowerCase()) ||
    c.anonymizedCode.toLowerCase().includes(query.toLowerCase()) ||
    c.district.toLowerCase().includes(query.toLowerCase()) ||
    c.assignedCounsellor.toLowerCase().includes(query.toLowerCase()) ||
    c.priorityReason.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search input bar */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a case ID, district, officer, or action..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-3 py-4 text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder-slate-400"
          />
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1.5 ml-2 text-slate-400 hover:text-slate-600 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Quick Action Shortcuts */}
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            System Shortcuts
          </div>

          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsVoiceAssistantOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Mic className="w-4 h-4 text-purple-500" />
              <span>Launch Multilingual Voice Assistant (10 Languages)</span>
            </div>
            <span className="text-[10px] text-slate-400">Audio UI</span>
          </button>

          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsEmergencyModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-rose-500" />
              <span>Access 24/7 Emergency Helplines (112 / Tele-MANAS)</span>
            </div>
            <span className="text-[10px] text-slate-400">Emergency</span>
          </button>

          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsReportModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Generate Periodic Welfare & Audit Report</span>
            </div>
            <span className="text-[10px] text-slate-400">Reports</span>
          </button>

          {/* Cases Results */}
          <div className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Cases ({filteredCases.length})
          </div>

          {filteredCases.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => {
                setIsCommandPaletteOpen(false);
                onSelectCase(c.id);
                onNavigate('cases');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {c.id}
                  </span>
                  <span className="text-[11px] text-slate-400">({c.anonymizedCode})</span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                    {c.stage}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                  {c.district} · {c.assignedCounsellor.split(' (')[0]}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                  {c.currentScore}/100
                </span>
                <span className="block text-[10px] text-slate-400 uppercase">{c.riskLevel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
