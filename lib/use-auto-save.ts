import { useEffect, useRef, useState, useCallback } from "react";

export type SaveStatus = "saved" | "saving" | null;

/**
 * Auto-saves data whenever it changes, with debounce.
 * @param data - the data to watch (stringified for deep comparison)
 * @param saveFn - async function that persists the data
 * @param debounceMs - delay before saving (default 800ms)
 * @returns {{ status, pause, resume }} - status: "saving" | "saved" | null;
 *   pause() clears any pending timer and prevents future autosaves;
 *   resume() re-enables autosave (timer restarts on next data change).
 */
export function useAutoSave<T>(
  data: T,
  saveFn: () => Promise<boolean>,
  debounceMs = 800,
) {
  const [status, setStatus] = useState<SaveStatus>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFnRef = useRef(saveFn);
  saveFnRef.current = saveFn;
  const pausedRef = useRef(false);

  // Serialize for deep comparison
  const serialized = JSON.stringify(data);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const doSave = useCallback(async () => {
    if (pausedRef.current) return;
    setStatus("saving");
    const ok = await saveFnRef.current();
    if (ok) {
      setStatus("saved");
      setTimeout(() => setStatus(null), 1500);
    } else {
      setStatus(null); // error — just clear, error shown elsewhere
    }
  }, []);

  useEffect(() => {
    clearTimer();
    if (!pausedRef.current) {
      timerRef.current = setTimeout(doSave, debounceMs);
    }
    return clearTimer;
    // We intentionally depend on serialized data for deep comparison
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, debounceMs]);

  /** Pause autosave — clears any pending timer and prevents future saves until resumed. */
  const pause = useCallback(() => {
    pausedRef.current = true;
    clearTimer();
  }, [clearTimer]);

  /** Resume autosave. Does NOT restart a timer — the next data change will. */
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return { status, pause, resume };
}
