import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { chatCompletion } from "@/lib/openrouter"
import { urunAgentConfig } from "../../../../../agents/urun-agent/config"
import * as fs from "fs"
import * as path from "path"

export async function POST(req: Request) {
  try {
    const { productId, type = "description", tone = "samimi", model } = await req.json()

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
    }

    const promptTemplate = fs.readFileSync(
      path.join(process.cwd(), "agents/urun-agent/prompts/ad-text-prompt.txt"),
      "utf-8"
    )

    const typeLabels: Record<string, string> = {
      description: "Ürün Açıklaması",
      instagram: "Instagram Post",
      facebook: "Facebook Reklam",
      email: "E-posta Kampanyası",
    }

    const finalPrompt = promptTemplate
      .replace("{{productName}}", product.name)
      .replace("{{category}}", product.category.name)
      .replace("{{price}}", product.price.toString())
      .replace("{{description}}", product.description ?? "")
      .replace("{{type}}", typeLabels[type] ?? type)
      .replace("{{tone}}", tone)

    const result = await chatCompletion({
      model: model || urunAgentConfig.openrouter.textModel,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: urunAgentConfig.openrouter.temperature,
      maxTokens: urunAgentConfig.openrouter.maxTokens,
    })

    const text = result.choices?.[0]?.message?.content ?? ""

    return NextResponse.json({ success: true, text, type, tone })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
