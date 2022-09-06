import { useEffect, useState, useRef } from "react";

import { pad, PadItemType } from "../pad";
import { calculator } from "../calculate";

function Calculator() {
  const [calStack, setCalStack] = useState<string[]>([]);
  const [typeStack, setTypeStack] = useState<string[]>([]);
  const [currentNum, setCurrentNum] = useState("");
  const [isClosedBracket, setIsClosedBracket] = useState(false);
  const exDisplay = useRef() as React.MutableRefObject<HTMLElement>;

  console.log(`현재 숫자는 : ${currentNum}`, `전체스택은: ${calStack}`);

  const operateCalc = (el: PadItemType) => {
    switch (el.type) {
      case "reset":
        resetCalc(el);
        break;
      case "undo":
        deleteCommand(el);
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
        console.log(makeResult());
        break;
      default:
    }
  };

  const resetCalc = (el: PadItemType) => {
    setCalStack([]);
    setTypeStack([]);
    setCurrentNum("");
    setIsClosedBracket(false);
  };

  const addNumber = (el: PadItemType) => {
    if (checkNumberOverflow()) return;
    setCurrentNum(currentNum + el.command);
    setTypeStack(typeStack.concat(el.type));
  };

  const addOperator = (el: PadItemType) => {
    const currentType = typeStack[typeStack.length - 1];
    if (currentType === "operator") {
      setCalStack(calStack.slice(0, -1).concat(el.command));
    } else if (currentType === "number") {
      setCalStack(calStack.concat(currentNum, el.command));
      setCurrentNum("");
      setTypeStack(typeStack.concat(el.type));
    } else {
      setCalStack(calStack.concat(el.command));
      setTypeStack(typeStack.concat(el.type));
    }
  };

  const deleteCommand = (el: PadItemType) => {
    const currentType = typeStack[typeStack.length - 1];
    if (currentType === "number") {
      if (!currentNum) {
        setCalStack(calStack.slice(0, -1));
        setCurrentNum(calStack[calStack.length - 1].slice(0, -1));
      } else {
        setCurrentNum(currentNum.slice(0, -1));
      }
    } else {
      setCalStack(calStack.slice(0, -1));
    }
    setTypeStack(typeStack.slice(0, -1));
  };

  const addBracket = (el: PadItemType) => {
    const currentType = typeStack[typeStack.length - 1];
    if (!isClosedBracket) {
      if (currentType === "number") {
        setCalStack(calStack.concat(currentNum, "("));
        setCurrentNum("");
      } else {
        setCalStack(calStack.concat("("));
      }
      setIsClosedBracket(true);
    } else {
      if (currentType === "number") {
        setCalStack(calStack.concat(currentNum, ")"));
        setCurrentNum("");
      } else {
        setCalStack(calStack.concat(")"));
      }
      setIsClosedBracket(false);
    }
    setTypeStack(typeStack.concat(el.type));
  };

  const changePlusMinus = () => {
    if (!currentNum) return;
    const changeNum = +currentNum > 0 ? -+currentNum : Math.abs(+currentNum);
    setCurrentNum(`${changeNum}`);
  };

  const checkNumberOverflow = () => {
    if (currentNum.length >= 12) return true;
    else return false;
  };

  const makeResult = () => {
    if (currentNum) {
      return calculator(calStack.concat(currentNum));
    } else return calculator(calStack);
  };

  const formatExpression = (raw: string) => {
    return raw.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    // .replace(/\+/g, " + ")
    // .replace(/\*/g, " * ")
    // .replace(/\//g, " / ")
    // .replace(/-/g, " - ");
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
    changeFontSize();
  }, [exDisplay.current?.offsetWidth]);

  return (
    <main className="calc">
      <section className="calc__display">
        <span ref={exDisplay}>{formatExpression(calStack.concat(currentNum).join(""))}</span>
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
