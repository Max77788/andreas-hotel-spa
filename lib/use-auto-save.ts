import { useEffect, useRef, useState, useCallback } from "react";

export type SaveStatus = "saved" | "saving" | null;

/**
 * Auto-saves data whenever it changes, with debounce.
 * @param data - the data to watch (stringified for deep comparison)
 * @param saveFn - async function that persists the data
 * @param debounceMs - delay before saving (default 800ms)
 * @returns status: "saving" | "saved" | null
 */
export function useAutoSave<T>(
  data: T,
  saveFn: () => Promise<boolean>,
  debounceMs = 800,
): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFnRef = useRef(saveFn);
  saveFnRef.current = saveFn;

  // Serialize for deep comparison
  const serialized = JSON.stringify(data);

  const doSave = useCallback(async () => {
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
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // We intentionally depend on serialized data for deep comparison
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, debounceMs]);

  return status;
}
