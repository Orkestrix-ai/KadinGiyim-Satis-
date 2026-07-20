const IYZICO_API_URL = process.env.IYZICO_API_URL ?? "https://sandbox-api.iyzico.com"

interface PaymentRequest {
  amount: number
  cardHolderName: string
  cardNumber: string
  cardExpiryMonth: string
  cardExpiryYear: string
  cardCvc: string
  orderId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerAddress: string
  buyerCity: string
  buyerCountry: string
  ip: string
}

interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string
  threeDSecureUrl?: string
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  try {
    const body = {
      locale: "tr",
      conversationId: request.orderId,
      price: request.amount.toFixed(2),
      paidPrice: request.amount.toFixed(2),
      currency: "TRY",
      installment: 1,
      basketId: request.orderId,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      paymentCard: {
        cardHolderName: request.cardHolderName,
        cardNumber: request.cardNumber.replace(/\s/g, ""),
        expireMonth: request.cardExpiryMonth,
        expireYear: request.cardExpiryYear,
        cvc: request.cardCvc,
        registerCard: 0,
      },
      buyer: {
        id: request.orderId,
        name: request.buyerName,
        surname: "",
        email: request.buyerEmail,
        identityNumber: "11111111111",
        registrationAddress: request.buyerAddress,
        city: request.buyerCity,
        country: request.buyerCountry ?? "Turkey",
        ip: request.ip,
      },
      shippingAddress: {
        contactName: request.buyerName,
        city: request.buyerCity,
        country: request.buyerCountry ?? "Turkey",
        address: request.buyerAddress,
      },
      billingAddress: {
        contactName: request.buyerName,
        city: request.buyerCity,
        country: request.buyerCountry ?? "Turkey",
        address: request.buyerAddress,
      },
      basketItems: [
        {
          id: request.orderId,
          name: "Sipariş",
          category1: "Giyim",
          itemType: "PHYSICAL",
          price: request.amount.toFixed(2),
        },
      ],
    }

    const apiKey = process.env.IYZICO_API_KEY
    const secretKey = process.env.IYZICO_SECRET_KEY

    if (!apiKey || !secretKey) {
      return { success: false, error: "Ödeme servisi yapılandırılmamış" }
    }

    const randomString = Math.random().toString(36).substring(2, 15)
    const timestamp = Date.now().toString()
    const hashString = apiKey + randomString + secretKey + timestamp
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(hashString))
    const hashHex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("")

    const response = await fetch(`${IYZICO_API_URL}/payment/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `IYZWS ${apiKey}:${hashHex}`,
        "x-iyz-rnd": randomString,
        "x-iyz-timestamp": timestamp,
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (result.status === "success") {
      return { success: true, paymentId: result.paymentId }
    }

    if (result.threeDSecureUrl) {
      return { success: false, threeDSecureUrl: result.threeDSecureUrl, error: "3D Secure gerekiyor" }
    }

    return { success: false, error: result.errorMessage ?? "Ödeme başarısız" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Ödeme hatası" }
  }
}
