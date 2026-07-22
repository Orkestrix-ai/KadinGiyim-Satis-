"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const footerLinks = [
  {
    title: "Kurumsal",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Mağazalarımız", href: "/magazalarimiz" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    title: "Yardım",
    links: [
      { label: "Sık Sorulan Sorular", href: "/sss" },
      { label: "Kargo ve Teslimat", href: "/kargo" },
      { label: "İade ve Değişim", href: "/iade" },
      { label: "Beden Rehberi", href: "/beden-rehberi" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "KVKK", href: "/kvkk" },
      { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { label: "Kullanım Koşulları", href: "/kullanım-kosullari" },
      { label: "Çerez Politikası", href: "/cerez-politikasi" },
    ],
  },
]

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const el = wrapperRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1.2,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <footer className="border-t border-border/50 bg-background mt-16">
      <div ref={wrapperRef} className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
              ModaCini
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Modern çizgileri geleneksel zarafetle buluşturan kadın giyim markası. Her anınıza özel tasarımlar.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Sevgiyle</span>
              <span className="text-destructive">&hearts;</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">hazırlandı</span>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/60">&copy; 2026 ModaCini. T&uuml;m haklar&#x131; sakl&#x131;d&#x131;r.</p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/60">
            <Link href="/kvkk" className="hover:text-foreground transition-colors">KVKK</Link>
            <Link href="/gizlilik-politikasi" className="hover:text-foreground transition-colors">Gizlilik</Link>
            <Link href="/kullanım-kosullari" className="hover:text-foreground transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
