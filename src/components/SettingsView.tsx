import React, { useState } from 'react';
import {
  Save,
  Mail,
  User,
  Building2,
  Trash2,
  Plus,
  Server,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
  HelpCircle,
  SendHorizontal,
  Smartphone,
  Globe,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppLanguage, AppSettings, CompanyItem, EmailSendMethod } from '../types';
import { DEFAULT_COMPANIES } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onUpdateLanguage?: (lang: AppLanguage) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onUpdateLanguage,
}) => {
  const [language, setLanguage] = useState<AppLanguage>(settings.language || 'tr');
  const t = getTranslation(language);

  // Sync if language changes externally (e.g. from header toggle)
  React.useEffect(() => {
    if (settings.language && settings.language !== language) {
      setLanguage(settings.language);
    }
  }, [settings.language]);

  const handleSelectLanguage = (newLang: AppLanguage) => {
    setLanguage(newLang);
    if (onUpdateLanguage) {
      onUpdateLanguage(newLang);
    }
  };

  // Inspector & Shift personnel state (Section 1 - at the top!)
  const [inspectorName, setInspectorName] = useState(settings.inspectorName);
  const [savedInspectors, setSavedInspectors] = useState<string[]>(
    settings.savedInspectors && settings.savedInspectors.length > 0
      ? settings.savedInspectors
      : ['1. Vardiya Görevlisi', '2. Vardiya Görevlisi']
  );
  const [newShiftPersonName, setNewShiftPersonName] = useState('');

  // Email state & sending method ('app' or 'smtp')
  const [emailSendMethod, setEmailSendMethod] = useState<EmailSendMethod>(
    settings.emailSendMethod || 'app'
  );
  const [recipientEmail, setRecipientEmail] = useState(settings.recipientEmail);
  const [ccEmail, setCcEmail] = useState(settings.ccEmail || '');
  const [autoCompress, setAutoCompress] = useState(settings.autoCompress);
  const [maxPhotoDimension, setMaxPhotoDimension] = useState(settings.maxPhotoDimension || 1280);

  // Companies state
  const [companies, setCompanies] = useState<CompanyItem[]>(settings.companies || DEFAULT_COMPANIES);
  const [newCompanyName, setNewCompanyName] = useState('');

  // SMTP state
  const [smtpHost, setSmtpHost] = useState(settings.smtpConfig?.host || '');
  const [smtpPort, setSmtpPort] = useState(settings.smtpConfig?.port || 587);
  const [smtpUser, setSmtpUser] = useState(settings.smtpConfig?.user || '');
  const [smtpPass, setSmtpPass] = useState(settings.smtpConfig?.pass || '');
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [smtpSecure, setSmtpSecure] = useState(settings.smtpConfig?.secure || false);

  // Test state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedBanner, setSavedBanner] = useState(false);

  // Shift personnel management
  const handleSelectShiftPerson = (name: string) => {
    setInspectorName(name);
  };

  const handleAddShiftPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftPersonName.trim()) return;
    const trimmed = newShiftPersonName.trim();
    if (!savedInspectors.includes(trimmed)) {
      setSavedInspectors([...savedInspectors, trimmed]);
    }
    setInspectorName(trimmed);
    setNewShiftPersonName('');
  };

  const handleDeleteShiftPerson = (personToRemove: string) => {
    setSavedInspectors(savedInspectors.filter((p) => p !== personToRemove));
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const newItem: CompanyItem = {
      id: `custom_${Date.now()}`,
      name: newCompanyName.trim(),
      isCustom: true,
    };
    setCompanies([...companies, newItem]);
    setNewCompanyName('');
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((c) => c.id !== id));
  };

  const handleResetCompanies = () => {
    setCompanies(DEFAULT_COMPANIES);
  };

  const handleTestSmtp = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpConfig: {
            host: smtpHost.trim(),
            port: Number(smtpPort),
            user: smtpUser.trim(),
            pass: smtpPass.trim(),
            secure: smtpSecure,
          },
          testRecipient: recipientEmail.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || (language === 'de' ? 'SMTP-Verbindung erfolgreich! Test-E-Mail gesendet.' : 'SMTP sunucu bağlantısı başarılı! Test e-postası iletildi.'),
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || (language === 'de' ? 'Verbindung fehlgeschlagen. Bitte Serverdaten prüfen.' : 'Bağlantı sağlanamadı. Sunucu veya şifrenizi kontrol ediniz.'),
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || (language === 'de' ? 'Keine Serververbindung.' : 'Sunucu ile iletişim kurulamadı.'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      language,
      emailSendMethod,
      inspectorName: inspectorName.trim(),
      savedInspectors,
      recipientEmail: recipientEmail.trim(),
      ccEmail: ccEmail.trim(),
      autoCompress,
      maxPhotoDimension: Number(maxPhotoDimension),
      companies,
      smtpConfig: {
        host: smtpHost.trim(),
        port: Number(smtpPort),
        user: smtpUser.trim(),
        pass: smtpPass.trim(),
        secure: smtpSecure,
      },
    };

    onSaveSettings(updated);
    setSavedBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSavedBanner(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 pb-20">
      {/* Save Success Banner */}
      {savedBanner && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl shadow-xs flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-semibold animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t.savedNotification}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: KONTROL EDEN PERSONEL (EN BAŞTA - VARDİYA KOLAYLIĞI) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border-2 border-blue-500/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                {t.settingsInspectorTitle}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t.settingsInspectorDesc}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
            {language === 'de' ? 'Schicht' : 'Vardiya'}
          </span>
        </div>

        {/* Aktif Personel Adı */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            {t.activeInspectorLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="input-settings-inspector"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            placeholder={language === 'de' ? 'z.B.: Max Mustermann / Schichtleiter' : 'Örn: Ahmet Yılmaz - 1. Vardiya'}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
            required
          />
        </div>

        {/* Hızlı Vardiya Seçim Rozetleri (Quick Presets) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.shiftPresetTitle}</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'de' ? 'Tippen zum Aktivieren' : 'Seçmek için dokunun'}
            </span>
          </div>

          {/* Quick Choice Chips */}
          <div className="flex flex-wrap gap-1.5">
            {savedInspectors.map((person) => {
              const isActive = inspectorName === person;
              return (
                <div
                  key={person}
                  className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <span
                    onClick={() => handleSelectShiftPerson(person)}
                    className="select-none"
                  >
                    {person}
                  </span>
                  {isActive && <Check className="w-3 h-3 text-white shrink-0 ml-0.5" />}
                  {savedInspectors.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteShiftPerson(person);
                      }}
                      className={`p-0.5 rounded-full hover:bg-black/10 transition cursor-pointer ${
                        isActive ? 'text-white' : 'text-slate-400 hover:text-rose-600'
                      }`}
                      title={language === 'de' ? 'Aus Liste entfernen' : 'Listeden çıkar'}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add New Shift Person */}
          <div className="pt-1.5 flex gap-2">
            <input
              type="text"
              value={newShiftPersonName}
              onChange={(e) => setNewShiftPersonName(e.target.value)}
              placeholder={t.addShiftPersonPlaceholder}
              className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddShiftPerson}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnAddPerson}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: DİL SEÇİMİ / SPRACHAUSWAHL (TÜRKÇE & ALMANCA) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                {t.settingsLangTitle}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t.settingsLangDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Türkçe Seçeneği */}
          <div
            onClick={() => handleSelectLanguage('tr')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
              language === 'tr'
                ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label="Türkçe">🇹🇷</span>
              <div>
                <p className="text-xs sm:text-sm font-semibold">Türkçe</p>
                <p className="text-[10px] text-slate-500 font-normal">Varsayılan / Standart</p>
              </div>
            </div>
            {language === 'tr' && (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Deutsch (Almanca) Seçeneği */}
          <div
            onClick={() => handleSelectLanguage('de')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
              language === 'de'
                ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label="Deutsch">🇩🇪</span>
              <div>
                <p className="text-xs sm:text-sm font-semibold">Deutsch</p>
                <p className="text-[10px] text-slate-500 font-normal">Almanca / LKW-Protokoll</p>
              </div>
            </div>
            {language === 'de' && (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: HEDEF E-POSTA ADRESLERİ */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{t.settingsEmailTitle}</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            {language === 'de' ? 'Offizielles Ziel' : 'Resmi Şirket Hedefi'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.recipientEmailLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            id="input-settings-recipient"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="ornek@firma.com"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.ccEmailLabel}
          </label>
          <input
            type="email"
            id="input-settings-cc"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            placeholder="muhasebe@firma.com, depo@firma.com"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: GÖNDERİM REHBERİ & SMTP */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600" />
            <span>{language === 'de' ? 'E-Mail-Versandoptionen & Leitfaden' : 'E-posta Gönderim Seçenekleri ve Rehber'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Telefon Gmail ile Gönderim */}
          <div
            id="opt-email-method-app"
            onClick={() => setEmailSendMethod('app')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 relative ${
              emailSendMethod === 'app'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs sm:text-sm">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{language === 'de' ? '1. Handy-E-Mail (Sofort & Ohne Setup)' : '1. Telefon Gmail ile Gönderim (Hazır & Sıfır Ayar)'}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  emailSendMethod === 'app' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {emailSendMethod === 'app' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'de'
                ? 'Keine Servereinrichtung nötig. Beim Tippen auf "E-Mail senden" öffnet sich Ihre Smartphone-Mail-App mit ausgefüllten Daten.'
                : 'Herhangi bir sunucu ayarı yapmanıza gerek kalmaz. Formda "E-posta Gönder" butonuna bastığınızda telefonunuzdaki Gmail/Mail uygulaması açılır.'}
            </p>
            {emailSendMethod === 'app' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" />
                {language === 'de' ? 'Aktive Methode' : 'Aktif Seçim'}
              </span>
            )}
          </div>

          {/* 2. Arka Planda Otomatik Gönderim (SMTP) */}
          <div
            id="opt-email-method-smtp"
            onClick={() => setEmailSendMethod('smtp')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 relative ${
              emailSendMethod === 'smtp'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                <SendHorizontal className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'de' ? '2. Automatischer Hintergrund-Versand (SMTP)' : '2. Arka Planda Otomatik Gönderim (SMTP)'}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  emailSendMethod === 'smtp' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}
              >
                {emailSendMethod === 'smtp' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'de'
                ? 'Überträgt Protokolle und Fotos automatisch über Ihren Mailserver direkt per Klick ohne externe App.'
                : 'Mail uygulamasını açmadan sistemin arka planda tutanağı ve 4 adet fotoğrafı doğrudan iletmesi için kullanılır.'}
            </p>
            {emailSendMethod === 'smtp' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" />
                {language === 'de' ? 'Aktive Methode' : 'Aktif Seçim'}
              </span>
            )}
          </div>
        </div>

        {/* Gmail Rehberi */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{language === 'de' ? 'Gmail SMTP-Hinweis:' : 'Gmail ile Otomatik Gönderim Yapmak İsteyenler İçin:'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            {language === 'de'
              ? 'Für Gmail aktivieren Sie 2FA in myaccount.google.com und generieren Sie unter "App-Passwörter" ein 16-stelliges Passwort.'
              : 'Google hesabınızda (myaccount.google.com) 2 Adımlı Doğrulama açık olmalı ve "Uygulama Şifreleri" bölümünden alınan 16 haneli şifre girilmelidir.'}
          </p>
        </div>

        {/* SMTP Form Alanları */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                id="input-smtp-host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Port
              </label>
              <input
                type="number"
                id="input-smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                placeholder="587"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'de' ? 'Benutzername / E-Mail' : 'Gönderen E-posta / Kullanıcı'}
              </label>
              <input
                type="text"
                id="input-smtp-user"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="sevk@sirket.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'de' ? 'Passwort / App-Passwort' : 'Şifre / Uygulama Şifresi'}
              </label>
              <div className="relative">
                <input
                  type={showSmtpPass ? 'text' : 'password'}
                  id="input-smtp-pass"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-10 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  id="btn-toggle-smtp-pass"
                  onClick={() => setShowSmtpPass(!showSmtpPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title={showSmtpPass ? (language === 'de' ? 'Passwort verbergen' : 'Şifreyi Gizle') : (language === 'de' ? 'Passwort anzeigen' : 'Şifreyi Göster')}
                  aria-label={showSmtpPass ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
                >
                  {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="smtp-secure-box"
                checked={smtpSecure}
                onChange={(e) => setSmtpSecure(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="smtp-secure-box" className="text-xs text-slate-700 cursor-pointer">
                SSL / TLS
              </label>
            </div>

            <button
              type="button"
              id="btn-test-smtp"
              disabled={isTesting || !smtpHost || !smtpUser || !smtpPass}
              onClick={handleTestSmtp}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {isTesting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{language === 'de' ? 'Wird getestet...' : 'Test Ediliyor...'}</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'de' ? 'SMTP Testen' : 'E-posta Ayarlarını Test Et'}</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: FİRMA LİSTESİ YÖNETİMİ */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{t.settingsCompaniesTitle}</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t.settingsCompaniesDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetCompanies}
            className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            title={language === 'de' ? 'Zurücksetzen' : 'Sıfırla'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'de' ? 'Standard' : 'Sıfırla'}</span>
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder={t.newCompanyInputPlaceholder}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCompany}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Hinzufügen' : 'Ekle'}</span>
          </button>
        </div>

        <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
          {companies.map((comp) => (
            <div
              key={comp.id}
              className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs transition"
            >
              <span className="font-medium text-slate-800">{comp.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteCompany(comp.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                title={language === 'de' ? 'Löschen' : 'Firmayı Sil'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 6: KAMERA & SIKIŞTIRMA */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.settingsPhotoTitle}</span>
          </h2>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-semibold text-slate-800">{t.autoCompressLabel}</p>
            <p className="text-[11px] text-slate-500">{t.autoCompressSub}</p>
          </div>
          <input
            type="checkbox"
            checked={autoCompress}
            onChange={(e) => setAutoCompress(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>
      </section>

      {/* SAVE BUTTON */}
      <div className="sticky bottom-3 z-30">
        <button
          type="submit"
          id="btn-save-settings"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <Save className="w-5 h-5" />
          <span>{t.btnSaveSettings}</span>
        </button>
      </div>
    </form>
  );
};
