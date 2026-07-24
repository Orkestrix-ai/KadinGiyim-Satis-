"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, User, Search, LogOut } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollHeaderProps {
  session: {
    user?: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  } | null
  cartCount: number
}

export function ScrollHeader({ session, cartCount }: ScrollHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const logo = logoRef.current
    if (!header || !logo) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top -80",
            end: "top -200",
            scrub: 1.5,
          },
        })

        tl.to(header, { height: 48, ease: "power1.inOut" }, 0)
          .to(logo, { fontSize: "1.25rem", ease: "power1.inOut" }, 0)
          .to(header, { borderColor: "rgba(0,0,0,0.15)", ease: "power1.inOut" }, 0)
      })

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top -80",
            end: "top -200",
            scrub: 1.5,
          },
        })

        tl.to(header, { height: 52, ease: "power1.inOut" }, 0)
          .to(logo, { fontSize: "1.125rem", ease: "power1.inOut" }, 0)
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={headerRef}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 h-16 overflow-hidden transition-colors"
    >
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            ref={logoRef}
            className="font-heading text-2xl font-bold tracking-tight text-primary shrink-0"
          >
            Nevrak
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Ürünler
            </Link>
            <Link
              href="/products?category=new-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Yeni Gelenler
            </Link>
            <Link
              href="/products?category=cok-satan"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Çok Satanlar
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
            <Search className="size-4" />
            <span>Ara</span>
          </button>
          <Link
            href={session?.user ? "/profil" : "/login"}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Hesabım"
          >
            <User className="size-5" />
          </Link>
          {session?.user && (
            <Link
              href="/cikis"
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive hidden md:inline-flex"
              aria-label="Çıkış Yap"
            >
              <LogOut className="size-5" />
            </Link>
          )}
          <Link
            href="/sepet"
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative"
            aria-label="Sepet"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
