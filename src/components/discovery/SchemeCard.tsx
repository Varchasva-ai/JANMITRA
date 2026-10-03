import React, { useState, useEffect } from 'react';
import { useLanguage, formatSchemeLevel } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { SchemeEvaluationResult } from '../../utils/matchingEngine';
import { speakText, stopSpeaking, subscribeSpeakingStatus } from '../../utils/speech';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Bookmark, 
  ArrowRight, 
  Building2, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Volume2,
  VolumeX,
  FileCheck2,
  Coins
} from 'lucide-react';

interface SchemeCardProps {
  evaluation: SchemeEvaluationResult;
  onOpenDetails: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ evaluation, onOpenDetails }) => {
  const { language, t } = useLanguage();
  const { savedSchemeIds, toggleSaveScheme, addJourney } = useCitizen();
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const { scheme, overallStatus, ruleEvaluations, matchedRulesCount, totalRulesCount, missingBridges } = evaluation;
  const isSaved = savedSchemeIds.includes(scheme.id);

  useEffect(() => {
    const unsub = subscribeSpeakingStatus((id) => setActiveSpeechId(id));
    return () => unsub();
  }, []);

  // Status styles & clear everyday language for rural users
  const statusBadge = {
    likely_eligible: {
      label: language === 'hi' ? '✓ आपको यह योजना मिल सकती है' : '✓ You May Be Eligible',
      bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      dot: 'bg-emerald-600'
    },
    potentially_eligible: {
      label: language === 'hi' ? '⚠ कागज़ या विवरण बाकी है' : '⚠ Action / Info Needed',
      bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      dot: 'bg-amber-600'
    },
    not_eligible: {
      label: language === 'hi' ? '✕ अभी शर्तें पूरी नहीं हैं' : '✕ Criteria Not Met',
      bg: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
      dot: 'bg-slate-500'
    }
  }[overallStatus];

  const matchedRules = ruleEvaluations.filter(r => r.status === 'match');
  const pendingRules = ruleEvaluations.filter(r => r.status !== 'match');
  const isSpeaking = activeSpeechId === `scheme-${scheme.id}`;

  const handleListenCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const schemeName = language === 'hi' ? scheme.nameHi : scheme.name;
    const benefit = scheme.benefitAmountEstimate || (language === 'hi' ? scheme.benefitTextHi : scheme.benefitText);
    const why = matchedRules.length > 0 ? (language === 'hi' ? matchedRules[0].reasonHi : matchedRules[0].reason) : '';
    
    const speech = language === 'hi'
      ? `${schemeName}। इसका अनुमानित लाभ है: ${benefit}। पात्रता: ${why}`
      : `${schemeName}. Estimated benefit is: ${benefit}. Eligibility: ${why}`;

    speakText(`scheme-${scheme.id}`, speech, language);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 sm:border-2 sm:border-slate-200/90 p-3.5 sm:p-6 hover:border-brand-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between shadow-2xs">
      
      {/* Top Meta & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs border ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusBadge.dot}`}></span>
              <span>{statusBadge.label}</span>
            </span>

            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              {formatSchemeLevel(scheme.level, language)}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Audio Listen Aloud Button */}
            <button
              type="button"
              onClick={handleListenCard}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs font-bold transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isSpeaking 
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-200 animate-pulse' 
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title={language === 'hi' ? 'बोलकर सुनें' : 'Listen aloud'}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <span className="flex items-center gap-1 text-[11px]">
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                </span>
              )}
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleSaveScheme(scheme.id); }}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isSaved 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              title={isSaved ? t('action.saved') : t('action.save')}
            >
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scheme Name & Department */}
        <h3 
          onClick={onOpenDetails}
          className="text-base sm:text-xl font-black text-slate-900 hover:text-brand-700 cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {language === 'hi' ? scheme.nameHi : scheme.name}
        </h3>

        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 mb-2 sm:mb-3">
          <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{language === 'hi' ? scheme.departmentHi : scheme.department}</span>
        </div>

        <p className="text-[11px] sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-2.5 sm:mb-4">
          {language === 'hi' ? scheme.shortDescriptionHi : scheme.shortDescription}
        </p>

        {/* High-Impact Benefit Callout Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 mb-2.5 sm:mb-3.5 flex items-start gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-black uppercase text-emerald-900 tracking-wide block">
              {language === 'hi' ? 'कुल सरकारी लाभ (Benefit):' : 'Government Benefit:'}
            </span>
            <p className="text-xs sm:text-sm font-black text-emerald-950 leading-snug mt-0.5 line-clamp-2">
              {scheme.benefitAmountEstimate || (language === 'hi' ? scheme.benefitTextHi : scheme.benefitText)}
            </p>
          </div>
        </div>

        {/* Scoring & Criteria Breakdown */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2.5 sm:mb-3.5 text-xs">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block uppercase">
              {language === 'hi' ? 'पात्रता मिलान' : 'Statutory Match'}
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className="text-xs sm:text-sm font-black text-slate-900">{evaluation.statutoryMatchPercent}%</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">({matchedRulesCount}/{totalRulesCount})</span>
            </div>
          </div>
          <div className={`p-2 sm:p-2.5 rounded-xl border ${evaluation.documentGapCount === 0 ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'}`}>
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold block uppercase">
              {language === 'hi' ? 'कागज़ात तैयारी' : 'Documents'}
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className={`text-xs sm:text-sm font-black ${evaluation.documentGapCount === 0 ? 'text-emerald-800' : 'text-amber-900'}`}>
                {evaluation.documentReadinessPercent}%
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600 truncate">
                {evaluation.documentGapCount === 0 
                  ? (language === 'hi' ? 'सब तैयार' : 'Ready') 
                  : (language === 'hi' ? `${evaluation.documentGapCount} बाकी` : `${evaluation.documentGapCount} gap`)}
              </span>
            </div>
          </div>
        </div>

        {/* Why you qualify: Compact */}
        <div className="space-y-1 mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
            {language === 'hi' ? 'पात्रता:' : 'Why you qualify:'}
          </span>
          
          {matchedRules.slice(0, 1).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{language === 'hi' ? rule.reasonHi : rule.reason}</span>
            </div>
          ))}

          {/* Pending / Missing Requirements Warning */}
          {pendingRules.slice(0, 1).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1 text-[10px] sm:text-xs text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                <strong>{language === 'hi' ? 'बाकी:' : 'Missing:'}</strong> {language === 'hi' ? rule.reasonHi : rule.reason}
              </span>
            </div>
          ))}
        </div>

        {/* Missing Requirements Bridge Alert */}
        {missingBridges.length > 0 && (
          <div className="mb-3 sm:mb-4 p-2 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] sm:text-xs text-amber-950 flex items-center justify-between gap-1.5">
            <span className="truncate">
              ⚠ <strong>{missingBridges.length}</strong> {language === 'hi' ? 'कागज़ बनवाना होगा' : 'doc(s) needed'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-brand-800 shrink-0 underline">
              {language === 'hi' ? 'तरीका ➔' : 'Steps ➔'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2.5 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenDetails}
          className="flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer min-h-[40px]"
        >
          <span>{language === 'hi' ? 'नियम देखें' : t('results.check_eligibility')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => addJourney(scheme.id)}
          className="py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl border border-slate-300 hover:border-brand-600 bg-white hover:bg-slate-50 text-slate-800 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
        >
          {t('action.start_journey')}
        </button>
      </div>

    </div>
  );
};
