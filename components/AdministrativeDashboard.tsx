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
  const exportHistory = useMemo(() => districtStateAnalyticsEngine.getExportAuditHistory(), [exportSuccessMessage]);

  // Role Access Control
  if (!canViewAnalytics()) {
    return (
      <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Administrative Analytics Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Aggregated territorial surveillance and district caseload summaries are restricted to Case Workers, District Welfare Officers, and State/National Administrators.
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
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
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 10: District &amp; State Analytics
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Aggregated Only · Zero Individual GPS
              </span>
            </div>

            <h1
              id="admin-analytics-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Territorial Public Health Surveillance
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-3xl leading-relaxed">
              District and state-level longitudinal metrics. Protects survivor identity by rendering strictly aggregated population health statistics without individual GPS or residence points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Controlled Audit Export</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            FILTER TOOLBAR: State, District, Time Range, Channel, Risk Category
            ===================================================================== */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Administrative Filters:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {/* Filter 1: State */}
            <div>
              <label htmlFor="stateFilterSelect" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">State:</label>
              <select
                id="stateFilterSelect"
                value={filterState}
                onChange={e => {
                  setFilterState(e.target.value);
                  setFilterDistrict('all');
                }}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
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
              <label htmlFor="districtFilterSelect" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">District:</label>
              <select
                id="districtFilterSelect"
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
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
              <label htmlFor="timeRangeFilterSelect" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Time Range:</label>
              <select
                id="timeRangeFilterSelect"
                value={filterTimeRange}
                onChange={e => setFilterTimeRange(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="Year-to-Date">Year-to-Date (2026)</option>
              </select>
            </div>

            {/* Filter 4: Channel */}
            <div>
              <label htmlFor="channelFilterSelect" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Channel:</label>
              <select
                id="channelFilterSelect"
                value={filterChannel}
                onChange={e => setFilterChannel(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
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
              <label htmlFor="riskCategoryFilterSelect" className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Risk Category:</label>
              <select
                id="riskCategoryFilterSelect"
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
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
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
          {[
            { id: 'kpi_trends', label: 'KPIs & Longitudinal Trends', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'map_view', label: 'Aggregated India & District Map', icon: <MapPin className="w-3.5 h-3.5" /> },
            { id: 'district_comparison', label: 'District Comparison Matrix', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'channel_analytics', label: 'Channel & Support Demand', icon: <Radio className="w-3.5 h-3.5" /> },
            { id: 'audit_log', label: 'Export Audit Provenance Log', icon: <History className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer min-h-[40px] ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8 KEY DASHBOARD KPIS (ALWAYS VISIBLE OR PRIMARY IN KPI TAB)
          1. active monitored cases
          2. completed check-ins
          3. follow-up completion
          4. open alerts
          5. resolved alerts
          6. average distress indicator
          7. trend changes
          8. channel usage
          ========================================================================= */}
      <section aria-label="Aggregated KPIs" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {/* KPI 1: Active Monitored Cases */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1. Active Cases</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.activeMonitoredCases}</span>
            <span className="text-[10px] text-slate-400 block font-medium">of {kpis.totalMonitoredCases} total</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">100% anonymized</span>
        </div>

        {/* KPI 2: Completed Check-ins */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">2. Completed Check-ins</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{kpis.completedCheckIns.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Across 5 channels</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Voluntary pulses</span>
        </div>

        {/* KPI 3: Follow-up Completion */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">3. Follow-up SLA</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{kpis.followUpCompletionRate}%</span>
            <span className="text-[10px] text-slate-400 block font-medium">Target: &gt;90%</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Within SLA bounds</span>
        </div>

        {/* KPI 4: Open Alerts */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">4. Open Alerts</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{kpis.openAlerts}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Active human triage</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold">Requires review</span>
        </div>

        {/* KPI 5: Resolved Alerts */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">5. Resolved Alerts</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.resolvedAlerts}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Documented closures</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Audited outcomes</span>
        </div>

        {/* KPI 6: Average Distress Indicator */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">6. Avg Distress</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{kpis.averageDistressIndicator}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Scale: 0–100</span>
          </div>
          <span className="text-[10px] text-blue-700 font-bold">Medium Operational</span>
        </div>

        {/* KPI 7: Trend Changes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">7. Trend Shift</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{kpis.trendChangesPct}%</span>
            <span className="text-[10px] text-slate-400 block font-medium">Month-over-month</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">Eased distress</span>
        </div>

        {/* KPI 8: Channel Usage Top */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">8. Channel Usage</span>
          <div className="my-1.5">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{kpis.channelUsage.chatbot}%</span>
            <span className="text-[10px] text-slate-400 block font-medium">Top: Chatbot</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">SMS: {kpis.channelUsage.sms}% · IVR: {kpis.channelUsage.ivrs}%</span>
        </div>
      </section>

      {/* =========================================================================
          TAB 1: KPIS & LONGITUDINAL TREND ANALYTICS (Weekly & Monthly)
          ========================================================================= */}
      {activeTab === 'kpi_trends' && (
        <section aria-labelledby="longitudinal-trends-heading" className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 id="longitudinal-trends-heading" className="text-xl font-black text-slate-900 dark:text-white">
                  Longitudinal Distress &amp; Volume Trajectories
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Aggregated time-series monitoring population stabilization and judicial milestone correlation.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setTrendHorizon('weekly')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    trendHorizon === 'weekly'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Weekly Trend
                </button>
                <button
                  onClick={() => setTrendHorizon('monthly')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    trendHorizon === 'monthly'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Monthly Trend
                </button>
              </div>
            </div>

            {/* Recharts Area / Line Chart */}
            <div className="w-full h-80 pt-2" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                {trendHorizon === 'weekly' ? (
                  <AreaChart data={weeklyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="adminDistressGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[30, 60]} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="avgDistress" name="Average Distress Indicator" stroke="#6366f1" strokeWidth={3} fill="url(#adminDistressGrad)" />
                  </AreaChart>
                ) : (
                  <BarChart data={monthlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="checkInCount" name="Completed Check-ins" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="activeCases" name="Active Monitored Cases" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: AGGREGATED INDIA & DISTRICT MAP
          "Display aggregated patterns only. Avoid exposing individual survivor locations."
          ========================================================================= */}
      {activeTab === 'map_view' && (
        <section aria-labelledby="map-view-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 id="map-view-heading" className="text-xl font-black text-slate-900 dark:text-white">
                Aggregated Geographic Surveillance (Privacy Preserving)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Mandatory Section 15A protection: Zero individual survivor coordinates or GPS traces are exposed. District centroid clusters only.
              </p>
            </div>
          </div>
          <MapVisualization onSelectDistrict={d => setFilterDistrict(d)} />
        </section>
      )}

      {/* =========================================================================
          TAB 3: DISTRICT COMPARISON MATRIX
          ========================================================================= */}
      {activeTab === 'district_comparison' && (
        <section aria-labelledby="district-comparison-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 id="district-comparison-heading" className="text-xl font-black text-slate-900 dark:text-white">
                Multi-District Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Cross-district surveillance of caseload density, response times, and follow-up completion rates.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="py-3 px-4">District / State</th>
                  <th scope="col" className="py-3 px-4 text-right">Active Caseload</th>
                  <th scope="col" className="py-3 px-4 text-right">Avg Distress</th>
                  <th scope="col" className="py-3 px-4 text-right">Follow-up SLA</th>
                  <th scope="col" className="py-3 px-4 text-right">Median Response</th>
                  <th scope="col" className="py-3 px-4">Primary Channel</th>
                  <th scope="col" className="py-3 px-4 text-right">Critical Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {districtComparisons.map(d => (
                  <tr key={d.district} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{d.district}</span>
                      <span className="text-[10px] text-slate-500">{d.state}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">{d.caseload}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{d.avgDistress}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">{d.followUpRate}%</td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-600 dark:text-indigo-400">{d.medianResponseMins} mins</td>
                    <td className="py-3.5 px-4">{d.topChannel}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{d.criticalCases}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: CHANNEL UTILIZATION, SUPPORT DEMAND & RESPONSE TIME
          ========================================================================= */}
      {activeTab === 'channel_analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel Utilization */}
          <section aria-labelledby="channel-util-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 id="channel-util-heading" className="text-lg font-black text-slate-900 dark:text-white">
              Channel Adoption &amp; Session Volume
            </h2>
            <div className="space-y-3">
              {channelUtilization.map(c => (
                <div key={c.channel} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{c.channel} ({c.preferredLanguage})</span>
                    <span className="font-mono font-bold">{c.percentage}% ({c.sessions.toLocaleString()} sessions)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.percentage}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Avg completion time: {c.avgCompletionSeconds} seconds</span>
                </div>
              ))}
            </div>
          </section>

          {/* Support Demand Surge Patterns & Response Time */}
          <section aria-labelledby="support-demand-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 id="support-demand-heading" className="text-lg font-black text-slate-900 dark:text-white">
                Support Demand &amp; Caseworker Response Time
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-600">
                Median: {responseTimeStats.medianResponseMins} mins
              </span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Surge Triggers:</span>
              {supportDemand.map(item => (
                <div key={item.milestoneTrigger} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.milestoneTrigger}</span>
                    <span className="text-slate-500">{item.caseworkerInterventions} interventions · Avg wait {item.avgWaitTimeMins} mins</span>
                  </div>
                  <span className={`font-mono font-black ${item.demandSurgePct > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {item.demandSurgePct > 0 ? `+${item.demandSurgePct}%` : `${item.demandSurgePct}%`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          TAB 5: EXPORT AUDIT PROVENANCE LOG
          "All exports must be audited."
          ========================================================================= */}
      {activeTab === 'audit_log' && (
        <section aria-labelledby="export-audit-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 id="export-audit-heading" className="text-xl font-black text-slate-900 dark:text-white">
                Export Audit &amp; Data Governance Provenance Log
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Mandatory administrative record logging every aggregate download to enforce compliance with judicial data confidentiality.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
              {exportHistory.length} Audited Operations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="py-3 px-3">Export ID</th>
                  <th scope="col" className="py-3 px-3">Timestamp (UTC)</th>
                  <th scope="col" className="py-3 px-3">Authorized Actor</th>
                  <th scope="col" className="py-3 px-3">Dataset Description</th>
                  <th scope="col" className="py-3 px-3">Format</th>
                  <th scope="col" className="py-3 px-3 text-right">Records</th>
                  <th scope="col" className="py-3 px-3 font-mono">Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {exportHistory.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{entry.id}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono">{entry.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold block">{entry.actor}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{entry.role}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{entry.dataset}</td>
                    <td className="py-3 px-3 font-bold">{entry.exportFormat}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">{entry.recordCount}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{entry.checksum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          CONTROLLED EXPORT MODAL WITH ROLE PERMISSIONS & AUDITING
          ========================================================================= */}
      {isExportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Controlled Aggregate Export
                </h2>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px]">Role Permission Status:</span>
                <p>
                  Authenticated as <strong>{role.toUpperCase()}</strong>. You are authorized to export aggregated statistical tables. Individual survivor records and GPS coordinates are systematically redacted.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Export Format:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CSV', 'PDF', 'JSON'] as ('CSV' | 'PDF' | 'JSON')[]).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        exportFormat === fmt
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">State Filter:</span>
                  <span>{filterState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">District Filter:</span>
                  <span>{filterDistrict}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Range:</span>
                  <span>{filterTimeRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aggregated Cases:</span>
                  <span className="font-bold">{kpis.activeMonitoredCases}</span>
                </div>
              </div>

              {exportSuccessMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{exportSuccessMessage}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer min-h-[40px]"
              >
                Authorize &amp; Download {exportFormat}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
