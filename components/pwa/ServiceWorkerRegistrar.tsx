"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => caches.keys())
        .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))))
        .catch(() => {
          // Fail silently; offline mode is optional.
        });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Fail silently; offline mode is optional.
    });
  }, []);

  return null;
}


