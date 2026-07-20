import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}
