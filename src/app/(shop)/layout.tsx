import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ScrollHeader } from "@/components/ui/scroll-header"
import { CinematicFooter } from "@/components/ui/motion-footer"

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const cartCount = session?.user
    ? await prisma.cart
        .findUnique({ where: { userId: session.user.id }, include: { items: true } })
        .then((c) => c?.items.length ?? 0)
        .catch(() => 0)
    : 0

  return (
    <div className="relative">
      <ScrollHeader session={session} cartCount={cartCount} />

      {children}

      <CinematicFooter />
    </div>
  )
}