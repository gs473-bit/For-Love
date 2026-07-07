import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = {
  id: string;
  label: string;
  icon: string;
  src: string | null; // null = cozy indoor gradient, no image
};

export const THEMES: Theme[] = [
  { id: "cozy-indoor", label: "Cozy indoor", icon: "🕯️", src: null },
  { id: "matheran-rain", label: "Matheran rain", icon: "🌧️", src: "/themes/matheran-rain.jpg" },
  { id: "swiss-alpine-lake", label: "Swiss Alps", icon: "🏔️", src: "/themes/swiss-alpine-lake.jpg" },
  { id: "cherry-blossom-garden", label: "Cherry blossom", icon: "🌸", src: "/themes/cherry-blossom-garden.jpg" },
  { id: "aurora-cabin", label: "Aurora", icon: "❄️", src: "/themes/aurora-cabin.jpg" },
  { id: "misty-pine-forest", label: "Pine forest", icon: "🌲", src: "/themes/misty-pine-forest.jpg" },
  { id: "golden-meadow", label: "Golden meadow", icon: "🌼", src: "/themes/golden-meadow.jpg" },
  { id: "ocean-cliffs", label: "Ocean cliffs", icon: "🌊", src: "/themes/ocean-cliffs.jpg" },
  { id: "snow-valley", label: "Snow valley", icon: "🌨️", src: "/themes/snow-valley.jpg" },
  { id: "starlit-mountain-ridge", label: "Starlit ridge", icon: "⭐", src: "/themes/starlit-mountain-ridge.jpg" },
];

const STORAGE_KEY = "love-theme";

type ThemeContextValue = {
  theme: Theme;
  setThemeById: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function TravelThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>("cozy-indoor");

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((t) => t.id === saved)) setThemeId(saved);
  }, []);

  const setThemeById = useCallback((id: string) => {
    if (!THEMES.some((t) => t.id === id)) return;
    setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: THEMES.find((t) => t.id === themeId) ?? THEMES[0],
      setThemeById,
    }),
    [themeId, setThemeById],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTravelTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTravelTheme must be used inside TravelThemeProvider");
  return ctx;
}
