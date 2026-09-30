(() => {
  const storageKey = "portfolio-theme";
  const themes = ["light", "dark"];

  function validTheme(value) {
    return themes.includes(value) ? value : null;
  }

  function storedTheme() {
    try {
      return validTheme(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The selected mode still applies for this page when storage is unavailable.
    }
  }

  const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)");
  const initialStoredTheme = storedTheme();
  let followsSystemTheme = initialStoredTheme === null;

  function preferredTheme() {
    const savedTheme = storedTheme();
    if (savedTheme) return savedTheme;
    if (systemTheme) return systemTheme.matches ? "dark" : "light";
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const nextTheme = theme === "light" ? "dark" : "light";
    const label = `Switch to ${nextTheme} mode`;
    document.querySelectorAll("[data-theme-switcher]").forEach((button) => {
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  }

  const initialTheme = preferredTheme();
  applyTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(initialTheme);

    document.querySelectorAll("[data-theme-switcher]").forEach((button) => {
      button.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme || "light";
        const nextTheme = current === "light" ? "dark" : "light";
        followsSystemTheme = false;
        applyTheme(nextTheme);
        persistTheme(nextTheme);
      });
    });

    systemTheme?.addEventListener("change", (event) => {
      if (followsSystemTheme) applyTheme(event.matches ? "dark" : "light");
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    const theme = validTheme(event.newValue);
    if (!theme) return;

    followsSystemTheme = false;
    applyTheme(theme);
  });

  window.addEventListener("pageshow", () => {
    const savedTheme = storedTheme();
    if (savedTheme) followsSystemTheme = false;
    applyTheme(savedTheme || preferredTheme());
  });
})();
