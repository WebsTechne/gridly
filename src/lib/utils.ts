import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function toA1Col(colIndex: number): string {
  let colName = "";
  let dividend = colIndex + 1;
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    colName = String.fromCharCode(65 + modulo) + colName;
    dividend = Math.floor((dividend - 1) / 26);
  }
  return colName;
}

export { cn, toA1Col };
