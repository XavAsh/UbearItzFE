"use client";

import { useCallback, useEffect, useState } from "react";

type CacheEntry<T> = {
  value: T;
  expiry?: number;
};

const asyncCache = new Map<string, CacheEntry<unknown>>();

type UseAsyncDataOptions<T> = {
  enabled?: boolean;
  initialData?: T;
  ttlMs?: number;
};

export function useAsyncData<T>(key: string, loader: () => Promise<T>, options: UseAsyncDataOptions<T> = {}) {
  const { enabled = true, initialData, ttlMs } = options;
  const [data, setData] = useState<T | undefined>(() => initialData);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(() => !initialData);

  const readFromCache = useCallback(() => {
    if (!asyncCache.has(key)) return undefined;
    const entry = asyncCache.get(key) as CacheEntry<T>;
    if (entry.expiry && Date.now() > entry.expiry) {
      asyncCache.delete(key);
      return undefined;
    }
    return entry.value;
  }, [key]);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(undefined);
    try {
      const result = await loader();
      asyncCache.set(key, { value: result, expiry: ttlMs ? Date.now() + ttlMs : undefined });
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled, loader, key, ttlMs]);

  useEffect(() => {
    if (!enabled) return;
    const cachedValue = readFromCache();
    if (cachedValue !== undefined) {
      setData(cachedValue);
      setLoading(false);
      return;
    }
    fetchData();
  }, [enabled, fetchData, readFromCache]);

  return { data, error, loading, refetch: fetchData };
}


