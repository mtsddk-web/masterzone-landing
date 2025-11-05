# 📝 INSTRUKCJA: Formularz Kontaktowy + MailerLite

## ✅ CO ZOSTAŁO ZROBIONE

### 1. Nowy komponent ContactForm
- **Lokalizacja:** `components/ContactForm.tsx`
- **Funkcje:**
  - ✅ Formularz z polami: Imię + Email + Checkbox RODO
  - ✅ Walidacja formularza (wymagane pola, format email, zgoda RODO)
  - ✅ Checkbox RODO z pełnym tekstem prawnym (Pustelnik Blisko Ludzi)
  - ✅ Link do Polityki prywatności: radekpustelnik.pl
  - ✅ Tracking UTM parameters z URL
  - ✅ Facebook Pixel tracking
  - ✅ Statusy: idle, loading, success, error
  - ✅ Po submit → zapisz do MailerLite → przekieruj do Skool

### 2. API Endpoint MailerLite
- **Lokalizacja:** `app/api/subscribe/route.ts`
- **Funkcje:**
  - ✅ Integracja z MailerLite API
  - ✅ Zapisuje: email, imię, source, UTM params, signup_date
  - ✅ Obsługuje duplikaty (jeśli email już jest na liście)
  - ✅ Error handling + logowanie

### 3. Zmienione przyciski CTA
- **Komponenty zmienione:**
  - ✅ `components/Hero.tsx` - główny przycisk na górze
  - ✅ `components/JoinSection.tsx` - przycisk w sekcji Join
  - ✅ `components/CTA.tsx` - przycisk na dole strony

- **Nowe zachowanie:**
  - Klik "Dołącz" → smooth scroll w dół do formularza
  - Nie prowadzi już bezpośrednio do Skool
  - User wypełnia formularz → dopiero wtedy redirect do Skool

### 4. Helper function scroll
- **Lokalizacja:** `lib/scrollToForm.ts`
- **Funkcja:** `scrollToContactForm()` - płynny scroll do formularza

### 5. Formularz dodany do strony
- **Lokalizacja:** `app/page.tsx` (linia 77-82)
- **Pozycja:** Po JoinSection, przed końcowym CTA

---

## 🔧 CO MUSISZ ZROBIĆ TERAZ

### Krok 1: Pobierz MailerLite API Key

1. Zaloguj się do MailerLite: https://dashboard.mailerlite.com/
2. Idź do: **Settings → Integrations → API**
3. Skopiuj **API Key** (zaczyna się od `eyJ...`)

### Krok 2: Dodaj API Key do .env.local

Otwórz plik `.env.local` w głównym folderze projektu:

```bash
# MailerLite API Configuration
MAILERLITE_API_KEY=eyJhbGciOiJSUzI1NiIsI... # WKLEJ TUTAJ SWÓJ API KEY
```

**WAŻNE:** Nie commituj .env.local do git! (jest już w .gitignore)

### Krok 3: Restart dev servera

```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie
npm run dev
```

Server musi być zrestartowany żeby wczytać nowe zmienne środowiskowe.

### Krok 4: Przetestuj flow

1. Otwórz stronę: http://localhost:3000
2. Kliknij "Dołącz" → powinieneś zobaczyć smooth scroll w dół do formularza
3. Wypełnij formularz: Imię + Email
4. **WAŻNE:** Zaznacz checkbox RODO (wymagane!)
5. Kliknij "Wyślij"
6. Sprawdź:
   - ✅ Jeśli checkbox nie zaznaczony → błąd walidacji
   - ✅ Po submit → "✅ Świetnie! Za chwilę przekierujemy Cię..."
   - ✅ Po 1.5s → redirect do https://www.skool.com/masterzone
   - ✅ W MailerLite (Subscribers) → nowy subscriber

---

## 📊 TRACKING

### Co jest trackowane automatycznie:

**1. Facebook Pixel:**
- Event: "Lead"
- Source: `hero_primary_button` / `join_section_cta_button` / `cta_bottom_button` / `landing_page_form`

**2. W MailerLite zapisywane są:**
- `email` - adres email
- `name` - imię
- `source` - skąd przyszedł lead (np. "landing_page_form")
- `utm_source` - źródło UTM (jeśli jest w URL)
- `utm_medium` - medium UTM (jeśli jest w URL)
- `utm_campaign` - kampania UTM (jeśli jest w URL)
- `signup_date` - data rejestracji (ISO 8601)

### Przykładowy URL z UTM:
```
https://rozproszenie.masterzone.edu.pl/?utm_source=facebook&utm_medium=ad&utm_campaign=masterzone_test
```

→ Zapisze się w MailerLite jako custom fields

---

## 🚀 DEPLOYMENT (Vercel)

### Dodaj MAILERLITE_API_KEY do Vercel:

1. Idź do: https://vercel.com/your-project/settings/environment-variables
2. Dodaj nową zmienną:
   - **Name:** `MAILERLITE_API_KEY`
   - **Value:** `eyJhbGciOiJSUzI1NiIsI...` (twój API key)
   - **Environment:** Production, Preview, Development (zaznacz wszystkie)
3. Kliknij **Save**
4. **Redeploy** projekt (Settings → Deployments → ... → Redeploy)

**WAŻNE:** Bez API key w Vercel, formularz nie będzie działał na produkcji!

---

## 🐛 TROUBLESHOOTING

### Problem: "Konfiguracja API nie jest dostępna"
**Rozwiązanie:**
- Sprawdź czy `.env.local` ma `MAILERLITE_API_KEY`
- Zrestartuj dev server (`npm run dev`)
- Sprawdź czy Vercel ma zmienną środowiskową

### Problem: Formularz nie scrolluje
**Rozwiązanie:**
- Sprawdź console (F12) → czy są błędy JS?
- Upewnij się że `id="contact-form"` jest w ContactForm component

### Problem: Email nie zapisuje się w MailerLite
**Rozwiązanie:**
- Sprawdź API key (czy jest poprawny)
- Sprawdź console → network tab → `/api/subscribe` → response
- Sprawdź logi server-side (Vercel → Functions → Logs)

### Problem: "Ten email jest już zapisany"
**To nie problem!** Jeśli email już jest na liście, API zwraca status 200 i user jest przekierowywany do Skool normalnie.

---

## 📝 CUSTOMIZACJA

### Zmień tekst w formularzu:

W `app/page.tsx` (linia 77-82):

```tsx
<ContactForm
  headline="Dołącz do MasterZone już teraz"  // ← ZMIEŃ
  subheadline="Podaj swoje dane, a za chwilę przekierujemy Cię do społeczności"  // ← ZMIEŃ
  ctaText="Dołącz teraz →"  // ← ZMIEŃ
  source="landing_page_form"  // ← tracking source (zostaw)
/>
```

### Zmień czas przekierowania (1.5s → coś innego):

W `components/ContactForm.tsx` (linia 59):

```tsx
setTimeout(() => {
  window.location.href = skoolUrl;
}, 1500);  // ← ZMIEŃ (ms)
```

### Zmień URL Skool:

W `components/ContactForm.tsx` (linia 55):

```tsx
const skoolUrl = params.toString()
  ? `https://www.skool.com/masterzone?${params.toString()}`  // ← ZMIEŃ
  : "https://www.skool.com/masterzone";  // ← ZMIEŃ
```

---

## ✅ CHECKLIST WDROŻENIA

- [ ] Pobrałem API key z MailerLite
- [ ] Dodałem API key do `.env.local`
- [ ] Zrestartowałem dev server
- [ ] Przetestowałem flow lokalnie (scroll → submit → redirect)
- [ ] Sprawdziłem czy subscriber pojawił się w MailerLite
- [ ] Dodałem API key do Vercel (Environment Variables)
- [ ] Zrobiłem redeploy na Vercel
- [ ] Przetestowałem flow na produkcji

---

**Status:** ✅ GOTOWE DO WDROŻENIA

Potrzebujesz tylko API key z MailerLite i będzie działać!
