import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, Eye, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Video } from 'lucide-react';
import { compressImage, formatBytes } from '../utils/imageCompressor';
import { LiveCameraModal } from './LiveCameraModal';

interface PhotoUploadSlotProps {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  value?: string;
  onChange: (dataUrl?: string) => void;
  onView: (dataUrl: string, title: string) => void;
  onBeforeCapture?: () => void;
  autoCompress?: boolean;
  maxDimension?: number;
  language?: 'tr' | 'de';
  labels?: {
    requiredBadge?: string;
    optionalBadge?: string;
    shootWithCamera?: string;
    selectFromGallery?: string;
    added?: string;
    requiredIndicator?: string;
    viewLarge?: string;
    retake?: string;
    delete?: string;
    optimized?: string;
    processing?: string;
  };
}

export const PhotoUploadSlot: React.FC<PhotoUploadSlotProps> = ({
  id,
  title,
  description,
  required = false,
  value,
  onChange,
  onView,
  onBeforeCapture,
  autoCompress = true,
  maxDimension = 1280,
  language = 'tr',
  labels,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressStats, setCompressStats] = useState<{ orig: number; comp: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);

  const tLabels = {
    requiredBadge: labels?.requiredBadge || 'Zorunlu',
    optionalBadge: labels?.optionalBadge || 'İsteğe Bağlı',
    shootWithCamera: labels?.shootWithCamera || 'Kamera ile Çek',
    selectFromGallery: labels?.selectFromGallery || 'Galeriden Seç',
    added: labels?.added || 'Eklendi',
    requiredIndicator: labels?.requiredIndicator || 'Gerekli',
    viewLarge: labels?.viewLarge || 'Büyük İncele',
    retake: labels?.retake || 'Değiştir',
    delete: labels?.delete || 'Fotoğrafı Sil',
    optimized: labels?.optimized || 'Otomatik Optimize Edildi',
    processing: labels?.processing || 'Fotoğraf optimize ediliyor...',
  };

  const handleOpenLiveCamera = () => {
    if (onBeforeCapture) onBeforeCapture();
    setIsLiveCameraOpen(true);
  };

  const handleOpenNativeCamera = () => {
    if (onBeforeCapture) onBeforeCapture();
    cameraInputRef.current?.click();
  };

  const handleOpenGallery = () => {
    if (onBeforeCapture) onBeforeCapture();
    galleryInputRef.current?.click();
  };

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Lütfen sadece resim formatı (JPEG, PNG vb.) seçiniz.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (autoCompress) {
        const result = await compressImage(file, maxDimension, 0.78);
        setCompressStats({ orig: result.originalSize, comp: result.compressedSize });
        onChange(result.dataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Fotoğraf işleme hatası:', err);
      setErrorMsg(err.message || 'Fotoğraf işlenirken hata oluştu.');
    } finally {
      setIsProcessing(false);
      // Reset input value so re-selecting same file triggers change
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const onCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setCompressStats(null);
  };

  const handleLiveCameraCapture = (dataUrl: string) => {
    onChange(dataUrl);
    setCompressStats({ orig: 1024 * 600, comp: Math.round(dataUrl.length * 0.75) });
  };

  return (
    <div
      id={`slot-card-${id}`}
      className={`rounded-xl border transition-all duration-200 bg-white p-2.5 sm:p-4 shadow-xs ${
        value
          ? 'border-emerald-300 ring-1 ring-emerald-200/50 bg-emerald-50/20'
          : required
          ? 'border-slate-300 hover:border-blue-400'
          : 'border-slate-200 bg-slate-50/40'
      }`}
    >
      {/* Live In-App Viewfinder Camera Modal */}
      <LiveCameraModal
        title={title}
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleLiveCameraCapture}
        onFallbackToFileInput={handleOpenNativeCamera}
        language={language}
      />

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onCameraChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onGalleryChange}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <h3 className="font-bold text-xs sm:text-sm text-slate-850 truncate tracking-tight">{title}</h3>

        {/* Status indicator */}
        {value ? (
          <div className="flex items-center gap-1 text-emerald-600 shrink-0 font-bold text-[10px] sm:text-xs bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>{tLabels.added}</span>
          </div>
        ) : (
          required && (
            <span className="text-[10px] sm:text-[11px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
              {tLabels.requiredBadge}
            </span>
          )
        )}
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="mb-2 p-1.5 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Main Body: Preview or Upload Actions */}
      {value ? (
        <div className="space-y-1.5">
          {/* Thumbnail preview container */}
          <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-4/3 sm:aspect-16/9 flex items-center justify-center">
            <img
              src={value}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay actions on mobile/hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-1.5 sm:p-2.5">
              <button
                type="button"
                id={`btn-view-${id}`}
                onClick={() => onView(value, title)}
                className="flex items-center gap-1 bg-white/90 hover:bg-white text-slate-800 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="hidden xs:inline sm:inline">{tLabels.viewLarge}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  id={`btn-retake-${id}`}
                  onClick={handleOpenLiveCamera}
                  className="flex items-center gap-1 bg-slate-800/90 hover:bg-slate-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded transition active:scale-95 cursor-pointer"
                  title={tLabels.retake}
                >
                  <RefreshCw className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">{tLabels.retake}</span>
                </button>
                <button
                  type="button"
                  id={`btn-delete-${id}`}
                  onClick={handleDelete}
                  className="flex items-center gap-1 bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] sm:text-xs p-1 sm:p-1.5 rounded transition active:scale-95 cursor-pointer"
                  title={tLabels.delete}
                >
                  <Trash2 className="w-3 h-3 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Compression Info Badge */}
          {compressStats && (
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>{formatBytes(compressStats.comp)}</span>
              </span>
              <span className="text-slate-400">
                {tLabels.optimized}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Empty State with Dual Action: Camera & Gallery */
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-2 sm:p-3 bg-slate-50/50 flex flex-col items-center justify-center">
          {isProcessing ? (
            <div className="py-4 flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-[11px] text-slate-600 font-medium">{tLabels.processing}</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2">
              {/* Primary: Direct In-App Camera button (safest for memory, no app switch) */}
              <button
                type="button"
                id={`btn-camera-${id}`}
                onClick={handleOpenLiveCamera}
                className="flex flex-col items-center justify-center gap-1 py-2.5 sm:py-3.5 px-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-xs transition active:scale-95 cursor-pointer text-center"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold leading-tight line-clamp-1">{language === 'de' ? 'Kamera' : 'Kamera'}</span>
              </button>

              {/* Secondary: Choose from gallery / file */}
              <button
                type="button"
                id={`btn-gallery-${id}`}
                onClick={handleOpenGallery}
                className="flex flex-col items-center justify-center gap-1 py-2.5 sm:py-3.5 px-1 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg shadow-xs transition active:scale-95 cursor-pointer text-center"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold leading-tight line-clamp-1">{language === 'de' ? 'Galerie' : 'Galeri'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
