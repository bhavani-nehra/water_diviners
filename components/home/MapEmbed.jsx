"use client";
import { useEffect, useState } from "react";
import styles from "./contact.module.css";

const QUERY = "M.M.S Water Diviners, Near Rameshwar Mandir, Bivnewadi, Kankavli, Maharashtra 416609";
const EMBED = `https://www.google.com/maps?q=${encodeURIComponent(QUERY)}&output=embed`;
const OPEN = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY)}`;

// Live, pannable Google map without an API key. If the frame never loads, only the link remains.
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setFailed(true), 8000);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <div className={styles.mapBox}>
      {(
        <iframe
          title="Map of M.M.S Water Diviners, Kankavli"
          src={EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={styles.map}
        />
      )}
      {failed && !loaded && <p className={styles.mapFallback}>The map could not load here.</p>}
      <a className={styles.mapLink} href={OPEN} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
    </div>
  );
}
