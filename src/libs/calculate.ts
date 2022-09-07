export const calculator = (calStack: string[]) => {
  const postfix = convertToPostfix(calStack);
  const tempStack: any[] = [];

  postfix.forEach((el) => {
    if (Number(el) || Number(el) === 0) {
      tempStack.push(el);
    } else {
      const operator = el;
      const num2 = tempStack.pop();
      const num1 = tempStack.pop() || num2;
      tempStack.push(calculate(num1, num2, operator));
    }
  });

  const result: number = tempStack.reduce((acc, cur) => acc * cur);

  return String(result).length > 12 ? String(result.toExponential(8)) : String(result);
};

const calculate = (num1: number, num2: number, operator: string) => {
  if (operator === " + ") return num1 + num2;
  if (operator === " - ") return num1 - num2;
  if (operator === " * ") return num1 * num2;
  if (operator === " / ") return num1 / num2;
};

const convertToPostfix = (calStack: string[]) => {
  const operatorBracketStack: string[] = [];
  const postfixStack: any[] = [];

  calStack.forEach((el) => {
    if (Number(el) || Number(el) === 0) {
      postfixStack.push(Number(el));
    } else {
      if (el === "(") operatorBracketStack.push("(");
      if (el === " * " || el === " / ") {
        while (
          operatorBracketStack[operatorBracketStack.length - 1] === " * " ||
          operatorBracketStack[operatorBracketStack.length - 1] === " / "
        ) {
          postfixStack.push(operatorBracketStack.pop());
        }
        operatorBracketStack.push(el);
      }
      if (el === " + " || el === " - ") {
        while (
          operatorBracketStack[operatorBracketStack.length - 1] === " * " ||
          operatorBracketStack[operatorBracketStack.length - 1] === " / " ||
          operatorBracketStack[operatorBracketStack.length - 1] === " + " ||
          operatorBracketStack[operatorBracketStack.length - 1] === " - "
        ) {
          postfixStack.push(operatorBracketStack.pop());
        }
        operatorBracketStack.push(el);
      }
      if (el === ")") {
        while (operatorBracketStack[operatorBracketStack.length - 1] !== "(") {
          postfixStack.push(operatorBracketStack.pop());
        }
        operatorBracketStack.pop();
      }
    }
  });

  while (operatorBracketStack.length !== 0) {
    postfixStack.push(operatorBracketStack.pop());
  }

  return postfixStack;
};
