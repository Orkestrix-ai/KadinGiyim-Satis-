import { describe, it, expect } from "vitest"
import { generateTrackingCode, getTrackingUrl } from "@/lib/shipping/service"

describe("generateTrackingCode", () => {
  it("generates a tracking code", () => {
    const code = generateTrackingCode("order-123")
    expect(code).toBeTruthy()
    expect(code.length).toBeGreaterThan(5)
  })

  it("generates unique codes", () => {
    const code1 = generateTrackingCode("order-1")
    const code2 = generateTrackingCode("order-2")
    expect(code1).not.toBe(code2)
  })
})

describe("getTrackingUrl", () => {
  it("returns Yurtiçi tracking URL", () => {
    const url = getTrackingUrl("YURTICI", "TEST123")
    expect(url).toContain("yurticikargo.com")
    expect(url).toContain("TEST123")
  })

  it("returns MNG tracking URL", () => {
    const url = getTrackingUrl("MNG", "TEST123")
    expect(url).toContain("mngkargo.com.tr")
  })

  it("returns fallback for unknown company", () => {
    const url = getTrackingUrl("UNKNOWN", "TEST123")
    expect(url).toBe("#")
  })
})
