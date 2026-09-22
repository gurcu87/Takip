export interface EmailReportData {
  id?: string;
  recipientEmail: string;
  ccEmail?: string;
  companyName: string;
  listNumber: string;
  tractorPlate: string;
  trailerPlate?: string;
  driverName?: string;
  driverPhone?: string;
  sealNumber?: string;
  notes?: string;
  inspectorName?: string;
  timestamp: string;
  language?: string;
}

export interface EmailDictionary {
  fromName: string;
  subjectPrefix: string;
  title: string;
  reportNo: string;
  issueDate: string;
  company: string;
  packingList: string;
  tractorPlate: string;
  trailerPlate: string;
  sealNumber: string;
  driverInfo: string;
  inspector: string;
  defaultInspector: string;
  notes: string;
  infoDisclaimer: string;
  footer: string;
  photoFilenames: Record<string, string>;
  plainSummary: {
    header: string;
    company: string;
    list: string;
    plate: string;
    date: string;
    inspector: string;
    notes: string;
    photosAttached: string;
  };
}

export const EMAIL_TRANSLATIONS: Record<string, EmailDictionary> = {
  tr: {
    fromName: 'Tır Sevk Kontrol',
    subjectPrefix: 'SEVK RAPORU',
    title: '🚛 TIR YÜKLEME VE SEVK TUTANAĞI',
    reportNo: 'Rapor No',
    issueDate: 'Düzenleme Tarihi',
    company: 'Taşıyıcı / Firma:',
    packingList: 'Çeki / Malzeme Liste No:',
    tractorPlate: 'Çekici (Tır) Plakası:',
    trailerPlate: 'Dorse / Treyler Plakası:',
    sealNumber: 'Mühür Numarası:',
    driverInfo: 'Şoför Bilgisi:',
    inspector: 'Kontrol Eden Personel:',
    defaultInspector: 'Rampa Görevlisi',
    notes: 'Rampa / Hasar Notu:',
    infoDisclaimer:
      'ℹ️ Bu tutanak yükleme sahasında yapılan kontrol ve fotoğraflı doğrulama neticesinde otomatik olarak oluşturulmuştur. Ekli fotoğraflar tırın rampadan ayrılış anındaki gerçek durumunu belgelemektedir.',
    footer: 'HobiStand Fotoğraflı Tutanak Sistemi • Güvenli ve Kanıtlı Sevkiyat Raporu',
    photoFilenames: {
      plate: '1_TIR_PLAKASI.jpg',
      frontCargo: '2_TIR_ON_KASA.jpg',
      rearCargo: '3_TIR_ARKA_KASA.jpg',
      packingList: '4_MALZEME_LISTESI.jpg',
      seal: '5_GUVENLIK_MUHRU.jpg',
    },
    plainSummary: {
      header: '🚛 TIR YÜKLEME VE SEVK RAPORU',
      company: 'Firma',
      list: 'Malzeme Liste No',
      plate: 'Tır Çekici Plakası',
      date: 'Tarih/Saat',
      inspector: 'Kontrol Eden',
      notes: 'Rampa Notu',
      photosAttached: '4 Adet Kontrol Fotoğrafı ve Çeki Listesi eklenmiştir.',
    },
  },

  de: {
    fromName: 'LKW-Verladekontrolle',
    subjectPrefix: 'VERSANDPROTOKOLL',
    title: '🚛 LKW-LADE- UND VERSANDPROTOKOLL',
    reportNo: 'Protokoll-Nr.',
    issueDate: 'Erstellungsdatum',
    company: 'Spedition / Firma:',
    packingList: 'Packliste / Frachtbrief Nr.:',
    tractorPlate: 'LKW-Kennzeichen (Zugmaschine):',
    trailerPlate: 'Auflieger / Anhänger-Kennzeichen:',
    sealNumber: 'Plomben- / Siegelnummer:',
    driverInfo: 'Fahrerdaten:',
    inspector: 'Prüfer / Rampenpersonal:',
    defaultInspector: 'Rampenpersonal',
    notes: 'Rampen- / Schadensnotiz:',
    infoDisclaimer:
      'ℹ️ Dieses Protokoll wurde nach Prüfung und Fotoverifizierung im Rampenbereich automatisch erstellt. Die beigefügten Fotos dokumentieren den Zustand des LKW beim Verlassen der Rampe.',
    footer: 'HobiStand Fotoprotokollsystem • Sicherer & nachweisbarer Versandbericht',
    photoFilenames: {
      plate: '1_LKW_KENNZEICHEN.jpg',
      frontCargo: '2_LKW_LADEFLAECHE_VORN.jpg',
      rearCargo: '3_LKW_LADEFLAECHE_HINTEN.jpg',
      packingList: '4_MATERIAL_PACKLISTE.jpg',
      seal: '5_SICHERHEITSPLOMBE.jpg',
    },
    plainSummary: {
      header: '🚛 LKW-LADE- UND VERSANDPROTOKOLL',
      company: 'Firma',
      list: 'Packliste / Frachtbrief Nr.',
      plate: 'LKW-Kennzeichen',
      date: 'Datum/Uhrzeit',
      inspector: 'Prüfer',
      notes: 'Rampen-Notiz',
      photosAttached: '4 Kontrollfotos und Frachtliste beigefügt.',
    },
  },

  en: {
    fromName: 'Truck Dispatch Control',
    subjectPrefix: 'SHIPMENT REPORT',
    title: '🚛 TRUCK LOADING & DISPATCH REPORT',
    reportNo: 'Report No.',
    issueDate: 'Issue Date',
    company: 'Carrier / Company:',
    packingList: 'Packing / Material List No.:',
    tractorPlate: 'Tractor / Truck Plate:',
    trailerPlate: 'Trailer Plate:',
    sealNumber: 'Seal Number:',
    driverInfo: 'Driver Info:',
    inspector: 'Inspector / Ramp Staff:',
    defaultInspector: 'Ramp Inspector',
    notes: 'Ramp / Damage Notes:',
    infoDisclaimer:
      'ℹ️ This report was automatically generated following verification and photographic inspection at the loading dock. Attached photos document the actual condition of the truck upon departure.',
    footer: 'HobiStand Photo Dispatch System • Secure & Documented Shipment Report',
    photoFilenames: {
      plate: '1_TRUCK_PLATE.jpg',
      frontCargo: '2_FRONT_CARGO.jpg',
      rearCargo: '3_REAR_CARGO.jpg',
      packingList: '4_PACKING_LIST.jpg',
      seal: '5_SECURITY_SEAL.jpg',
    },
    plainSummary: {
      header: '🚛 TRUCK LOADING & DISPATCH REPORT',
      company: 'Company',
      list: 'Material List No',
      plate: 'Truck Plate',
      date: 'Date/Time',
      inspector: 'Inspector',
      notes: 'Ramp Note',
      photosAttached: '4 Inspection photos and packing list attached.',
    },
  },
};

/**
 * Get email translations dictionary for active language, falling back to 'tr'
 */
export function getEmailDictionary(lang?: string): EmailDictionary {
  if (lang && EMAIL_TRANSLATIONS[lang]) {
    return EMAIL_TRANSLATIONS[lang];
  }
  return EMAIL_TRANSLATIONS.tr;
}

/**
 * Generate formatted email subject
 */
export function buildEmailSubject(data: EmailReportData, lang?: string): string {
  const dict = getEmailDictionary(lang);
  const plate = (data.tractorPlate || '').toUpperCase();
  return `[${dict.subjectPrefix}] ${data.companyName} | ${plate} | ${dict.packingList.replace(':', '')}: ${data.listNumber}`;
}

/**
 * Generate beautiful HTML content for email body
 */
export function buildEmailHtml(data: EmailReportData, lang?: string): string {
  const dict = getEmailDictionary(lang);
  const reportId = data.id || `SEVK-${Date.now()}`;
  const plateUpper = (data.tractorPlate || '').toUpperCase();
  const trailerUpper = data.trailerPlate ? data.trailerPlate.toUpperCase() : '';
  const inspector = data.inspectorName || dict.defaultInspector;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1e3a8a; margin: 0 0 6px 0; font-size: 22px;">${dict.title}</h2>
        <p style="margin: 0; color: #64748b; font-size: 13px;">${dict.reportNo}: <strong>#${reportId}</strong> | ${dict.issueDate}: <strong>${data.timestamp}</strong></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; width: 35%; color: #475569;">${dict.company}</td>
            <td style="padding: 10px 12px; font-weight: bold; color: #0f172a; font-size: 15px;">${data.companyName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.packingList}</td>
            <td style="padding: 10px 12px; font-family: monospace; font-size: 15px; font-weight: bold; color: #2563eb;">${data.listNumber}</td>
          </tr>
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.tractorPlate}</td>
            <td style="padding: 10px 12px; font-weight: bold; font-family: monospace; font-size: 15px; letter-spacing: 1px;">${plateUpper}</td>
          </tr>
          ${
            trailerUpper
              ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.trailerPlate}</td>
            <td style="padding: 10px 12px; font-family: monospace; font-size: 14px;">${trailerUpper}</td>
          </tr>`
              : ''
          }
          ${
            data.sealNumber
              ? `
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.sealNumber}</td>
            <td style="padding: 10px 12px; font-family: monospace;">${data.sealNumber}</td>
          </tr>`
              : ''
          }
          ${
            data.driverName
              ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.driverInfo}</td>
            <td style="padding: 10px 12px;">${data.driverName} ${data.driverPhone ? `(${data.driverPhone})` : ''}</td>
          </tr>`
              : ''
          }
          <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569;">${dict.inspector}</td>
            <td style="padding: 10px 12px;">${inspector}</td>
          </tr>
          ${
            data.notes
              ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 12px; font-weight: bold; color: #475569; vertical-align: top;">${dict.notes}</td>
            <td style="padding: 10px 12px; background-color: #fefce8; color: #854d0e; border-left: 3px solid #eab308;">${data.notes}</td>
          </tr>`
              : ''
          }
        </tbody>
      </table>

      <div style="background-color: #f1f5f9; padding: 14px; border-radius: 6px; font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 24px;">
        ${dict.infoDisclaimer}
      </div>

      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #94a3b8; text-align: center;">
        ${dict.footer}
      </div>
    </div>
  `;
}

/**
 * Generate plain text report summary for mailto and mobile app sharing
 */
export function buildEmailPlainText(data: EmailReportData, lang?: string): string {
  const dict = getEmailDictionary(lang);
  const p = dict.plainSummary;
  const plateUpper = (data.tractorPlate || '').toUpperCase();
  const inspector = data.inspectorName || dict.defaultInspector;

  return `${p.header}
${p.company}: ${data.companyName}
${p.list}: ${data.listNumber}
${p.plate}: ${plateUpper}${data.trailerPlate ? ` / ${data.trailerPlate.toUpperCase()}` : ''}
${p.date}: ${data.timestamp}
${p.inspector}: ${inspector}
${data.notes ? `${p.notes}: ${data.notes}\n` : ''}
${p.photosAttached}`;
}

/**
 * Get localized attachment filename
 */
export function getPhotoAttachmentFilename(
  photoKey: string,
  tractorPlate: string,
  lang?: string
): string {
  const dict = getEmailDictionary(lang);
  const filename = dict.photoFilenames[photoKey] || `${photoKey}.jpg`;
  const plate = (tractorPlate || '').toUpperCase().replace(/\s+/g, '_');
  return `${plate}_${filename}`;
}
