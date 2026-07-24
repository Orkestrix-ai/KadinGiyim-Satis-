import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/db"

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const computed = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret yapılandırılmamış" }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get("x-signature")

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 })
  }

  const eventName = payload.meta?.event_name
  if (!eventName) {
    return NextResponse.json({ error: "Event name eksik" }, { status: 400 })
  }

  const lsOrderId = payload.data?.id
  const customData = payload.meta?.custom_data
  const localOrderId = customData?.order_id

  if (!localOrderId) {
    return NextResponse.json({ error: "Sipariş ID'si bulunamadı" }, { status: 400 })
  }

  if (eventName === "order_created") {
    await prisma.order.update({
      where: { id: localOrderId },
      data: {
        status: "PROCESSING",
        lemonsqueezyOrderId: lsOrderId ? String(lsOrderId) : undefined,
      },
    })
  }

  return NextResponse.json({ received: true })
}

export async function GET() {
  return NextResponse.json({ error: "Sadece POST kabul edilir" }, { status: 405 })
}