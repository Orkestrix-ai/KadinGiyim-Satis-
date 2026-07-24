import { PrismaClient } from "@/generated/prisma/client"
import { auth } from "@/lib/auth"

type PrismaTx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>

export async function withCtx<T>(
  prisma: PrismaClient,
  fn: (tx: PrismaTx) => Promise<T>
): Promise<T> {
  const session = await auth()
  const userId = session?.user?.id ?? ''
  const role = (session?.user as { role?: string })?.role ?? ''

  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.user_id', $1, true)`,
      userId
    )
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.role', $1, true)`,
      role
    )
    return fn(tx)
  })
}
