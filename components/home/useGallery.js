"use client";
import { useEffect, useState } from "react";

// Fetches admin-managed gallery items once; returns only items of the requested type.
// Any failure yields an empty list so the calling section can hide itself.
export function useGallery(type) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let live = true;
    fetch("/api/admin/gallery")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!live || !Array.isArray(data)) return;
        setItems(data.filter((i) => (i.type || "image") === type && i.url));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [type]);
  return items;
}

// Cloudinary delivery URLs accept inline transformations; others pass through untouched.
export function cdn(url, transform) {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com") || !url.includes("/upload/"))
    return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function videoPoster(url) {
  const u = cdn(url, "so_1,f_jpg,q_auto,w_1200");
  return u === url ? undefined : u.replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}
