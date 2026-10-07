'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { InterventionCategory } from '@/types';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
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
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

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
      icon: <HeartHandshake className="w-4 h-4 text-[#FD1053]" />,
      defaultTitle: 'Trauma Stabilization & Grounding Tele-Counselling',
      defaultDesc: 'Conduct structured 45-minute tele-counselling session focusing on acute anxiety reduction.',
    },
    {
      key: 'protection',
      label: 'Protection Review',
      icon: <Shield className="w-4 h-4 text-white" />,
      defaultTitle: 'District Protection Review & Police Escort Liaison',
      defaultDesc: 'Coordinate with District SP special cell to verify transit safety and provide witness escort.',
    },
    {
      key: 'medical',
      label: 'Medical Assessment',
      icon: <Stethoscope className="w-4 h-4 text-[#D6D6D6]" />,
      defaultTitle: 'Referral for Qualified Public Health Evaluation',
      defaultDesc: 'Refer to District Civil Hospital psychiatric / medical officer for clinical examination.',
    },
    {
      key: 'relocation',
      label: 'Relocation Support',
      icon: <Home className="w-4 h-4 text-[#D6D6D6]" />,
      defaultTitle: 'Referral to Authorized Safe Transit Shelter',
      defaultDesc: 'Temporary confidential shelter accommodation under state witness protection scheme.',
    },
    {
      key: 'financial',
      label: 'Financial Assistance',
      icon: <IndianRupee className="w-4 h-4 text-white" />,
      defaultTitle: 'Central Victim Compensation Fund Verification',
      defaultDesc: 'Expedite processing of interim compensation grant via District Legal Services Authority.',
    },
    {
      key: 'legal',
      label: 'Legal Aid Linkage',
      icon: <Scale className="w-4 h-4 text-[#FD1053]" />,
      defaultTitle: 'Special Public Prosecutor Pre-Trial Briefing',
      defaultDesc: 'Connect with designated PoA legal aid advocate for in-camera deposition preparation.',
    },
    {
      key: 'rehabilitation',
      label: 'Rehabilitation Program',
      icon: <Briefcase className="w-4 h-4 text-[#D6D6D6]" />,
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
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intervention-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={e => {
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
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                Human Intervention Authorization
              </span>
              <h3 id="intervention-modal-title" className="text-lg font-bold text-white mt-0.5">
                Recommend Support Action · {targetCase.id}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#333333]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                Intervention Scheduled &amp; Logged
              </h4>
              <p className="text-xs text-[#D6D6D6]">
                Assigned caseworker notified and audit record created.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selection */}
              <div>
                <label className="block text-xs font-semibold text-[#D6D6D6] mb-2">
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
                          ? 'border-[#FD1053] bg-[#333333] text-white shadow-sm'
                          : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] text-[#D6D6D6] hover:bg-[#252525]'
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
                <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                  Intervention Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Pre-Trial Anxiety Grounding"
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                  Detailed Protocol &amp; Scope
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specific guidance, coordinator contacts, and protective steps..."
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white focus:outline-none focus:border-[#FD1053] resize-none"
                />
              </div>

              {/* Assigned Professional & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                    Assigned Officer / Counsellor
                  </label>
                  <input
                    type="text"
                    required
                    value={assignedProfessional}
                    onChange={e => setAssignedProfessional(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6D6D6] mb-1">
                    Scheduled Execution Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1E1E1E] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                  />
                </div>
              </div>

              {/* Human in the loop confirmation notice */}
              <div className="p-3 rounded-xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] text-[11px] text-[#D6D6D6]">
                <strong className="text-white">Human Oversight Requirement:</strong> This action will be authorized under your caseworker credentials and recorded into the immutable judicial welfare audit log.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <LuxuryButton
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                  className="text-xs py-1.5 px-4 min-h-[40px]"
                >
                  Cancel
                </LuxuryButton>
                <LuxuryButton
                  type="submit"
                  variant="primary"
                  className="text-xs py-1.5 px-5 min-h-[40px]"
                >
                  Authorize &amp; Schedule
                </LuxuryButton>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
