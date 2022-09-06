export const calculator = (calStack: string[]) => {
  const postfix = convertToPostfix(calStack);
  const result: any[] = [];

  postfix.forEach((el) => {
    if (Number(el)) {
      result.push(el);
    } else {
      const operator = el;
      const num2 = result.pop();
      const num1 = result.pop();
      result.push(calculate(num1, num2, operator));
    }
  });

  return result[0];
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
    if (Number(el)) {
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
