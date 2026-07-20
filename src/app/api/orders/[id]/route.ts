import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, cargoCode } = await req.json()

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (cargoCode) updateData.cargoCode = cargoCode

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Sipariş güncellenirken hata oluştu" }, { status: 500 })
  }
}
