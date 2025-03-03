import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CONVERT PRISMA OBJECT INTO REGULAR JS OBJECT
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// FORMAT NUMBERS WITH DECIMAL PLACES
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}
