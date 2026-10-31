import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Joins class names; on Tailwind conflicts the later class wins (e.g. a caller's `className`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
