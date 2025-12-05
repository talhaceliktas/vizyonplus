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
import { updateWatchHistory } from "../actions";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  contentId: number;
  initialTime?: number;
  contentType: "film" | "dizi"; // Genişletilebilir
  seasonId?: number;
  episodeId?: number;
}

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
  seasonId,
  episodeId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimeRef = useRef<number>(0);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- PROGRESS SAVING ---
  const saveProgress = async (time: number, totalDuration: number) => {
    if (time <= 0 || totalDuration <= 0) return;
    if (Math.abs(time - lastSavedTimeRef.current) < 5) return; // 5 sn throttle

    lastSavedTimeRef.current = time;

    try {
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
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (initialTime > 0) video.currentTime = initialTime;

    const handleFullscreenChange = () =>
      setIsFullscreen(screenfull.isFullscreen);
    if (screenfull.isEnabled) screenfull.on("change", handleFullscreenChange);

    return () => {
      if (screenfull.isEnabled)
        screenfull.off("change", handleFullscreenChange);
      if (video) saveProgress(video.currentTime, video.duration);
    };
  }, [initialTime]);

  // --- HANDLERS ---
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (!isPlaying) return;
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
      saveProgress(video.currentTime, video.duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDragging) return;

    const curr = video.currentTime;
    setCurrentTime(curr);

    // Auto-save every 10 seconds
    if (Math.floor(curr) > 0 && Math.floor(curr) % 10 === 0) {
      saveProgress(curr, video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    setIsDragging(true);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  // --- RENDER ---
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative h-full w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
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
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        playsInline
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <Loader2 className="h-16 w-16 animate-spin text-yellow-500" />
        </div>
      )}

      {/* Big Play Button Overlay */}
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

      {/* CONTROLS BAR */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-30 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 ${
          showControls ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="group/slider relative mb-3 flex h-1.5 w-full cursor-pointer items-center rounded-full bg-white/20 hover:h-2">
          <div
            className="absolute left-0 h-full rounded-full bg-yellow-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Draggable Input */}
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

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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

            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="text-white/80 hover:text-white"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            {/* Volume */}
            <div className="group/vol flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-6 w-6 text-white" />
                ) : (
                  <Volume2 className="h-6 w-6 text-white" />
                )}
              </button>
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

            <span className="text-sm font-medium text-white/90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

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
