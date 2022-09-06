import { useEffect, useState, useRef } from "react";

import { pad, PadItemType } from "../pad";
import { calculator } from "../calculate";

function Calculator() {
  const [calStack, setCalStack] = useState<string[]>([]);
  const [typeStack, setTypeStack] = useState<string[]>([]);
  const [tempResult, setTempResult] = useState<string[]>(["0"]);
  const [isClosedBracket, setIsClosedBracket] = useState(true);
  const exDisplay = useRef() as React.MutableRefObject<HTMLElement>;

  const operateCalc = (el: PadItemType) => {
    switch (el.type) {
      case "reset":
        resetCalc();
        break;
      case "undo":
        deleteCommand();
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
      case "changer":
        changePlusMinus();
        break;
      case "equal":
        equal(el);
        break;
      default:
    }
  };

  const getCurrent = (stack: string[]) => {
    return stack[stack.length - 1];
  };

  const removeRecent = (stack: string[]) => {
    return stack.slice(0, -1);
  };

  const addNew = (stack: string[], add: string) => {
    return stack.concat(add);
  };

  const removeRecentAndAddNew = (stack: string[], add: string) => {
    return stack.slice(0, -1).concat(add);
  };

  const resetCalc = () => {
    setCalStack([]);
    setTypeStack([]);
    setIsClosedBracket(true);
    setTempResult(["0"]);
  };

  const addNumber = (el: PadItemType) => {
    if (checkNumberOverflow()) return;
    const currentType = getCurrent(typeStack);

    if (currentType === "number") {
      const newNum = getCurrent(calStack) + el.command;
      setCalStack(removeRecentAndAddNew(calStack, newNum));
      makeTempResult(newNum);
    } else {
      setCalStack(addNew(calStack, el.command));
      makeTempResult(el.command);
    }
    setTypeStack(typeStack.concat(el.type));
  };

  const addOperator = (el: PadItemType) => {
    const currentType = getCurrent(typeStack);
    if (currentType === "operator") {
      setCalStack(removeRecentAndAddNew(calStack, el.command));
    } else {
      setCalStack(addNew(calStack, el.command));
      setTypeStack(addNew(typeStack, el.type));
    }
    isClosedBracket && makeTempResult();
  };

  const deleteCommand = () => {
    const currentType = getCurrent(typeStack);
    if (currentType === "number") {
      const newNum = getCurrent(calStack).slice(0, -1);
      if (newNum.length === 0) {
        setCalStack(removeRecent(calStack));
        makeTempResult(" ");
      } else {
        setCalStack(removeRecentAndAddNew(calStack, newNum));
        makeTempResult(newNum);
      }
    } else {
      setCalStack(removeRecent(calStack));
    }

    if (currentType === "number" || currentType === "operator") {
      setTempResult(tempResult.slice(0, -1));
    }
    setTypeStack(typeStack.slice(0, -1));
  };

  const addBracket = (el: PadItemType) => {
    setIsClosedBracket(!isClosedBracket);
    setCalStack(addNew(calStack, isClosedBracket ? "(" : ")"));
    setTypeStack(addNew(typeStack, el.type));
  };

  const changePlusMinus = () => {
    const currentNum = getCurrent(calStack);
    if (!Number(currentNum)) return;
    const changeNum = +currentNum > 0 ? -+currentNum : Math.abs(+currentNum);
    setCalStack(calStack.slice(0, -1).concat(`${changeNum}`));
  };

  const checkNumberOverflow = () => {
    const currentNum = getCurrent(calStack);
    if (currentNum && currentNum.length >= 12) return true;
    else return false;
  };

  const makeTempResult = (result?: string) => {
    if (result) {
      setTempResult(addNew(tempResult, result));
    } else {
      setTempResult(addNew(tempResult, calculator(calStack)));
    }
  };

  const equal = (el: PadItemType) => {
    setTypeStack(addNew(typeStack, el.type));
    makeTempResult();
    const result = calculator(calStack);
    const parsed = JSON.parse(localStorage.getItem("calhistory")!);
    localStorage.setItem(
      "calhistory",
      JSON.stringify([
        { expression: formatExpression(calStack.join("") + " = "), result },
        ...parsed,
      ])
    );
  };

  const formatExpression = (raw: string) => {
    return raw.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
    if (!localStorage.getItem("calhistory")) {
      localStorage.setItem("calhistory", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener("keyup", (e) => {
      console.log(e);
    });
  }, []);

  useEffect(() => {
    changeFontSize();
  }, [exDisplay.current?.offsetWidth]);

  return (
    <main className="calc">
      <section className="calc__result">
        <span>{formatExpression(`${getCurrent(tempResult)}`)}</span>
      </section>
      <section className="calc__display">
        <span ref={exDisplay}>{formatExpression(calStack.join(""))}</span>
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
