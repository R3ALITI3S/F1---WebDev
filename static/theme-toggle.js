(() => {
  const storageKey = "theme";

  function getSavedTheme() {
    const savedTheme = window.localStorage.getItem(storageKey);
    return savedTheme === "light" ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    document.body.classList.toggle("light-mode", theme === "light");
  }

  function ThemeToggle() {
    const [theme, setTheme] = React.useState(getSavedTheme);
    const [clicks, setClicks] = React.useState(0);

    React.useEffect(() => {
      applyTheme(theme);
      window.localStorage.setItem(storageKey, theme);
    }, [theme]);

    const nextTheme = theme === "light" ? "dark" : "light";

    return (
      <div>
        <button
          className="theme-btn"
          onClick={() => {
            setTheme(nextTheme);
            setClicks((c) => c + 1);
          }}
        >
          Switch to {nextTheme} theme
        </button>

        <p style={{ marginTop: "10px" }}>
          You have switched theme {clicks} times
        </p>
      </div>
    );
  }

  function mountThemeToggle() {
    const mountNode = document.getElementById("theme-toggle-root");
    if (!mountNode) return;

    const root = ReactDOM.createRoot(mountNode);
    root.render(<ThemeToggle />);
  }

  applyTheme(getSavedTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemeToggle, { once: true });
  } else {
    mountThemeToggle();
  }
})();