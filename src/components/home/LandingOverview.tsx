import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { 
  Search, 
  HelpCircle, 
  FolderCheck, 
  Navigation, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  FileText,
  Radio
} from 'lucide-react';

export const LandingOverview: React.FC = () => {
  const { language, t } = useLanguage();
  const { setActiveTab } = useCitizen();

  const loopSteps = [
    { num: '01', titleEn: 'My Situation', titleHi: 'मेरी स्थिति', descEn: 'Tell us in everyday words', descHi: 'अपनी जरूरत बताएं' },
    { num: '02', titleEn: 'What Can I Get?', titleHi: 'क्या लाभ संभव है?', descEn: 'Discover relevant schemes', descHi: 'संबंधित योजनाएं खोजें' },
    { num: '03', titleEn: 'Why May I Qualify?', titleHi: 'पात्रता क्यों बनती है?', descEn: 'Evidence-backed criteria match', descHi: 'तथ्यों पर आधारित मिलान' },
    { num: '04', titleEn: 'What Am I Missing?', titleHi: 'क्या कमी है?', descEn: 'Identify document gaps', descHi: 'लापता दस्तावेजों की पहचान' },
    { num: '05', titleEn: 'What Documents Needed?', titleHi: 'कौन से दस्तावेज चाहिए?', descEn: 'Locker gap checklist', descHi: 'दस्तावेज चेकलिस्ट' },
    { num: '06', titleEn: 'How Do I Get Them?', titleHi: 'वे कैसे मिलेंगे?', descEn: 'Link directly to services', descHi: 'सीधे सरकारी सेवाओं से जुड़ें' },
    { num: '07', titleEn: 'What Do I Do Next?', titleHi: 'आगे क्या करें?', descEn: 'Clear next actionable step', descHi: 'सटीक अगला कदम' },
    { num: '08', titleEn: 'Track My Journey', titleHi: 'प्रगति ट्रैक करें', descEn: 'Organize applications', descHi: 'आवेदन स्थिति पर नजर रखें' }
  ];

  const pillars = [
    {
      icon: Search,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      titleEn: 'Discover',
      titleHi: 'खोजें',
      descEn: 'Find potentially relevant benefits based on your age, location, income, and education without needing to know department names.',
      descHi: 'विभाग का नाम जाने बिना अपनी आयु, निवास, आय और शिक्षा के आधार पर संभावित योजनाओं की खोज करें।'
    },
    {
      icon: HelpCircle,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      titleEn: 'Understand',
      titleHi: 'समझें',
      descEn: 'Turn dense bureaucratic gazette circulars into simple human steps with our "Explain This" feature.',
      descHi: 'कठिन सरकारी आदेशों और नियमों को "Explain This" टूल से आम बोलचाल की भाषा में समझें।'
    },
    {
      icon: FolderCheck,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      titleEn: 'Prepare',
      titleHi: 'तैयारी करें',
      descEn: 'Scan your locker to know exactly which certificates are missing or expired before visiting any portal or counter.',
      descHi: 'किसी भी पोर्टल पर जाने से पहले अपने लॉकर की जांच करें कि कौन सा दस्तावेज गायब या एक्सपायर है।'
    },
    {
      icon: Navigation,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      titleEn: 'Navigate',
      titleHi: 'मार्गदर्शन',
      descEn: 'Step-by-step procedures covering where to go, fees, Lekhpal verification, and official portal links.',
      descHi: 'कदम-दर-कदम प्रक्रिया: कहां जाना है, कितना शुल्क है, लेखपाल जांच कैसे होगी, और आधिकारिक लिंक।'
    },
    {
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      titleEn: 'Track',
      titleHi: 'ट्रैक करें',
      descEn: 'Organize active applications across multiple departments in one single unified citizen dashboard.',
      descHi: 'विभिन्न सरकारी विभागों के अपने सभी आवेदनों को एक ही नागरिक डैशबोर्ड में व्यवस्थित रखें।'
    }
  ];

  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-brand-200">
            Citizen-First Operating Philosophy
          </span>
          <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            One place to understand government processes
          </h2>
          <p className="mt-1 sm:mt-2 text-slate-600 text-xs sm:text-base leading-relaxed">
            Citizens should not need to understand administrative bureaucracy to access public services.
          </p>
        </div>

        {/* 5 Core Pillars (Section 31) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3.5 mb-8 sm:mb-14">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 border ${pillar.color}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 sm:mb-1.5">
                    {language === 'hi' ? pillar.titleHi : pillar.titleEn}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {language === 'hi' ? pillar.descHi : pillar.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Fundamental Product Loop (Section 33) */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mb-5 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Differentiator</span>
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              The JanMitra Action Loop
            </h3>
            <p className="mt-1 sm:mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
              We turn your real-life situation into an evidence-backed roadmap with zero guesswork.
            </p>
          </div>

          {/* Loop Stepper Horizontal / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-2.5">
            {loopSteps.map((st, idx) => (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:bg-white/10 transition-colors relative group"
              >
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-saffron-400 block mb-0.5 sm:mb-1">
                    STEP {st.num}
                  </span>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-saffron-300 transition-colors leading-tight">
                    {language === 'hi' ? st.titleHi : st.titleEn}
                  </h4>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 line-clamp-2">
                  {language === 'hi' ? st.descHi : st.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Loop Action */}
          <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Every recommendation is pinned to verified gazettes and official department orders.</span>
            </div>
            <button
              onClick={() => setActiveTab('discover')}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer min-h-[40px]"
            >
              <span>Start Discovery Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vakh Civic Chaupal Feature Callout */}
        <div className="mt-8 sm:mt-14 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider border border-emerald-400/30">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                New: Powered by Vakh.com
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-200">Hyperlocal Community Feed</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              {language === 'hi' ? 'वख जन-चौपाल — जमीनी अपडेट एवं शिविर' : 'Vakh Civic Chaupal — Real-Time Ground Notices'}
            </h3>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              {language === 'hi'
                ? 'तहसील काउंटर की स्थिति, सीएससी शिविर और लेखपाल सत्यापन की वास्तविक सूचनाएं। क्यूरेटेड और मॉडरेटेड: Samentha Massey (@samentha)।'
                : 'Live ground updates on local CSC kiosks, Tehsil verification availability, and welfare camps. Curated by Samentha Massey (@samentha) on Vakh.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('vakh')}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer min-h-[40px]"
            >
              Open Vakh Chaupal
            </button>
            <a
              href="https://vakh.com/@samentha"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <span>@samentha</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* The 5 Questions JanMitra Answers (Section 32) */}
        <div className="mt-8 sm:mt-14 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-8">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base mb-3 sm:mb-4">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <span>5 Core Questions JanMitra Answers for Every Citizen:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-brand-700 block mb-1">1. Relevant Benefits</span>
              <span className="text-slate-600">What government benefits might be relevant to my situation?</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-brand-700 block mb-1">2. Qualification</span>
              <span className="text-slate-600">Why might I qualify based on criteria rules?</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-brand-700 block mb-1">3. Missing Factors</span>
              <span className="text-slate-600">What documents or information am I missing?</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-brand-700 block mb-1">4. Exact Procedure</span>
              <span className="text-slate-600">What exactly do I need to do step-by-step?</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-brand-700 block mb-1">5. Next Immediate Step</span>
              <span className="text-slate-600">What should I do right now to make progress?</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
