import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ items: [] })
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    })
  }

  return NextResponse.json(cart)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
  }

  const { variantId, quantity } = await req.json()

  let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } })
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity ?? 1) },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity: quantity ?? 1 },
    })
  }

  return NextResponse.json({ success: true })
}

export async function PUT(req: Request) {
  const { itemId, quantity } = await req.json()

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { itemId } = await req.json()

  await prisma.cartItem.delete({ where: { id: itemId } })

  return NextResponse.json({ success: true })
}
