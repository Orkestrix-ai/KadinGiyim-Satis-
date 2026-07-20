import { describe, it, expect } from "vitest"
import { formatPrice, slugify, cn } from "@/lib/utils"

describe("formatPrice", () => {
  it("formats number as TRY currency", () => {
    const result = formatPrice(150.5)
    expect(result).toContain("150")
    expect(result).toContain("₺")
  })

  it("handles string input", () => {
    const result = formatPrice("99.99")
    expect(result).toContain("99")
  })

  it("handles zero", () => {
    const result = formatPrice(0)
    expect(result).toContain("0")
  })
})

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Kırmızı Elbise")).toBe("kirmizi-elbise")
  })

  it("removes special characters", () => {
    expect(slugify("Ürün @#$ Test")).toBe("urun-test")
  })

  it("handles multiple spaces", () => {
    expect(slugify("a   b")).toBe("a-b")
  })
})

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("px-4", "py-2")
    expect(result).toContain("px-4")
    expect(result).toContain("py-2")
  })

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible")
    expect(result).toBe("base visible")
  })
})
