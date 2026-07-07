import { useEffect, useRef, useState } from "react";
import { THEMES, useTravelTheme } from "../hooks/use-travel-theme";

/** Floating pill (top-right). Tap to open the scene menu, pick a place. */
export function ThemeSwitcher() {
  const { theme, setThemeById } = useTravelTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="theme-switcher" ref={rootRef}>
      <button
        type="button"
        className="theme-switcher__toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change scenery (current: ${theme.label})`}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{theme.icon}</span>
        <span className="theme-switcher__label">{theme.label}</span>
      </button>

      {open && (
        <ul className="theme-switcher__menu" role="listbox" aria-label="Scenery">
          {THEMES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="option"
                aria-selected={t.id === theme.id}
                className={`theme-switcher__item ${t.id === theme.id ? "is-active" : ""}`}
                onClick={() => {
                  setThemeById(t.id);
                  setOpen(false);
                }}
              >
                <span aria-hidden="true">{t.icon}</span> {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
