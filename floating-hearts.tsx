import { useEffect, useState } from "react";

type Heart = { id: number; left: number; delay: number; size: number };

/**
 * A small drift of hearts rising from the composer, fired once per send.
 * Bump `burstKey` to trigger. Respects prefers-reduced-motion via CSS.
 */
export function FloatingHearts({ burstKey }: { burstKey: number }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (burstKey === 0) return;
    const batch: Heart[] = Array.from({ length: 6 }, (_, i) => ({
      id: burstKey * 10 + i,
      left: 42 + Math.random() * 16, // cluster near the send button
      delay: Math.random() * 0.35,
      size: 12 + Math.random() * 10,
    }));
    setHearts(batch);
    const t = setTimeout(() => setHearts([]), 2200);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (hearts.length === 0) return null;

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="hearts__one"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            fontSize: `${h.size}px`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
