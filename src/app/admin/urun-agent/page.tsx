"use client"

import { useState, useEffect } from "react"
import { urunAgentConfig } from "../../../../agents/urun-agent/config"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  images: string[]
  category: { name: string }
}

type Tab = "photo" | "text" | "video"

export default function UrunAgentPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [tab, setTab] = useState<Tab>("photo")

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const [photoStyle, setPhotoStyle] = useState("minimal")
  const [photoCount, setPhotoCount] = useState(2)
  const [photoModel, setPhotoModel] = useState(urunAgentConfig.openrouter.defaultImageModel)
  const [photoResolution, setPhotoResolution] = useState("1K")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const [textModel, setTextModel] = useState(urunAgentConfig.openrouter.textModel)
  const [textType, setTextType] = useState("description")
  const [textTone, setTextTone] = useState("samimi")
  const [generatedText, setGeneratedText] = useState("")

  const [videoType, setVideoType] = useState("tanitim")
  const [videoDuration, setVideoDuration] = useState("30")
  const [generatedStoryboard, setGeneratedStoryboard] = useState("")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})

  }, [])

  async function handlePhotoGenerate() {
    if (!selectedProduct) return
    setLoading(true)
    setError("")
    setGeneratedImages([])
    setResult(null)

    try {
      const res = await fetch("/api/urun-agent/generate-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          style: photoStyle,
          count: photoCount,
          model: photoModel,
          resolution: photoResolution,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else if (data.images?.length) {
        setGeneratedImages(data.images)
        setResult(`${data.images.length} görsel oluşturuldu (${data.model ?? photoModel})`)
      } else {
        setError("Görsel üretilemedi. Lütfen API anahtarınızı kontrol edin.")
      }
    } catch (e) {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  async function handleTextGenerate() {
    if (!selectedProduct) return
    setLoading(true)
    setError("")
    setGeneratedText("")
    setResult(null)

    try {
      const res = await fetch("/api/urun-agent/generate-ad-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          model: textModel,
          type: textType,
          tone: textTone,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else if (data.text) {
        setGeneratedText(data.text)
        setResult("Metin oluşturuldu")
      } else {
        setError("Metin üretilemedi")
      }
    } catch (e) {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  async function handleVideoGenerate() {
    if (!selectedProduct) return
    setLoading(true)
    setError("")
    setGeneratedStoryboard("")
    setResult(null)

    try {
      const res = await fetch("/api/urun-agent/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          model: textModel,
          type: videoType,
          duration: videoDuration,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else if (data.storyboard) {
        setGeneratedStoryboard(data.storyboard)
        setResult("Video storyboard oluşturuldu")
      } else {
        setError("Storyboard üretilemedi")
      }
    } catch (e) {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(images?: string[], description?: string) {
    if (!selectedProduct) return
    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/urun-agent/save-to-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          images: images ?? undefined,
          description: description ?? undefined,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult("Ürüne kaydedildi!")
      }
    } catch (e) {
      setError("Kaydetme hatası")
    } finally {
      setSaving(false)
    }
  }
  const tabs: { key: Tab; label: string }[] = [
    { key: "photo", label: "Fotoğraf Üret" },
    { key: "text", label: "Metin Üret" },
    { key: "video", label: "Video Storyboard" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ürün Agent</h1>

      <div>
        <label className="block text-sm font-medium mb-1.5">Ürün Seç</label>
        <select
          value={selectedProduct?.id ?? ""}
          onChange={(e) => {
            const p = products.find((x) => x.id === e.target.value)
            setSelectedProduct(p ?? null)
            setGeneratedImages([])
            setGeneratedText("")
            setGeneratedStoryboard("")
            setResult(null)
            setError("")
          }}
          className="w-full max-w-md px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">-- Ürün Seçiniz --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.category?.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="border rounded-xl p-4 bg-card space-y-1">
          <p className="font-semibold">{selectedProduct.name}</p>
          <p className="text-sm text-muted-foreground">
            {selectedProduct.category?.name} — {Number(selectedProduct.price).toFixed(2)} TL
          </p>
          {selectedProduct.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{selectedProduct.description}</p>
          )}
          {selectedProduct.images.length > 0 && (
            <p className="text-xs text-muted-foreground">{selectedProduct.images.length} mevcut görsel</p>
          )}
        </div>
      )}

      {selectedProduct && (
        <>
          <div className="flex gap-1 border-b">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key)
                  setResult(null)
                  setError("")
                }}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "photo" && (
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-muted/30 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model Seçimi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {urunAgentConfig.openrouter.imageModels.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setPhotoModel(m.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        photoModel === m.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{m.cost}</span>
                        <span className="text-xs">
                          {"⭐".repeat(Math.floor(m.realistic / 2))}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Stil</label>
                  <select
                    value={photoStyle}
                    onChange={(e) => setPhotoStyle(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {urunAgentConfig.defaults.styles.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Çözünürlük</label>
                  <select
                    value={photoResolution}
                    onChange={(e) => setPhotoResolution(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="512">512 (düşük)</option>
                    <option value="1K">1K (standart)</option>
                    <option value="2K">2K (yüksek)</option>
                    <option value="4K">4K (en yüksek)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Adet</label>
                  <select
                    value={photoCount}
                    onChange={(e) => setPhotoCount(Number(e.target.value))}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePhotoGenerate}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Oluşturuluyor..." : "Fotoğraf Oluştur"}
              </button>

              {generatedImages.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((url, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden bg-muted/20">
                        <img src={url} alt={`Üretilen görsel ${i + 1}`} className="w-full aspect-square object-cover" />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSave(generatedImages)}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? "Kaydediliyor..." : "Görselleri Ürüne Kaydet"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "text" && (
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-muted/30 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LLM Modeli</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {urunAgentConfig.openrouter.textModels.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setTextModel(m.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        textModel === m.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.description}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Metin Türü</label>
                  <select
                    value={textType}
                    onChange={(e) => setTextType(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {urunAgentConfig.defaults.textTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Ton</label>
                  <select
                    value={textTone}
                    onChange={(e) => setTextTone(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {urunAgentConfig.defaults.tones.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleTextGenerate}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Oluşturuluyor..." : "Metin Oluştur"}
              </button>

              {generatedText && (
                <div className="space-y-3">
                  <div className="border rounded-xl p-4 bg-card whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedText}
                  </div>
                  <button
                    onClick={() => handleSave(undefined, generatedText)}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? "Kaydediliyor..." : "Metni Ürün Açıklamasına Kaydet"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "video" && (
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-muted/30 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LLM Modeli</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {urunAgentConfig.openrouter.textModels.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setTextModel(m.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        textModel === m.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.description}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Video Türü</label>
                  <select
                    value={videoType}
                    onChange={(e) => setVideoType(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {urunAgentConfig.defaults.videoTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Süre (saniye)</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="15">15 sn</option>
                    <option value="30">30 sn</option>
                    <option value="60">60 sn</option>
                    <option value="90">90 sn</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleVideoGenerate}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Oluşturuluyor..." : "Storyboard Oluştur"}
              </button>

              {generatedStoryboard && (
                <div className="border rounded-xl p-4 bg-card whitespace-pre-wrap text-sm leading-relaxed">
                  {generatedStoryboard}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          {result}
        </div>
      )}

      {!selectedProduct && (
        <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
          <p className="text-lg mb-1">👆 Bir ürün seçin</p>
          <p className="text-sm">Yukarıdan bir ürün seçerek AI ile fotoğraf, metin veya video storyboard oluşturun.</p>
        </div>
      )}
    </div>
  )
}
