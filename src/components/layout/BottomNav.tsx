import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { Home, Compass, MapPin, FolderCheck, FileText } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, journeys, documents } = useCitizen();

  const navItems = [
    {
      id: 'home' as const,
      label: t('nav.home'),
      icon: Home
    },
    {
      id: 'discover' as const,
      label: t('nav.discover'),
      icon: Compass
    },
    {
      id: 'services' as const,
      label: t('nav.services'),
      icon: FileText
    },
    {
      id: 'journey' as const,
      label: t('nav.journey'),
      icon: MapPin,
      badge: journeys.length > 0 ? journeys.length : undefined
    },
    {
      id: 'documents' as const,
      label: t('nav.documents'),
      icon: FolderCheck,
      badge: documents.filter(d => d.status === 'available').length > 0 ? documents.filter(d => d.status === 'available').length : undefined
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-lg shadow-slate-900/10 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-xl transition-all relative active:scale-95 cursor-pointer ${
                isActive 
                  ? 'text-brand-800 font-bold bg-brand-50/80' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-700 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 leading-tight truncate max-w-full ${isActive ? 'font-bold text-brand-900' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-700 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
