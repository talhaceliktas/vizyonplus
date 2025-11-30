"use client";

import React, { useState, useRef, useEffect } from "react";
import screenfull from "screenfull";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Loader2,
} from "lucide-react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  filmId?: number;
  bolumId?: number;
  baslangicSaniyesi?: number;
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

export default function CustomVideoPlayer({
  src,
  poster,
  baslangicSaniyesi = 0,
}: VideoPlayerProps) {
  // Native Video Element Referansı
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- STATE ---
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Anlık süre
  const [duration, setDuration] = useState(0); // Toplam süre
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // İlerleme çubuğunu tutuyor mu?

  // --- COMPONENT MOUNT ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Başlangıç saniyesini ayarla
    if (baslangicSaniyesi > 0) {
      video.currentTime = baslangicSaniyesi;
    }

    // Tam ekran dinleyicisi
    const handleFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleFullscreenChange);
      }
    };
  }, [baslangicSaniyesi]);

  // --- KONTROLLERİ GİZLEME MANTIĞI ---
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (!playing) return; // Video duruyorsa gizleme

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // --- VİDEO EVENT HANDLERS (Native HTML5 Eventleri) ---

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDragging) return; // Sürüklerken update etme
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleWaiting = () => setBuffering(true);
  const handlePlaying = () => setBuffering(false);

  const handleEnded = () => {
    setPlaying(false);
    setShowControls(true);
  };

  // --- SEEKING (İlerleme Çubuğu) ---
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime); // Görsel olarak güncelle
    setIsDragging(true);
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const video = videoRef.current;
    if (video) {
      // Değeri event target'tan al veya state'ten kullan
      const target = e.target as HTMLInputElement;
      video.currentTime = parseFloat(target.value);
      video.play();
      setPlaying(true);
    }
    setIsDragging(false);
  };

  // --- SES ---
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  // --- GERİ SARMA ---
  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  // --- TAM EKRAN ---
  const toggleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
    }
  };

  // İlerleme yüzdesi (CSS için)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerContainerRef}
      className="group relative flex aspect-video w-full flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={() => setShowControls(true)}
    >
      {/* --- NATIVE HTML5 VIDEO --- */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-contain"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        playsInline
      />

      {/* --- BUFFERING LOADER --- */}
      {buffering && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <Loader2 className="h-16 w-16 animate-spin text-yellow-500" />
        </div>
      )}

      {/* --- ORTA BÜYÜK PLAY/PAUSE (Duraklatıldığında görünür) --- */}
      {!playing && !buffering && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="animate-in zoom-in fade-in pointer-events-auto cursor-pointer rounded-full bg-black/40 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:bg-black/60"
          >
            <Play className="ml-1 h-12 w-12 fill-white text-white" />
          </div>
        </div>
      )}

      {/* --- KONTROL PANELI (Overlay) --- */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-6 transition-all duration-300 ${
          showControls
            ? "visible opacity-100"
            : "invisible translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="group/slider relative flex h-4 w-full cursor-pointer items-center">
          <input
            type="range"
            min={0}
            max={duration || 100} // duration yoksa 100 varsay
            step="any"
            value={currentTime}
            onMouseDown={() => setIsDragging(true)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            onTouchEnd={handleSeekMouseUp}
            className="absolute z-20 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />

          {/* Çubuk Arka Plan */}
          <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/30 transition-all group-hover/slider:h-2">
            {/* Doluluk Çizgisi */}
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Top (Thumb) */}
          <div
            className="pointer-events-none absolute h-4 w-4 scale-0 rounded-full bg-yellow-500 shadow-lg transition-transform duration-200 group-hover/slider:scale-100"
            style={{
              left: `${progressPercent}%`,
              transform: `translateX(-50%) ${progressPercent === 0 ? "scale(0)" : ""}`,
            }}
          />
        </div>

        {/* Alt Kontroller */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Oynat / Durdur */}
            <button
              onClick={togglePlay}
              className="transform text-white transition-colors hover:text-yellow-500 active:scale-90"
            >
              {playing ? (
                <Pause className="h-7 w-7 fill-current" />
              ) : (
                <Play className="h-7 w-7 fill-current" />
              )}
            </button>

            {/* 10sn Geri */}
            <button
              onClick={handleRewind}
              className="group/rewind flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <RotateCcw className="h-5 w-5 transition-transform group-hover/rewind:-rotate-45" />
            </button>

            {/* Ses */}
            <div className="group/volume flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white transition-colors hover:text-yellow-500"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1 w-0 cursor-pointer appearance-none overflow-hidden rounded-lg bg-white/30 accent-yellow-500 transition-all duration-300 group-hover/volume:w-20"
              />
            </div>

            {/* Süre */}
            <div className="text-xs font-medium text-white/90">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-white/50">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleFullScreen}
              className="text-white transition-transform hover:scale-110 hover:text-yellow-500"
            >
              {isFullscreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
