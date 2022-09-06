import { useEffect, useState } from "react";
import "./App.css";

import Calculator from "./components/Calculator";
import History from "./components/History";

import { ReactComponent as HistoryIcon } from "./assets/images/history.svg";
import { ReactComponent as LightmodeIcon } from "./assets/images/lightmode.svg";
import { ReactComponent as DarkmodeIcon } from "./assets/images/darkmode.svg";

function App() {
  const [theme, setTheme] = useState("");
  const [isHistoryOn, setIsHistoryOn] = useState(false);

  const initializeTheme = (darkSchemeMediaQueryList: MediaQueryList) => {
    const mediaMode = darkSchemeMediaQueryList.matches ? "dark" : "light";
    const theme = localStorage.getItem("darkmode") || mediaMode;
    document.body.dataset.theme = theme;
    setTheme(theme);
  };

  const toggleTheme = () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("darkmode", newTheme);
    document.body.dataset.theme = newTheme;
    setTheme(newTheme);
  };

  useEffect(() => {
    initializeTheme(window.matchMedia("(prefers-color-scheme: dark)"));
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="header__logo">🤔 Calculator</div>
        <div className="header__tool">
          <button className="header__history" onClick={() => setIsHistoryOn(!isHistoryOn)}>
            <HistoryIcon />
          </button>
          <button className="header__theme" onClick={toggleTheme}>
            {theme === "dark" ? <DarkmodeIcon /> : <LightmodeIcon />}
          </button>
        </div>
      </header>
      {isHistoryOn && <History />}
      <Calculator />
    </div>
  );
}

export default App;
