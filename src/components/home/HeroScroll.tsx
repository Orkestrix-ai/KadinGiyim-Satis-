"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroProduct {
  id: string
  slug: string
  name: string
  price: number
  images: string[]
  category: { name: string }
}

export function HeroScroll({
  products,
  children,
}: {
  products: HeroProduct[]
  children: React.ReactNode
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showDots, setShowDots] = useState(true)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const childrenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || products.length === 0) return

    const ctx = gsap.context(() => {
      products.forEach((_, i) => {
        const section = sectionRefs.current[i]
        const image = imageRefs.current[i]
        const text = textRefs.current[i]
        if (!section || !image || !text) return

        gsap.fromTo(image,
          { y: "-15%", scale: 1.1 },
          {
            y: "15%",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        )

        gsap.fromTo(text,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 25%",
              scrub: 1,
            },
          }
        )

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        })
      })

      if (childrenRef.current) {
        ScrollTrigger.create({
          trigger: childrenRef.current,
          start: "top bottom",
          end: "top top",
          onToggle: (self) => setShowDots(!self.isActive),
        })
      }
    })

    return () => ctx.revert()
  }, [products])

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative">
      {products.map((product, i) => (
        <section
          key={product.id}
          ref={(el) => { sectionRefs.current[i] = el }}
          className="relative h-dvh w-full overflow-hidden"
        >
          <div
            ref={(el) => { imageRefs.current[i] = el }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div
            ref={(el) => { textRefs.current[i] = el }}
            className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs uppercase tracking-widest mb-4 border border-white/20">
              {product.category.name}
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-3 max-w-2xl leading-tight">
              {product.name}
            </h2>
            <p className="text-xl md:text-3xl text-white/90 font-light tracking-wide mb-6">
              {formatPrice(product.price)}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-medium text-sm hover:bg-white/90 transition-all hover:scale-105 cursor-pointer"
            >
              İncele
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        </section>
      ))}

      <div ref={childrenRef} className="bg-background">
        {children}
      </div>

      {showDots && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
          {products.map((_, j) => (
            <button
              key={j}
              onClick={() => scrollTo(j)}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                activeIndex === j
                  ? "w-10 h-2.5 bg-white shadow-lg shadow-white/30"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Ürün ${j + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
