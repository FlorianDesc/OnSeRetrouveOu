import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(value?: string | null) {
  if (!value || value.length === 0) {
    return value ?? "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
