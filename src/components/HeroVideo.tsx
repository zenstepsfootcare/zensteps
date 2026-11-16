"use client";

import React from "react";

/**
 * Background video that can play a trimmed segment [start, end) on loop.
 * `#t=start` makes the browser begin there natively (before hydration); the loop is done
 * here rather than with `loop`, which would always jump back to 0s.
 * See BRAND_VIDEO in VideoHero.tsx for why the brand film needs trimming.
 */
interface HeroVideoProps {
  src: string;
  poster?: string;
  start?: number;
  end?: number;
  className?: string;
}

export function HeroVideo({ src, poster, start = 0, end, className = "" }: HeroVideoProps) {
  const restart = (video: HTMLVideoElement) => {
    video.currentTime = start;
    void video.play().catch(() => {});
  };

  return (
    <video
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={poster}
      loop={end === undefined}
      aria-hidden="true"
      className={className}
      onTimeUpdate={
        end === undefined
          ? undefined
          : (e) => {
              if (e.currentTarget.currentTime >= end) restart(e.currentTarget);
            }
      }
      onEnded={(e) => restart(e.currentTarget)}
    >
      <source src={start > 0 ? `${src}#t=${start}` : src} type="video/mp4" />
    </video>
  );
}
