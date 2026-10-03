import React from 'react';

interface JanMitraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const JanMitraLogo: React.FC<JanMitraLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeMap[size]} relative shrink-0 rounded-full overflow-hidden bg-white p-0.5 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow`}>
        <img 
          src="/logo.png" 
          alt="JanMitra Logo" 
          className="w-full h-full object-contain rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to local assets path if needed
            (e.target as HTMLImageElement).src = '/src/assets/images/janmitra_logo_1791013155976.jpg';
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              JanMitra
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 leading-none">
              जनमित्र
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide">
            Understand. Discover. Apply.
          </span>
        </div>
      )}
    </div>
  );
};
