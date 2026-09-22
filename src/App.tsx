import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { AppSettings, ShipmentRecord } from './types';
import { loadSettings, saveSettings, loadHistory, saveToHistory, deleteFromHistory } from './utils/storage';
import { Header } from './components/Header';
import { ShipmentForm } from './components/ShipmentForm';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { ImageViewerModal } from './components/ImageViewerModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'settings'>('new');
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [history, setHistory] = useState<ShipmentRecord[]>(() => loadHistory());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Lightbox Modal
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerTitle, setViewerTitle] = useState('');

  // Top notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast(newSettings.language === 'de' ? 'Einstellungen gespeichert.' : 'Ayarlar başarıyla kaydedildi.');
  };

  const handleUpdateActiveInspector = (inspectorName: string) => {
    const updated = {
      ...settings,
      inspectorName,
    };
    setSettings(updated);
    saveSettings(updated);
    showToast(
      settings.language === 'de'
        ? `Aktiver Prüfer: ${inspectorName}`
        : `Aktif görevli: ${inspectorName}`
    );
  };

  const handleAddNewCompany = (name: string) => {
    const newCompany = {
      id: `comp_${Date.now()}`,
      name,
      isCustom: true,
    };
    const updatedCompanies = [...settings.companies, newCompany];
    const updatedSettings = {
      ...settings,
      companies: updatedCompanies,
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    showToast(`"${name}" eklendi.`);
  };

  const handleUpdateLanguage = (newLang: 'tr' | 'de') => {
    const updated: AppSettings = {
      ...settings,
      language: newLang,
    };
    setSettings(updated);
    saveSettings(updated);
    showToast(newLang === 'de' ? '🇩🇪 Sprache auf Deutsch geändert.' : '🇹🇷 Dil Türkçe olarak güncellendi.');
  };

  const handleRecordCompleted = (record: ShipmentRecord, message: string) => {
    saveToHistory(record);
    setHistory(loadHistory());
    showToast(message);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    showToast(settings.language === 'de' ? 'Datensatz gelöscht.' : 'Sevk kaydı silindi.');
  };

  const handleOpenImageViewer = (url: string, title: string) => {
    setViewerUrl(url);
    setViewerTitle(title);
    setImageViewerOpen(true);
  };

  const handleShareRecord = async (record: ShipmentRecord) => {
    const isDe = settings.language === 'de';
    const summary = isDe
      ? `🚛 LKW-LADE- UND VERSANDPROTOKOLL
Firma: ${record.companyName}
Packliste Nr.: ${record.listNumber}
LKW-Kennzeichen: ${record.tractorPlate.toUpperCase()}
Datum/Uhrzeit: ${record.timestamp}
Prüfer: ${record.inspectorName || 'Rampenpersonal'}
Empfänger: ${record.recipientEmail}`
      : `🚛 TIR YÜKLEME VE SEVK TUTANAĞI
Firma: ${record.companyName}
Malzeme Liste No: ${record.listNumber}
Tır Çekici Plakası: ${record.tractorPlate.toUpperCase()}
Tarih/Saat: ${record.timestamp}
Kontrol Eden: ${record.inspectorName || 'Rampa Görevlisi'}
Alıcı E-posta: ${record.recipientEmail}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${isDe ? 'LKW-Protokoll' : 'Tır Sevk'} - ${record.tractorPlate.toUpperCase()}`,
          text: summary,
        });
      } catch (e) {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(summary);
        showToast(isDe ? 'Protokoll kopiert.' : 'Tutanak panoya kopyalandı.');
      } catch (e) {
        // fallback
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-2">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        historyCount={history.length}
        language={settings.language}
        onUpdateLanguage={handleUpdateLanguage}
      />

      {/* PWA Install Notification Banner for Android Mobile */}
      {isInstallable && !isInstalled && (
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-3.5 py-2.5 shadow-md flex items-center justify-between gap-2.5 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-xs sm:text-sm truncate">
                {settings.language === 'de' ? 'App auf Startbildschirm installieren' : 'Uygulamayı Telefona Yükle'}
              </p>
              <p className="text-[11px] text-blue-100 truncate">
                {settings.language === 'de' ? 'Klicken für Vollbildmodus & Offline' : 'Tam ekran ve hızlı açılış için yükleyin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-banner-install-pwa"
            onClick={install}
            className="shrink-0 bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-900 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
          >
            {settings.language === 'de' ? 'Installieren' : 'Yükle'}
          </button>
        </div>
      )}

      {/* Main Container - Optimized for Android Mobile Viewport */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-5">
        {activeTab === 'new' && (
          <ShipmentForm
            settings={settings}
            onRecordCompleted={handleRecordCompleted}
            onOpenImageViewer={handleOpenImageViewer}
            onAddNewCompany={handleAddNewCompany}
            onUpdateActiveInspector={handleUpdateActiveInspector}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onDeleteRecord={handleDeleteHistoryRecord}
            onOpenImageViewer={handleOpenImageViewer}
            onShareRecord={handleShareRecord}
            language={settings.language}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onUpdateLanguage={handleUpdateLanguage}
          />
        )}
      </main>

      {/* Full-screen Lightbox Image Viewer */}
      <ImageViewerModal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageUrl={viewerUrl}
        title={viewerTitle}
      />
    </div>
  );
}
