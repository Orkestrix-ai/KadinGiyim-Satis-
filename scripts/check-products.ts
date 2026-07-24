import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const count = await prisma.product.count()
  const products = await prisma.product.findMany({ take: 5, include: { variants: true } })
  console.log(`Toplam ürün: ${count}`)
  for (const p of products) {
    console.log(`  ${p.id} | ${p.name} | ${p.price} TL | ${p.variants.length} varyant`)
  }
  await prisma.$disconnect()
}
main()