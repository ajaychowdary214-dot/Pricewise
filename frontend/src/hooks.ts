import { useEffect, useState } from "react";
import { api } from "./api";

// Small data-fetching hook with loading and error state.
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!path);
  useEffect(() => {
    if (!path) return;
    let live = true;
    setLoading(true);
    setError("");
    api<T>(path).then((d) => live && setData(d)).catch((e: Error) => live && setError(e.message)).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [path]);
  return { data, error, loading, setData };
}
