import { useEffect, useState, useRef } from "react";

import { pad, PadItemType } from "../libs/pad";
import { calculator } from "../libs/calculate";

interface CalcStackItemType {
  result: string;
  type: string;
  command: null | string;
}

function Calculator() {
  const [expression, setExpression] = useState("0");
  const [calcStack, setCalcStack] = useState<CalcStackItemType[]>([
    { result: "0", type: "init", command: null },
  ]);
  const exDisplay = useRef() as React.MutableRefObject<HTMLElement>;

  const operateCalc = (el: PadItemType) => {
    switch (el.type) {
      case "reset":
        resetCalc();
        break;
      case "undo":
        undoCommand();
        break;
      case "bracket":
        addBracket(el);
        break;
      case "operator":
        addOperator(el);
        break;
      case "number":
        addNumber(el);
        break;
      case "dot":
        addDot(el);
        break;
      case "changer":
        changePlusMinus();
        break;
      case "equal":
        makeResult(el);
        break;
      default:
    }
  };

  const getRecentCalcStack = () => {
    return calcStack[calcStack.length - 1];
  };

  const addCalcStack = (add: CalcStackItemType) => {
    setCalcStack(calcStack.concat(add));
  };

  const removeRecentCalcStack = () => {
    setCalcStack(calcStack.slice(0, -1));
  };

  const changeRecentCalcStack = (add: CalcStackItemType) => {
    setCalcStack(calcStack.slice(0, -1).concat(add));
  };

  const resetCalc = () => {
    setExpression("0");
    setCalcStack([{ result: "0", type: "init", command: null }]);
  };

  const addNumber = (el: PadItemType) => {
    if (checkNumberOverflow()) return;
    const { type: recentType, result: recentNum } = getRecentCalcStack();

    switch (recentType) {
      case "number":
      case "dot":
        setExpression(expression + el.command);
        addCalcStack({ result: recentNum + el.command, ...el });
        break;
      case "operator":
      case "bracket":
        setExpression(expression + " " + el.command);
        addCalcStack({ result: el.command, ...el });
        break;
      default:
        setExpression(el.command);
        addCalcStack({ result: el.command, ...el });
    }
  };

  const addDot = (el: PadItemType) => {
    if (checkDoubleDot()) return;
    const { type: recentType, result: recentNum } = getRecentCalcStack();
    switch (recentType) {
      case "number":
        setExpression(expression + el.command);
        addCalcStack({ result: recentNum + el.command, ...el });
        break;
      case "operator":
      case "bracket":
        setExpression(expression + " 0" + el.command);
        addCalcStack({ result: "0" + el.command, ...el });
        break;
      default:
        setExpression(expression + el.command);
        addCalcStack({ result: expression + el.command, ...el });
    }
  };

  const addOperator = (el: PadItemType) => {
    const { type: recentType } = getRecentCalcStack();
    switch (recentType) {
      case "operator":
        setExpression(expression.slice(0, -2) + " " + el.command);
        changeRecentCalcStack({ result: equal(true), ...el });
        break;
      case "bracket":
        checkClosedBracket()
          ? setExpression(expression + " " + el.command)
          : setExpression(expression + " 0 " + el.command);
        addCalcStack({
          result: checkClosedBracket() ? equal() : equal(true),
          ...el,
        });
        break;
      default:
        setExpression(expression + " " + el.command);
        addCalcStack({
          result: checkClosedBracket() ? equal() : equal(true),
          ...el,
        });
    }
  };

  const undoCommand = () => {
    const { type: recentType, result: recentNum } = getRecentCalcStack();

    switch (recentType) {
      case "operator":
        setExpression(expression.trim().slice(0, -2));
        removeRecentCalcStack();
        break;
      case "number":
      case "dot":
        expression.slice(0, -1).length === 0
          ? setExpression("0")
          : recentNum.slice(0, -1) === "-"
          ? setExpression(expression.slice(0, -2))
          : setExpression(expression.slice(0, -1));
        removeRecentCalcStack();
        break;
      case "bracket":
        setExpression(expression.trim().slice(0, -2));
        removeRecentCalcStack();
        break;
      case "equal":
        resetCalc();
        break;
      default:
        setExpression("0");
    }
  };

  const addBracket = (el: PadItemType) => {
    const bracket = checkClosedBracket() ? " (" : " )";
    setExpression(expression + bracket);
    addCalcStack({ result: equal(true), ...el });
  };

  const checkClosedBracket = () => {
    let openBracket = 0;
    let closeBracket = 0;
    for (const char of expression) {
      if (char === "(") openBracket++;
      if (char === ")") closeBracket++;
    }
    return !(openBracket - closeBracket);
  };

  const changePlusMinus = () => {
    const { type: recentType } = getRecentCalcStack();
    if (recentType === "number") {
      const recentNum = getRecentCalcStack().result;
      const changeNum = +recentNum > 0 ? -+recentNum : Math.abs(+recentNum);
      setExpression(expression.split(" ").slice(0, -1).concat(`${changeNum}`).join(" "));
    }

    const calcStackCopy = [...calcStack];
    for (const el of calcStackCopy.reverse()) {
      if (el.type !== "number") break;
      else {
        el.result = +el.result > 0 ? String(-+el.result) : String(Math.abs(+el.result));
      }
    }
    setCalcStack(calcStackCopy.reverse());
  };

  const checkNumberOverflow = () => {
    const recentNum = getRecentCalcStack().result;
    const changeNum = +recentNum > 0 ? -+recentNum : Math.abs(+recentNum);
    if (`${Math.abs(changeNum)}`.length >= 12) return true;
    else return false;
  };

  const checkDoubleDot = () => {
    const recentNum = getRecentCalcStack().result;
    for (const char of recentNum) {
      if (char === ".") return true;
    }
    return false;
  };

  const equal = (duplicate?: boolean) => {
    if (duplicate) return getRecentCalcStack().result;
    else return calculator(expression.split(" "));
  };

  const makeResult = (el: PadItemType) => {
    const result = equal();
    setHistory(formatExpression(expression + " = "), result);
    addCalcStack({ result, ...el });
  };

  const setHistory = (expression: string, result: string) => {
    const parsed = JSON.parse(localStorage.getItem("calhistory")!);
    localStorage.setItem("calhistory", JSON.stringify([{ expression, result }, ...parsed]));
  };

  const formatExpression = (raw: string) => {
    return raw.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").trim();
  };

  const changeFontSize = () => {
    const pNode = exDisplay.current.parentNode as HTMLElement;
    const pWidth = pNode.offsetWidth;
    const cWidth = exDisplay.current.offsetWidth;
    const cFontSize = +window.getComputedStyle(exDisplay.current).fontSize.slice(0, -2);

    if (cWidth >= pWidth * 0.85 && cFontSize > 14) {
      exDisplay.current.style.fontSize = `${cFontSize - 5}px`;
    }

    if (cWidth < pWidth * 0.5 && cFontSize < 24) {
      exDisplay.current.style.fontSize = `${cFontSize + 5}px`;
    }
  };

  useEffect(() => {
    changeFontSize();
  }, [exDisplay.current?.offsetWidth]);

  return (
    <main className="calc">
      <section className="calc__result">
        <span>{formatExpression(getRecentCalcStack().result)}</span>
      </section>
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
  );
}

export default Calculator;
