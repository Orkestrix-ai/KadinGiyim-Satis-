---
name: loop_engineering
description: "Kullanıcının ihtiyacına göre AI modellerine, iş süreçlerine ve kod/test görevlerine yönelik çalışmaya hazır promptlar ve loop (otonom döngü) tasarımları oluştur. Loop mühendisliği (loop engineering) metodolojisine dayanır: ReAct, Reflection, Ralph Loop, Evaluator-Optimizer, Multi-Agent Supervisor, Circuit Breaker gibi kanıtlanmış loop pattern'lerini ve doğrulanabilir çıkış koşulu (verifiable stop condition) tasarımını kullanır. Trigger: 'prompt oluştur', 'prompt yaz', 'prompt gerek', 'nasıl sor', 'AI''ya ne desen', 'test prompt', 'code prompt', 'loop kur', 'loop mühendisliği', 'loop prompt', 'otonom akış', 'self-correcting agent', 'agent loop', 'ralph loop', 'verifier tasarla', veya belirli bir görev için etkili bir prompt ya da kendi kendini denetleyen bir iş akışı gerektiğinde. Teknik (API, kod analizi), iş (sales, HR, operasyon), ve creative (yazı, tasarım) promptlar dahil."
---

# Loop_Engineering

**Versiyon**: 2.0 | **Sahip**: Orkestrix | **Repo**: [Loop_Engineering](https://github.com/Orkestrix-ai/Loop_Engineering)

Etkili promptlar oluşturmak sanat ve bilimdir; otonom döngüler tasarlamak ise ayrı bir disiplindir. Bu skill, kullanıcının amaçlarını anlayıp, Claude (veya diğer AI modelleri) için optimize edilmiş, çalışmaya hazır promptlar **ve** kanıtlanmış loop mühendisliği pattern'lerine dayanan otonom döngü tasarımları üretir.

Bu skill iki modda çalışır:

| Mod | Ne üretir? | Ne zaman? |
|---|---|---|
| **Single-shot prompt** | Tek seferlik, kopyala-yapıştır prompt metni | Görev tek geçişte bitiyorsa |
| **Loop prompt (loop mühendisliği)** | Kendi kendini yöneten, denetleyen, düzelten otonom döngü tasarımı | Görev doğrulanabilir bir hedefe sahipse ve tek geçişte güvenilir bitmiyorsa |

---

## Loop Mühendisliği (Loop Engineering) Nedir?

**Tanım**: Loop mühendisliği; yapay zekâya tek seferlik talimatlar (prompt) vermek yerine, sistemi **kendisinin** ajanı zamanla/olayla tetikleyip görev keşfeden, doğrulayan, tekrar deneyen ve durduran şekilde tasarlama disiplinidir. Kısacası: ajanı sen turdan tura yönlendirmek yerine, bunu **senin yerine yapacak sistemi** tasarlarsın.

> Prompt mühendisliği **talimatı** optimize eder. Context mühendisliği modelin **görebileceklerini** optimize eder. Harness mühendisliği modeli **çalıştırılabilir bir ortama** bağlar. Loop mühendisliği ise sistemin **tekrar tekrar gözlemleme → eyleme geçme → doğrulama → düzeltme** döngüsünü nasıl yürüteceğini tasarlar.

### Alanın evrimi (2023 → 2026)

```
1. Prompt Engineering   → Modele NE söylenir? (talimat kalitesi)
2. Context Engineering  → Modele hangi bilgi/tool/data gösterilir?
3. Harness Engineering  → Model hangi çalıştırılabilir ortama bağlanır? (tool loop, sandbox)
4. Loop Engineering     → Sistem NASIL tekrar tekrar gözlemler, eyler, doğrular, düzeltir, durur?
```

Terim, 2026 ortasında Claude Code ekibinden Boris Cherny'nin kendi iş akışını "Claude'u manuel yönlendirmek yerine, ne yapılacağını bulup onu prompt'layan döngüler" olarak tanımlamasıyla yaygınlaştı. Odak, **prompt yazmaktan döngü tasarlamaya** kaydı.

### Prompt vs. Loop

```
PROMPT (tek seferlik)
Talimat → Çıktı → [insan denetler] → [insan düzeltir]

LOOP (otonom)
Hedef → Plan → Eylem → Doğrulama (dış sinyal) → Hata mı? → Düzelt → tekrar Eylem
                            ↓ Hayır
                     Çıkış koşulu (exit) → Sonuç
```

### Beş katmanlı model

Sağlam bir otonom loop şu beş katmandan oluşur:

| Katman | Ne yapar? |
|---|---|
| **Harness** | Ajanın çalıştığı ortam: tool erişimi, sandbox, dosya sistemi |
| **Loop contract** | "Bitti" ne demek — hedef + doğrulayıcı + çıkış koşulu tanımı |
| **State layer** | Restart'a dayanıklı durum: denenen çözümler, dosyalar, tur sayısı |
| **Checker** | Otomatik doğrulama — ayrı bir prompt/model çağrısıyla, yapıcı ajandan bağımsız |
| **Human checkpoint** | Geri alınamaz eylemlerden önce insanın gözden geçirdiği nokta |

### Bir loop'un zorunlu 6 bileşeni

Loop tasarlarken bu altısı **eksiksiz** tanımlanmalıdır. Eksik olan her bileşen ya sonsuz döngü ya da sessiz hata üretir.

1. **Hedef (Goal)** — Tek cümlelik, ölçülebilir amaç. "İyi kod yaz" değil, "tüm testler yeşil olana kadar auth modülünü düzelt".
2. **Doğrulama sinyali (Verifier)** — Loop'un başarıyı kendi kendine ölçtüğü **nesnel** kaynak: test çıktısı, lint, type-check, build log, DB assertion, HTTP status, schema validation. Doğrulayıcısı olmayan görev loop'a uygun değildir — LLM'in "bence oldu" demesi doğrulama değildir.
3. **Çıkış koşulu (Exit criteria)** — Loop ne zaman **başarıyla** durur? Ne zaman **başarısız** kabul edip durur?
4. **Iterasyon limiti + escalation** — Maksimum tur sayısı (ör. 5) ve limit dolduğunda ne yapılacağı (insana devret, son durumu raporla, rollback).
5. **Durum/hafıza (State)** — Turlar arasında taşınan bağlam: denenen çözümler, alınan hatalar, değişen dosyalar. Aynı hatayı iki kez denemeyi engelleyen şey budur.
6. **Eylem alanı (Tools/Scope)** — Loop'un neye dokunabileceği ve **kesinlikle dokunamayacağı** sınır (prod DB'ye yazma yok, migration çalıştırma yok, dosya silme yok).

---

## Doğrulanabilir Çıkış Koşulu (Verifiable Stop Condition) Tasarımı

Bir çıkış koşulu **doğrulanabilir** sayılır ancak üç özelliği taşıyorsa:

- **Binary** — evet/hayır, yorum gerektirmez
- **Deterministik** — ajan kendi muhakemesiyle değil, ölçülebilir durumla kontrol eder
- **Ölçülebilir bir duruma referans verir** — dosya, sayı, komut çıktısı

### Doğrulanabilir koşul türleri

| Tür | Örnek |
|---|---|
| **Count-based** | Sabit iterasyon limiti (max 5 tur) |
| **State-change** | Dosya oluştu mu, API "complete" döndü mü |
| **List completion** | Listedeki tüm item'lar işlendi mi |
| **Threshold** | %80 test coverage, hata oranı <%1 |
| **Schema validation** | Çıktı beklenen JSON şemasına uyuyor mu |

### Sık yapılan hatalar

❌ **Öznel dil** — "kaliteli", "kapsamlı", "tamamlanmış hissi" gibi ifadeler tutarsız döngü üretir; ajan kendi kendini güvenilir değerlendiremez.
❌ **Self-evaluation bias** — ajanlar kendi çıktısını olduğundan iyi görme eğilimindedir; dış doğrulama şart.
❌ **Iterasyon limiti eksikliği** — yanlış kurgulanmış koşullar sonsuz döngüye yol açar.
❌ **İmkansız koşul** — ajanın asla sağlayamayacağı bir gereksinim, her seferinde limiti doldurur.
❌ **Sorumlulukların karışması** — görevi yürüten ile "bitti mi" diyen aynı ajan/çağrı olursa çıkar çatışması oluşur.

### Önerilen yapı: Worker / Checker / Router ayrımı

Kendi çıktısını değerlendiren ajan güvenilmezdir ("self-serving evaluation bias" — literatürde belgelenmiş bir önyargı). Bu yüzden mimariyi ayır:

- **Worker** — görevi yürütür
- **Checker** — çıkış koşulunu **ayrı bir prompt/model çağrısıyla**, yapılandırılmış (JSON) çıktıyla değerlendirir
- **Router** — checker'ın sonucuna göre devam et / dur / escalate kararını verir

---

## 10 Loop Pattern'i (Loop Design Patterns)

Görev tipine göre hangi loop pattern'inin kullanılacağını seç:

### Temel pattern'ler

| # | Pattern | Ne için | Verifier |
|---|---|---|---|
| 1 | **ReAct Loop** | Genel amaçlı ajan mimarisi: Algıla → Muhakeme et → Planla → Eyle → Gözlemle | Görev tamamlama / durma koşulu |
| 2 | **Reflection Loop** | Halüsinasyonu azaltmak, tutarsızlıkları yakalamak | Ajanın kendi öz-eleştirisi (zayıf verifier — dikkatli kullan) |
| 3 | **Tool Use Loop** | Eğitim verisi dışı bilgiye erişim (API, DB, canlı sistem) | Dış sistemin döndürdüğü sonuç |
| 4 | **Prompt Chaining** | Karmaşık görevi sabit, izlenebilir alt adımlara bölmek | Tüm önceden tanımlı adımların tamamlanması |

### Pratikte kanıtlanmış pattern'ler

| # | Pattern | Ne için | Verifier |
|---|---|---|---|
| 5 | **Ralph Loop** | Kendi kendini doğrulama önyargısını önlemek; her iterasyonda context'i sıfırlar | Derleyici, linter, test suite gibi **dış** validator'lar |
| 6 | **Evaluator-Optimizer Loop** | Üretici ile eleştirmeni ayırmak | Ayrı bir "evaluator" ajanın yapılandırılmış onayı |
| 7 | **Multi-Agent Supervisor Loop** | Tek context penceresini aşan karmaşık işi uzmanlaşmış worker'lara dağıtmak | Supervisor'ın iş akışını yönetmesi |

### Prodüksiyon sağlamlaştırma pattern'leri

| # | Pattern | Ne için | Verifier |
|---|---|---|---|
| 8 | **Circuit Breaker** | Takılan ajanın sonsuz token yakmasını önlemek | N tur boyunca ilerleme yoksa devre kesilir, insana bildirilir |
| 9 | **Heartbeat Loop** | Sürekli çalışma yerine zamanlanmış/olay tetiklemeli, maliyeti düşük çalışma | Zamanlanmış tetik + "in progress" kilidi |
| 10 | **Bounded Execution & Context Engineering** | Kaynak tüketimini sınırlamak, context penceresi bozulmasını yönetmek | Maksimum iterasyon / token / wall-time tavanı |

**Seçim kuralı**: Basit debug/test-yeşile-döndürme görevlerinde **Ralph Loop** veya **Evaluator-Optimizer** varsayılan; kod tabanı geneline yayılan büyük işlerde **Multi-Agent Supervisor**; uzun süre çalışan/otomatik tetiklenen sistemlerde **Heartbeat + Circuit Breaker** kombinasyonu.

### Loop Anti-Patterns

❌ **Doğrulayıcısız loop** — "Beğenene kadar iyileştir." Model kendi çıktısını beğenir, döngü anlamsız döner.
❌ **Limitsiz loop** — Çıkış koşulu yoksa token yakar, sonsuza gider.
❌ **State'siz loop** — Her tur sıfırdan başlar, aynı hatalı çözümü tekrar dener.
❌ **Yıkıcı eylem alanı** — Loop'a geri alınamayan yetki (prod delete, force push) vermek.
❌ **Reflection'ı tek verifier olarak kullanmak** — ajanın öz-değerlendirmesi dış sinyalin yerini tutamaz.
❌ **Her şeyi loop'a sokmak** — Blog yazısı, tek seferlik SQL, basit refactor loop istemez. Loop maliyeti (token + risk) ancak doğrulanabilir + tekrarlı görevlerde geri döner.

### Loop ne zaman DOĞRU araçtır?

✅ Nesnel bir doğrulayıcı var (test, lint, build, schema, API response)
✅ Görev tek geçişte %100 doğru bitmiyor, iterasyon gerekiyor
✅ Hata sinyali makine tarafından okunabilir
✅ Yanlış adımın maliyeti geri alınabilir (branch, staging, dry-run)

Bu dördü sağlanmıyorsa **single-shot prompt** üret, loop üretme.

---

## Loop Prompt Şablonu

```
ROL: Sen [X] görevini hedefe ulaşana kadar otonom yürüten bir agent'sın.

PATTERN: [Ralph Loop / Evaluator-Optimizer / Multi-Agent Supervisor / ...]

HEDEF:
[Tek cümle, ölçülebilir]

BAŞARI TANIMI (Verifier — Worker'dan bağımsız Checker):
[Nesnel komut/sinyal, ör: `npm test` çıktısında 0 failing. Binary, deterministik,
ölçülebilir bir duruma referans verir. Ajanın kendi görüşü verifier değildir.]

DÖNGÜ:
1. PLAN    → Mevcut duruma bak, bir sonraki tek adımı seç ve gerekçelendir.
2. EYLEM   → Sadece o adımı uygula.
3. DOĞRULA → [verifier komutunu] çalıştır. Çıktıyı olduğu gibi oku, yorum katma.
4. KARAR   →
   - Başarı koşulu sağlandıysa → DUR ve final raporu ver.
   - Sağlanmadıysa → Hatanın kök nedenini yaz, denenmiş çözümler listesine ekle, 1'e dön.

STATE (her turda güncelle ve taşı):
- Tur no:
- Son hata:
- Denenmiş ve işe yaramamış çözümler: [tekrar deneme]
- Değiştirilen dosyalar:

KISITLAR:
- Maksimum [N] tur. Limitte durur, insana devredersin.
- [Dokunulmaz alanlar: prod, secrets, migration, silme işlemleri]
- Aynı çözümü iki kez deneme.
- Doğrulama çıktısını uydurma; komutu gerçekten çalıştır.

ESCALATION (Circuit Breaker):
Limit dolarsa veya aynı hata 2 turdur değişmiyorsa: dur, "TAKILDIM" yaz,
son hatayı + denenenleri + önerini raporla.

FINAL ÇIKTI FORMATI:
[Beklenen rapor formatı]
```

---

## Kullanım Durumları (Use Cases)

| Tür | Kapsam | Mod |
|---|---|---|
| **Teknik** | Kod yazma, review/debug, test, SQL, DevOps | Single-shot |
| **İş** | Sales, HR, finans, pazarlama, contract review | Single-shot |
| **Creative** | İçerik, tasarım briefi, UX copy | Single-shot |
| **Loop** | Doğrulayıcısı olan tekrarlı görevler: test/lint/build yeşile dönene kadar debug, schema geçene kadar veri temizleme, retry + self-correction akışları | Loop |

Kural: doğrulayıcı (test/lint/build/schema/HTTP) yoksa → single-shot. Varsa ve tek geçişte bitmiyorsa → loop.

## Anti-Patterns (Kaçınılması Gerekenler)

❌ **Kötü**: "Bana bir prompt yaz"
- Amaç belirsiz
- Context yok
- Beklentiler tanımlanmamış

✅ **İyi**: "Supabase ile auth kuran React component'ı yazıp test etmesini söylemek için bir prompt yaz. TypeScript kullan, error handling ekle"

---

## Prompt Oluşturma Süreci

### 0. Mod Seçimi (ilk karar)

Önce sor/karar ver: **single-shot mu, loop mu?**
- Nesnel doğrulayıcı var mı? → yoksa single-shot.
- Tek geçişte biter mi? → biterse single-shot.
- İkisi de "hayır" ise → loop tasarla, uygun pattern'i seç (yukarıdaki 10 pattern'den), Loop Prompt Şablonu'nu kullan.

### 1. Gereksinim Toplama

Eğer kullanıcı eksik bilgi sağlamışsa, sor:

- **Görev**: Tam olarak ne yapılsın?
- **Context**: Hangi teknolojiler/frameworks/tools?
- **Başarı Kriterleri**: Ne "başarı" demek bu görev için? (loop ise: hangi komut/sinyal bunu ölçüyor, doğrulanabilir mi?)
- **Constraints**: Varsa sınırlamalar (dosya boyutu, hız, uyum, vb)?
- **Tone/Style**: Resmi mi, casual mi, teknik mi?
- **(Loop ise)** Hangi pattern uygun, iterasyon limiti, dokunulmaz alanlar, escalation hedefi?

### 2. Prompt Tasarımı

İyi bir prompt:

- **Net ve öz** - amacı net belirtir, uzun değildir
- **Context sağlar** - arkaplan bilgisini verir
- **Rol/Perspektif** - "sen X rolündesin" veya "şöyle davran"
- **Format bekler** - output formatını açıkça söyler
- **Örnek sağlar** - mümkünse input/output örneği
- **Constraints listeler** - neleri yapmasın?

İyi bir loop, bunlara ek olarak: **pattern seçimi + verifier + exit + limit + state + scope** içerir ve worker/checker ayrımını netleştirir.

### 3. Optimizasyon

Prompt'u test et:
- Bir iki kez çalıştır, sonuçları gözlemle
- Amaca ulaşıyor mu? Değilse neden?
- Çok uzun mu? Kısalt
- Belirsiz mi? Spesifikleş

Loop'u test et:
- İlk turda doğru duruyor mu (false positive exit yok mu)?
- Kasıtlı bir hata enjekte et — loop yakalıyor mu?
- Limit gerçekten devreye giriyor mu?
- State turlar arasında taşınıyor mu, aynı çözümü tekrar deniyor mu?
- Verifier ajanın kendi görüşünden mi geliyor, yoksa gerçekten dış/ayrı bir kontrol mü?

---

## Template Örnekleri

### Teknik Prompt Şablonu

```
Görev: [Tam açıklama]

Teknoloji: [Stack: React + Supabase + TypeScript, vb]

Requirements:
- [Gereksinim 1]
- [Gereksinim 2]
- [Gereksinim 3]

Output Format: [JSON/Markdown/Code snippet vb]

Constraints:
- [Kısıt 1]
- [Kısıt 2]

Example:
Input: [örnek]
Output: [beklenen çıkış]
```

### İş Prompt Şablonu

```
Kontext: [Durum açıklaması]

Hedef: [Ne başarılmak isteniyor?]

Audience: [Kime hitap ediyor?]

Tone: [Resmi/Friendly/Persuasive]

Key Points: [Ana noktalar]

Success Criteria: [Başarı ölçütü]
```

### Creative Prompt Şablonu

```
Konsept: [Temel fikir]

Target Audience: [Kimler?]

Style/Tone: [Yazı stili]

Length: [Kaç kelime/dakika?]

Constraints: [Neleri içermemeli?]

Example of desired output: [Benzeri örnek]
```

### Loop Şablonu

→ Yukarıdaki **Loop Prompt Şablonu** bölümünü kullan.

---

## Tips & Best Practices

✅ **Spesifik ol** - "prompt yaz" değil, "Supabase RLS kuran prompt yaz"
✅ **Örnek ver** - İyi bir örnek bazen 1000 kelimeden daha değerlidir
✅ **Constraints söyle** - "kısaca", "detaylı", "3 seçenek", vb
✅ **Role ver** - "sen bir senior engineer gibi..."
✅ **Format tanımla** - JSON, Markdown, pseudo-code, vb
✅ **Loop'ta doğrulayıcıyı dışarıdan al** - modelin öz-değerlendirmesi doğrulayıcı değildir
✅ **Loop'ta worker/checker'ı ayır** - aynı ajan hem yapıp hem onaylarsa self-serving bias oluşur
✅ **Loop'ta her zaman limit + escalation yaz** - takılan loop, hatalı loop'tan pahalıdır
✅ **Doğru pattern'i seç** - basit debug'a Multi-Agent Supervisor kurmak; büyük migration'a tek Reflection loop'u yeterli değildir

❌ Vakit kaybetme - eğer prompt hala işe yaramıyorsa, direkt geri bildir ve itera yap

---

## Çıktı

Output **her zaman** çalışmaya hazır, direkt kopyala-yapıştır prompt metnidir.

Hiçbir açıklama ekleme, sadece prompt ver.

Eğer prompt çok kompleks ise, sections ile böl (ör: system prompt + user prompt).

Loop üretiliyorsa çıktı: tek blok halinde loop prompt'u (rol + pattern + hedef + verifier + döngü + state + kısıtlar + escalation + final format).

---

## Gerçek Örnekler (Real Examples)

### Örnek 1: Supabase RLS Prompt
**İstek**: "Supabase RLS kuran React hook prompt yaz"

**Çıktı**:
```
Supabase Row Level Security (RLS) politikaları ile güvenli veri erişimi sağlayan bir React hook yaz.

Gereksinimler:
- TypeScript
- Supabase JS client
- RLS policies set up (users tablosu, tenant_id ile)
- Error handling + loading states

Kod şu adımları takip etsin:
1. useEffect'te Supabase client'ı init et
2. İlgili politikaları kontrol et (WHERE auth.uid() = user_id)
3. Unauthorized hatası varsa user-friendly mesaj göster
4. Loading/error states yönet

Output format: Hazır kopyala-yapıştır React hook kodu
```

### Örnek 2: Sequential Approval Chain Prompt
**İstek**: "Sıralı onay akışını (approval workflow) handle eden prompt"

**Çıktı**:
```
Sequential approval chain'i implement eden prompt.

Gereksinimler:
- Supabase DB structure (approvals table, status enum)
- React form components
- TypeScript strict mode
- Notification system (in-app only, no email)

Flow:
1. Document upload → initial approval step (step_1)
2. Step başarısızsa → rejection, user rejected step'ten yeniden başlayabilir
3. Adımlar sırayla gitmeli (step_1 → step_2 → step_3)
4. Her adımda file/photo attachment mandatory

Output: Sequential state machine logic (TypeScript)
```

### Örnek 3: Türkçe Onboarding Email Prompt
**İstek**: "Türkçe SaaS signup sonrası welcome email prompt yaz, friendly tone"

**Çıktı**:
```
Yeni kullanıcılara hoş geldiniz diyen, Türkçe welcome email yaz.

Context:
- B2B SaaS müşterisi (KOBİ yöneticisi)
- İlk kez SaaS kullanıyor olabilir
- 24 saat içinde ilk core aksiyonu tamamlaması hedefleniyor

Tone: Samimi, yardımcı, teknik olmayan dil

Email şunları içermeli:
- Hoş geldin
- İlk adımlar (3 madde)
- Support contact (email)
- Call-to-action (ilk aksiyonu başlat)

Length: 150-200 kelime
Output: HTML email template
```

### Örnek 4 (LOOP — Ralph Loop pattern): Test-yeşile-dönene-kadar debug loop
**İstek**: "Modül testleri kırmızı, kendi kendini düzelten bir loop kur"

**Çıktı**:
```
ROL: Sen bu repoda testleri yeşile döndürene kadar otonom çalışan bir debug agent'sın.

PATTERN: Ralph Loop (dış validator = test suite; öz-değerlendirme yok)

HEDEF:
`src/approvals/**` altındaki tüm testler geçene kadar üretim kodunu düzelt.

BAŞARI TANIMI (Verifier):
`npm test -- src/approvals` çıktısında 0 failing, 0 error.
Bu komutun gerçek çıktısı tek doğruluk kaynağıdır. Çıktı uydurma.

DÖNGÜ:
1. PLAN    → Son hata mesajını oku, kök nedeni tek cümlede yaz, tek bir düzeltme seç.
2. EYLEM   → Sadece o düzeltmeyi uygula.
3. DOĞRULA → `npm test -- src/approvals` çalıştır, çıktıyı olduğu gibi al.
4. KARAR   → 0 failing ise DUR. Değilse STATE'i güncelle ve 1'e dön.

STATE (her turda yazdır):
- Tur no:
- Failing test sayısı (önceki → şimdiki):
- Son hata:
- Denenmiş ve işe yaramamış düzeltmeler:
- Değiştirilen dosyalar:

KISITLAR:
- Maksimum 5 tur.
- Testleri değiştirme, silme veya skip etme. Sadece üretim kodunu düzelt.
- Supabase migration çalıştırma, .env dosyalarına dokunma.
- Aynı düzeltmeyi iki kez deneme.

ESCALATION (Circuit Breaker):
5. tur dolarsa veya failing sayısı 2 tur üst üste azalmazsa: DUR, "TAKILDIM" yaz,
son hatayı + denenen düzeltmeleri + kendi hipotezini raporla.

FINAL ÇIKTI:
- Sonuç: BAŞARILI / TAKILDIM
- Tur sayısı
- Değiştirilen dosyalar + diff özeti
- Kök neden (1 paragraf)
```

### Örnek 5 (LOOP — Evaluator-Optimizer pattern): İçerik kalite döngüsü
**İstek**: "Blog yazısını, ayrı bir editör ajan onaylayana kadar düzelten bir loop kur"

**Çıktı**:
```
ROL: Sen (Writer) blog yazısını hedef kritere ulaşana kadar revize eden ajansın.

PATTERN: Evaluator-Optimizer (Writer ≠ Evaluator, ayrı çağrı/prompt)

HEDEF:
Blog yazısı, ayrı bir Evaluator ajanın "APPROVED" JSON çıktısını verene kadar revize edilir.

BAŞARI TANIMI (Verifier — Evaluator, Writer'dan bağımsız prompt):
Evaluator, şu şemaya uyan JSON döndürür:
{"verdict": "APPROVED" | "REJECTED", "reasons": [...]}
Sadece "verdict": "APPROVED" çıkış koşulunu sağlar. Writer'ın kendi
değerlendirmesi geçerli değildir.

DÖNGÜ:
1. EYLEM     → Writer taslağı yazar/revize eder.
2. DOĞRULA   → Taslak Evaluator'a gönderilir; Evaluator YALNIZCA yukarıdaki
                JSON şemasıyla yanıt verir.
3. KARAR     → "APPROVED" ise DUR. "REJECTED" ise reasons'ı STATE'e ekle, 1'e dön.

STATE (her turda güncelle):
- Tur no:
- Önceki reddedilme gerekçeleri (tekrar aynı hatayı yapma):
- Taslağın son hâli:

KISITLAR:
- Maksimum 4 tur.
- Evaluator'ın kriterlerini Writer değiştiremez.
- Aynı gerekçeyle iki kez reddedilme → farklı bir yaklaşım dene.

ESCALATION:
4. tur dolduğunda hâlâ REJECTED ise: DUR, son taslağı + tüm red gerekçelerini
insana sun, "İNSAN İNCELEMESİ GEREKLİ" yaz.

FINAL ÇIKTI:
- Sonuç: APPROVED / İNSAN İNCELEMESİ GEREKLİ
- Tur sayısı
- Son taslak
- Red gerekçeleri geçmişi
```

---

## Troubleshooting

### Problem: Prompt çıktısı hâlâ belirsiz
**Çözüm**:
- Constraints'i daha spesifik yaz
- Bir örnek (good example) ekle
- "Şöyle davran" yerine "şöyle yap" diye komut ver

### Problem: Çıktı çok uzun
**Çözüm**:
- "kısaca" veya "bullet points" diye söyle
- "max 200 kelime" gibi limit koy
- İstediğin format'ı açıkça belirt

### Problem: Output formatı yanlış
**Çözüm**:
- "Çıktı XYZ formatında olmalı" diye başla
- Örnek göster (Input → Expected Output)
- JSON istersan `{"key": "value"}` şeklinde örnek ver

### Problem: Loop sonsuza dönüyor / durmuyor
**Çözüm**: Çıkış koşulu doğrulanabilir değil (binary/deterministik/ölçülebilir değil). Verifier'ı bir komuta bağla ve iterasyon limiti + escalation (Circuit Breaker) ekle.

### Problem: Loop "başardım" diyor ama başarmamış
**Çözüm**: Model kendi çıktısını doğruluyor (self-serving evaluation bias). Worker/Checker'ı ayır: doğrulamayı dışarıdaki bir sinyale (test/lint/build/HTTP) veya bağımsız bir Evaluator çağrısına taşı, "çıktıyı uydurma, komutu gerçekten çalıştır" kısıtını ekle.

### Problem: Loop aynı hatayı tekrar tekrar deniyor
**Çözüm**: State eksik. "Denenmiş ve işe yaramamış çözümler" listesini her turda taşıt ve tekrarı yasakla.

### Problem: Yanlış pattern seçildi (ör. basit debug'a Multi-Agent Supervisor)
**Çözüm**: Görev tek bir doğrulayıcıyla ölçülüyorsa Ralph Loop veya Evaluator-Optimizer yeterlidir; pattern'i göreve göre küçült.

---

## Workflow Özeti

```
Kullanıcı İsteği
    ↓
Mod Seçimi (Single-shot mu? Loop mu?)
    ↓                          ↓
Gereksinim Toplama        Loop Tasarımı
(Context, Constraints,    (Pattern seçimi, Hedef, Verifier,
 Success Criteria)         Exit, Limit, State, Scope)
    ↓                          ↓
Prompt Tasarımı           Loop Prompt Şablonu
    ↓                          ↓
Output (Çalışmaya hazır prompt / loop metni)
    ↓
[Opsiyonel] Test & Iterate
```

---

## Compatibility & Dependencies

**Gereksinimler:**
- Claude API (claude-opus, claude-sonnet, vb)
- Veya claude.ai web interface
- Türkçe dil desteği (UTF-8)
- Loop modu için: agent runtime'ı olan bir ortam (Claude Code, n8n, kendi orchestrator'ın)

**Dikkat:**
- Bu skill loop'u **tasarlar ve prompt'unu üretir**; loop'u çalıştıran runtime'ı kurmaz
- n8n orchestration bu skill'de yer almıyor (loop prompt'u n8n'e beslenebilir)
- Web search veya API integration prompt'lar hakkında bilgi verir ama implement etmez

## Kaynaklar (References)

Bu skill'in loop mühendisliği bölümü aşağıdaki kaynaklardan derlenen bilgiyle güncellenmiştir (2026):

- [Loop Engineering: The Guide for AI Agents — Lushbinary](https://lushbinary.com/blog/loop-engineering-ai-coding-agents-guide/)
- [Loop Engineering: Designing Autonomous AI Agent Loops — Claude Skills Hub](https://claudeskills.info/loop-engineering/)
- [What Is Loop Engineering? — MindStudio](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents)
- [From Prompts to Loops: Building Autonomous Coding Agents — ITNEXT](https://itnext.io/from-prompts-to-loops-building-autonomous-coding-agents-6135bf880415)
- [10 Loop Engineering Design Patterns for AI Builders — Data Science Dojo](https://datasciencedojo.com/blog/loop-engineering-design-patterns/)
- [Agentic Loop Design: Goals and Verification Criteria — MindStudio](https://www.mindstudio.ai/blog/agentic-loop-design-goals-verification-criteria)
- [How to Design Agent Loops with Verifiable Stop Conditions — MindStudio](https://www.mindstudio.ai/blog/agent-loops-verifiable-stop-conditions)
- [Loop Engineering — Cobus Greyling (Medium)](https://cobusgreyling.medium.com/loop-engineering-62926dd6991c)
