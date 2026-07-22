"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Heart } from "lucide-react"

interface ProductCardProduct {
  slug: string
  name: string
  price: number
  images: string[]
  category: { name: string }
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-[3/4] bg-muted rounded-2xl mb-3 overflow-hidden relative">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground" />
        )}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-3 right-3 size-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white cursor-pointer shadow-sm"
          aria-label="Favorilere ekle"
        >
          <Heart className="size-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <p className="text-xs text-muted-foreground tracking-wide uppercase">{product.category.name}</p>
      <h3 className="font-medium text-sm mt-0.5 truncate group-hover:text-primary transition-colors">{product.name}</h3>
      <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
    </Link>
  )
}
