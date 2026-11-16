"use client";

import React, { useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiEye,
  FiHeart,
  FiInstagram,
  FiMessageCircle,
  FiPlay,
  FiX,
  FiYoutube,
} from "react-icons/fi";
import { parseSocialUrl, type SectionSettings, type SocialEmbed } from "@/lib/homeSections";

export interface SocialVideoItem {
  id: string;
  url: string;
  title: string;
  coverImage: string | null;
  views: string | null;
  likes: string | null;
  comments: string | null;
}

type PlayableVideo = SocialVideoItem & SocialEmbed;

const PLATFORM = {
  youtube: { label: "YouTube", Icon: FiYoutube },
  instagram: { label: "Instagram", Icon: FiInstagram },
} as const;

export function SocialHighlights({
  videos,
  settings,
}: {
  videos: SocialVideoItem[];
  settings: SectionSettings;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<PlayableVideo | null>(null);

  // Links that are not YouTube or Instagram are skipped rather than rendered broken.
  const items: PlayableVideo[] = videos.flatMap((video) => {
    const embed = parseSocialUrl(video.url);
    return embed ? [{ ...video, ...embed }] : [];
  });

  if (items.length === 0) return null;

  const play = (video: PlayableVideo) => {
    setActive(video);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <section id="social" className="section bg-brand text-white">
      <div className="container-site">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-12">
          <div className="max-w-3xl">
            <span className="eyebrow-gold">{settings.socialEyebrow}</span>
            <h2 className="h2 mt-3 text-white">{settings.socialTitle}</h2>
            {settings.socialSubtitle && (
              <p className="lead mt-4 text-white/75">{settings.socialSubtitle}</p>
            )}
          </div>

          {(settings.instagramUrl || settings.youtubeUrl) && (
            <div className="flex shrink-0 flex-wrap gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm"
                >
                  <FiInstagram className="h-4 w-4" aria-hidden="true" />
                  Follow on Instagram
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm"
                >
                  <FiYoutube className="h-4 w-4" aria-hidden="true" />
                  Subscribe on YouTube
                </a>
              )}
            </div>
          )}
        </div>

        {/* Swipeable row on phones, grid from tablet up. `relative` keeps the absolutely
            positioned sr-only labels inside the scroller so they cannot widen the page. */}
        <ul className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {items.map((video) => {
            const { label, Icon } = PLATFORM[video.platform];
            const cover = video.coverImage || video.thumbnail;
            return (
              <li key={video.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
                <article className="flex h-full flex-col bg-brand-dark">
                  <button
                    type="button"
                    onClick={() => play(video)}
                    className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden bg-black/30"
                    aria-label={`Play video: ${video.title}`}
                  >
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      // No cover (typical for Instagram): branded poster instead of a blank frame
                      <span className="flex h-full w-full items-end justify-center pb-[18%]">
                        <img src="/zensteps-logo.png" alt="" className="h-14 w-auto opacity-80" />
                      </span>
                    )}
                    <span className="chip absolute top-3 left-3 bg-brand-dark text-white">
                      <Icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                      {label}
                    </span>
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center bg-gold text-brand transition-colors group-hover:bg-gold-hover">
                      <FiPlay className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                      {video.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                        {video.views && (
                          <span className="flex items-center gap-1.5">
                            <FiEye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">Views:</span> {video.views}
                          </span>
                        )}
                        {video.likes && (
                          <span className="flex items-center gap-1.5">
                            <FiHeart className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">Likes:</span> {video.likes}
                          </span>
                        )}
                        {video.comments && (
                          <span className="flex items-center gap-1.5">
                            <FiMessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">Comments:</span> {video.comments}
                          </span>
                        )}
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open on ${label}`}
                        className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center text-white/70 transition-colors hover:text-gold"
                      >
                        <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Player: the iframe only exists while the dialog is open, so closing stops playback */}
      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={active?.title ?? "Video player"}
        className="m-auto max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 backdrop:bg-black/85"
      >
        {active && (
          <div className="relative">
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-12 right-0 flex h-10 w-10 cursor-pointer items-center justify-center text-white transition-colors hover:bg-white/10"
            >
              <FiX className="h-6 w-6" aria-hidden="true" />
            </button>
            <div
              className={
                active.vertical
                  ? "aspect-[9/16] w-[min(calc(100vw-2rem),calc(min(80vh,760px)*9/16))]"
                  : "aspect-video w-[min(calc(100vw-2rem),960px)]"
              }
            >
              <iframe
                src={active.embedUrl}
                title={active.title}
                className={`h-full w-full ${active.platform === "instagram" ? "bg-white" : "bg-black"}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
