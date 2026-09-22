import React, { useState, useEffect } from 'react';
import {
  Mail,
  Share2,
  Trash2,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Users,
  FileText,
  ChevronDown,
  SendHorizontal,
  Smartphone,
} from 'lucide-react';
import { AppSettings, PhotoFieldKey, ShipmentRecord } from '../types';
import { CompanySelector } from './CompanySelector';
import { PhotoUploadSlot } from './PhotoUploadSlot';
import { loadDraft, saveDraft, clearDraft } from '../utils/storage';
import { getTranslation } from '../utils/translations';
import { buildEmailSubject, buildEmailPlainText } from '../utils/emailTemplates';

interface ShipmentFormProps {
  settings: AppSettings;
  onRecordCompleted: (record: ShipmentRecord, message: string) => void;
  onOpenImageViewer: (url: string, title: string) => void;
  onAddNewCompany: (name: string) => void;
  onUpdateActiveInspector?: (name: string) => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  settings,
  onRecordCompleted,
  onOpenImageViewer,
  onAddNewCompany,
  onUpdateActiveInspector,
}) => {
  const language = settings.language || 'tr';
  const t = getTranslation(language);

  // Form States - Initialize synchronously from saved draft so page reloads on Android never lose data
  const [initialDraft] = useState(() => loadDraft());

  const [companyName, setCompanyName] = useState(() => initialDraft?.companyName || '');
  const [listNumber, setListNumber] = useState(() => initialDraft?.listNumber || '');
  const [tractorPlate, setTractorPlate] = useState(() => initialDraft?.tractorPlate || '');
  const [notes, setNotes] = useState(() => initialDraft?.notes || '');
  const [currentInspector, setCurrentInspector] = useState(settings.inspectorName);
  const [showShiftPicker, setShowShiftPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [photos, setPhotos] = useState<{
    plate?: string;
    frontCargo?: string;
    rearCargo?: string;
    packingList?: string;
  }>(() => initialDraft?.photos || {});

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Keep inspector in sync when settings update
  useEffect(() => {
    setCurrentInspector(settings.inspectorName);
  }, [settings.inspectorName]);

  // Synchronous auto-save draft whenever state changes
  useEffect(() => {
    saveDraft({
      companyName,
      listNumber,
      tractorPlate,
      notes,
      photos,
    });
  }, [companyName, listNumber, tractorPlate, notes, photos]);

  const flushDraftNow = () => {
    saveDraft({
      companyName,
      listNumber,
      tractorPlate,
      notes,
      photos,
    });
  };

  const handlePhotoChange = (key: PhotoFieldKey, dataUrl?: string) => {
    setPhotos((prev) => {
      const updated = {
        ...prev,
        [key]: dataUrl,
      };
      saveDraft({
        companyName,
        listNumber,
        tractorPlate,
        notes,
        photos: updated,
      });
      return updated;
    });
  };

  const handleExecuteReset = () => {
    setCompanyName('');
    setListNumber('');
    setTractorPlate('');
    setNotes('');
    setPhotos({});
    clearDraft();
    setErrorMessage(null);
    setSuccessBanner(null);
    setShowResetConfirm(false);
  };

  // Validate required fields
  const validateForm = (): boolean => {
    const missing: string[] = [];
    if (!companyName.trim()) missing.push(t.companyRequired);
    if (!listNumber.trim()) missing.push(t.listNumberRequired);
    if (!tractorPlate.trim()) missing.push(t.plateRequired);

    // 4 mandatory photos
    if (!photos.plate) missing.push(t.photo1Required);
    if (!photos.frontCargo) missing.push(t.photo2Required);
    if (!photos.rearCargo) missing.push(t.photo3Required);
    if (!photos.packingList) missing.push(t.photo4Required);

    if (missing.length > 0) {
      setErrorMessage(`${t.missingFieldsAlert}\n• ${missing.join('\n• ')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    if (!settings.recipientEmail) {
      setErrorMessage(t.noRecipientEmailAlert);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const createRecordObject = (): ShipmentRecord => {
    const now = new Date();
    const timestamp = now.toLocaleDateString(language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      id: `SEVK-${Date.now().toString().slice(-6)}`,
      companyName: companyName.trim(),
      listNumber: listNumber.trim(),
      tractorPlate: tractorPlate.trim().toUpperCase(),
      notes: notes.trim() || undefined,
      inspectorName: currentInspector || settings.inspectorName,
      timestamp,
      status: 'sent',
      recipientEmail: settings.recipientEmail,
      ccEmail: settings.ccEmail || undefined,
      photos,
    };
  };

  const buildTextSummary = (record: ShipmentRecord): string => {
    if (language === 'de') {
      return `🚛 LKW-LADE- UND VERSANDPROTOKOLL
Firma: ${record.companyName}
Packliste / Frachtbrief Nr.: ${record.listNumber}
LKW-Kennzeichen: ${record.tractorPlate.toUpperCase()}
Datum/Uhrzeit: ${record.timestamp}
Prüfer: ${record.inspectorName || 'Rampenpersonal'}
${record.notes ? `Rampen-Notiz: ${record.notes}\n` : ''}
4 Kontrollfotos und Frachtliste beigefügt.`;
    }

    return `🚛 TIR YÜKLEME VE SEVK RAPORU
Firma: ${record.companyName}
Malzeme Liste No: ${record.listNumber}
Tır Çekici Plakası: ${record.tractorPlate.toUpperCase()}
Tarih/Saat: ${record.timestamp}
Kontrol Eden: ${record.inspectorName || 'Rampa Görevlisi'}
${record.notes ? `Rampa Notu: ${record.notes}\n` : ''}
4 Adet Kontrol Fotoğrafı ve Çeki Listesi eklenmiştir.`;
  };

  // ACTION 1: "E-posta Gönder" / "E-Mail senden"
  const handleEmailSend = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrorMessage(null);
    const record = createRecordObject();
    const textSummary = buildTextSummary(record);

    const isSmtpMode = settings.emailSendMethod === 'smtp';

    if (isSmtpMode) {
      // 2. Arka Planda Otomatik Gönderim (SMTP)
      const hasSmtp =
        settings.smtpConfig?.host?.trim() &&
        settings.smtpConfig?.user?.trim() &&
        settings.smtpConfig?.pass?.trim();

      if (!hasSmtp) {
        setIsProcessing(false);
        setErrorMessage(
          language === 'de'
            ? 'SMTP-Konfiguration fehlt! Bitte tragen Sie Host, Benutzer und Passwort in den Einstellungen ein oder wählen Sie Methode 1 (Handy-E-Mail).'
            : 'SMTP bilgileri eksik! Lütfen Ayarlar sekmesinden SMTP Host, Gönderen E-posta ve Şifre bilgilerinizi giriniz veya Ayarlar\'dan "1. Telefon Gmail ile Gönderim" seçeneğine geçiniz.'
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      try {
        const response = await fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...record,
            smtpConfig: settings.smtpConfig,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          clearDraft();
          onRecordCompleted(
            record,
            language === 'de'
              ? `Versandprotokoll (#${record.id}) mit 4 Fotos erfolgreich im Hintergrund per SMTP an ${record.recipientEmail} gesendet.`
              : `Sevk tutanağı (#${record.id}) ve 4 adet fotoğraf arka planda ${record.recipientEmail} adresine başarıyla gönderildi.`
          );
          setSuccessBanner(
            language === 'de'
              ? `✅ Protokoll (#${record.id}) und Fotos wurden ohne zusätzliche App direkt an ${record.recipientEmail} gesendet!`
              : `✅ Sevk tutanağı (#${record.id}) ve 4 adet fotoğraf hiçbir ek uygulama açılmadan arka planda ${record.recipientEmail} adresine iletildi!`
          );
          // Reset form fields
          setCompanyName('');
          setListNumber('');
          setTractorPlate('');
          setNotes('');
          setPhotos({});
        } else {
          setErrorMessage(
            data.error ||
              (language === 'de'
                ? 'Fehler beim automatischen SMTP-Versand. Bitte SMTP-Servereinstellungen prüfen.'
                : 'Otomatik SMTP gönderiminde hata oluştu. Lütfen Ayarlar sekmesindeki SMTP sunucu ve şifre bilgilerinizi kontrol ediniz.')
          );
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err: any) {
        console.error('SMTP send error:', err);
        setErrorMessage(
          err.message ||
            (language === 'de'
              ? 'Serververbindung fehlgeschlagen.'
              : 'Sunucu ile iletişim kurulamadı. Lütfen internet bağlantınızı kontrol ediniz.')
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // 1. Telefon Gmail ile Gönderim (Hazır & Sıfır Ayar)
      try {
        const subject = encodeURIComponent(
          `[${language === 'de' ? 'LKW-PROTOKOLL' : 'SEVK RAPORU'}] ${record.companyName} | ${record.tractorPlate.toUpperCase()} | ${record.listNumber}`
        );
        const body = encodeURIComponent(textSummary);
        const mailtoUrl = `mailto:${record.recipientEmail}?subject=${subject}&body=${body}`;

        // Open native email client
        window.location.href = mailtoUrl;

        // Save and record
        clearDraft();
        onRecordCompleted(
          record,
          language === 'de'
            ? `Versandprotokoll (#${record.id}) gespeichert und Mail-App geöffnet.`
            : `Sevk tutanağı (#${record.id}) kaydedildi ve e-posta uygulaması açıldı.`
        );
        setSuccessBanner(
          language === 'de'
            ? `✅ Protokoll (#${record.id}) gespeichert und an E-Mail-App übergeben!`
            : `✅ Sevk tutanağı (#${record.id}) kaydedildi ve telefonunuzun e-posta uygulamasına aktarıldı!`
        );
      } catch (err: any) {
        console.error('E-posta işlem hatası:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // ACTION 2: "Başka Uygulama ile Paylaş" / "Per App teilen"
  const handleShare = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    const record = createRecordObject();
    const textSummary = buildTextSummary(record);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${language === 'de' ? 'LKW-Protokoll' : 'Tır Sevk Raporu'} - ${record.tractorPlate.toUpperCase()}`,
          text: textSummary,
        });
      } else {
        await navigator.clipboard.writeText(textSummary);
        alert(
          language === 'de'
            ? 'Protokoll in die Zwischenablage kopiert! Sie können es in WhatsApp einfügen.'
            : 'Sevk tutanağı panoya kopyalandı! WhatsApp veya istediğiniz uygulamaya yapıştırabilirsiniz.'
        );
      }

      // Save to history & clear
      clearDraft();
      onRecordCompleted(
        record,
        language === 'de'
          ? `Versandprotokoll (#${record.id}) gespeichert und geteilt.`
          : `Sevk tutanağı (#${record.id}) kaydedildi ve paylaşıldı.`
      );
      setSuccessBanner(
        language === 'de'
          ? `✅ Protokoll (#${record.id}) gespeichert und geteilt!`
          : `✅ Sevk tutanağı (#${record.id}) kaydedildi ve paylaşıldı!`
      );
    } catch (err) {
      // User cancelled share
    } finally {
      setIsProcessing(false);
    }
  };

  const completedPhotosCount = [
    photos.plate,
    photos.frontCargo,
    photos.rearCargo,
    photos.packingList,
  ].filter(Boolean).length;

  const photoLabels = {
    requiredBadge: t.badgeRequired,
    optionalBadge: t.badgeOptional,
    shootWithCamera: t.btnCamera,
    selectFromGallery: t.btnGallery,
    added: t.photoAdded,
    requiredIndicator: t.photoRequiredIndicator,
    viewLarge: t.viewLarge,
    retake: t.btnRetake,
    delete: t.btnDeletePhoto,
    optimized: t.photoOptimized,
    processing: t.photoProcessing,
  };

  const savedInspectorsList = settings.savedInspectors && settings.savedInspectors.length > 0
    ? settings.savedInspectors
    : [settings.inspectorName];

  return (
    <div className="space-y-4 pb-20">
      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-2 text-emerald-800 text-xs sm:text-sm font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 whitespace-pre-line leading-relaxed font-medium">
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Banner (Safe alternative to window.confirm) */}
      {showResetConfirm && (
        <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-amber-950 text-xs space-y-2 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{language === 'de' ? 'Formular und Fotos zurücksetzen?' : 'Formu ve fotoğrafları temizlemek istediğinize emin misiniz?'}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleExecuteReset}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 cursor-pointer"
            >
              {language === 'de' ? 'Ja, alles leeren' : 'Evet, Temizle'}
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              {t.btnCancel}
            </button>
          </div>
        </div>
      )}

      {/* Target Recipient Bar */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">
            {t.targetEmailBar}:{' '}
            <strong className="font-semibold text-blue-950">{settings.recipientEmail}</strong>
          </span>
        </div>
        <span className="text-[11px] bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full shrink-0">
          {t.savedTargetEmail}
        </span>
      </div>

      {/* UNIFIED SECTION: FİRMA, YÜKLEME & PLAKA BİLGİLERİ */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>{t.unifiedHeader}</span>
          </h2>
        </div>

        {/* 4 Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Gelen Tırın Firması / Taşıyıcı */}
          <div>
            <CompanySelector
              companies={settings.companies}
              selectedCompany={companyName}
              onSelectCompany={(name) => setCompanyName(name)}
              onAddNewCompany={onAddNewCompany}
              label={t.companyLabel}
              placeholder={t.companyPlaceholder}
              searchPlaceholder={t.searchPlaceholder}
              addNewLabel={t.addNewCompanyBtn}
            />
          </div>

          {/* 2. Yüklenecek Malların Liste No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.listNumberLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-list-number"
              value={listNumber}
              onChange={(e) => setListNumber(e.target.value)}
              placeholder={t.listNumberPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium"
              required
            />
          </div>

          {/* 3. Tır Çekici (Kupa) Plakası */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.tractorPlateLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="input-tractor-plate"
              value={tractorPlate}
              onChange={(e) => setTractorPlate(e.target.value.toUpperCase())}
              placeholder={t.tractorPlatePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold tracking-wider uppercase"
              required
            />
          </div>

          {/* 4. Kontrol Eden Personel (Shift Quick Switcher Built-in!) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t.inspectorFieldLabel}
              </label>
              {savedInspectorsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowShiftPicker(!showShiftPicker)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3 h-3" />
                  <span>{language === 'de' ? 'Wechseln' : 'Vardiya Değiştir'}</span>
                </button>
              )}
            </div>

            <div
              onClick={() => {
                if (savedInspectorsList.length > 1) {
                  setShowShiftPicker(!showShiftPicker);
                }
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
              title={language === 'de' ? 'Klicken zum Wechseln' : 'Vardiya personelini değiştirmek için tıklayınız'}
            >
              <span className="truncate">{currentInspector || settings.inspectorName}</span>
              {savedInspectorsList.length > 1 && (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </div>

            {/* Quick Shift Selection Dropdown */}
            {showShiftPicker && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 animate-in fade-in">
                <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  {language === 'de' ? 'Schichtpersonal wählen:' : 'Aktif Vardiya Görevlisi Seçin:'}
                </p>
                <div className="space-y-1">
                  {savedInspectorsList.map((insp) => (
                    <button
                      key={insp}
                      type="button"
                      onClick={() => {
                        setCurrentInspector(insp);
                        if (onUpdateActiveInspector) {
                          onUpdateActiveInspector(insp);
                        }
                        setShowShiftPicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                        currentInspector === insp
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{insp}</span>
                      {currentInspector === insp && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: 4 ZORUNLU + 1 OPSİYONEL FOTOĞRAF ALANI */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.photoSectionTitle}
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              completedPhotosCount === 4
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {t.photosReady.replace('{ready}', completedPhotosCount.toString())}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* 1. Tırın Plakası */}
          <PhotoUploadSlot
            id="plate"
            title={t.photo1Title}
            required={true}
            value={photos.plate}
            onChange={(val) => handlePhotoChange('plate', val)}
            onView={onOpenImageViewer}
            onBeforeCapture={flushDraftNow}
            language={language}
            autoCompress={settings.autoCompress}
            maxDimension={settings.maxPhotoDimension}
            labels={photoLabels}
          />

          {/* 2. Tırın Ön Kasası */}
          <PhotoUploadSlot
            id="frontCargo"
            title={t.photo2Title}
            required={true}
            value={photos.frontCargo}
            onChange={(val) => handlePhotoChange('frontCargo', val)}
            onView={onOpenImageViewer}
            onBeforeCapture={flushDraftNow}
            language={language}
            autoCompress={settings.autoCompress}
            maxDimension={settings.maxPhotoDimension}
            labels={photoLabels}
          />

          {/* 3. Tırın Arka Kasası */}
          <PhotoUploadSlot
            id="rearCargo"
            title={t.photo3Title}
            required={true}
            value={photos.rearCargo}
            onChange={(val) => handlePhotoChange('rearCargo', val)}
            onView={onOpenImageViewer}
            onBeforeCapture={flushDraftNow}
            language={language}
            autoCompress={settings.autoCompress}
            maxDimension={settings.maxPhotoDimension}
            labels={photoLabels}
          />

          {/* 4. Malların Çeki/İrsaliye Listesi */}
          <PhotoUploadSlot
            id="packingList"
            title={t.photo4Title}
            required={true}
            value={photos.packingList}
            onChange={(val) => handlePhotoChange('packingList', val)}
            onView={onOpenImageViewer}
            onBeforeCapture={flushDraftNow}
            language={language}
            autoCompress={settings.autoCompress}
            maxDimension={settings.maxPhotoDimension}
            labels={photoLabels}
          />
        </div>
      </section>

      {/* SECTION: RAMPA / HASAR / ÖZEL NOT (OPSİYONEL) */}
      <section className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="textarea-notes" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{t.notesLabel}</span>
          </label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setNotes(language === 'de' ? 'Ladung vollständig und unbeschädigt übergeben.' : 'Tüm yük eksiksiz ve hasarsız teslim edildi.')}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium border border-slate-200"
            >
              {t.notesQuickNoProblem}
            </button>
            <button
              type="button"
              onClick={() => setNotes(language === 'de' ? 'Beschädigung an 1 Palette festgestellt.' : '1 palette ambalaj ezilmesi tespit edildi.')}
              className="text-[11px] bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium border border-amber-200"
            >
              {t.notesQuickDamaged}
            </button>
          </div>
        </div>

        <textarea
          id="textarea-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </section>

      {/* FLOATING BOTTOM ACTION BAR: SIDE-BY-SIDE BUTTONS */}
      <div className="sticky bottom-3 z-30 pt-2">
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-2">
          {/* Reset button */}
          <button
            type="button"
            id="btn-reset-form"
            onClick={() => setShowResetConfirm(true)}
            className="p-3 bg-slate-800 hover:bg-rose-900/70 text-slate-300 hover:text-rose-200 rounded-xl transition active:scale-95 shrink-0 cursor-pointer"
            title={language === 'de' ? 'Formular leeren' : 'Formu ve fotoğrafları temizle'}
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* TWO SIDE-BY-SIDE BUTTONS */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {/* Button 1: E-posta Gönder (Dynamic based on settings.emailSendMethod) */}
            <button
              type="button"
              id="btn-send-email"
              disabled={isProcessing}
              onClick={handleEmailSend}
              className={`py-3 px-2 sm:px-3 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer text-center ${
                settings.emailSendMethod === 'smtp'
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <span className="truncate">{language === 'de' ? 'Wird gesendet...' : 'Gönderiliyor...'}</span>
              ) : settings.emailSendMethod === 'smtp' ? (
                <>
                  <SendHorizontal className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {language === 'de' ? 'Auto-SMTP senden' : 'SMTP ile Gönder'}
                  </span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.btnSendEmail}</span>
                </>
              )}
            </button>

            {/* Button 2: Başka Uygulama ile Paylaş */}
            <button
              type="button"
              id="btn-share-app"
              disabled={isProcessing}
              onClick={handleShare}
              className="py-3 px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer text-center"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.btnShareOther}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
