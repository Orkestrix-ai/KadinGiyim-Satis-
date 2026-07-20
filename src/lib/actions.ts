"use server"

import { prisma } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const parsed = schema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (existing) throw new Error("Bu e-posta adresi zaten kayıtlı")

  const hashedPassword = await bcrypt.hash(parsed.password, 12)

  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
    },
  })

  revalidatePath("/")
}

export async function addToCart(productId: string, variantId: string, quantity: number = 1) {
  const cart = await prisma.cart.findFirst()
  if (!cart) {
    await prisma.cart.create({
      data: {
        items: {
          create: { variantId, quantity },
        },
      },
    })
  } else {
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    })
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      })
    }
  }
  revalidatePath("/")
}
