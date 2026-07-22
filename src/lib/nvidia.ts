const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1"

function getApiKey(): string {
  return process.env.NVIDIA_API_KEY ?? ""
}

export async function chatCompletion({
  model = "meta/llama-3.3-70b-instruct",
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
  if (!apiKey) throw new Error("NVIDIA_API_KEY not configured")

  const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
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
    throw new Error(`NVIDIA error (${res.status}): ${err}`)
  }

  return res.json()
}

export async function generateImage({
  prompt,
  model = "black-forest-labs/flux-1-schnell",
  n = 1,
}: {
  prompt: string
  model?: string
  n?: number
}) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error("NVIDIA_API_KEY not configured")

  const modelEndpoint = `https://ai.api.nvidia.com/v1/vlm/${model}`
  const res = await fetch(modelEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`NVIDIA image error (${res.status}): ${err}`)
  }

  const json = await res.json()
  const images: string[] = []
  const content = json.choices?.[0]?.message?.content
  if (content && typeof content === "string") {
    const urls = content.match(/https?:\/\/[^\s"'<>]+(?:jpg|jpeg|png|gif|webp)/gi)
    if (urls) images.push(...urls)
  }

  return { images }
}
