import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export interface CreateCheckoutInput {
  storeId: number
  variantId: number
  customPrice: number
  orderId: string
  email: string
  name: string
  redirectUrl: string
}

export interface CheckoutResult {
  success: boolean
  url?: string
  error?: string
}

export async function createPaymentCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    if (!apiKey) {
      return { success: false, error: "LemonSqueezy API anahtarı yapılandırılmamış" }
    }

    lemonSqueezySetup({ apiKey })

    const { data, error } = await createCheckout(
      String(input.storeId),
      String(input.variantId),
      {
        customPrice: input.customPrice,
        checkoutData: {
          email: input.email,
          name: input.name,
          custom: {
            order_id: input.orderId,
          },
        },
        productOptions: {
          redirectUrl: input.redirectUrl,
          enabledVariants: [input.variantId],
        },
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }
    )

    if (error) {
      return { success: false, error: error.message ?? "LemonSqueezy checkout oluşturulamadı" }
    }

    const url = data?.data?.attributes?.url
    if (!url) {
      return { success: false, error: "Checkout URL alınamadı" }
    }

    return { success: true, url }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Checkout hatası" }
  }
}
