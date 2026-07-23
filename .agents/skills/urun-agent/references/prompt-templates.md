# Prompt Templates Reference

## Photo Generation Template

Base prompt: `agents/urun-agent/prompts/photo-prompt.txt`

Variables:
- `{{productName}}` — Ürün adı
- `{{category}}` — Kategori adı
- `{{description}}` — Ürün açıklaması
- `{{style}}` — Stil seçimi (minimal/luks/dogal/canli/editorial)

Style modifiers:
- **minimal**: clean white background, soft lighting, minimal accessories
- **luks**: dramatic lighting, premium setting, elegant composition
- **dogal**: outdoor natural lighting, casual setting, lifestyle
- **canli**: vibrant colors, bold background, energetic
- **editorial**: high fashion magazine style, artistic composition

## Ad Text Generation Template

Base prompt: `agents/urun-agent/prompts/ad-text-prompt.txt`

Variables:
- `{{productName}}`, `{{category}}`, `{{price}}`, `{{description}}`
- `{{type}}` — description / instagram / facebook / email
- `{{tone}}` — samimi / luks / genc / profesyonel

Type-specific notes:
- **description**: 2-3 paragraph detailed product description with features
- **instagram**: short, visual, emoji-friendly, hashtags
- **facebook**: persuasive, benefit-focused, CTA
- **email**: subject line + body, promotional style

## Video Storyboard Template

Base prompt: `agents/urun-agent/prompts/video-storyboard-prompt.txt`

Variables:
- `{{productName}}`, `{{category}}`, `{{price}}`, `{{description}}`
- `{{type}}` — tanitim / kampanya / sosyal-medya
- `{{duration}}` — seconds (30/60/90)

Type-specific notes:
- **tanitim**: product-focused, feature showcase
- **kampanya**: seasonal, promotional, emotional
- **sosyal-medya**: fast-paced, short-form (15-60s), vertical format
