import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { config } from "dotenv"

config({ path: ".env" })

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany({ select: { email: true, role: true, name: true } })
  console.log(JSON.stringify(users, null, 2))
  await prisma.$disconnect()
}

main()
