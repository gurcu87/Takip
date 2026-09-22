export interface ShipmentRecord {
  id: string;
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
  status: 'sent' | 'draft' | 'simulated';
  recipientEmail: string;
  ccEmail?: string;
  photos: {
    plate?: string;
    frontCargo?: string;
    rearCargo?: string;
    packingList?: string;
    seal?: string;
  };
}

export interface CompanyItem {
  id: string;
  name: string;
  isCustom?: boolean;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}

export type AppLanguage = 'tr' | 'de';

export type EmailSendMethod = 'app' | 'smtp';

export interface AppSettings {
  language: AppLanguage;
  emailSendMethod?: EmailSendMethod;
  recipientEmail: string;
  ccEmail: string;
  inspectorName: string;
  savedInspectors?: string[];
  autoCompress: boolean;
  maxPhotoDimension: number; // e.g. 1280
  smtpConfig: SmtpConfig;
  companies: CompanyItem[];
}

export type PhotoFieldKey = 'plate' | 'frontCargo' | 'rearCargo' | 'packingList' | 'seal';

export interface PhotoConfig {
  key: PhotoFieldKey;
  title: string;
  description: string;
  required: boolean;
  recommendedAspect?: string;
}
