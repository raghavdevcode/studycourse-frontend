import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function switchTheme(e) {
    const isDark = e.target.checked;
    setDark(isDark);

    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={dark}
          onChange={switchTheme}
        />
        <div className="mode-container py-1">
          <i className="gg-sun"></i>
          <i className="gg-moon"></i>
        </div>
      </label>
    </div>
  );
}

export default ThemeToggle;
