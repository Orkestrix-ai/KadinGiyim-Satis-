import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateImage } from "@/lib/openrouter"
import { urunAgentConfig } from "../../../../../agents/urun-agent/config"
import * as fs from "fs"
import * as path from "path"

const styleLabels: Record<string, string> = {
  minimal: "Minimal / Sade",
  luks: "Lüks / Premium",
  dogal: "Doğal / Günlük",
  canli: "Canlı / Renkli",
  editorial: "Editoryal / Moda Çekimi",
}

export async function POST(req: Request) {
  try {
    const {
      productId,
      prompt,
      style = "minimal",
      model,
      count = 2,
      resolution = "1K",
      aspectRatio = "1:1",
      quality = "high",
    } = await req.json()

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
    }

    const stylePrompt =
      urunAgentConfig.defaults.stylePrompts[style as keyof typeof urunAgentConfig.defaults.stylePrompts] ??
      "ultra realistic product photography, 8K"

    const promptTemplate = fs.readFileSync(
      path.join(process.cwd(), "agents/urun-agent/prompts/photo-prompt.txt"),
      "utf-8"
    )

    const finalPrompt = prompt ?? promptTemplate
      .replace("{{productName}}", product.name)
      .replace("{{category}}", product.category.name)
      .replace("{{description}}", product.description ?? "")
      .replace("{{style_prompt}}", stylePrompt)

    const selectedModel =
      model ||
      urunAgentConfig.openrouter.defaultImageModel ||
      urunAgentConfig.openrouter.imageModels[0].value

    const result = await generateImage({
      prompt: finalPrompt,
      model: selectedModel,
      n: count,
      resolution,
      aspectRatio,
      quality,
    })

    return NextResponse.json({
      success: true,
      images: result.images,
      model: selectedModel,
      style: styleLabels[style] ?? style,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
