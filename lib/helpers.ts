import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrencySymbol = (currency: "USD" | "EUR" | "USDT") => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "USDT":
      return "₮";
    default:
      return "$";
  }
};

export function formatExcelDate(serial: number): string {
  const parsed = XLSX.SSF.parse_date_code(serial);
  if (!parsed) return "Invalid date";
  const { y, m, d } = parsed;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function excelDateToISO(serial: number): string {
  const parsed = XLSX.SSF.parse_date_code(serial);
  if (!parsed) return "";
  const { y, m, d, h, m: min, s } = parsed;
  const date = new Date(Date.UTC(y, m - 1, d, h, min, s));
  return date.toISOString();
}

export function excelSerialToISO(serial: number): string {
  const epoch = new Date(1899, 11, 30); // Excel bug-based epoch
  const date = new Date(epoch.getTime() + serial * 86400 * 1000);
  return date.toISOString(); // .toLocaleDateString() —  UI
}
