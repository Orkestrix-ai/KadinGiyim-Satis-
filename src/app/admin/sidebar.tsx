"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/admin-constants"

interface Props {
  session: { user?: { email?: string | null; name?: string | null } } | null
  pendingOrders: number
  failedDropshipping: number
}

export function AdminSidebar({ session, pendingOrders, failedDropshipping }: Props) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r bg-card hidden md:flex flex-col z-30">
      <div className="p-6 border-b">
        <Link href="/admin" className="text-lg font-bold tracking-tight">
          ModaCini
          <span className="block text-xs font-normal text-muted-foreground">Yönetim Paneli</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {(item.href === "/admin/orders" && pendingOrders > 0) ||
              (item.href === "/admin/dropshipping" && failedDropshipping > 0) ? (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.href === "/admin/orders" ? pendingOrders : failedDropshipping}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground truncate">{session?.user?.email ?? "Giriş yapılmadı"}</p>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 block">
          Siteye Dön →
        </Link>
      </div>
    </aside>
  )
}
