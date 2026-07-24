"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { mobileNavItems } from "@/lib/admin-constants"

interface Props {
  session: { user?: { email?: string | null } } | null
  pendingOrders: number
  failedDropshipping: number
}

export function AdminMobileNav({ session }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-card">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="font-bold text-sm">
          Nevrak Admin
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-muted"
          aria-label="Menü"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t bg-card p-3 space-y-1">
          {mobileNavItems.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 border-t mt-3">
            <p className="text-xs text-muted-foreground px-3">{session?.user?.email}</p>
            <Link href="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
              Siteye Dön →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
