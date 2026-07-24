import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AdminSidebar } from "./sidebar"
import { AdminMobileNav } from "./mobile-nav"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") redirect("/login")

  const counts = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.dropshipperOrder.count({ where: { status: "FAILED" } }).catch(() => 0),
  ])

  return (
    <div className="min-h-screen bg-background">
      <AdminMobileNav session={session} pendingOrders={counts[0]} failedDropshipping={counts[1]} />
      <AdminSidebar session={session} pendingOrders={counts[0]} failedDropshipping={counts[1]} />
      <main className="md:pl-64 pt-14 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
