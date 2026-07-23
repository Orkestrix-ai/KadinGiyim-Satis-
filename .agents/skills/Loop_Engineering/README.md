# Loop_Engineering

[![Orkestrix](https://img.shields.io/badge/Author-Orkestrix-blue)](https://github.com/Orkestrix-ai)
[![Version](https://img.shields.io/badge/Version-2.0-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

Çalışmaya hazır **promptlar** ve kanıtlanmış pattern'lere dayanan, kendi kendini denetleyen **otonom loop'lar** üreten Claude skill'i.

> Prompt mühendisliği talimatı optimize eder. **Loop mühendisliği süreci optimize eder.**

*(Eski adı: Prompt_Generator)*

---

## 🎯 Ne İşe Yarar?

| Tür | Kapsam | Mod |
|---|---|---|
| **Teknik** | Kod yazma, review/debug, test, SQL, DevOps | Single-shot |
| **İş** | Sales, HR, finans, pazarlama, contract review | Single-shot |
| **Creative** | İçerik, tasarım briefi, UX copy | Single-shot |
| **Loop** | Doğrulayıcısı olan tekrarlı görevler: test/lint/build yeşile dönene kadar debug, schema geçene kadar veri temizleme, retry + self-correction akışları | Loop |

**Seçim kuralı**: nesnel doğrulayıcı (test/lint/build/schema/HTTP) yoksa → single-shot. Varsa ve görev tek geçişte bitmiyorsa → loop.

---

## 🔁 Loop Mühendisliği (Loop Engineering)

**Tanım**: Loop mühendisliği; yapay zekâya tek seferlik talimatlar (prompt) vermek yerine, sistemin kendisini — görev keşfeden, eyleme geçen, doğrulayan, hatasını düzeltip hedefe ulaşana kadar döndüren otonom mekanizmayı — tasarlama disiplinidir. Sen ajanı tur tur yönlendirmek yerine, **bunu senin yerine yapacak sistemi** kurarsın.

Alanın evrimi:

```
Prompt Engineering  → Modele NE söylenir?
Context Engineering → Modele hangi bilgi/tool gösterilir?
Harness Engineering → Model hangi çalıştırılabilir ortama bağlanır?
Loop Engineering    → Sistem nasıl tekrar gözlemler / eyler / doğrular / durur?
```

```
PROMPT   Talimat → Çıktı → [insan denetler] → [insan düzeltir]

LOOP     Hedef → Plan → Eylem → Doğrula → Hata mı? → Düzelt ↺
                                    ↓ Hayır
                              Çıkış koşulu → Sonuç
```

### Bir loop'un zorunlu 6 bileşeni

| # | Bileşen | Neden zorunlu? |
|---|---|---|
| 1 | **Hedef** | Ölçülebilir tek cümle. "İyi kod yaz" değil. |
| 2 | **Doğrulayıcı (Verifier)** | Nesnel sinyal: test, lint, build, schema, HTTP. Modelin "bence oldu" demesi doğrulama değildir. |
| 3 | **Çıkış koşulu** | Binary + deterministik + ölçülebilir bir duruma referans verir. Ne zaman başarıyla, ne zaman başarısız durur? |
| 4 | **Limit + escalation** | Max tur sayısı ve dolduğunda ne olacağı (Circuit Breaker → insana devret). |
| 5 | **State** | Denenen ve işe yaramayan çözümler taşınır → aynı hata tekrarlanmaz. |
| 6 | **Scope** | Dokunulmaz alanlar (prod, secrets, migration, silme). |

### 10 Loop Pattern'i (özet)

| Grup | Pattern'ler |
|---|---|
| **Temel** | ReAct · Reflection · Tool Use · Prompt Chaining |
| **Pratikte kanıtlanmış** | Ralph Loop (dış validator, context reset) · Evaluator-Optimizer (worker ≠ checker) · Multi-Agent Supervisor |
| **Prodüksiyon sağlamlaştırma** | Circuit Breaker (stagnation koruması) · Heartbeat Loop (zamanlanmış tetik) · Bounded Execution (token/tur/süre tavanı) |

Detaylı tanımlar ve seçim rehberi için **SKILL.md**.

### Loop anti-pattern'leri

```
❌ Doğrulayıcısız loop  → model kendi çıktısını beğenir, döngü anlamsız
❌ Limitsiz loop        → token yakar, sonsuza gider
❌ State'siz loop       → aynı hatalı çözümü tekrar dener
❌ Yıkıcı scope         → geri alınamayan yetki (prod delete, force push)
❌ Gereksiz loop        → tek seferlik görev loop istemez
```

---

## 🚀 Hızlı Başlangıç

```
- "prompt oluştur: [görev açıklaması]"
- "prompt yaz: RLS koruması kuran React hook"
- "loop kur: testler yeşile dönene kadar debug etsin"
- "otonom akış: schema validation geçene kadar veriyi temizlesin"
```

---

## 📋 5 Adımda İyi Prompt

1. **Görev** — Ne yapılacak? (1-2 cümle)
2. **Context** — Stack, kütüphaneler, kısıtlar
3. **Başarı kriteri** — Ne "başarı" sayılır? *(Loop ise: bunu hangi komut ölçüyor, doğrulanabilir mi?)*
4. **Format** — JSON / TypeScript / Markdown / plain text
5. **Constraints** — Neleri yapmasın?

### ❌ Kaçın

```
❌ "Bana bir prompt yaz"        (belirsiz)
❌ "Kod yaz"                     (context yok)
❌ "İyi bir sales pitch"         (success criteria yok)
❌ "Beğenene kadar iyileştir"    (loop'ta doğrulayıcı yok)

✅ "Auth kuran TypeScript prompt, friendly tone, max 150 kelime"
✅ "Loop: `npm test` 0 failing olana kadar düzelt, max 5 tur, testlere dokunma"
```

---

## 📚 Örnekler

### 1. Single-shot — RLS Hook

**İstek**: "RLS korumalı veri erişim hook'u, React + TypeScript, loading/error states"

**Çıktı** (prompt):
```
RLS korumalı veri erişim hook'u yaz.

Context:
- users table: id, email, tenant_id
- RLS: WHERE auth.uid() = user_id
- React + TypeScript
- Unauthorized → user-friendly error message

Hook:
- useDataQuery(table, conditions)
- Loading, error, data states
- Retry logic
- Type-safe

Output: Kopyala-yapıştır React hook
```

### 2. Loop (Ralph Loop pattern) — Test yeşile dönene kadar debug

**İstek**: "Modül testleri kırmızı, kendi kendini düzelten bir loop kur"

**Çıktı** (loop prompt):
```
ROL: Testleri yeşile döndürene kadar otonom çalışan debug agent'sın.

PATTERN: Ralph Loop (verifier = test suite, öz-değerlendirme yok)

HEDEF: [modül] altındaki tüm testler geçene kadar üretim kodunu düzelt.

BAŞARI TANIMI (Verifier):
`npm test -- [modül]` çıktısında 0 failing. Bu komutun gerçek çıktısı
tek doğruluk kaynağıdır. Çıktı uydurma.

DÖNGÜ:
1. PLAN    → Son hatayı oku, kök nedeni tek cümlede yaz, tek düzeltme seç.
2. EYLEM   → Sadece o düzeltmeyi uygula.
3. DOĞRULA → Verifier komutunu çalıştır, çıktıyı olduğu gibi al.
4. KARAR   → 0 failing ise DUR. Değilse STATE'i güncelle, 1'e dön.

STATE (her turda yazdır):
- Tur no / Failing sayısı (önceki → şimdiki) / Son hata
- Denenmiş ve işe yaramamış düzeltmeler
- Değiştirilen dosyalar

KISITLAR:
- Max 5 tur. Testleri değiştirme, silme, skip etme.
- Migration çalıştırma, .env dosyalarına dokunma.
- Aynı düzeltmeyi iki kez deneme.

ESCALATION (Circuit Breaker):
Limit dolarsa veya failing sayısı 2 tur azalmazsa: DUR, "TAKILDIM" yaz,
son hatayı + denenenleri + hipotezini raporla.

FINAL ÇIKTI:
Sonuç (BAŞARILI/TAKILDIM) · Tur sayısı · Değişen dosyalar · Kök neden
```

---

## 📦 Kurulum

### Repo yapısı

```
Loop_Engineering/
├── SKILL.md      # Skill tanımı (frontmatter + tüm şablonlar/örnekler)
├── README.md     # Bu dosya
└── LICENSE       # MIT
```

### 1. Klonlama

```bash
git clone https://github.com/Orkestrix-ai/Loop_Engineering.git
cd Loop_Engineering
```

SSH ile:
```bash
git clone git@github.com:Orkestrix-ai/Loop_Engineering.git
```

### 2. Skill olarak kurma

**Claude Code (kullanıcı seviyesi — tüm projelerde aktif):**
```bash
mkdir -p ~/.claude/skills/loop-engineering
cp SKILL.md README.md ~/.claude/skills/loop-engineering/
```

**Claude Code (proje seviyesi — sadece bu repo'da aktif):**
```bash
mkdir -p .claude/skills/loop-engineering
cp SKILL.md README.md .claude/skills/loop-engineering/
```

Doğrudan klonlayarak da kurabilirsin:
```bash
git clone https://github.com/Orkestrix-ai/Loop_Engineering.git \
  ~/.claude/skills/loop-engineering
```

Kurulumu doğrula:
```bash
ls ~/.claude/skills/loop-engineering/SKILL.md
```
Claude'u yeniden başlat, ardından `"prompt oluştur: ..."` veya `"loop kur: ..."` yaz — skill tetiklenmeli.

**Claude.ai (web):** SKILL.md içeriğini Settings → Capabilities → Skills altından yükle.

### 3. Güncelleme

```bash
cd ~/.claude/skills/loop-engineering
git pull origin main
```

### 4. Katkı / Push (maintainer)

```bash
git checkout -b feature/loop-patterns
# SKILL.md ve/veya README.md üzerinde değişiklik yap
git add SKILL.md README.md
git commit -m "feat: yeni loop pattern'i ekle"
git push -u origin feature/loop-patterns
```
Ardından GitHub'da PR aç. Doğrudan `main`'e:
```bash
git add . && git commit -m "docs: v2.0" && git push origin main
```

> **Loop modu** için agent runtime'ı olan bir ortam gerekir (Claude Code, n8n, kendi orchestrator'ın). Bu skill loop'u **tasarlar ve prompt'unu üretir**; runtime'ı kurmaz.

---

## 🔧 Troubleshooting

| Problem | Çözüm |
|---|---|
| Prompt hâlâ belirsiz | Constraints ve örnek ekle |
| Çıktı çok uzun | "Kısaca" / "max 200 kelime" / bullet points |
| Format yanlış | Beklenen output'un örneğini göster |
| **Loop durmuyor** | Çıkış koşulu doğrulanabilir değil → verifier'ı komuta bağla, limit ekle |
| **Loop "başardım" diyor ama başarmamış** | Kendi çıktısını doğruluyor (self-serving bias) → worker/checker'ı ayır, doğrulamayı dış sinyale taşı |
| **Loop aynı hatayı tekrarlıyor** | State eksik → "denenmiş çözümler" listesini her turda taşıt |
| **Yanlış pattern seçildi** | Basit debug'a ağır bir pattern (Multi-Agent Supervisor) kurmak yerine Ralph Loop/Evaluator-Optimizer yeterlidir |

---

## 📖 Referanslar

- **SKILL.md** — Detaylı dokümantasyon, 10 loop pattern'i, doğrulanabilir çıkış koşulu tasarımı, tüm şablonlar ve örnekler
- **Claude Docs** — [Prompting Guide](https://docs.anthropic.com)
- Loop mühendisliği araştırma kaynakları SKILL.md'nin sonunda listelenmiştir (Lushbinary, Data Science Dojo, MindStudio, Cobus Greyling ve diğerleri)

---

## 🤝 Katkı & Destek

- **GitHub**: [@Orkestrix-ai](https://github.com/Orkestrix-ai) · [Issues](https://github.com/Orkestrix-ai/Loop_Engineering/issues)
- **Email**: orkestrix@gmail.com

## 📄 License

MIT License © 2026 Orkestrix

---

**Last Updated**: 2026-07-18
**Version**: 2.0
**Maintainer**: Orkestrix
