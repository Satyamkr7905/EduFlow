import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from its previous value to `target`.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export function useCountUp(target = 0, duration = 900) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(target) || 0;
    if (from === to) {
      setValue(to);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}
