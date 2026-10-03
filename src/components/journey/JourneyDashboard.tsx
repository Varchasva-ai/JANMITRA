import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { JourneyItem, ApplicationStage } from '../../types';
import { DependencyTree } from '../services/DependencyTree';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Edit3, 
  Plus, 
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  trackApplicationNumber, 
  verifyEdistrictCertificate, 
  checkDbtAadhaarSeeding,
  updateUserJourneyStage as apiUpdateStage 
} from '../../utils/apiClient';

export const JourneyDashboard: React.FC<{ onNavigateToService: (serviceId: string) => void }> = ({ onNavigateToService }) => {
  const { language, t } = useLanguage();
  const { journeys, updateJourneyStage, updateJourneyNotes, setActiveTab } = useCitizen();

  const [activeJourneyId, setActiveJourneyId] = useState<string>(journeys[0]?.id || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [tempAppNumber, setTempAppNumber] = useState('');

  // Verified Status Tracking State (Phase 4 Roadmap)
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Government Sandbox Adapter State (Phase 4 Roadmap)
  const [activeSandboxTab, setActiveSandboxTab] = useState<'edistrict' | 'dbt'>('edistrict');
  const [sandboxInput, setSandboxInput] = useState('24151001004829');
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const currentJourney = journeys.find(j => j.id === activeJourneyId) || journeys[0];

  const handleStageChange = async (stage: ApplicationStage) => {
    if (!currentJourney) return;
    updateJourneyStage(currentJourney.id, stage);

    // Synchronize to backend database
    try {
      await apiUpdateStage(currentJourney.id, stage, `Updated to ${stage} by citizen`);
    } catch {
      // Offline fallback
    }

    if (stage === 'approved' || stage === 'completed') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleTrackApplication = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = trackingQuery.trim() || currentJourney?.applicationNumber || 'UP/2026/PMS/884219';
    setIsTracking(true);
    setTrackingResult(null);

    try {
      const res = await trackApplicationNumber(query);
      if (res?.success) {
        setTrackingResult(res);
      }
    } finally {
      setIsTracking(false);
    }
  };

  const handleRunSandboxCheck = async () => {
    setIsSandboxRunning(true);
    setSandboxResult(null);

    try {
      if (activeSandboxTab === 'edistrict') {
        const res = await verifyEdistrictCertificate('income', sandboxInput, 'UP-ED-2024-4829');
        setSandboxResult(res);
      } else {
        const res = await checkDbtAadhaarSeeding(sandboxInput.slice(-4) || '4829');
        setSandboxResult(res);
      }
    } finally {
      setIsSandboxRunning(false);
    }
  };

  const handleSaveNotes = () => {
    if (!currentJourney) return;
    updateJourneyNotes(currentJourney.id, tempNotes, tempAppNumber);
    setEditingNotes(false);
  };

  const stages: Array<{ key: ApplicationStage; label: string }> = [
    { key: 'preparation', label: language === 'hi' ? 'तैयारी (कागज़ात)' : 'Preparation' },
    { key: 'ready_to_apply', label: language === 'hi' ? 'आवेदन हेतु तैयार' : 'Ready to Apply' },
    { key: 'submitted', label: language === 'hi' ? 'जमा किया गया' : 'Submitted' },
    { key: 'under_verification', label: language === 'hi' ? 'सत्यापन प्रक्रियाधीन' : 'Under Verification' },
    { key: 'action_required', label: language === 'hi' ? 'सुधार अपेक्षित' : 'Action Required' },
    { key: 'approved', label: language === 'hi' ? 'स्वीकृत ✓' : 'Approved' },
    { key: 'completed', label: language === 'hi' ? 'लाभ प्राप्त (सफल)' : 'Completed' }
  ];

  if (!currentJourney) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">{t('journey.empty_title')}</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          {t('journey.empty_desc')}
        </p>
        <button
          onClick={() => setActiveTab('discover')}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white font-semibold text-xs shadow-md cursor-pointer"
        >
          {t('journey.discover_cta')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {t('lifecycle.nav')}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span>{language === 'hi' ? 'मेरी आवेदन यात्राएं' : 'My Application Journeys'}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {language === 'hi' ? 'वास्तविक समय में मील के पत्थर की ट्रैकिंग, आवश्यक दस्तावेज़ और आधिकारिक स्थिति।' : 'Real-time milestone tracking, document prerequisite chains, and official status logs.'}
          </p>
        </div>

        {/* Journey Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {journeys.map(j => (
            <button
              key={j.id}
              onClick={() => {
                setActiveJourneyId(j.id);
                setEditingNotes(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeJourneyId === j.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {language === 'hi' ? j.titleHi : j.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Journey Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
        
        {/* Journey Meta & Title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                {language === 'hi' ? 'सक्रिय आवेदन' : 'Active Application'}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'hi' ? 'अपडेट:' : 'Updated:'} {currentJourney.lastUpdated}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? currentJourney.titleHi : currentJourney.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'लक्ष्य:' : 'Goal:'} {currentJourney.goal}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 min-w-[200px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-slate-400 font-medium">{language === 'hi' ? 'आवेदन संदर्भ:' : 'Application Ref:'}</span>
              <span className="font-mono font-bold text-slate-900">
                {currentJourney.applicationNumber || (language === 'hi' ? 'अभी जमा नहीं किया गया' : 'Not submitted yet')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 font-medium">{language === 'hi' ? 'वर्तमान स्थिति:' : 'Current Status:'}</span>
              <span className="font-bold text-brand-700 uppercase text-[11px]">
                {stages.find(s => s.key === currentJourney.status)?.label || currentJourney.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 16: Immediate Next Action Banner */}
        <div className="my-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                {language === 'hi' ? 'नागरिक के लिए अगला कदम:' : 'Next Recommended Citizen Action:'}
              </span>
              <span className="font-semibold text-slate-900 text-sm">
                {language === 'hi' ? currentJourney.nextActionHi : currentJourney.nextAction}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToService('srv-income-cert')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <span>{t('action.proceed')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 17: Interactive Application Stage Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('lifecycle.title')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t('lifecycle.subtitle')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {stages.map(st => {
              const isActive = currentJourney.status === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handleStageChange(st.key)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-700 text-white border-brand-800 font-bold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <span className="text-[11px] block truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 16: Milestone Stepper Timeline */}
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            {t('lifecycle.milestone')}
          </h4>

          <div className="space-y-3">
            {currentJourney.steps.map((st, idx) => {
              const isDone = st.completed;
              const isCurrent = st.current;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : isCurrent 
                      ? 'bg-brand-50/50 border-brand-300 ring-2 ring-brand-500/10' 
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-brand-700 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-slate-900">
                        {language === 'hi' ? st.titleHi : st.title}
                      </h5>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {isDone ? 'Completed' : isCurrent ? 'Active Stage' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'hi' ? st.detailHi : st.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 15: Government Service Dependency Graph */}
        <div className="mb-8">
          <DependencyTree
            schemeTitle={currentJourney.title}
            dependencies={currentJourney.dependencies}
            onResolveService={onNavigateToService}
          />
        </div>

        {/* Notes & Tracking Information */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>{language === 'hi' ? 'व्यक्तिगत नोट्स और आधिकारिक संदर्भ संख्या' : 'Personal Notes & Official Reference ID'}</span>
            </h4>

            {!editingNotes ? (
              <button
                type="button"
                onClick={() => {
                  setTempNotes(currentJourney.notes || '');
                  setTempAppNumber(currentJourney.applicationNumber || '');
                  setEditingNotes(true);
                }}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                {t('action.edit_notes')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {t('action.save_changes')}
              </button>
            )}
          </div>

          {editingNotes ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  {language === 'hi' ? 'आधिकारिक आवेदन संदर्भ संख्या:' : 'Official Application Reference No:'}
                </label>
                <input
                  type="text"
                  value={tempAppNumber}
                  onChange={(e) => setTempAppNumber(e.target.value)}
                  placeholder="E.g. UP-SCH-2026-98124"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  {language === 'hi' ? 'आपके नोट्स / लेखपाल संपर्क:' : 'Your Personal Notes / Lekhpal Contact:'}
                </label>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>{language === 'hi' ? 'नोट्स:' : 'Notes:'}</strong> {currentJourney.notes || (language === 'hi' ? 'अभी कोई नोट्स नहीं जोड़े गए हैं।' : 'No notes added yet.')}</p>
            </div>
          )}
        </div>

      </div>

      {/* Verified Application-Status Tracking (Phase 4 Roadmap) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              {t('tracking.portal_badge')}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              <span>{t('tracking.portal_title')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('tracking.portal_desc')}
            </p>
          </div>
        </div>

        <form onSubmit={handleTrackApplication} className="flex flex-col sm:flex-row items-center gap-2 mb-6">
          <input
            type="text"
            value={trackingQuery}
            onChange={(e) => setTrackingQuery(e.target.value)}
            placeholder={currentJourney?.applicationNumber || (language === 'hi' ? "आवेदन संख्या दर्ज करें (उदा. UP/2026/PMS/884219)" : "Enter Application No. (e.g. UP/2026/PMS/884219)")}
            className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-hidden focus:border-brand-600"
          />
          <button
            type="submit"
            disabled={isTracking}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isTracking ? t('tracking.btn_tracking') : t('tracking.btn_track')}
          </button>
        </form>

        {trackingResult && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-900 block">
                  Ref: {trackingResult.applicationNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {trackingResult.serviceName} • {language === 'hi' ? 'आवेदक:' : 'Applicant:'} {trackingResult.applicantName} ({trackingResult.district})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {language === 'hi' ? `जनहित SLA: अधिकतम ${trackingResult.slaGuarantee?.statutoryLimitDays || 15} दिन` : `Janhit SLA: ${trackingResult.slaGuarantee?.statutoryLimitDays || 15} Days Max`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {language === 'hi' ? 'वैधानिक अंतिम तिथि:' : 'Statutory Deadline:'} {trackingResult.slaGuarantee?.deadlineDate}
                </span>
              </div>
            </div>

            {/* Step-by-Step Timeline */}
            <div className="space-y-3">
              {trackingResult.timeline?.map((step: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    step.status === 'Completed' ? 'bg-emerald-600 text-white' : step.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.status === 'Completed' ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{step.stage}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{step.remarks}</p>
                    <span className="text-[10px] text-brand-700 font-semibold block mt-1">
                      Desk: {step.officer}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{language === 'hi' ? 'प्रथम अपीलीय अधिकारी: उपजिलाधिकारी (एसडीएम)' : 'First Appellate Authority: Sub-Divisional Magistrate (SDM)'}</span>
              <span className="font-mono text-[11px]">{language === 'hi' ? 'डिजिटल मुहर:' : 'Digital Seal:'} {trackingResult.digitalReceipt?.receiptNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Authorized Government Service Adapters Sandbox (Phase 4 Roadmap) */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-400 bg-saffron-400/10 px-2.5 py-0.5 rounded-full border border-saffron-400/20">
              {t('sandbox.badge')}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {t('sandbox.title')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('sandbox.desc')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveSandboxTab('edistrict'); setSandboxInput('24151001004829'); setSandboxResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSandboxTab === 'edistrict' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('sandbox.edistrict_tab')}
            </button>
            <button
              type="button"
              onClick={() => { setActiveSandboxTab('dbt'); setSandboxInput('4829'); setSandboxResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSandboxTab === 'dbt' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('sandbox.dbt_tab')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="w-full sm:w-auto flex-1">
            <label className="text-xs text-slate-400 block mb-1">
              {activeSandboxTab === 'edistrict' ? t('sandbox.cert_label') : t('sandbox.aadhaar_label')}
            </label>
            <input
              type="text"
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <button
            type="button"
            disabled={isSandboxRunning}
            onClick={handleRunSandboxCheck}
            className="w-full sm:w-auto mt-4 sm:mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isSandboxRunning ? t('sandbox.btn_running') : t('sandbox.btn_run')}
          </button>
        </div>

        {sandboxResult && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs font-mono animate-in fade-in">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="font-bold">{language === 'hi' ? 'गेटवे प्रत्युत्तर: 200 OK' : 'Gateway Response: 200 OK'}</span>
              <span className="text-[11px] text-slate-400">{sandboxResult.portal || sandboxResult.gateway}</span>
            </div>
            <pre className="text-slate-300 text-[11px] overflow-x-auto p-3 bg-slate-950 rounded-xl">
              {JSON.stringify(sandboxResult.certificateDetails || sandboxResult.seedingStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
