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
import { izlemeGecmisiGuncelle } from "../../_lib/data-service-server";

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
  filmId,
  bolumId,
  baslangicSaniyesi = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimeRef = useRef<number>(0); // Son kaydedilen saniyeyi tutar

  // --- STATE ---
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- KAYIT FONKSİYONU ---
  const saveProgress = async (time: number, totalDuration: number) => {
    // Geçersiz değerleri veya çok sık kayıtları engelle
    if (time <= 0 || totalDuration <= 0) return;
    if (Math.abs(time - lastSavedTimeRef.current) < 5) return; // En az 5 saniye fark olsun

    lastSavedTimeRef.current = time;

    // Server action çağrısı (Arka planda çalışır, UI'ı bloklamaz)
    // filmId veya bolumId'den hangisi varsa onu kullanır
    try {
      await izlemeGecmisiGuncelle({
        filmId,
        bolumId,
        saniye: time,
        toplamSaniye: totalDuration,
      });
      // console.log("Kayıt Başarılı:", time);
    } catch (error) {
      console.error("Kayıt Hatası:", error);
    }
  };

  // --- COMPONENT MOUNT ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (baslangicSaniyesi > 0) {
      video.currentTime = baslangicSaniyesi;
    }

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
      // Sayfadan çıkarken son kez kaydet
      if (video) saveProgress(video.currentTime, video.duration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baslangicSaniyesi]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (!playing) return;

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
      // Durdurulunca kaydet
      saveProgress(video.currentTime, video.duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDragging) return;

    const curr = video.currentTime;
    setCurrentTime(curr);

    // Her 10 saniyede bir otomatik kaydet
    if (Math.floor(curr) > 0 && Math.floor(curr) % 10 === 0) {
      saveProgress(curr, video.duration);
    }
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
    // Bittiğinde son kez kaydet (Backend %95 üstü olunca "izlendi" işaretler)
    if (videoRef.current)
      saveProgress(videoRef.current.duration, videoRef.current.duration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    setIsDragging(true);
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const video = videoRef.current;
    if (video) {
      const target = e.target as HTMLInputElement;
      const newTime = parseFloat(target.value);
      video.currentTime = newTime;
      video.play();
      setPlaying(true);
      // Sarmadan sonra hemen kaydet
      saveProgress(newTime, video.duration);
    }
    setIsDragging(false);
  };

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

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const toggleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerContainerRef}
      className="group relative flex aspect-video w-full flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={() => setShowControls(true)}
    >
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

      {buffering && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <Loader2 className="h-16 w-16 animate-spin text-yellow-500" />
        </div>
      )}

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

      <div
        className={`absolute right-0 bottom-0 left-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-6 transition-all duration-300 ${
          showControls
            ? "visible opacity-100"
            : "invisible translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group/slider relative flex h-4 w-full cursor-pointer items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="any"
            value={currentTime}
            onMouseDown={() => setIsDragging(true)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            onTouchEnd={handleSeekMouseUp}
            className="absolute z-20 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
          <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/30 transition-all group-hover/slider:h-2">
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div
            className="pointer-events-none absolute h-4 w-4 scale-0 rounded-full bg-yellow-500 shadow-lg transition-transform duration-200 group-hover/slider:scale-100"
            style={{
              left: `${progressPercent}%`,
              transform: `translateX(-50%) ${progressPercent === 0 ? "scale(0)" : ""}`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
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

            <button
              onClick={handleRewind}
              className="group/rewind flex flex-col items-center text-xs text-white/80 hover:text-white"
            >
              <RotateCcw className="h-5 w-5 transition-transform group-hover/rewind:-rotate-45" />
            </button>

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
