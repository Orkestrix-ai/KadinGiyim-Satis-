import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  const adminEmail = "admin@modacini.com"
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existing) {
    console.log("Admin kullanıcı zaten mevcut.")
  } else {
    const password = await bcrypt.hash("admin123", 12)
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password,
        role: "ADMIN",
      },
    })
    console.log("Admin kullanıcı oluşturuldu:", adminEmail)
  }

  const categories = [
    { name: "Elbiseler", slug: "elbiseler" },
    { name: "Üst Giyim", slug: "ust-giyim" },
    { name: "Dış Giyim", slug: "dis-giyim" },
    { name: "Alt Giyim", slug: "alt-giyim" },
    { name: "Aksesuar", slug: "aksesuar" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log("Kategoriler oluşturuldu.")
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
