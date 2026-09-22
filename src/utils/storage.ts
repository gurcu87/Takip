import { AppSettings, CompanyItem, ShipmentRecord } from '../types';

export const DEFAULT_COMPANIES: CompanyItem[] = [
  { id: 'ekol', name: 'Ekol Lojistik' },
  { id: 'arkas', name: 'Arkas Lojistik' },
  { id: 'mars', name: 'Mars Lojistik' },
  { id: 'netlog', name: 'Netlog Lojistik' },
  { id: 'barsan', name: 'Barsan Global Logistics' },
  { id: 'horoz', name: 'Horoz Lojistik' },
  { id: 'ceva', name: 'CEVA Logistics' },
  { id: 'borusan', name: 'Borusan Lojistik' },
  { id: 'sertrans', name: 'Sertrans Logistics' },
  { id: 'dhl', name: 'DHL Freight' },
  { id: 'reysas', name: 'Reysaş Lojistik' },
  { id: 'omsan', name: 'OMSAN Lojistik' },
  { id: 'ozel', name: 'Özmal / Serbest Taşıyıcı' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'tr',
  emailSendMethod: 'app',
  recipientEmail: 'gurcu87@gmail.com',
  ccEmail: '',
  inspectorName: 'Rampa Kontrol Görevlisi',
  savedInspectors: ['Murat', 'Celal', 'Tino', 'Mike', 'Hasan'],
  autoCompress: true,
  maxPhotoDimension: 1280,
  smtpConfig: {
    host: '',
    port: 587,
    user: '',
    pass: '',
    secure: false,
  },
  companies: DEFAULT_COMPANIES,
};

const STORAGE_KEYS = {
  SETTINGS: 'tir_app_settings_v1',
  DRAFT: 'tir_active_draft_v1',
  HISTORY: 'tir_shipment_history_v1',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      language: parsed.language || 'tr',
      emailSendMethod: parsed.emailSendMethod || 'app',
      savedInspectors: Array.isArray(parsed.savedInspectors) && parsed.savedInspectors.length > 0
        ? parsed.savedInspectors
        : DEFAULT_SETTINGS.savedInspectors,
      companies: parsed.companies && parsed.companies.length > 0 ? parsed.companies : DEFAULT_COMPANIES,
      smtpConfig: {
        ...DEFAULT_SETTINGS.smtpConfig,
        ...(parsed.smtpConfig || {}),
      },
    };
  } catch (e) {
    console.error('Settings load error:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Settings save error:', e);
  }
}

export function loadDraft(): Partial<ShipmentRecord> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT) || sessionStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Draft load error:', e);
    return null;
  }
}

export function saveDraft(draft: Partial<ShipmentRecord>): void {
  try {
    const serialized = JSON.stringify(draft);
    localStorage.setItem(STORAGE_KEYS.DRAFT, serialized);
    try {
      sessionStorage.setItem(STORAGE_KEYS.DRAFT, serialized);
    } catch (_) {}
  } catch (e) {
    console.error('Draft save error:', e);
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.DRAFT);
    } catch (_) {}
  } catch (e) {
    console.error('Draft clear error:', e);
  }
}

export function loadHistory(): ShipmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('History load error:', e);
    return [];
  }
}

export function saveToHistory(record: ShipmentRecord): void {
  try {
    const current = loadHistory();
    // Prepend new record, avoid duplicates
    const filtered = current.filter((r) => r.id !== record.id);
    const updated = [record, ...filtered].slice(0, 50); // keep up to 50 latest
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('History save error:', e);
  }
}

export function deleteFromHistory(id: string): ShipmentRecord[] {
  try {
    const current = loadHistory();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('History delete error:', e);
    return [];
  }
}
