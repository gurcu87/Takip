import React from 'react';
import { Truck, History, Settings, PlusCircle, Download, Wifi, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppLanguage } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  activeTab: 'new' | 'history' | 'settings';
  setActiveTab: (tab: 'new' | 'history' | 'settings') => void;
  isOnline: boolean;
  historyCount: number;
  language?: AppLanguage;
  onUpdateLanguage?: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  historyCount,
  language = 'tr',
  onUpdateLanguage,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const t = getTranslation(language);

  const toggleLanguage = () => {
    if (onUpdateLanguage) {
      onUpdateLanguage(language === 'de' ? 'tr' : 'de');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner shrink-0 text-white">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                {t.appTitle}
                <span className="hidden sm:inline-block text-xs font-normal bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700/50">
                  {t.appBadge}
                </span>
              </h1>
              <p className="text-xs text-slate-400">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Language Toggle Button */}
            {onUpdateLanguage && (
              <button
                type="button"
                id="btn-header-lang-toggle"
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-xs active:scale-95"
                title={t.langSwitchTitle}
              >
                <span>{language === 'de' ? '🇩🇪' : '🇹🇷'}</span>
                <span className="text-[11px] uppercase tracking-wider font-mono">
                  {language === 'de' ? 'DE' : 'TR'}
                </span>
              </button>
            )}

            {/* Online / Offline status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950/60 text-rose-300 border-rose-800 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.onlineText}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{t.offlineText}</span>
                </>
              )}
            </div>

            {/* PWA Install Button for Android / Desktop */}
            {isInstallable && (
              <button
                id="btn-pwa-install"
                onClick={install}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                title={language === 'de' ? 'App auf Startbildschirm installieren' : 'Android ana ekrana yükle'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.installApp}</span>
                <span className="sm:hidden">{t.installAppShort}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-800">
          <button
            id="tab-btn-new"
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.tabNew}</span>
          </button>

          <button
            id="tab-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer relative ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.tabHistory}</span>
            {historyCount > 0 && (
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-200'
                }`}
              >
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.tabSettings}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
