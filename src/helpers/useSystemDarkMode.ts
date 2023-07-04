import { useEffect, useState } from "react";

const DARK_MEDIA_SELECTOR = "(prefers-color-scheme: dark)";

export default function useSystemDarkMode() {
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    window.matchMedia(DARK_MEDIA_SELECTOR).matches
  );

  const mediaQuery = window
    .matchMedia(DARK_MEDIA_SELECTOR);

  useEffect(() => {
    function handleDarkModeChange() {
      const doesMatch = mediaQuery.matches;
      setPrefersDarkMode(doesMatch);
    }

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", handleDarkModeChange);
    } else {
      mediaQuery.addListener(handleDarkModeChange);
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener("change", handleDarkModeChange);
      } else {
        mediaQuery.removeListener(handleDarkModeChange);
      }
    };
  }, []);

  return prefersDarkMode;
}
