const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

function getApiKey(): string {
  return process.env.OPENROUTER_API_KEY ?? ""
}

export async function chatCompletion({
  model = "meta-llama/llama-3.3-70b-instruct",
  messages,
  temperature = 0.7,
  maxTokens = 2048,
}: {
  model?: string
  messages: { role: string; content: string }[]
  temperature?: number
  maxTokens?: number
}) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured")

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error (${res.status}): ${err}`)
  }

  return res.json()
}

export async function generateImage({
  prompt,
  model = "black-forest-labs/flux-1.1-pro",
  n = 1,
  resolution = "1K",
  aspectRatio = "1:1",
  quality = "high",
}: {
  prompt: string
  model?: string
  n?: number
  resolution?: string
  aspectRatio?: string
  quality?: string
}) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured")

  const res = await fetch(`${OPENROUTER_BASE}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n,
      resolution,
      aspect_ratio: aspectRatio,
      quality,
    }),
  })

  if (res.ok) {
    const json = await res.json()
    const images: string[] = []

    if (json.data) {
      for (const item of json.data) {
        if (item.url) images.push(item.url)
        else if (item.b64_json) images.push(`data:image/png;base64,${item.b64_json}`)
      }
    }

    if (images.length > 0) return { images }
  }

  const fallbackModels = [
    "black-forest-labs/flux.2-pro",
    "black-forest-labs/flux-1.1-pro",
    "stabilityai/stable-diffusion-3.5-large",
  ]

  for (const fallback of fallbackModels) {
    if (fallback === model) continue

    const fbRes = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: fallback,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      }),
    })

    if (fbRes.ok) {
      const fbJson = await fbRes.json()
      const content = fbJson.choices?.[0]?.message?.content
      if (content && typeof content === "string") {
        const urls = content.match(/https?:\/\/[^\s]+/g)
        if (urls && urls.length > 0) return { images: urls }
      }
    }
  }

  throw new Error("Tüm modeller başarısız oldu. API anahtarınızı kontrol edin.")
}
