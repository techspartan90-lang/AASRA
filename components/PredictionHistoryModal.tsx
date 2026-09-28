'use client';

import React from 'react';
import { X, History, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { INITIAL_PREDICTION_HISTORY, PredictionHistoryRecord } from '@/lib/ai/prediction-history';

interface PredictionHistoryModalProps {
  caseId: string;
  onClose: () => void;
}

export function PredictionHistoryModal({ caseId, onClose }: PredictionHistoryModalProps) {
  const records = INITIAL_PREDICTION_HISTORY.filter(
    (r) => r.caseId.toLowerCase() === caseId.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Prediction History & Observed Trajectories
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Case {caseId} · Algorithmic Trajectory Validation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <strong>Model Verification Audit:</strong> Each historical prediction is compared against the subsequently recorded check-in observation to evaluate trajectory alignment without manipulating historical predictions.
          </div>

          {records.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              No previous automated predictions recorded for this case.
            </p>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {rec.date}
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        Score at Check-in: <strong>{rec.currentIndicator}/100</strong>
                      </span>
                    </div>

                    {rec.alignmentStatus === 'directionally_aligned' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Directionally Aligned
                      </span>
                    )}
                    {rec.alignmentStatus === 'pending_later_checkin' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Subsequent Check-in
                      </span>
                    )}
                    {rec.alignmentStatus === 'divergent' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Divergent Trajectory
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Predicted Trajectory</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {rec.predictedTrajectory}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Model Confidence</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {Math.round(rec.confidence * 100)}% ({rec.uncertainty})
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Later Actual Score</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {rec.actualLaterIndicator !== undefined
                          ? `${rec.actualLaterIndicator}/100`
                          : 'Awaiting event'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Model Version</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono text-[10px]">
                        {rec.modelVersion}
                      </p>
                    </div>
                  </div>

                  {rec.alignmentNotes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                      Note: {rec.alignmentNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Model evaluation and trajectory alignment research records
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-slate-800 dark:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
