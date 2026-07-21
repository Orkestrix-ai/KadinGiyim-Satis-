export interface ProductInfo {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string
  images: string[]
}

export interface GenerationResult {
  success: boolean
  data: unknown
  error?: string
}

export interface PhotoGenerationInput {
  productId: string
  prompt?: string
  style?: string
  count?: number
}

export interface AdTextGenerationInput {
  productId: string
  type: "description" | "instagram" | "facebook" | "email"
  tone: "samimi" | "luks" | "genc" | "profesyonel"
}

export interface VideoGenerationInput {
  productId: string
  type: "tanitim" | "kampanya" | "sosyal-medya"
  duration?: string
}
