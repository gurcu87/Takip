import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import {
  buildEmailHtml,
  buildEmailSubject,
  buildEmailPlainText,
  getEmailDictionary,
  getPhotoAttachmentFilename,
} from './src/utils/emailTemplates';

interface ShipmentReportPayload {
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
  photos: {
    plate?: string;
    frontCargo?: string;
    rearCargo?: string;
    packingList?: string;
    seal?: string;
  };
  smtpConfig?: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    secure?: boolean;
  };
}

const reportsStore: Array<Omit<ShipmentReportPayload, 'photos'> & { photoCount: number; id: string; createdAt: string }> = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept up to 25MB for base64 encoded photo attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get saved reports list (metadata only, without heavy base64 strings)
  app.get('/api/reports', (req, res) => {
    res.json({ success: true, reports: reportsStore });
  });

  // Send shipment report endpoint
  app.post('/api/send-report', async (req, res) => {
    try {
      const data: ShipmentReportPayload = req.body;

      if (!data.companyName || !data.listNumber || !data.tractorPlate || !data.recipientEmail) {
        return res.status(400).json({
          success: false,
          error: 'Eksik bilgi: Firma adı, liste numarası, çekici plakası ve alıcı e-posta adresi zorunludur.',
        });
      }

      const reportId = data.id || `SEVK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const createdAt = new Date().toISOString();

      // Count provided photos
      const photoKeys = Object.keys(data.photos || {});
      const photoCount = photoKeys.filter((k) => !!data.photos[k as keyof typeof data.photos]).length;

      // Save to lightweight history log
      reportsStore.unshift({
        id: reportId,
        recipientEmail: data.recipientEmail,
        ccEmail: data.ccEmail,
        companyName: data.companyName,
        listNumber: data.listNumber,
        tractorPlate: data.tractorPlate,
        trailerPlate: data.trailerPlate,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        sealNumber: data.sealNumber,
        notes: data.notes,
        inspectorName: data.inspectorName,
        timestamp: data.timestamp || createdAt,
        photoCount,
        createdAt,
      });

      // Keep last 100 in memory
      if (reportsStore.length > 100) {
        reportsStore.pop();
      }

      // Check if SMTP credentials exist in request or environment
      const smtpHost = data.smtpConfig?.host || process.env.SMTP_HOST;
      const smtpPort = Number(data.smtpConfig?.port || process.env.SMTP_PORT || 587);
      const smtpUser = data.smtpConfig?.user || process.env.SMTP_USER;
      const smtpPass = data.smtpConfig?.pass || process.env.SMTP_PASS;
      const isSecure = data.smtpConfig?.secure ?? (smtpPort === 465);

      // Determine language and load email dictionary
      const activeLang = data.language || 'tr';
      const dict = getEmailDictionary(activeLang);

      const htmlContent = buildEmailHtml(data, activeLang);
      const textContent = buildEmailPlainText(data, activeLang);

      // Build attachments array from base64 photos with localized filenames
      const attachments: Array<{ filename: string; content: string; encoding: string; cid?: string }> = [];

      if (data.photos) {
        for (const [key, base64Url] of Object.entries(data.photos)) {
          if (base64Url && typeof base64Url === 'string' && base64Url.startsWith('data:image/')) {
            const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '');
            const filename = getPhotoAttachmentFilename(key, data.tractorPlate, activeLang);
            attachments.push({
              filename,
              content: base64Data,
              encoding: 'base64',
            });
          }
        }
      }

      if (smtpHost && smtpUser && smtpPass) {
        // Send real email with nodemailer
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: isSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const subject = buildEmailSubject(data, activeLang);

        const mailOptions = {
          from: `"${dict.fromName}" <${smtpUser}>`,
          to: data.recipientEmail,
          cc: data.ccEmail || undefined,
          subject,
          text: textContent,
          html: htmlContent,
          attachments,
        };

        const info = await transporter.sendMail(mailOptions);

        return res.json({
          success: true,
          mode: 'real_smtp',
          reportId,
          messageId: info.messageId,
          recipient: data.recipientEmail,
          attachmentCount: attachments.length,
          message: `${data.recipientEmail} adresine e-posta ${attachments.length} adet fotoğraflı ek ile başarıyla gönderildi.`,
        });
      } else {
        // Successful simulation/queue mode when SMTP is not configured yet
        return res.json({
          success: true,
          mode: 'ready_logged',
          reportId,
          recipient: data.recipientEmail,
          attachmentCount: attachments.length,
          message: `Sevk tutanağı (#${reportId}) başarıyla hazırlandı ve kayıt altına alındı. E-posta otomatik gönderimi için Ayarlar'dan SMTP sunucu bilgilerinizi girebilir veya ekrandaki butonlarla doğrudan telefonunuzdaki Gmail / Paylaş menüsüyle gönderebilirsiniz.`,
        });
      }
    } catch (err: any) {
      console.error('Error handling /api/send-report:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'E-posta gönderilirken bir hata meydana geldi.',
      });
    }
  });

  // Test SMTP connection endpoint
  app.post('/api/test-smtp', async (req, res) => {
    try {
      const { smtpConfig, testRecipient } = req.body;
      const host = smtpConfig?.host || process.env.SMTP_HOST;
      const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 587);
      const user = smtpConfig?.user || process.env.SMTP_USER;
      const pass = smtpConfig?.pass || process.env.SMTP_PASS;
      const secure = smtpConfig?.secure ?? (port === 465);

      if (!host || !user || !pass) {
        return res.status(400).json({
          success: false,
          error: 'SMTP Host, Kullanıcı Adı ve Şifre alanları zorunludur.',
        });
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      // Verify connection configuration
      await transporter.verify();

      // If test recipient provided, send a quick test ping
      if (testRecipient) {
        await transporter.sendMail({
          from: `"Tır Sevk Kontrol Test" <${user}>`,
          to: testRecipient,
          subject: '✅ [TEST BAŞARILI] Tır Sevk Kontrol E-posta Bağlantısı',
          text: 'Tebrikler! Tır Sevkiyat ve Yükleme Takip Sistemi e-posta sunucu bağlantınız başarıyla kurulmuştur. Artık yapılan yüklemelerin fotoğraflı tutanakları bu adrese sorunsuz ulaşacaktır.',
        });
      }

      return res.json({
        success: true,
        message: `SMTP sunucusuna başarıyla bağlanıldı! ${testRecipient ? `${testRecipient} adresine test mesajı gönderildi.` : ''}`,
      });
    } catch (err: any) {
      console.error('SMTP test error:', err);
      return res.status(500).json({
        success: false,
        error: `Bağlantı hatası: ${err.message || 'SMTP sunucusuna bağlanılamadı. Lütfen sunucu, port veya şifrenizi kontrol ediniz.'}`,
      });
    }
  });

  // PWA Manifest with explicit application/manifest+json MIME type
  app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
  });

  // Service Worker with explicit Service-Worker-Allowed scope header
  app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tır Sevk Sunucusu http://0.0.0.0:${PORT} adresinde aktif.`);
  });
}

startServer();
