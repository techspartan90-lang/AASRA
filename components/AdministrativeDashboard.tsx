'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  districtStateAnalyticsEngine,
  AnalyticsKPIs,
  WeeklyTrendPoint,
  MonthlyTrendPoint,
  DistrictComparisonData,
  ChannelUtilizationData,
  SupportDemandMetric,
  ExportAuditEntry,
} from '@/lib/district-state-analytics';
import { MapVisualization } from '@/components/MapVisualization';
import {
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  GlassInput,
  PremiumBadge,
} from '@/components/design-system';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Building2,
  Users,
  Activity,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  Layers,
  Calendar,
  Clock,
  Radio,
  MapPin,
  Lock,
  History,
  ShieldCheck,
  CheckCheck,
  Search,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';

export function AdministrativeDashboard({
  onSelectCase,
}: {
  onSelectCase?: (caseId: string) => void;
}) {
  const { role, canViewAnalytics } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'kpi_trends' | 'map_view' | 'district_comparison' | 'channel_analytics' | 'audit_log'>('kpi_trends');

  // Filter toolbar state
  const [filterState, setFilterState] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('Last 30 Days');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Trend sub-tab
  const [trendHorizon, setTrendHorizon] = useState<'weekly' | 'monthly'>('weekly');

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF' | 'JSON'>('CSV');
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Engine data queries
  const kpis: AnalyticsKPIs = useMemo(() => {
    return districtStateAnalyticsEngine.getKPIs(filterState, filterDistrict);
  }, [filterState, filterDistrict]);

  const weeklyTrends = useMemo(() => districtStateAnalyticsEngine.getWeeklyTrends(), []);
  const monthlyTrends = useMemo(() => districtStateAnalyticsEngine.getMonthlyTrends(), []);
  const districtComparisons = useMemo(() => districtStateAnalyticsEngine.getDistrictComparisons(), []);
  const channelUtilization = useMemo(() => districtStateAnalyticsEngine.getChannelUtilization(), []);
  const supportDemand = useMemo(() => districtStateAnalyticsEngine.getSupportDemandMetrics(), []);
  const responseTimeStats = useMemo(() => districtStateAnalyticsEngine.getResponseTimeStats(), []);
  const exportHistory = useMemo(() => {
    return districtStateAnalyticsEngine.getExportAuditHistory();
  }, [exportSuccessMessage]);

  // Role Access Control
  if (!canViewAnalytics()) {
    return (
      <div className="p-8 rounded-3xl bg-[#333333] border border-white/10 text-center space-y-4 text-white">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#FD1053]/15 flex items-center justify-center text-[#FD1053]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Administrative Analytics Restricted
          </h2>
          <p className="text-xs sm:text-sm text-[#D6D6D6] mt-1 max-w-md mx-auto">
            Aggregated territorial surveillance and district caseload summaries are restricted to Case Workers, District Welfare Officers, and State/National Administrators.
          </p>
        </div>
        <p className="text-xs text-[#D6D6D6]">
          To inspect these views, switch your demo role to <strong>District Officer</strong> or <strong>State Admin</strong> in the top navigation.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const actorName = role === 'district_officer' ? 'District Welfare Officer (Kamrup)' : 'State Nodal Administrator';
    const result = districtStateAnalyticsEngine.exportData({
      actor: actorName,
      role,
      datasetName: `Aggregated Surveillance Report (${filterState} / ${filterDistrict})`,
      format: exportFormat,
      filterParams: {
        state: filterState,
        district: filterDistrict,
        timeRange: filterTimeRange,
        channel: filterChannel,
        riskCategory: filterRisk,
      },
      recordCount: kpis.activeMonitoredCases,
    });

    if (result.success) {
      setExportSuccessMessage(`Export authorized & logged: ${result.auditEntry?.id} (${exportFormat})`);
      setTimeout(() => {
        setIsExportModalOpen(false);
        setExportSuccessMessage(null);
      }, 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER & GOVERNANCE GUARANTEE
          ========================================================================= */}
      <section
        aria-labelledby="admin-analytics-heading"
        className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 10: District &amp; State Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#474747]/60 text-emerald-400 border border-emerald-500/30">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Aggregated Only · Zero Individual GPS
              </span>
            </div>

            <h1
              id="admin-analytics-heading"
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Territorial Public Health Surveillance
            </h1>
            <p className="text-sm text-[#D6D6D6] font-medium mt-1 max-w-3xl leading-relaxed">
              District and state-level longitudinal metrics. Protects survivor identity by rendering strictly aggregated population health statistics without individual GPS or residence points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LuxuryButton
              variant="primary"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Controlled Audit Export
            </LuxuryButton>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6D6D6] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#FD1053]" />
            <span>Administrative Filters:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {/* Filter 1: State */}
            <div>
              <label htmlFor="stateFilterSelect" className="font-semibold text-white block mb-1">State:</label>
              <select
                id="stateFilterSelect"
                value={filterState}
                onChange={e => {
                  setFilterState(e.target.value);
                  setFilterDistrict('all');
                }}
                className="w-full p-2.5 rounded-xl bg-[#333333] border border-white/10 text-white font-semibold cursor-pointer"
              >
                <option value="all">All States</option>
                <option value="Assam">Assam</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Bihar">Bihar</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            {/* Filter 2: District */}
            <div>
              <label htmlFor="districtFilterSelect" className="font-semibold text-white block mb-1">District:</label>
              <select
                id="districtFilterSelect"
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#333333] border border-white/10 text-white font-semibold cursor-pointer"
              >
                <option value="all">All Districts</option>
                <option value="Kamrup Rural">Kamrup Rural</option>
                <option value="Sawai Madhopur">Sawai Madhopur</option>
                <option value="Madurai">Madurai</option>
                <option value="Gaya">Gaya</option>
                <option value="Alwar">Alwar</option>
                <option value="South 24 Parganas">South 24 Parganas</option>
              </select>
            </div>

            {/* Filter 3: Time Range */}
            <div>
              <label htmlFor="timeRangeFilterSelect" className="font-semibold text-white block mb-1">Time Range:</label>
              <select
                id="timeRangeFilterSelect"
                value={filterTimeRange}
                onChange={e => setFilterTimeRange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#333333] border border-white/10 text-white font-semibold cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="Year-to-Date">Year-to-Date (2026)</option>
              </select>
            </div>

            {/* Filter 4: Channel */}
            <div>
              <label htmlFor="channelFilterSelect" className="font-semibold text-white block mb-1">Channel:</label>
              <select
                id="channelFilterSelect"
                value={filterChannel}
                onChange={e => setFilterChannel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#333333] border border-white/10 text-white font-semibold cursor-pointer"
              >
                <option value="all">All Channels</option>
                <option value="Chatbot">Chatbot</option>
                <option value="IVRS">IVRS Telephony</option>
                <option value="SMS">SMS Short-Code</option>
                <option value="Mobile App">Mobile Application</option>
                <option value="Web Portal">Web Portal</option>
              </select>
            </div>

            {/* Filter 5: Risk Category */}
            <div>
              <label htmlFor="riskCategoryFilterSelect" className="font-semibold text-white block mb-1">Risk Category:</label>
              <select
                id="riskCategoryFilterSelect"
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#333333] border border-white/10 text-white font-semibold cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'kpi_trends', label: 'KPIs & Longitudinal Trends', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'map_view', label: 'Aggregated India & District Map', icon: <MapPin className="w-3.5 h-3.5" /> },
            { id: 'district_comparison', label: 'District Comparison Matrix', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'channel_analytics', label: 'Channel & Support Demand', icon: <Radio className="w-3.5 h-3.5" /> },
            { id: 'audit_log', label: 'Export Audit Provenance Log', icon: <History className="w-3.5 h-3.5" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-[#FD1053] text-white shadow-lg shadow-[#FD1053]/25'
                    : 'bg-[#474747]/40 text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8 KEY DASHBOARD KPIS
          ========================================================================= */}
      <section aria-label="Aggregated KPIs" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">1. Active Cases</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-white font-mono">{kpis.activeMonitoredCases}</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">of {kpis.totalMonitoredCases} total</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">100% anonymized</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">2. Check-ins</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-white font-mono">{kpis.completedCheckIns.toLocaleString()}</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Across 5 channels</span>
          </div>
          <span className="text-[10px] text-[#D6D6D6] font-medium">Voluntary pulses</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">3. Follow-up SLA</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{kpis.followUpCompletionRate}%</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Target: &gt;90%</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Within SLA bounds</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">4. Open Alerts</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-[#FD1053] font-mono">{kpis.openAlerts}</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Active human triage</span>
          </div>
          <span className="text-[10px] text-[#FD1053] font-bold">Requires review</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">5. Resolved</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-white font-mono">{kpis.resolvedAlerts}</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Documented closures</span>
          </div>
          <span className="text-[10px] text-[#D6D6D6] font-medium">Audited outcomes</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">6. Avg Distress</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-white font-mono">{kpis.averageDistressIndicator}</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Scale: 0–100</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold">Medium Operational</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">7. Trend Shift</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{kpis.trendChangesPct}%</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Month-over-month</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Eased distress</span>
        </LuxuryCard>

        <LuxuryCard className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6D6D6]">8. Top Channel</span>
          <div className="my-1.5">
            <span className="text-base font-bold text-white truncate block">Chatbot ({kpis.channelUsage.chatbot}%)</span>
            <span className="text-[10px] text-[#D6D6D6] block font-medium">Primary access gateway</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Accessible</span>
        </LuxuryCard>
      </section>

      {/* =========================================================================
          VIEW MODE 1: KPIS & LONGITUDINAL TRENDS
          ========================================================================= */}
      {activeTab === 'kpi_trends' && (
        <section aria-labelledby="longitudinal-trends-heading" className="space-y-6">
          <GlassPanel
            title="Longitudinal Distress &amp; Intervention Velocity Trends"
            subtitle="Evaluating population mental distress curves against prompt counsellor resolution."
            action={
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#333333] border border-white/10 text-xs">
                <button
                  onClick={() => setTrendHorizon('weekly')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    trendHorizon === 'weekly' ? 'bg-[#FD1053] text-white shadow-xs' : 'text-[#D6D6D6]'
                  }`}
                >
                  Weekly (8 Wks)
                </button>
                <button
                  onClick={() => setTrendHorizon('monthly')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    trendHorizon === 'monthly' ? 'bg-[#FD1053] text-white shadow-xs' : 'text-[#D6D6D6]'
                  }`}
                >
                  Monthly (6 Mos)
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    trendHorizon === 'weekly'
                      ? weeklyTrends
                      : monthlyTrends.map(m => ({
                          week: m.month,
                          avgDistress: m.averageDistress,
                          resolvedAlerts: Math.round(m.checkInCount * 0.15),
                          checkInVolume: m.checkInCount,
                          supportRequests: m.activeCases,
                        }))
                  }
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="distressGrad" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="5%" stopColor="#FD1053" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FD1053" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="5%" stopColor="#474747" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#474747" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#474747" opacity={0.3} />
                  <XAxis dataKey="period" stroke="#D6D6D6" fontSize={11} />
                  <YAxis stroke="#D6D6D6" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#333333',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="avgDistress"
                    name="Mean Distress Indicator"
                    stroke="#FD1053"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#distressGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolvedAlerts"
                    name="Resolved Interventions"
                    stroke="#D6D6D6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#resolvedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </section>
      )}

      {/* =========================================================================
          VIEW MODE 2: MAP VIEW
          ========================================================================= */}
      {activeTab === 'map_view' && (
        <section aria-labelledby="map-section-heading" className="space-y-4">
          <MapVisualization />
        </section>
      )}

      {/* =========================================================================
          VIEW MODE 3: DISTRICT COMPARISON
          ========================================================================= */}
      {activeTab === 'district_comparison' && (
        <GlassPanel
          title="District Caseload &amp; Vulnerability Matrix"
          subtitle="Comparative surveillance across territorial jurisdictions with zero PII."
        >
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#333333] text-[#D6D6D6] font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Active Cases</th>
                  <th className="py-3 px-4">Mean Distress</th>
                  <th className="py-3 px-4">Open Alerts</th>
                  <th className="py-3 px-4">SLA Rate</th>
                  <th className="py-3 px-4">Vulnerability Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {districtComparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#474747]/30 transition">
                    <td className="py-3 px-4 font-bold text-white">{row.district}</td>
                    <td className="py-3 px-4 text-[#D6D6D6]">{row.state}</td>
                    <td className="py-3 px-4 font-mono text-white">{row.caseload}</td>
                    <td className="py-3 px-4 font-mono text-[#FD1053] font-bold">{row.avgDistress}</td>
                    <td className="py-3 px-4 font-mono text-white">{row.criticalCases}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{row.followUpRate}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.criticalCases > 2 ? 'bg-[#FD1053] text-white' : 'bg-[#474747] text-[#D6D6D6]'
                      }`}>
                        {row.criticalCases > 2 ? 'High Attention' : 'Standard'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          VIEW MODE 4: CHANNEL & DEMAND
          ========================================================================= */}
      {activeTab === 'channel_analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel
            title="Multi-Channel Check-in Distribution"
            subtitle="Adoption and intake volume across authorized channels."
          >
            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#474747" opacity={0.3} />
                  <XAxis dataKey="channel" stroke="#D6D6D6" fontSize={11} />
                  <YAxis stroke="#D6D6D6" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333333', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="checkInCount" name="Check-in Volume" fill="#FD1053" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel
            title="Support Modality Utilization"
            subtitle="Counsellor assistance requests categorized by delivery modality."
          >
            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supportDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#474747" opacity={0.3} />
                  <XAxis dataKey="service" stroke="#D6D6D6" fontSize={11} />
                  <YAxis stroke="#D6D6D6" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#333333', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" name="Support Requests" fill="#D6D6D6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 5: AUDIT LOG PROVENANCE
          ========================================================================= */}
      {activeTab === 'audit_log' && (
        <GlassPanel
          title="Administrative Data Export Audit Ledger"
          subtitle="Immutable record of every territorial dataset extraction."
          badge={<PremiumBadge tone="stable">Audit Provenance</PremiumBadge>}
        >
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#333333] text-[#D6D6D6] font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Export ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Authorizing Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Records</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {exportHistory.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#474747]/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">{entry.id}</td>
                    <td className="py-3 px-4 text-[#D6D6D6] font-mono text-[11px]">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">{entry.actor}</td>
                    <td className="py-3 px-4 text-[#D6D6D6] capitalize">{entry.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#474747] text-white font-mono text-[10px]">
                        {entry.exportFormat}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-white">{entry.recordCount}</td>
                    <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                      ✓ {entry.id.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          CONTROLLED EXPORT MODAL
          ========================================================================= */}
      {isExportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#333333] border border-white/10 p-6 sm:p-8 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Authorized Surveillance Data Export
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-xl text-[#D6D6D6] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-white block">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#474747] border border-white/10 text-white font-semibold cursor-pointer"
                >
                  <option value="CSV">Comma Separated Values (.CSV)</option>
                  <option value="PDF">Certified Audit Document (.PDF)</option>
                  <option value="JSON">Encrypted Telemetry JSON (.JSON)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#474747]/40 border border-white/5 space-y-1 text-[#D6D6D6]">
                <p><strong>Dataset:</strong> Aggregated Public Health Metrics</p>
                <p><strong>Territory:</strong> {filterState} / {filterDistrict}</p>
                <p><strong>Records:</strong> {kpis.activeMonitoredCases} Aggregated Units</p>
                <p className="text-[#FD1053] font-bold">Zero Survivor PII or Exact GPS Included</p>
              </div>

              {exportSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ✓ {exportSuccessMessage}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <LuxuryButton
                variant="ghost"
                size="sm"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={handleExport}
              >
                Authorize &amp; Download
              </LuxuryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
