import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json()

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, slug },
    })

    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Kategori eklenirken hata oluştu" }, { status: 500 })
  }
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })
  return NextResponse.json(categories)
}
