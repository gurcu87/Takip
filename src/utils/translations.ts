import { AppLanguage } from '../types';

export const TRANSLATIONS = {
  tr: {
    // App header & nav
    appTitle: 'Tır Yükleme Sistemi',
    appSubtitle: 'HobiStand Fotoğraflı Tutanak Sistemi',
    appBadge: 'v1.0',
    tabNew: 'Yeni Yükleme',
    tabNewShipment: 'Yeni Yükleme',
    tabHistory: 'Geçmiş Kayıtlar',
    tabSettings: 'Ayarlar',
    onlineText: 'Çevrimiçi',
    offlineText: 'Çevrimdışı (Kayıtlar Korunur)',
    statusOnline: 'Çevrimiçi',
    statusOffline: 'Çevrimdışı (Kayıtlar Korunur)',
    installApp: 'Telefona Yükle',
    installAppShort: 'Yükle',
    langSwitchTitle: 'Dili Değiştir / Sprache wechseln',

    // Shipment Form - Section 1
    unifiedHeader: 'Firma, Yükleme & Plaka Bilgileri',
    sectionCompanyPlate: 'Firma, Yükleme & Plaka Bilgileri',
    targetEmailBar: 'Hedef E-posta',
    targetEmailLabel: 'Hedef E-posta:',
    savedTargetEmail: 'Kayıtlı',
    savedBadge: 'Kayıtlı',
    companyLabel: 'Gelen Tırın Firması / Taşıyıcı',
    carrierLabel: 'Gelen Tırın Firması / Taşıyıcı',
    companyPlaceholder: 'Listeden tırın ait olduğu firmayı seçin...',
    carrierPlaceholder: 'Listeden tırın ait olduğu firmayı seçin...',
    searchPlaceholder: 'Firma adı ara...',
    carrierSearchPlaceholder: 'Firma adı ara...',
    addNewCompanyBtn: 'Listeye Yeni Firma Ekle',
    addNewCarrier: 'Listeye Yeni Firma Ekle',
    newCarrierPrompt: 'Eklenecek Taşıyıcı / Firma Adı:',
    listNumberLabel: 'Yüklenecek Malların Liste No',
    listNumberPlaceholder: 'Örn: ML-2026-8942 / Çeki 104',
    tractorPlateLabel: 'Tır Çekici (Kupa) Plakası',
    tractorPlatePlaceholder: 'Örn: 34 ABC 123',
    inspectorFieldLabel: 'Kontrol Eden Personel',
    inspectorLabel: 'Kontrol Eden Personel',
    quickShiftTip: 'Vardiya Değiştir',

    // Shipment Form - Section 2 (Photos)
    photoSectionTitle: ' Fotoğraf Kontrolü (4 Zorunlu)',
    sectionPhotosTitle: ' Fotoğraf Kontrolü (4 Zorunlu)',
    photosReady: '{ready} / 4 Hazır',
    photosReadyCount: '{count} / 4 Hazır',
    photo1Title: '1. TIR PLAKASI',
    photo2Title: '2. TIR ÖN KASA',
    photo3Title: '3. TIR ARKA KASA',
    photo4Title: '4. MALZEME LİSTESİ',
    photoPlate: '1. TIR PLAKASI',
    photoFrontCargo: '2. TIR ÖN KASA',
    photoRearCargo: '3. TIR ARKA KASA',
    photoPackingList: '4. MALZEME LİSTESİ',
    badgeRequired: 'Zorunlu',
    badgeOptional: 'İsteğe Bağlı',
    photoRequired: 'Zorunlu',
    photoOptional: 'Opsiyonel',
    photoAdded: 'Eklendi',
    photoRequiredIndicator: 'Gerekli',
    photoReady: 'Hazır',
    photoEmpty: 'Bekleniyor',
    btnCamera: 'Kamera ile Çek',
    btnTakePhoto: 'Kamera ile Çek',
    btnGallery: 'Galeriden Seç',
    btnRetake: 'Değiştir',
    btnChangePhoto: 'Değiştir',
    btnDeletePhoto: 'Fotoğrafı Sil',
    btnRemovePhoto: 'Kaldır',
    viewLarge: 'Büyük İncele',
    btnViewPhoto: 'Büyüt',
    photoOptimized: 'Otomatik Optimize Edildi',
    photoProcessing: 'Fotoğraf optimize ediliyor...',

    // Shipment Form - Notes
    notesSectionTitle: 'Rampa / Hasar / Özel Not (Opsiyonel)',
    notesLabel: 'Rampa / Hasar / Özel Not',
    notesPlaceholder: 'Rampada fark edilen herhangi bir durum veya not yazabilirsiniz...',
    notesQuickNoProblem: 'Sorunsuz',
    notesQuickDamaged: 'Hasar Notu',
    presetFlawless: 'Sorunsuz',
    presetFlawlessText: 'Tüm yük eksiksiz ve hasarsız teslim edildi.',
    presetDamage: 'Hasar Notu',
    presetDamageText: '1 palette ambalaj ezilmesi tespit edildi.',

    // Bottom Action Bar
    btnSendEmail: 'E-posta Gönder',
    btnShareOther: 'Başka Uygulama ile Paylaş',
    btnShareApp: 'Başka Uygulama ile Paylaş',
    btnResetFormTitle: 'Formu ve fotoğrafları temizle',
    resetConfirmTitle: 'Mevcut yükleme formunu ve çekilen tüm fotoğrafları temizlemek istediğinize emin misiniz?',
    copiedToClipboard: 'Sevk tutanağı panoya kopyalandı! WhatsApp veya istediğiniz uygulamaya yapıştırabilirsiniz.',

    // Validations & Banners
    missingFieldsAlert: 'Lütfen eksik alanları tamamlayınız:',
    validationErrorTitle: 'Lütfen eksik alanları tamamlayınız:',
    companyRequired: 'Tırın ait olduğu firma',
    listNumberRequired: 'Yüklenecek malların liste numarası',
    plateRequired: 'Tır çekici plakası',
    photo1Required: '1. Tırın Plaka Fotoğrafı',
    photo2Required: '2. Tırın Ön Kasa Fotoğrafı',
    photo3Required: '3. Tırın Arka Kasa Fotoğrafı',
    photo4Required: '4. Malların Çeki / Malzeme Liste Görüntüsü',
    noRecipientEmailAlert: 'Ayarlar sayfasında alıcı e-posta adresi tanımlı değil. Lütfen Ayarlar sekmesinden e-posta adresinizi kaydediniz.',
    missingCompany: 'Tırın ait olduğu firma',
    missingListNumber: 'Yüklenecek malların liste numarası',
    missingTractorPlate: 'Tır çekici plakası',
    missingEmailSettings: 'Ayarlar sayfasında alıcı e-posta adresi tanımlı değil. Lütfen Ayarlar sekmesinden e-posta adresinizi kaydediniz.',
    recordCreatedEmail: 'Sevk tutanağı (#{id}) kaydedildi ve e-posta uygulamasına aktarıldı!',
    recordCreatedShare: 'Sevk tutanağı (#{id}) kaydedildi ve paylaşıldı!',

    // History View
    historyTitle: 'Geçmiş Sevk Tutanakları',
    historySubtitle: 'Bu cihazda kayıtlı {count} adet sevk kaydı bulunmaktadır',
    historySearchPlaceholder: 'Plaka, firma adı veya liste no ile ara...',
    historyEmptyTitle: 'Henüz Kayıtlı Sevk Tutanağı Yok',
    historyEmptyDesc: 'Yeni Yükleme sekmesinden tır yüklemesi yapıp "E-posta Gönder" veya "Paylaş" butonuna bastığınızda sevk tutanağı burada arşivlenir.',
    historyNoResults: 'Aramanızla eşleşen sevk kaydı bulunamadı.',
    historyDeleteConfirmTitle: 'Bu sevk kaydını silmek istediğinize emin misiniz?',
    historyDeleteConfirmDesc: 'Bu işlem geri alınamaz. Cihaz hafızasındaki bu sevk raporu silinecektir.',
    btnConfirmDelete: 'Evet, Sil',
    btnCancel: 'Vazgeç',
    btnDelete: 'Kaydı Sil',
    btnShare: 'Paylaş',

    // History Column Titles (Requested Exact 4 Titles)
    historyColCompany: 'Tır Firması',
    historyColPlate: 'Tır Plakası',
    historyColListNo: 'Liste Numarası',
    historyColInspector: 'Kontrol Eden',

    // Settings View
    settingsTitle: 'Uygulama & Sevk Ayarları',
    settingsSubtitle: 'Vardiya personeli, dil tercihi, e-posta ve saha ayarları',
    savedNotification: 'Ayarlar başarıyla kaydedildi!',

    // Settings Section 1 - Personnel (At the top!)
    settingsInspectorTitle: 'Kontrol Eden Personel (Vardiya / Rampa)',
    settingsInspectorDesc: 'Vardiya başlangıcında kontrol görevlisini buradan hızlıca güncelleyebilirsiniz.',
    activeInspectorLabel: 'Aktif Kontrol Görevlisi Adı',
    shiftPresetTitle: 'Kayıtlı Vardiya Personelleri (Hızlı Seçim)',
    addShiftPersonPlaceholder: 'Yeni vardiya personeli adı...',
    btnAddPerson: 'Ekle',

    // Settings Section 2 - Language
    settingsLangTitle: 'Dil Seçimi / Sprachauswahl',
    settingsLangDesc: 'Uygulama dilini anında değiştirebilirsiniz. Seçiminiz kalıcı olarak kaydedilir.',
    langTurkish: 'Türkçe',
    langGerman: 'Deutsch (Almanca)',

    // Settings Section 3 - Email
    settingsEmailTitle: 'Alıcı E-posta Ayarları',
    settingsEmailDesc: 'Rampa tutanakları ve fotoğrafların gönderileceği resmi şirket e-posta adresi.',
    recipientEmailLabel: 'Alıcı E-posta Adresi',
    ccEmailLabel: 'Bilgi (CC) E-posta Adresi (Opsiyonel)',

    // Settings Section 4 - Companies
    settingsCompaniesTitle: 'Gelen Tır Taşıyıcı Firma Listesi',
    settingsCompaniesDesc: 'Uygulama açılışında listelenen lojistik firmalarını buradan yönetebilirsiniz.',
    newCompanyInputPlaceholder: 'Yeni nakliye firması ekle...',

    // Settings Section 5 - Photos & Camera
    settingsPhotoTitle: 'Fotoğraf & Kamera Ayarları',
    settingsPhotoDesc: 'Mobil veri ve e-posta kotası tasarrufu için otomatik sıkıştırma.',
    autoCompressLabel: 'Otomatik Fotoğraf Boyutlandırma',
    autoCompressSub: 'Telefonun yüksek çözünürlüklü fotoğraflarını e-postanın saniyeler içinde gitmesi için optimize eder.',
    photoMaxDimLabel: 'Maksimum Çözünürlük (Piksel)',

    // Settings Save Button
    btnSaveSettings: 'AYARLARI KAYDET',

    // Shift Switcher Modal / Tooltip
    quickShiftTitle: 'Vardiya Görevlisi Değiştir',
    saveAndSelect: 'Seç ve Kaydet',

    // Lightbox Modal
    downloadPhoto: 'Fotoğrafı İndir',
    closeModal: 'Kapat',
  },
  de: {
    // App header & nav
    appTitle: 'LKW-Verladekontrolle',
    appSubtitle: 'Rampenverladung & Fotoprotokollsystem',
    appBadge: 'Rampe v1.0',
    tabNew: 'Neue Verladung',
    tabNewShipment: 'Neue Verladung',
    tabHistory: 'Verladehistorie',
    tabSettings: 'Einstellungen',
    onlineText: 'Online',
    offlineText: 'Offline (Daten geschützt)',
    statusOnline: 'Online',
    statusOffline: 'Offline (Daten geschützt)',
    installApp: 'App installieren',
    installAppShort: 'Installieren',
    langSwitchTitle: 'Sprache wechseln / Dili Değiştir',

    // Shipment Form - Section 1
    unifiedHeader: 'Spedition, Lade- & Kennzeichendaten',
    sectionCompanyPlate: 'Spedition, Lade- & Kennzeichendaten',
    targetEmailBar: 'Ziel-E-Mail',
    targetEmailLabel: 'Ziel-E-Mail:',
    savedTargetEmail: 'Gespeichert',
    savedBadge: 'Gespeichert',
    companyLabel: 'Spedition / Frachtführer',
    carrierLabel: 'Spedition / Frachtführer',
    companyPlaceholder: 'Spedition aus der Liste wählen...',
    carrierPlaceholder: 'Spedition aus der Liste wählen...',
    searchPlaceholder: 'Spedition suchen...',
    carrierSearchPlaceholder: 'Spedition suchen...',
    addNewCompanyBtn: 'Neue Spedition hinzufügen',
    addNewCarrier: 'Neue Spedition hinzufügen',
    newCarrierPrompt: 'Name der hinzuzufügenden Spedition:',
    listNumberLabel: 'Packlisten- / Frachtbriefnummer',
    listNumberPlaceholder: 'z.B.: ML-2026-8942 / Frachtbrief 104',
    tractorPlateLabel: 'Tır Çekici (Kupa) Plakası / Kennzeichen',
    tractorPlatePlaceholder: 'z.B.: 34 ABC 123 / HH-XY 123',
    inspectorFieldLabel: 'Prüfendes Personal (Rampenleiter)',
    inspectorLabel: 'Prüfendes Personal (Rampenleiter)',
    quickShiftTip: 'Schicht wechseln',

    // Shipment Form - Section 2 (Photos)
    photoSectionTitle: 'Rampen-Fotokontrolle (4 Pflichtfotos)',
    sectionPhotosTitle: 'Rampen-Fotokontrolle (4 Pflichtfotos)',
    photosReady: '{ready} / 4 Bereit',
    photosReadyCount: '{count} / 4 Bereit',
    photo1Title: '1. LKW-KENNZEICHEN',
    photo2Title: '2. LKW-LADEFLÄCHE VORN',
    photo3Title: '3. LKW-LADEFLÄCHE HINTEN',
    photo4Title: '4. MATERIAL- / PACKLISTE',
    photoPlate: '1. LKW-KENNZEICHEN',
    photoFrontCargo: '2. LKW-LADEFLÄCHE VORN',
    photoRearCargo: '3. LKW-LADEFLÄCHE HINTEN',
    photoPackingList: '4. MATERIAL- / PACKLISTE',
    badgeRequired: 'Pflicht',
    badgeOptional: 'Optional',
    photoRequired: 'Pflicht',
    photoOptional: 'Optional',
    photoAdded: 'Hinzugefügt',
    photoRequiredIndicator: 'Erforderlich',
    photoReady: 'Bereit',
    photoEmpty: 'Ausstehend',
    btnCamera: 'Kamera',
    btnTakePhoto: 'Kamera',
    btnGallery: 'Galerie',
    btnRetake: 'Ändern',
    btnChangePhoto: 'Ändern',
    btnDeletePhoto: 'Foto löschen',
    btnRemovePhoto: 'Entfernen',
    viewLarge: 'Vergrößern',
    btnViewPhoto: 'Vergrößern',
    photoOptimized: 'Automatisch optimiert',
    photoProcessing: 'Foto wird optimiert...',

    // Shipment Form - Notes
    notesSectionTitle: 'Rampen- / Schadensnotiz (Optional)',
    notesLabel: 'Rampen- / Schadens- / Sonstige Notiz',
    notesPlaceholder: 'Besonderheiten, Bemerkungen oder Schäden hier eintragen...',
    notesQuickNoProblem: 'Einwandfrei',
    notesQuickDamaged: 'Schadensvermerk',
    presetFlawless: 'Einwandfrei',
    presetFlawlessText: 'Komplette Ladung vollständig und unbeschädigt verladen.',
    presetDamage: 'Schadensvermerk',
    presetDamageText: 'Beschädigung an Palette / Verpackung festgestellt.',

    // Bottom Action Bar
    btnSendEmail: 'E-Mail senden',
    btnShareOther: 'Per App teilen',
    btnShareApp: 'Per App teilen',
    btnResetFormTitle: 'Formular und Fotos leeren',
    resetConfirmTitle: 'Möchten Sie das Formular und alle aufgenommenen Fotos wirklich leeren?',
    copiedToClipboard: 'Verladeprotokoll in die Zwischenablage kopiert! Sie können es z.B. in WhatsApp einfügen.',

    // Validations & Banners
    missingFieldsAlert: 'Bitte füllen Sie die folgenden Pflichtfelder aus:',
    validationErrorTitle: 'Bitte füllen Sie die folgenden Pflichtfelder aus:',
    companyRequired: 'Spedition / Frachtführer',
    listNumberRequired: 'Packlisten- oder Frachtbriefnummer',
    plateRequired: 'Kennzeichen der Zugmaschine',
    photo1Required: '1. Kennzeichen-Foto der Zugmaschine',
    photo2Required: '2. Foto vorderer Laderaum',
    photo3Required: '3. Foto hinterer Laderaum',
    photo4Required: '4. Foto der Packliste / Frachtbrief',
    noRecipientEmailAlert: 'In den Einstellungen ist keine Ziel-E-Mail hinterlegt. Bitte tragen Sie diese unter Einstellungen ein.',
    missingCompany: 'Spedition / Frachtführer',
    missingListNumber: 'Packlisten- oder Frachtbriefnummer',
    missingTractorPlate: 'Kennzeichen der Zugmaschine',
    missingEmailSettings: 'In den Einstellungen ist keine Ziel-E-Mail hinterlegt. Bitte tragen Sie diese unter Einstellungen ein.',
    recordCreatedEmail: 'Verladeprotokoll (#{id}) gespeichert und E-Mail-App geöffnet!',
    recordCreatedShare: 'Verladeprotokoll (#{id}) gespeichert und geteilt!',

    // History View
    historyTitle: 'Vergangene Verladeprotokolle',
    historySubtitle: 'Auf diesem Gerät sind {count} Verladeprotokolle gespeichert',
    historySearchPlaceholder: 'Nach Kennzeichen, Spedition oder Listennummer suchen...',
    historyEmptyTitle: 'Noch keine Verladeprotokolle vorhanden',
    historyEmptyDesc: 'Wenn Sie eine Verladung durchführen und auf "E-Mail senden" oder "Teilen" tippen, wird das Protokoll hier archiviert.',
    historyNoResults: 'Keine passenden Verladeprotokolle gefunden.',
    historyDeleteConfirmTitle: 'Diesen Eintrag wirklich löschen?',
    historyDeleteConfirmDesc: 'Dieser Vorgang kann nicht rückgängig gemacht werden. Das Verladeprotokoll wird vom Gerät gelöscht.',
    btnConfirmDelete: 'Ja, Löschen',
    btnCancel: 'Abbrechen',
    btnDelete: 'Löschen',
    btnShare: 'Teilen',

    // History Column Titles (Requested Exact 4 Titles)
    historyColCompany: 'Tır Firması',
    historyColPlate: 'Tır Plakası',
    historyColListNo: 'Liste Numarası',
    historyColInspector: 'Kontrol Eden',

    // Settings View
    settingsTitle: 'App- & Verladeeinstellungen',
    settingsSubtitle: 'Schichtpersonal, Sprachauswahl, E-Mail- und Vor-Ort-Optionen',
    savedNotification: 'Einstellungen erfolgreich gespeichert!',

    // Settings Section 1 - Personnel (At the top!)
    settingsInspectorTitle: 'Prüfendes Personal (Schicht / Rampenleiter)',
    settingsInspectorDesc: 'Hier können Sie den aktiven Kontrolleur zu Schichtbeginn schnell wechseln.',
    activeInspectorLabel: 'Aktiver Prüfer / Kontrolleur',
    shiftPresetTitle: 'Gespeichertes Schichtpersonal (Schnellauswahl)',
    addShiftPersonPlaceholder: 'Neuer Mitarbeitername...',
    btnAddPerson: 'Hinzufügen',

    // Settings Section 2 - Language
    settingsLangTitle: 'Sprachauswahl / Dil Seçimi',
    settingsLangDesc: 'Die Sprache der Benutzeroberfläche wird sofort und dauerhaft umgestellt.',
    langTurkish: 'Türkçe',
    langGerman: 'Deutsch (Almanca)',

    // Settings Section 3 - Email
    settingsEmailTitle: 'Ziel-E-Mail-Adresse',
    settingsEmailDesc: 'Offizielle Firmen-E-Mail-Adresse, an die Protokolle gesendet werden.',
    recipientEmailLabel: 'Haupt-Empfänger-E-Mail (Pflichtfeld)',
    ccEmailLabel: 'Kopie (CC) E-Mail (Optional)',

    // Settings Section 4 - Companies
    settingsCompaniesTitle: 'Speditionen & Frachtführerliste',
    settingsCompaniesDesc: 'Verwalten Sie häufig ankommende Logistik- und Speditionsunternehmen.',
    newCompanyInputPlaceholder: 'Speditionsnamen eingeben...',

    // Settings Section 5 - Photos & Camera
    settingsPhotoTitle: 'Foto- & Kameraqualität',
    settingsPhotoDesc: 'Automatische Komprimierung zur Schonung des Datenvolumens.',
    autoCompressLabel: 'Fotos automatisch optimieren',
    autoCompressSub: 'Komprimiert Fotos ohne sichtbaren Qualitätsverlust für schnellen E-Mail-Versand.',
    photoMaxDimLabel: 'Maximale Auflösung (Pixel)',

    // Settings Save Button
    btnSaveSettings: 'EINSTELLUNGEN SPEICHERN',

    // Shift Switcher Modal / Tooltip
    quickShiftTitle: 'Schichtprüfer wechseln',
    saveAndSelect: 'Wählen & Speichern',

    // Lightbox Modal
    downloadPhoto: 'Foto herunterladen',
    closeModal: 'Schließen',
  },
};

export function getTranslation(lang: AppLanguage = 'tr') {
  return TRANSLATIONS[lang] || TRANSLATIONS.tr;
}
