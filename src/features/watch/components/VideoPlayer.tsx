"use client";

import React, { useState, useRef, useEffect } from "react";
import screenfull from "screenfull"; // Tam ekran yönetimi için popüler bir paket
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
import { updateWatchHistory } from "../actions";

// BU DOSYA NE İŞE YARAR?
// Özel Video Oynatıcı (Custom Video Player).
// Tarayıcının standart oynatıcısı yerine, kendi tasarımımız olan kontrolleri kullanır.
// İzleme süresini otomatik kaydeder (Resume feature).

interface VideoPlayerProps {
  src: string; // Video URL'si
  poster?: string; // Kapak resmi
  contentId: number; // Hangi içerik izleniyor?
  initialTime?: number; // Kaldığı yerden devam etmesi için başlangıç süresi
  contentType: "film" | "dizi";
  seasonId?: number;
  episodeId?: number;
}

// Süreyi okunabilir formata çevirir (örn: 7523 sn -> 02:05:23)
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  return hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function VideoPlayer({
  src,
  poster,
  contentId,
  initialTime = 0,
  contentType,
  // seasonId, // Kullanılmıyor, lint hatasını önlemek için kaldırıldı
  episodeId,
}: VideoPlayerProps) {
  // REFS (Referanslar)
  // HTMLVideoElement'e doğrudan erişmek için kullanılır (videoRef.current.play() gibi).
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Tam ekran yapılacak kapsayıcı
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Kontrolleri gizlemek için zamanlayıcı
  const lastSavedTimeRef = useRef<number>(0); // En son sunucuya gönderilen saniye

  // STATES (Durumlar)
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 0 ile 1 arası
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true); // Mouse durunca gizlensin mi?
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); // Yükleniyor spinner'ı
  const [isDragging, setIsDragging] = useState(false); // İlerleme çubuğu sürükleniyor mu?

  // --- İZLEME SÜRESİNİ KAYDET (Backend Entegrasyonu) ---
  const saveProgress = React.useCallback(
    async (time: number, totalDuration: number) => {
      if (time <= 0 || totalDuration <= 0) return;

      // Throttle: Çok sık istek atmamak için (en az 5 saniye fark olmalı)
      if (Math.abs(time - lastSavedTimeRef.current) < 5) return;

      lastSavedTimeRef.current = time;

      try {
        // Server Action çağır
        await updateWatchHistory({
          contentId,
          time,
          totalDuration,
          type: contentType,
          episodeId,
        });
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    },
    [contentId, contentType, episodeId],
  );

  // --- BAŞLANGIÇ AYARLARI ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Kaldığı yerden başlat
    if (initialTime > 0) video.currentTime = initialTime;

    // Tam ekran değişimlerini dinle
    const handleFullscreenChange = () =>
      setIsFullscreen(screenfull.isFullscreen);
    if (screenfull.isEnabled) screenfull.on("change", handleFullscreenChange);

    // Temizlik (Cleanup)
    return () => {
      if (screenfull.isEnabled)
        screenfull.off("change", handleFullscreenChange);
      // Sayfadan çıkarken son durumu kaydet
      if (video) saveProgress(video.currentTime, video.duration);
    };
  }, [initialTime, saveProgress]);

  // --- EVENT HANDLERS (Olay Yönetimi) ---

  // Mouse hareket edince kontrolleri göster, sonra zamanlayıcı başlatıp gizle.
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (!isPlaying) return; // Video duruyorsa kontroller hep açık kalsın
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      saveProgress(video.currentTime, video.duration); // Durdurunca hemen kaydet
    }
  };

  // Video her ilerlediğinde (saniyede birkaç kez tetiklenir)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDragging) return; // Sürüklerken update etme (titreme yapar)

    const curr = video.currentTime;
    setCurrentTime(curr);

    // Otomatik Kayıt: Her 10 saniyede bir
    if (Math.floor(curr) > 0 && Math.floor(curr) % 10 === 0) {
      saveProgress(curr, video.duration);
    }
  };

  // İlerleme çubuğunu manuel değiştirme (Seek)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    setIsDragging(true); // Video akışını geçici durdur (UI update'i engellemesin)
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
    if (videoRef.current) {
      videoRef.current.play(); // Sürükleme bitince oynat
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  // --- RENDER (Görünüm) ---
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef} // Tam ekran yapılacak element burası
      className="group relative h-full w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => setShowControls(true)}
    >
      {/* HTML5 Video Elementi (Varsayılan kontroller gizli) */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-contain"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay(); // Videoya tıklayınca durdur/oynat
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true); // Bitince kontrolleri göster
        }}
        playsInline
      />

      {/* Buffering Spinner (Yükleniyor) */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <Loader2 className="h-16 w-16 animate-spin text-yellow-500" />
        </div>
      )}

      {/* Ortadaki Büyük Play Butonu (Sadece duruyorsa görünür) */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-black/70"
          >
            <Play className="ml-1 h-10 w-10 fill-white" />
          </button>
        </div>
      )}

      {/* CONTROLS BAR (Alt Kontrol Çubuğu) */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-30 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 ${
          showControls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()} // Bar'a tıklayınca video durmasın
      >
        {/* İlerleme Çubuğu (Timeline) */}
        <div className="group/slider relative mb-3 flex h-1.5 w-full cursor-pointer items-center rounded-full bg-white/20 hover:h-2">
          {/* Dolu Kısım (Sarı) */}
          <div
            className="absolute left-0 h-full rounded-full bg-yellow-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Görünmez Range Input (Sürükleme mantığı bunun üzerindedir) */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        {/* Alt Butonlar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-yellow-500"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current" />
              )}
            </button>

            {/* 10 Saniye Geri Sar */}
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="text-white/80 hover:text-white"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            {/* Ses Kontrolü */}
            <div className="group/vol flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-6 w-6 text-white" />
                ) : (
                  <Volume2 className="h-6 w-6 text-white" />
                )}
              </button>
              {/* Ses slider'ı hover olunca açılır (w-0 -> w-20) */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) videoRef.current.volume = val;
                }}
                className="h-1 w-0 rounded-lg bg-white/30 accent-yellow-500 opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100"
              />
            </div>

            {/* Süre Bilgisi */}
            <span className="text-sm font-medium text-white/90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Tam Ekran */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-yellow-500"
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
  );
}
