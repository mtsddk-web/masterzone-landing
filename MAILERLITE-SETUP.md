# ✅ MailerLite Setup - Konfiguracja grup i automatyzacji

## 🎯 Co zostało naprawione:

1. **Lead event** - triggeruje się TYLKO po wypełnieniu emaila (nie przy kliknięciu CTA)
2. **Success message** - zamiast redirect do Skool, modal pokazuje komunikat "Sprawdź email"
3. **MailerLite grupy** - subskrybenci automatycznie trafiają do dedykowanej grupy
4. **Custom fields** - dodane tracking fields (source, signup_date, trial_status)

---

## 📧 KROK 1: Znajdź Group ID w MailerLite

### Jak znaleźć Group ID:

1. **Zaloguj się do MailerLite:** https://dashboard.mailerlite.com
2. **Przejdź do:** Subscribers → Groups
3. **Utwórz nową grupę:**
   - Nazwa: `MasterZone - Trial Signups`
   - Opis: `Osoby które wypełniły email gate na landing page`
4. **Kliknij na grupę** → Skopiuj ID z URL

Przykład URL:
```
https://dashboard.mailerlite.com/subscribers/groups/123456789
                                                  ^^^^^^^^^^^
                                                  TO JEST TWÓJ GROUP_ID
```

---

## 🔧 KROK 2: Dodaj Group ID do .env.local

W pliku `.env.local` (w głównym katalogu projektu) dodaj:

```bash
# MailerLite API Key (już masz)
MAILERLITE_API_KEY=twoj-api-key

# MailerLite Group ID (NOWE - dodaj to!)
MAILERLITE_TRIAL_GROUP_ID=123456789
```

**Bez tego** - subskrybenci będą dodawani do MailerLite ale BEZ grupy.
**Z tym** - subskrybenci automatycznie trafią do grupy "MasterZone - Trial Signups".

---

## 📨 KROK 3: Stwórz automatyzację emaila w MailerLite

### Workflow w MailerLite:

1. **Przejdź do:** Automations → Create new automation
2. **Trigger:** "Subscriber added to group" → Wybierz grupę "MasterZone - Trial Signups"
3. **Action:** Send email → Utwórz email z linkiem do Skool

### Template emaila:

```
Subject: 🎉 Witaj w MasterZone! Oto Twój link do społeczności

---

Cześć!

Dziękujemy za dołączenie do MasterZone! 🚀

Kliknij poniższy link aby założyć konto na Skool i rozpocząć 7-dniowy trial:

👉 [KLIKNIJ TUTAJ - DOŁĄCZ DO MASTERZONE](https://www.skool.com/masterzone)

Co dalej?
1️⃣ Załóż konto na Skool (zajmuje 30 sekund)
2️⃣ Dołącz do pierwszego bloku pracy jutro o 6:00 rano
3️⃣ Rób 2x więcej w 90-minutowych blokach skupienia

⏰ Pierwsze 7 dni: DARMOWE
💰 Potem: tylko $14/mies (możesz anulować w każdej chwili)

Masz pytania? Napisz do nas!

---

Do zobaczenia jutro o 6:00! ⏰
Zespół MasterZone
```

---

## 🧪 KROK 4: Przetestuj całość

### Test flow:

1. **Otwórz:** https://rozproszenie.masterzone.edu.pl
2. **Kliknij:** "Testuję 7 dni za darmo"
3. **Wpisz:** swój PRAWDZIWY email
4. **Kliknij:** "Wyślij mi dostęp"

### Co POWINNO się stać:

✅ Modal pokazuje: "Link wysłany! Sprawdź email"
✅ Facebook Pixel rejestruje: Lead event (source: email_gate_modal)
✅ MailerLite: Nowy subskrybent w grupie "MasterZone - Trial Signups"
✅ Email: Dostaniesz email z linkiem do Skool (w ciągu 1 minuty)

### Sprawdź w MailerLite Dashboard:

1. Subscribers → Groups → "MasterZone - Trial Signups"
2. Powinieneś zobaczyć nowego subskrybenta
3. Custom fields: source, signup_date, trial_status = "pending"

---

## 📊 Custom Fields które są trackowane:

```typescript
{
  email: "user@example.com",
  fields: {
    source: "Email Gate - Skool Trial",       // Skąd przyszedł user
    last_interest: "2025-11-27T14:00:00Z",    // Kiedy się zapisał
    signup_date: "2025-11-27T14:00:00Z",      // Data zapisu
    trial_status: "pending"                   // pending → active → paid
  },
  groups: ["123456789"],                      // Grupa Trial Signups
  status: "active"                            // Status subskrybenta
}
```

Możesz później używać `trial_status` do trackowania:
- **pending** = wypełnił email, NIE kliknął linku w emailu
- **active** = kliknął link, założył konto na Skool
- **paid** = po 7 dniach zapłacił $14/mies

---

## 🎯 Kolejne kroki (opcjonalnie):

### 1. Email Sequence (3 emaile w 7 dni):
```
Day 0: Welcome + link do Skool
Day 3: "Jak Ci idzie? Tu są najlepsze bloki pracy"
Day 6: "Jutro kończy się trial - zostań z nami!"
```

### 2. Segmentacja w MailerLite:
```
Segment 1: "Clicked link" (kliknęli link do Skool)
Segment 2: "Not clicked" (NIE kliknęli - wyślij reminder)
```

### 3. Retargeting na Facebooku:
```
Custom Audience: Email list z MailerLite
→ Ludzie którzy wypełnili email ALE nie założyli konta
→ Pokaż im reklamy "Dokończ rejestrację"
```

---

## ❓ FAQ / Troubleshooting

### Q: Email nie przychodzi do usera?
A: Sprawdź:
1. Czy automatyzacja w MailerLite jest **włączona** (status: Active)
2. Czy email nie trafił do SPAM
3. Czy group_id w .env.local jest prawidłowe

### Q: Lead event nie pokazuje się w Facebook?
A: Sprawdź:
1. Facebook Pixel Helper - czy pixel jest załadowany?
2. Console DevTools - czy `fbq('track', 'Lead')` się wywołał?
3. Facebook Events Manager → Test Events → sprawdź live

### Q: Subskrybent nie trafia do grupy?
A: Sprawdź:
1. Czy dodałeś MAILERLITE_TRIAL_GROUP_ID do .env.local?
2. Czy **zresetowałeś serwer Next.js** po dodaniu zmiennej? (Ctrl+C → npm run dev)
3. Czy group_id jest prawidłowe? (skopiuj z MailerLite URL)

---

## ✅ Checklist przed uruchomieniem kampanii:

```
☐ Dodano MAILERLITE_TRIAL_GROUP_ID do .env.local
☐ Zresetowano Next.js server (npm run dev)
☐ Utworzono grupę "MasterZone - Trial Signups" w MailerLite
☐ Utworzono automatyzację emaila w MailerLite
☐ Przetestowano flow (wypełniono email + otrzymano email z linkiem)
☐ Sprawdzono Facebook Pixel Helper (Lead event działa)
☐ Sprawdzono MailerLite (subskrybent w grupie)
```

---

**Created:** 27.11.2025
**Author:** Claude Code
**Project:** MasterZone Landing Page
