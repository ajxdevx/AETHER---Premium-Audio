"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type ProductVideoChromeProps = {
  src: string;
  poster: string;
  title: string;
  ready: boolean;
  onReady: () => void;
  /** Matches the product card stage so letterboxing isn’t a black flash. */
  stageColor?: string;
};

export function ProductVideoChrome({
  src,
  poster,
  title,
  ready,
  onReady,
  stageColor = "transparent",
}: ProductVideoChromeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (!playing) return;
    hideTimerRef.current = setTimeout(() => {
      setChromeVisible(false);
    }, 2200);
  }, [clearHideTimer, playing]);

  const revealChrome = useCallback(() => {
    setChromeVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        /* gesture / policy — center play remains */
      }
    };

    void tryPlay();
  }, [src]);

  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  useEffect(() => {
    if (!playing) return;
    scheduleHide();
    return clearHideTimer;
  }, [playing, scheduleHide, clearHideTimer]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    revealChrome();
    if (video.paused) {
      try {
        await video.play();
      } catch {
        /* autoplay / gesture policies */
      }
    } else {
      video.pause();
    }
  }, [revealChrome]);

  const toggleMute = useCallback(
    (e?: { stopPropagation?: () => void }) => {
      e?.stopPropagation?.();
      const video = videoRef.current;
      if (!video) return;
      const next = !video.muted;
      video.muted = next;
      setMuted(next);
      revealChrome();
    },
    [revealChrome]
  );

  const seekFromClientX = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setProgress(ratio);
    setCurrentTime(video.currentTime);
  }, []);

  const onBarPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      seekFromClientX(e.clientX);
      revealChrome();
    },
    [revealChrome, seekFromClientX]
  );

  const onBarPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      seekFromClientX(e.clientX);
    },
    [seekFromClientX]
  );

  const onBarPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      scheduleHide();
    },
    [scheduleHide]
  );

  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: stageColor }}
      onMouseMove={revealChrome}
    >
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        playsInline
        muted={muted}
        autoPlay
        preload="auto"
        aria-label={title}
        className="absolute inset-0 z-0 h-full w-full object-contain"
        style={{ backgroundColor: stageColor }}
        onPlaying={() => {
          setPlaying(true);
          onReady();
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          clearHideTimer();
          setChromeVisible(true);
        }}
        onVolumeChange={() => {
          const video = videoRef.current;
          if (video) setMuted(video.muted);
        }}
        onEnded={() => {
          setPlaying(false);
          setChromeVisible(true);
        }}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video || !video.duration || draggingRef.current) return;
          setProgress(video.currentTime / video.duration);
          setCurrentTime(video.currentTime);
        }}
        onDurationChange={() => {
          const video = videoRef.current;
          if (video) setDuration(video.duration || 0);
        }}
        onClick={(e) => {
          e.stopPropagation();
          void togglePlay();
        }}
      />

      {/* Soft bottom gradient — cinema chrome */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-500",
          ready && chromeVisible ? "opacity-100" : "opacity-0"
        )}
        aria-hidden
      />

      {/* Center play when paused */}
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={(e) => {
          e.stopPropagation();
          void togglePlay();
        }}
        className={cn(
          "absolute left-1/2 top-1/2 z-[3] flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-white/30 bg-white/15 text-white backdrop-blur-md",
          "shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out",
          "hover:scale-110 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.45)]",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          ready && (!playing || chromeVisible)
            ? "opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-95"
        )}
      >
        {playing ? (
          <Pause size={22} strokeWidth={2} className="fill-current" aria-hidden />
        ) : (
          <Play
            size={22}
            strokeWidth={2}
            className="ml-0.5 fill-current"
            aria-hidden
          />
        )}
      </button>

      {/* Bottom control rail — above video so mute/play always receive clicks */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[5] px-4 pb-4 pt-8 transition-all duration-500 sm:px-5 sm:pb-5",
          ready && chromeVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          ref={barRef}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          onPointerDown={onBarPointerDown}
          onPointerMove={onBarPointerMove}
          onPointerUp={onBarPointerUp}
          onPointerCancel={onBarPointerUp}
          onKeyDown={(e) => {
            const video = videoRef.current;
            if (!video || !video.duration) return;
            if (e.key === "ArrowRight") {
              video.currentTime = Math.min(
                video.duration,
                video.currentTime + 5
              );
            } else if (e.key === "ArrowLeft") {
              video.currentTime = Math.max(0, video.currentTime - 5);
            }
          }}
          className="group/seek relative mb-3.5 h-5 cursor-pointer touch-none"
        >
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 transition-[height] duration-200 group-hover/seek:h-[3px]">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear group-hover/seek:bg-brand"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 scale-75 shadow-[0_0_0_4px_rgba(var(--brand-accent-rgb),0.22)] transition-all duration-200 group-hover/seek:opacity-100 group-hover/seek:scale-100 group-hover/seek:bg-brand group-focus-visible/seek:opacity-100 group-focus-visible/seek:scale-100"
            style={{ left: `${progress * 100}%` }}
            aria-hidden
          />
        </div>

        <div className="relative z-[1] flex items-center gap-2.5">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={(e) => {
              e.stopPropagation();
              void togglePlay();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,color,transform,box-shadow] duration-300 ease-out hover:scale-105 hover:bg-brand hover:text-white hover:shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)] active:scale-95"
          >
            {playing ? (
              <Pause size={16} strokeWidth={2.25} aria-hidden />
            ) : (
              <Play
                size={16}
                strokeWidth={2.25}
                className="ml-px fill-current"
                aria-hidden
              />
            )}
          </button>

          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,color,transform,box-shadow] duration-300 ease-out hover:scale-105 hover:bg-brand hover:text-white hover:shadow-[0_4px_16px_-6px_rgba(var(--brand-accent-rgb),0.35)] active:scale-95"
          >
            {muted ? (
              <VolumeX size={16} strokeWidth={2.25} aria-hidden />
            ) : (
              <Volume2 size={16} strokeWidth={2.25} aria-hidden />
            )}
          </button>

          <p className="ml-1.5 font-mono text-[11px] tracking-wide text-white/55 tabular-nums">
            <span className="text-white/85">{formatTime(currentTime)}</span>
            <span className="mx-1.5 text-white/25">/</span>
            <span>{formatTime(duration)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
