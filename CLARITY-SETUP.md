# Microsoft Clarity - Setup Instructions

## Czym jest Microsoft Clarity?

Microsoft Clarity to **darmowe narzędzie** do analizy zachowań użytkowników na stronie:
- 📊 **Heatmapy** - gdzie ludzie klikają, scrollują, się zatrzymują
- 🎥 **Nagrania sesji** - oglądaj jak użytkownicy poruszają się po stronie
- 💡 **Insights** - frustracje, dead clicks, rage clicks
- 🚀 **100% darmowe** - bez limitów!

---

## Krok 1: Załóż konto Microsoft Clarity

1. Wejdź na: **https://clarity.microsoft.com/**
2. Kliknij **"Sign in"** lub **"Get started for free"**
3. Zaloguj się kontem Microsoft (lub załóż nowe)

---

## Krok 2: Stwórz projekt

1. Po zalogowaniu kliknij **"Add new project"**
2. Wypełnij dane:
   - **Name:** MasterZone Landing
   - **Website URL:** https://rozproszenie.masterzone.edu.pl
   - **Site category:** Business Services
3. Kliknij **"Add new project"**

---

## Krok 3: Zdobądź Project ID

1. Po stworzeniu projektu zobaczysz ekran "Install tracking code"
2. **Skopiuj Project ID** - to ciąg znaków typu: `mj4k7l8m9n`

   Wygląda to tak:
   ```javascript
   <script type="text/javascript">
     (function(c,l,a,r,i,t,y){
       ...
     })(window, document, "clarity", "script", "mj4k7l8m9n");  // <-- TO JEST TWÓJ PROJECT ID
   </script>
   ```

---

## Krok 4: Dodaj Project ID do projektu

### A) Lokalnie (development):

Edytuj plik `.env.local` i dodaj:
```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=mj4k7l8m9n
```
(zamień `mj4k7l8m9n` na swój prawdziwy Project ID)

### B) Na Vercel (production):

1. Wejdź na: https://vercel.com/
2. Otwórz projekt **masterzone-landing**
3. Idź do: **Settings → Environment Variables**
4. Dodaj nową zmienną:
   - **Key:** `NEXT_PUBLIC_CLARITY_PROJECT_ID`
   - **Value:** `mj4k7l8m9n` (twój Project ID)
   - **Environment:** Production, Preview, Development (zaznacz wszystkie)
5. Kliknij **"Save"**
6. **Re-deploy** projekt (Settings → Deployments → ... → Redeploy)

---

## Krok 5: Sprawdź czy działa

1. Odwiedź swoją stronę: https://rozproszenie.masterzone.edu.pl
2. Wróć do Microsoft Clarity dashboard
3. Po 1-2 minutach powinieneś zobaczyć pierwsze sesje w zakładce **"Recordings"**

---

## Jak korzystać z Clarity?

### 📊 Heatmapy
- **Dashboard → Heatmaps**
- Zobacz gdzie użytkownicy klikają najczęściej
- Sprawdź jak daleko scrollują
- Znajdź "dead zones" (miejsca ignorowane)

### 🎥 Nagrania sesji
- **Dashboard → Recordings**
- Oglądaj jak użytkownicy poruszają się po stronie
- Szukaj frustracji, błędów, problemów

### 💡 Insights
- **Dashboard → Insights**
- **Rage clicks** - gdy użytkownik klika wściekle w jedno miejsce
- **Dead clicks** - kliknięcia w nie-klikalne elementy
- **Quick backs** - użytkownik wrócił bardzo szybko

---

## Troubleshooting

### Nie widzę danych w Clarity?
1. Sprawdź czy `NEXT_PUBLIC_CLARITY_PROJECT_ID` jest ustawione
2. Sprawdź czy re-deployowałeś projekt na Vercel po dodaniu zmiennej
3. Clarity zbiera dane po 1-2 minutach od pierwszej wizyty

### Gdzie sprawdzić czy Clarity działa?
1. Otwórz stronę
2. Otwórz DevTools (F12)
3. Console → wpisz: `clarity`
4. Jeśli zwróci funkcję - działa! Jeśli undefined - nie działa

---

## Gotowe! 🎉

Teraz masz:
- ✅ Heatmapy showing gdzie użytkownicy klikają
- ✅ Session recordings - oglądasz jak poruszają się po stronie
- ✅ Insights - wykrywanie problemów UX
- ✅ 100% darmowe - bez limitów!

**Pro tip:** Sprawdzaj Clarity co tydzień żeby optymalizować landing page na podstawie realnych danych użytkowników!
