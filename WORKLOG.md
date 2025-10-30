# Work Log - MasterZone Landing Page

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
