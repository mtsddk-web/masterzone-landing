# Work Log - MasterZone Landing Page

## 2025-11-05 (Środa)

### ✅ Wykonane zadania:

1. **Formularz kontaktowy z integracją MailerLite**
   - Utworzono komponent `ContactForm.tsx` z polami: Imię + Email + Checkbox RODO
   - Pełna walidacja formularza (wymagane pola, format email, zgoda RODO)
   - Skrócono tekst RODO do przyjaznej formy: "Wyrażam zgodę na przetwarzanie danych w celu dostępu do MasterZone i otrzymywania materiałów edukacyjnych zgodnie z polityką prywatności"
   - Zweryfikowano politykę prywatności Radka - zawiera wszystkie wymagane elementy RODO

2. **Integracja MailerLite API**
   - Utworzono endpoint `/api/subscribe/route.ts`
   - Automatyczne przypisywanie do grupy: "Z reklam FB przez Landing Page Rozproszenie" (ID: 170230618054985586)
   - Zapisywane dane: email, name, source, utm_source, utm_medium, utm_campaign, signup_date
   - Obsługa duplikatów (zwraca 200 OK nawet jeśli email już istnieje)
   - Dodano `MAILERLITE_API_KEY` do Vercel environment variables (production, preview, development)

3. **Unified CTA Flow - zmiana wszystkich przycisków na smooth scroll**
   - **Zmieniono 10 komponentów** - wszystkie CTA teraz prowadzą do formularza zamiast bezpośrednio do Skool:
     1. `Hero.tsx` - główny przycisk CTA
     2. `JoinSection.tsx` - przycisk w sekcji Join
     3. `CTA.tsx` - przycisk na dole strony
     4. `ExitIntentPopup.tsx` - popup przy wychodzeniu ze strony
     5. `Benefits.tsx` - sekcja z benefitami
     6. `Tools.tsx` - sekcja z narzędziami
     7. `HowItWorks.tsx` - sekcja "Jak to działa"
     8. `Testimonials.tsx` - sekcja z opiniami
     9. `Pricing.tsx` - karta cenowa
     10. `Transformation.tsx` - sekcja transformacji

4. **Helper functions i utilities**
   - Utworzono `lib/scrollToForm.ts` - funkcja smooth scroll do formularza
   - Usunięto nieużywane importy `appendUTM` z komponentów (teraz używają `scrollToContactForm`)
   - Dodano formularz do `app/page.tsx` między JoinSection a końcowym CTA

5. **Deployment i testy**
   - 3 deployments na Vercel production
   - Testy końcowe: formularz działa, subscribers trafiają do właściwej grupy MailerLite
   - Veryfikacja całego flow: klik CTA → scroll → formularz → MailerLite → Skool

### 🎯 Nowy flow użytkownika:

```
Landing page (dowolna sekcja)
    ↓
Klik "Dołącz" / "Chcę pracować w pełnym skupieniu" (dowolny CTA)
    ↓
Smooth scroll do formularza kontaktowego
    ↓
Wypełnia: Imię + Email + ✅ Zgoda RODO
    ↓
Submit → API /api/subscribe
    ↓
MailerLite zapisuje do grupy "Z reklam FB przez Landing Page Rozproszenie"
    ↓
Sukces → Redirect do Skool (po 1.5s)
```

### 📊 Tracking:

**MailerLite:**
- Email, Name, Source (np. `landing_page_form`, `hero_primary_button`, `pricing_cta`)
- UTM parameters (source, medium, campaign) - jeśli są w URL
- Signup date (ISO 8601)
- Grupa: "Z reklam FB przez Landing Page Rozproszenie"

**Facebook Pixel:**
- Event: "Lead"
- Source: dokładny przycisk CTA który został kliknięty
- Event: "InitiateCheckout" (dla pricing CTA)

### 📄 Dokumentacja:

- Utworzono `INSTRUKCJA-FORMULARZ.md` - pełna instrukcja wdrożenia i konfiguracji
- Dokumentacja zawiera: setup, testowanie, deployment, troubleshooting, customizacja

### 🔧 Commits:

1. `ed071db` - ✨ Add contact form with MailerLite integration + RODO
2. `e251e7e` - 🎯 Add MailerLite group assignment to form submissions
3. `4356dc4` - 🔗 Change all CTA buttons to scroll to contact form
4. `d383176` - 🔗 Fix remaining CTA buttons + cleanup unused imports

### 🛠️ Stack dodany:

- MailerLite API v2 (https://connect.mailerlite.com/api)
- Next.js API Routes (App Router)
- React Hook Form patterns (manual)

---

## 2025-01-22 (Środa)

### ✅ Wykonane zadania:

1. **Przegląd strony MasterZone**
   - Sprawdzono status strony na https://rozproszenie.masterzone.edu.pl
   - Potwierdzono że wszystkie sekcje działają poprawnie
   - Zweryfikowano strukturę treści w folderze `content/`

2. **Analiza i dokumentacja UTM tracking**
   - Znaleziono funkcję `appendUTM` która przekazuje parametry UTM do Skool
   - Potwierdzono że parametry są automatycznie przekazywane z landing page'a do Skool
   - Znajdowany plik testowy `test-utm.html` do lokalnego testowania

3. **Instrukcje Facebook Ads Manager**
   - Wyjaśniono jak ustawić parametry UTM w Facebook Ads Manager
   - Pokazano gdzie znajduje się opcja "Zbuduj parametr URL"
   - Przedstawiono dynamiczne parametry Facebook: `{{site_source_name}}`, `{{campaign.name}}`, `{{ad.name}}`
   - Wyjaśniono różnicę między wpisaniem pełnego URL a użyciem osobnych pól parametrów

4. **Dokumentacja flow UTM**
   - Wyjaśniono cały proces: Facebook Ads → Landing Page → Skool
   - Potwierdzono że parametry są zachowywane w całym flow
   - Użytkownik może śledzić konwersje w Skool Analytics

### 📝 Kluczowe ustalenia:

- **Główny URL:** https://rozproszenie.masterzone.edu.pl
- **Repo GitHub:** https://github.com/mtsddk-web/masterzone-landing
- **Funkcja UTM:** `appendUTM()` w komponentach przekazuje parametry do Skool
- **Facebook parametry:** Automatycznie dodaje `fbclid` + własne parametry UTM

### 🔄 Proces UTM tracking:

```
Facebook Ads (z parametrami UTM)
    ↓
Landing Page (https://rozproszenie.masterzone.edu.pl/?utm_source=facebook...)
    ↓
Funkcja appendUTM() przechwytuje parametry
    ↓
Przekierowanie do Skool (https://www.skool.com/masterzone?utm_source=facebook...)
    ↓
Skool Analytics zapisuje źródło konwersji
```

### 💡 Sugestie na przyszłość:

- Rozważyć zmianę subdomeny z `rozproszenie` na coś krótsego (np. `start`, `join`, `focus`)
- Możliwość stworzenia wielu wariantów landing page na różnych subdomenach dla różnych kampanii
- A/B testing różnych wersji treści

### 🛠️ Stack technologiczny:

- Next.js 15
- TypeScript
- Tailwind CSS
- Decap CMS
- Vercel (auto-deployment)
- GitHub (version control)

---

## Poprzednie sesje

### 2025-01-21
- Zmieniono testimoniale z flip animation na carousel z przyciskami
- Dodano funkcję appendUTM do przekazywania parametrów UTM na Skool
- Dodano 5 złotych gwiazdek do każdej opinii

### 2025-01-16
- Przeprojektowano testimoniale - dodano prawdziwe opinie z Skool
- Naprawiono animację testimoniali

### 2025-01-15
- Utworzono projekt masterzone-landing
- Zdeployowano na Vercel
- Skonfigurowano domenę rozproszenie.masterzone.edu.pl
- Dodano wszystkie sekcje landing page
