'use client';

import React, { useState } from 'react';
import { DISTRICT_AGGREGATES, DistrictAggregate } from '@/lib/mock-data';
import { ShieldCheck, MapPin, EyeOff, Layers, Users, Activity } from 'lucide-react';

export function MapVisualization({
  onSelectDistrict,
}: {
  onSelectDistrict?: (district: string) => void;
}) {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictAggregate>(
    DISTRICT_AGGREGATES[0]
  );
  const [viewMode, setViewMode] = useState<'aggregate' | 'risk_density'>('aggregate');

  // Relative SVG layout coordinate approximations for regional districts across India
  const districtCoords: Record<string, { x: number; y: number }> = {
    'Kamrup Metropolitan': { x: 380, y: 150 },
    'South 24 Parganas': { x: 320, y: 210 },
    'Mayurbhanj': { x: 300, y: 240 },
    'Ranchi': { x: 270, y: 190 },
    'Muzaffarpur': { x: 260, y: 150 },
    'East Khasi Hills': { x: 410, y: 170 },
    'Madurai': { x: 190, y: 360 },
    'Imphal West': { x: 440, y: 180 },
    'Aizawl': { x: 430, y: 210 },
    'Kokrajhar': { x: 360, y: 140 },
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs">
      {/* Privacy Guarantee Header (Section 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Geographic Aggregate Monitoring (Privacy-Preserving)
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Zero PII
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complies with Section 16 safeguards: exact victim coordinates, residence, and GPS trails are strictly redacted. Only district-level administrative counts are displayed.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('aggregate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'aggregate'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Caseload Volume
          </button>
          <button
            onClick={() => setViewMode('risk_density')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'risk_density'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Elevated Risk Density
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Map Canvas */}
        <div className="lg:col-span-2 relative h-80 sm:h-96 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden">
          {/* Subtle regional boundary silhouettes */}
          <svg viewBox="0 0 520 420" className="w-full h-full max-h-96">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Stylized national boundary outline */}
            <path
              d="M 170 50 Q 230 40 260 70 L 320 120 L 460 160 L 450 240 L 340 230 L 290 270 L 220 380 L 170 320 L 140 220 L 130 140 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="text-slate-300 dark:text-slate-700"
            />

            {/* District Aggregate Bubbles (No exact coordinates, district centroid counts) */}
            {DISTRICT_AGGREGATES.map((dist, idx) => {
              const coords = districtCoords[dist.district] || {
                x: 180 + (idx % 4) * 60,
                y: 120 + Math.floor(idx / 4) * 70,
              };

              const radius =
                viewMode === 'aggregate'
                  ? Math.max(12, Math.min(26, dist.activeCases / 2))
                  : Math.max(10, Math.min(24, dist.elevatedRiskCases * 2.5));

              const isSelected = selectedDistrict.district === dist.district;

              const fillColor =
                viewMode === 'risk_density'
                  ? dist.elevatedRiskCases > 6
                    ? '#f43f5e'
                    : '#f59e0b'
                  : '#10b981';

              return (
                <g
                  key={dist.district}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => {
                    setSelectedDistrict(dist);
                    if (onSelectDistrict) onSelectDistrict(dist.district);
                  }}
                >
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={radius + (isSelected ? 6 : 0)}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                    stroke={fillColor}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 6 : 4}
                    fill={fillColor}
                  />
                  {/* Label */}
                  <text
                    x={coords.x}
                    y={coords.y + radius + 11}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="fill-slate-600 dark:fill-slate-300 pointer-events-none select-none"
                  >
                    {dist.district.split(' ')[0]} ({viewMode === 'aggregate' ? dist.activeCases : dist.elevatedRiskCases})
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Privacy badge pinned on map */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex items-center gap-1.5">
            <EyeOff className="w-3 h-3 text-emerald-500" />
            <span>Strict Geo-Fencing: No Street/Home Coordinates</span>
          </div>
        </div>

        {/* Selected District Details Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                District Overview
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedDistrict.district}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                State: {selectedDistrict.state}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Active Monitored Cases</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDistrict.activeCases}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-amber-500 font-medium">Elevated Indicators</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {selectedDistrict.elevatedRiskCases}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Active Counsellors</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDistrict.counsellorsActive}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Avg Response Time</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedDistrict.avgResponseHours}h
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Interventions Executed: </span>
              {selectedDistrict.interventionsCompleted} welfare & protection actions logged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
