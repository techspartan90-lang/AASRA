'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { STATE_AGGREGATES, DISTRICT_AGGREGATES } from '@/lib/mock-data';
import {
  FileSpreadsheet,
  Download,
  Printer,
  X,
  CheckCircle2,
  Filter,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function ReportModal({ onClose }: { onClose: () => void }) {
  const { cases } = useApp();

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState<string | null>(null);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete('CSV summary exported successfully.');
      setTimeout(() => setExportComplete(null), 4000);
    }, 1200);
  };

  const handlePrintPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete('Printable PDF docket generated.');
      setTimeout(() => setExportComplete(null), 4000);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Statutory Report Generation
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Judicial Welfare & Atrocity Victim Monitoring Data Dockets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Watermark Notice (Section 26) */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Prototype / Demonstration Data:</strong> All generated reports contain synthetic demonstration data under judicial privacy protection guidelines.
          </span>
        </div>

        {/* Period Selector (Section 26) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Reporting Period
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase transition cursor-pointer ${
                  period === p
                    ? 'bg-slate-900 text-white dark:bg-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              State Jurisdiction
            </label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="All">All Jurisdictions (National)</option>
              {STATE_AGGREGATES.map(s => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Risk Filter
            </label>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="All">All Risk Strata</option>
              <option value="high">High Concern Only</option>
              <option value="elevated">Elevated Indicators</option>
              <option value="stable">Stable Maintenance</option>
            </select>
          </div>
        </div>

        {/* Summary Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Report Title:</span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {period} Victim Well-Being & Intervention Audit Docket
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Jurisdiction Scope:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{selectedState}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Estimated Records:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {cases.length} cases (704 nationwide aggregate)
            </span>
          </div>
        </div>

        {exportComplete && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-medium text-center">
            ✓ {exportComplete}
          </div>
        )}

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
