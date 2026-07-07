import { useEffect, useState } from "react";
import { useTravelTheme } from "../hooks/use-travel-theme";

/**
 * Full-viewport scenery behind the chat. Crossfades between themes and lays a
 * blurred dusk gradient on top so text stays readable on any image.
 */
export function TravelBackground() {
  const { theme } = useTravelTheme();
  const [visibleSrc, setVisibleSrc] = useState<string | null>(theme.src);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (theme.src === visibleSrc) return;
    setFading(true);
    const swap = () => {
      setVisibleSrc(theme.src);
      setFading(false);
    };
    if (!theme.src) return void setTimeout(swap, 250);
    const img = new Image();
    img.onload = swap;
    img.onerror = swap;
    img.src = theme.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.src]);

  return (
    <div className="travel-bg" aria-hidden="true">
      {visibleSrc && (
        <div
          className={`travel-bg__image ${fading ? "is-fading" : ""}`}
          style={{ backgroundImage: `url(${visibleSrc})` }}
        />
      )}
      <div className="travel-bg__overlay" />
    </div>
  );
}
