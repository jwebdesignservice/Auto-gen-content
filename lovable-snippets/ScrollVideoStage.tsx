import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  poster?: string;
  scrollVH?: number;
}

/**
 * Pinned background video whose playback position is driven by page scroll.
 * Never auto-plays. We only nudge currentTime to force the first frame
 * to paint, then scrubbing takes over. Plays forward as the user scrolls
 * down and reverses as they scroll up.
 *
 * REUSABLE SNIPPET for Lovable builds. Drop into src/components and pass a
 * `src` (short, compressed, frame-seek-friendly mp4) plus an optional poster.
 * Tweak the dark tint / filter values per site theme (the --forest and
 * rgba(10,25,18,...) values below are placeholders from one build).
 */
export function ScrollVideoStage({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const tickingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.removeAttribute("autoplay");

    const updateDuration = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        durationRef.current = d;
        setIsReady(true);
      }
    };

    updateDuration();
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("loadeddata", updateDuration);
    video.addEventListener("canplay", updateDuration);

    // Kick the loader (some browsers won't fetch metadata until interaction)
    try {
      video.load();
    } catch {
      /* noop */
    }

    const onPlay = () => {
      if (!video.paused) video.pause();
    };
    video.addEventListener("play", onPlay);

    return () => {
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("loadeddata", updateDuration);
      video.removeEventListener("canplay", updateDuration);
      video.removeEventListener("play", onPlay);
    };
  }, [src]);

  useEffect(() => {
    if (!isReady) return;
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    const loop = () => {
      const duration = durationRef.current;
      if (duration > 0) {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        targetTimeRef.current = progress * Math.max(duration - 0.05, 0);

        const next =
          currentTimeRef.current +
          (targetTimeRef.current - currentTimeRef.current) * 0.18;
        currentTimeRef.current = next;

        // Clamp to seekable range to avoid silent failures while buffering
        let seekTo = next;
        if (video.seekable && video.seekable.length > 0) {
          const end = video.seekable.end(video.seekable.length - 1);
          if (seekTo > end) seekTo = end;
        }

        if (Math.abs(video.currentTime - seekTo) > 1 / 60) {
          try {
            video.currentTime = seekTo;
          } catch {
            /* noop */
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isReady]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--forest)]"
      aria-hidden
      style={{ height: "100vh" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(0.9) contrast(1.05) brightness(0.7)" }}
      />
      {poster && !isReady && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Uniform dark tint across the whole site for consistent legibility */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,25,18,0.32)" }}
      />
    </div>
  );
}
