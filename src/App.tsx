import { useEffect, useState } from "react";
import "./App.css";

import Calculator from "./components/Calculator";

import { ReactComponent as Lightmode } from "./assets/images/lightmode.svg";
import { ReactComponent as Darkmode } from "./assets/images/darkmode.svg";

function App() {
  const [theme, setTheme] = useState("");
  // TODO : localStorage에 저장된 다크모드 값을 가져와서 덮어쓰기
  const initializeTheme = (darkSchemeMediaQueryList: MediaQueryList) => {
    const theme = darkSchemeMediaQueryList.matches ? "dark" : "light";
    document.body.dataset.theme = theme;
  };

  const toggleTheme = () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
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
        <button className="header__theme" onClick={toggleTheme}>
          {theme === "dark" ? <Darkmode /> : <Lightmode />}
        </button>
      </header>
      <Calculator />
    </div>
  );
}

export default App;
