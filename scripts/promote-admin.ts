import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { config } from "dotenv"

config({ path: ".env" })

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } })

  if (users.length === 0) {
    console.log("Henüz kayıtlı kullanıcı yok. Önce /register sayfasından kayıt olun.")
    await prisma.$disconnect()
    return
  }

  console.log("Mevcut kullanıcılar:")
  users.forEach((u, i) => console.log(`  ${i + 1}. ${u.email} (${u.name ?? "isimsiz"}) — rol: ${u.role}`))

  const email = process.argv[2]
  if (!email) {
    console.log("\nKullanım: npx tsx scripts/promote-admin.ts <email>")
    console.log("Örnek: npx tsx scripts/promote-admin.ts admin@example.com")
    await prisma.$disconnect()
    return
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log(`"${email}" adresinde kullanıcı bulunamadı.`)
    await prisma.$disconnect()
    return
  }

  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } })
  console.log(`✅ "${email}" kullanıcısı ADMIN rolüne yükseltildi.`)
  await prisma.$disconnect()
}

main().catch(console.error)
