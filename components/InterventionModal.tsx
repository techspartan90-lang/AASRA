'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { InterventionCategory } from '@/types';
import {
  HeartHandshake,
  Shield,
  Stethoscope,
  Home,
  IndianRupee,
  Scale,
  Briefcase,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface InterventionModalProps {
  caseId: string;
  onClose: () => void;
}

export function InterventionModal({ caseId, onClose }: InterventionModalProps) {
  const { cases, createIntervention } = useApp();
  const targetCase = cases.find(c => c.id === caseId) || cases[0];

  const [category, setCategory] = useState<InterventionCategory>('counselling');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-09-28');
  const [assignedProfessional, setAssignedProfessional] = useState(
    targetCase.assignedCounsellor
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const categories: {
    key: InterventionCategory;
    label: string;
    icon: React.ReactNode;
    defaultTitle: string;
    defaultDesc: string;
  }[] = [
    {
      key: 'counselling',
      label: 'Counselling Support',
      icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
      defaultTitle: 'Trauma Stabilization & Grounding Tele-Counselling',
      defaultDesc: 'Conduct structured 45-minute tele-counselling session focusing on acute anxiety reduction.',
    },
    {
      key: 'protection',
      label: 'Protection Review',
      icon: <Shield className="w-4 h-4 text-rose-500" />,
      defaultTitle: 'District Protection Review & Police Escort Liaison',
      defaultDesc: 'Coordinate with District SP special cell to verify transit safety and provide witness escort.',
    },
    {
      key: 'medical',
      label: 'Medical Assessment',
      icon: <Stethoscope className="w-4 h-4 text-blue-500" />,
      defaultTitle: 'Referral for Qualified Public Health Evaluation',
      defaultDesc: 'Refer to District Civil Hospital psychiatric / medical officer for clinical examination.',
    },
    {
      key: 'relocation',
      label: 'Relocation Support',
      icon: <Home className="w-4 h-4 text-purple-500" />,
      defaultTitle: 'Referral to Authorized Safe Transit Shelter',
      defaultDesc: 'Temporary confidential shelter accommodation under state witness protection scheme.',
    },
    {
      key: 'financial',
      label: 'Financial Assistance',
      icon: <IndianRupee className="w-4 h-4 text-amber-500" />,
      defaultTitle: 'Central Victim Compensation Fund Verification',
      defaultDesc: 'Expedite processing of interim compensation grant via District Legal Services Authority.',
    },
    {
      key: 'legal',
      label: 'Legal Aid Linkage',
      icon: <Scale className="w-4 h-4 text-indigo-500" />,
      defaultTitle: 'Special Public Prosecutor Pre-Trial Briefing',
      defaultDesc: 'Connect with designated PoA legal aid advocate for in-camera deposition preparation.',
    },
    {
      key: 'rehabilitation',
      label: 'Rehabilitation Program',
      icon: <Briefcase className="w-4 h-4 text-teal-500" />,
      defaultTitle: 'Livelihood Training & Welfare Linkage',
      defaultDesc: 'Link with district vocational skill development center and self-help group grant.',
    },
  ];

  const handleSelectCategory = (catKey: InterventionCategory) => {
    setCategory(catKey);
    const cat = categories.find(c => c.key === catKey);
    if (cat) {
      setTitle(cat.defaultTitle);
      setDescription(cat.defaultDesc);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIntervention({
      caseId: targetCase.id,
      category,
      title: title || `${category.toUpperCase()} Intervention`,
      description,
      assignedProfessional,
      scheduledDate,
      status: 'scheduled',
      aiSuggested: false,
    });
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Human Intervention Authorization
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Recommend Support Action · {targetCase.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Intervention Scheduled & Logged
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned caseworker notified and audit record created.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Support Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleSelectCategory(cat.key)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                      category === cat.key
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {cat.icon}
                    <span className="text-xs font-medium truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intervention Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Pre-Trial Anxiety Grounding"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Protocol & Scope
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Specific guidance, coordinator contacts, and protective steps..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Assigned Professional & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Officer / Counsellor
                </label>
                <input
                  type="text"
                  required
                  value={assignedProfessional}
                  onChange={e => setAssignedProfessional(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Execution Date
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Human in the loop confirmation notice */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
              <strong>Human Oversight Requirement:</strong> This action will be authorized under your caseworker credentials and recorded into the immutable judicial welfare audit log.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs min-h-[40px] cursor-pointer"
              >
                Authorize & Schedule Intervention
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
