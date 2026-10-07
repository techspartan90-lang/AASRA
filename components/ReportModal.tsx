'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { STATE_AGGREGATES } from '@/lib/mock-data';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  FileSpreadsheet,
  Download,
  Printer,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

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
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xl rounded-3xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] shadow-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#474747] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center shadow-sm">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 id="report-modal-title" className="text-base font-bold text-white tracking-tight">
                  Statutory Report Generation
                </h3>
                <p className="text-xs text-[#D6D6D6]">
                  Judicial Welfare &amp; Atrocity Victim Monitoring Data Dockets
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#333333] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prototype Watermark Notice */}
          <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(253,16,83,0.30)] text-xs text-[#D6D6D6] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FD1053] shrink-0" />
            <span>
              <strong className="text-white">Protected Prototype Data:</strong> All generated reports contain synthetic demonstration data under judicial privacy protection guidelines.
            </span>
          </div>

          {/* Period Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#D6D6D6]">
              Reporting Period
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase transition cursor-pointer ${
                    period === p
                      ? 'bg-[#FD1053] text-white shadow-sm'
                      : 'bg-[#333333] text-[#D6D6D6] hover:bg-[#474747] hover:text-white'
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
              <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                State Jurisdiction
              </label>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white cursor-pointer focus:outline-none focus:border-[#FD1053]"
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
              <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                Risk Filter
              </label>
              <select
                value={selectedRisk}
                onChange={e => setSelectedRisk(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white cursor-pointer focus:outline-none focus:border-[#FD1053]"
              >
                <option value="All">All Risk Strata</option>
                <option value="high">High Concern Only</option>
                <option value="elevated">Elevated Indicators</option>
                <option value="stable">Stable Maintenance</option>
              </select>
            </div>
          </div>

          {/* Summary Preview Box */}
          <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] text-xs space-y-2">
            <div className="flex justify-between text-[#D6D6D6]">
              <span>Report Title:</span>
              <span className="font-semibold text-white capitalize">
                {period} Victim Well-Being &amp; Intervention Audit Docket
              </span>
            </div>
            <div className="flex justify-between text-[#D6D6D6]">
              <span>Jurisdiction Scope:</span>
              <span className="font-semibold text-white">{selectedState}</span>
            </div>
            <div className="flex justify-between text-[#D6D6D6]">
              <span>Estimated Records:</span>
              <span className="font-semibold text-white">
                {cases.length} active caseload ({cases.length * 12} longitudinal check-ins)
              </span>
            </div>
          </div>

          {exportComplete && (
            <div className="p-3 rounded-xl bg-[#333333] border border-[rgba(255,255,255,0.15)] text-white text-xs font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FD1053]" />
              <span>{exportComplete}</span>
            </div>
          )}

          {/* Export Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <LuxuryButton
              onClick={handleExportCSV}
              variant="secondary"
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4 text-[#FD1053]" />}
              className="text-xs"
            >
              Export CSV
            </LuxuryButton>

            <LuxuryButton
              onClick={handlePrintPDF}
              variant="primary"
              isLoading={isExporting}
              leftIcon={<Printer className="w-4 h-4" />}
              className="text-xs"
            >
              Generate PDF
            </LuxuryButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
