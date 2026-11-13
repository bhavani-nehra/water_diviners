"use client";
import { useEffect, useRef, useState } from "react";
import { useGallery, videoPoster } from "./useGallery";
import styles from "./video.module.css";

export default function VideoSection() {
  const items = useGallery("video");
  const stage = useRef(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const inView = useRef(false);

  const clip = items[current];

  // Play only while the stage is on screen; autoplay can be refused, so surface a play button.
  useEffect(() => {
    const v = stage.current;
    if (!v || !clip) return;
    const io = new IntersectionObserver(
      ([en]) => {
        inView.current = en.isIntersecting && en.intersectionRatio > 0.6;
        if (inView.current) {
          v.play().then(
            () => setBlocked(false),
            () => setBlocked(true),
          );
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [clip]);

  useEffect(() => {
    const v = stage.current;
    if (v) v.muted = muted;
  }, [muted, clip]);

  if (!items.length) return null;

  const toggle = () => {
    const v = stage.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setBlocked(false), () => setBlocked(true));
    else v.pause();
  };

  return (
    <section id="videos" className={styles.section} aria-labelledby="videos-title">
      <div className={styles.inner}>
        <h2 id="videos-title" className={styles.title}>
          Watch the work
        </h2>
        <p className={styles.lead}>Real sites, real scans. Tap a clip to switch.</p>

        <div className={styles.stageWrap}>
          <video
            key={clip.url}
            ref={stage}
            className={styles.stage}
            src={clip.url}
            poster={videoPoster(clip.url)}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={clip.caption || `Video ${current + 1}`}
          />
          {(blocked || !playing) && (
            <button type="button" className={styles.bigPlay} onClick={toggle} aria-label="Play video">
              ▶
            </button>
          )}
          <div className={styles.controls}>
            <button type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
              {playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        </div>
        {clip.caption && <p className={styles.caption}>{clip.caption}</p>}

        {items.length > 1 && (
          <ul className={styles.strip} aria-label="More videos">
            {items.map((it, i) => (
              <li key={it._id || it.url}>
                <button
                  type="button"
                  className={`${styles.thumb} ${i === current ? styles.thumbOn : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Play ${it.caption || `video ${i + 1}`}`}
                  aria-current={i === current}
                >
                  <video src={`${it.url}#t=0.5`} poster={videoPoster(it.url)} muted playsInline preload="metadata" tabIndex={-1} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
