export interface PadItemType {
  command: string;
  type: string;
}

export const pad: PadItemType[] = [
  { command: "C", type: "reset" },
  { command: "( )", type: "bracket" },
  { command: "CE", type: "undo" },
  { command: "/", type: "operator" },
  { command: "7", type: "number" },
  { command: "8", type: "number" },
  { command: "9", type: "number" },
  { command: "*", type: "operator" },
  { command: "4", type: "number" },
  { command: "5", type: "number" },
  { command: "6", type: "number" },
  { command: "-", type: "operator" },
  { command: "1", type: "number" },
  { command: "2", type: "number" },
  { command: "3", type: "number" },
  { command: "+", type: "operator" },
  { command: "+/-", type: "changer" },
  { command: "0", type: "number" },
  { command: ".", type: "number" },
  { command: "=", type: "equal" },
];
