import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LiveCameraModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onFallbackToFileInput: () => void;
  language?: 'tr' | 'de';
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  title,
  isOpen,
  onClose,
  onCapture,
  onFallbackToFileInput,
  language = 'tr',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const t = {
    takePhoto: language === 'de' ? 'Foto aufnehmen' : 'Fotoğraf Çek',
    retake: language === 'de' ? 'Wiederholen' : 'Yeniden Çek',
    usePhoto: language === 'de' ? 'Foto verwenden' : 'Fotoğrafı Kullan',
    switchCamera: language === 'de' ? 'Kamera wechseln' : 'Kamerayı Çevir',
    useNative: language === 'de' ? 'Galerie / System-Kamera' : 'Galeri / Sistem Kamerası',
    cameraDenied: language === 'de' 
      ? 'Kamerazugriff verweigert oder nicht verfügbar.' 
      : 'Kamera erişimine izin verilmedi veya kamera bulunamadı.',
    aimGuide: language === 'de' ? 'Objekt im Rahmen zentrieren' : 'Görüntüyü çerçeveye ortalayın',
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    stopStream();
    setCameraError(null);
    setCapturedUrl(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(t.cameraDenied);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      setCameraError(t.cameraDenied);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
      setCapturedUrl(null);
      setCameraError(null);
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    setCapturedUrl(dataUrl);
    stopStream();
  };

  const handleConfirm = () => {
    if (capturedUrl) {
      onCapture(capturedUrl);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedUrl(null);
    startCamera();
  };

  const handleSwitchMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between text-white bg-black/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold truncate max-w-[220px]">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center text-white space-y-4 max-w-sm">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <p className="text-sm text-slate-300">{cameraError}</p>
            <button
              onClick={() => {
                onClose();
                onFallbackToFileInput();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm shadow-lg cursor-pointer"
            >
              {t.useNative}
            </button>
          </div>
        ) : capturedUrl ? (
          // Captured Preview
          <img
            src={capturedUrl}
            alt="Snapped"
            className="w-full h-full object-contain"
          />
        ) : (
          // Live Video
          <>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Overlay Guides */}
            <div className="absolute inset-8 sm:inset-16 border-2 border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
                <div className="w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
              </div>
              <div className="text-center text-white/80 text-xs bg-black/40 py-1 px-3 rounded-full mx-auto backdrop-blur-xs">
                {t.aimGuide}
              </div>
              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
                <div className="w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-black/80 backdrop-blur-md flex items-center justify-around z-10">
        {capturedUrl ? (
          <div className="flex items-center justify-between w-full max-w-sm gap-4">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.retake}</span>
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.usePhoto}</span>
            </button>
          </div>
        ) : !cameraError ? (
          <div className="flex items-center justify-between w-full max-w-sm">
            {/* Fallback to gallery / native camera button */}
            <button
              onClick={() => {
                onClose();
                onFallbackToFileInput();
              }}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              title={t.useNative}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={handleSnap}
              className="w-18 h-18 rounded-full border-4 border-white bg-white/20 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-2xl"
              title={t.takePhoto}
            >
              <div className="w-14 h-14 rounded-full bg-white"></div>
            </button>

            {/* Switch Camera */}
            <button
              onClick={handleSwitchMode}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              title={t.switchCamera}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
