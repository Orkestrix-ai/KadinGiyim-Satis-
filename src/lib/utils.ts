import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(num)
}

const turkishMap: Record<string, string> = {
  "ı": "i", "ğ": "g", "ü": "u", "ş": "s", "ö": "o", "ç": "c",
  "İ": "i", "Ğ": "g", "Ü": "u", "Ş": "s", "Ö": "o", "Ç": "c",
}

export function slugify(text: string): string {
  let result = text.toLowerCase()
  for (const [tr, en] of Object.entries(turkishMap)) {
    result = result.replace(new RegExp(tr, "g"), en)
  }
  return result
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
