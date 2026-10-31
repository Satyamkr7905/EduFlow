import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal data-fetching hook with loading / error / refetch and
 * stale-response protection.
 *
 * @param {() => Promise<any>} fetcher   – memoised async function
 * @param {Array} deps                   – re-run when these change
 */
export function useAsync(fetcher, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const requestId = useRef(0);

  const run = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (id === requestId.current) setData(result);
        return result;
      } catch (err) {
        if (id === requestId.current) setError(err);
        return null;
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    if (immediate) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, immediate]);

  return { data, error, loading, refetch: run, setData };
}
