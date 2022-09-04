import { useEffect, useState, useRef } from "react";
import "./App.css";
import { pad } from "./pad";
import { calculate } from "./calculate";
import { ReactComponent as Lightmode } from "./assets/lightmode.svg";
import { ReactComponent as Darkmode } from "./assets/darkmode.svg";

import { PadItemType } from "./pad";

function App() {
  const [theme, setTheme] = useState("");
  const [expression, setExpression] = useState("");
  const [isClosedBracket, setIsClosedBracket] = useState(false);
  const exDisplay = useRef() as React.MutableRefObject<HTMLElement>;

  const initializeTheme = (darkSchemeMediaQueryList: MediaQueryList) => {
    const theme = darkSchemeMediaQueryList.matches ? "dark" : "light";
    document.body.dataset.theme = theme;
  };

  const toggleTheme = () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = newTheme;
    setTheme(newTheme);
  };

  const operateCalc = (el: PadItemType) => {
    switch (el.type) {
      case "reset":
        resetCalc();
        break;
      case "undo":
        deleteCommand();
        break;
      case "bracket":
        addBracket();
        break;
      case "operator":
        addCommand(el.command);
        break;
      case "number":
        if (checkNumberOverflow()) break;
        addCommand(el.command);
        break;
      case "changer":
        changePlusMinus();
        break;
      case "equal":
        makeResult(expression);
        break;
      default:
    }
  };

  const resetCalc = () => {
    setExpression("");
  };

  const addCommand = (command: string) => {
    setExpression(expression + command);
  };

  const deleteCommand = () => {
    setExpression(expression.slice(0, -1));
  };

  const addBracket = () => {
    if (!isClosedBracket) {
      setExpression(expression + "(");
      setIsClosedBracket(true);
    } else {
      setExpression(expression + ")");
      setIsClosedBracket(false);
    }
  };

  const changePlusMinus = () => {
    const recentNumRegExp = new RegExp(/-?[0-9.]+$/);
    const recentNum = expression.match(recentNumRegExp);
    if (!recentNum) return;

    const changeNum = +recentNum[0] > 0 ? -+recentNum[0] : Math.abs(+recentNum[0]);
    const newExpression = expression.replace(recentNumRegExp, `${changeNum}`);
    setExpression(newExpression);
  };

  const checkNumberOverflow = () => {
    const recentNumRegExp = new RegExp(/[0-9.]+$/);
    const recentNum = expression.match(recentNumRegExp);
    if (!recentNum) return false;
    if (recentNum[0].length >= 12) return true;
  };

  const makeResult = (expression: string) => {
    setExpression(calculate(expression));
  };

  const formatExpression = (raw: string) => {
    return raw
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      .replace(/\+/g, " + ")
      .replace(/\*/g, " * ")
      .replace(/\//g, " / ")
      .replace(/-/g, " - ");
  };

  const changeFontSize = () => {
    const pNode = exDisplay.current.parentNode as HTMLElement;
    const pWidth = pNode.offsetWidth;
    const cWidth = exDisplay.current.offsetWidth;
    const cFontSize = +window.getComputedStyle(exDisplay.current).fontSize.slice(0, -2);

    if (cWidth >= pWidth * 0.95 && cFontSize > 14) {
      exDisplay.current.style.fontSize = `${cFontSize - 8}px`;
    }

    if (cWidth < pWidth * 0.5 && cFontSize < 30) {
      exDisplay.current.style.fontSize = `${cFontSize + 8}px`;
    }
  };

  useEffect(() => {
    initializeTheme(window.matchMedia("(prefers-color-scheme: dark)"));
  }, []);

  useEffect(() => {
    changeFontSize();
  }, [exDisplay.current?.offsetWidth]);

  return (
    <div className="App">
      <header className="header">
        <div className="header__logo">🤔 Calculator</div>
        <button className="header__themeBtn" onClick={toggleTheme}>
          {theme === "dark" ? <Darkmode /> : <Lightmode />}
        </button>
      </header>
      <main className="calc">
        <section className="calc__display">
          <span ref={exDisplay}>{formatExpression(expression)}</span>
        </section>
        <section className="calc__pad">
          {pad.map((el) => (
            <div
              className="calc__paditem"
              key={el.command}
              onClick={() => {
                operateCalc(el);
              }}
            >
              {el.command}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
