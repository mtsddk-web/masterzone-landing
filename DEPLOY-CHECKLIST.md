# 🚀 DEPLOY CHECKLIST - MasterZone 7 DNI ZA DARMO

**Data zmian:** 13 listopada 2025
**Deadline:** 13.11.2025 (dziś!)

---

## ✅ CO ZOSTAŁO ZROBIONE

### Zmienione pliki:
1. `content/pricing.md` - cena: "7 DNI ZA DARMO" + "potem $14/msc"
2. `content/hero.md` - CTA: "Wypróbuj 7 dni ZA DARMO"
3. `content/valuestack.md` - cena: "7 dni ZA DARMO"
4. `components/ExitIntentPopup.tsx` - 2x cena zmieniona
5. `components/ContactForm.tsx` - redirect na /thank-you
6. `app/thank-you/page.tsx` - NOWA STRONA z filmem Wistia
7. `masterzone/masterzone.edu.pl/index.html` - stary landing (cena zmieniona)

---

## 🔥 DO ZROBIENIA TERAZ (deployment)

### 1. TEST LOKALNY (5 min)

```bash
cd /Users/mateuszdudek/Documents/atlas/masterzone/masterzone-landing
npm run dev
```

Otwórz: http://localhost:3000

**Sprawdź:**
- [ ] Czy cena pokazuje "7 DNI ZA DARMO" (hero, pricing, exit popup)
- [ ] Czy formularz działa
- [ ] Czy po submit → redirect na /thank-you
- [ ] Czy strona /thank-you pokazuje film Wistia
- [ ] Czy film się ładuje (Wistia player)
- [ ] Czy przycisk "Przejdź do MasterZone" działa
- [ ] Czy auto-redirect (60s) działa

---

### 2. COMMIT & PUSH DO GIT (2 min)

```bash
cd /Users/mateuszdudek/Documents/atlas/masterzone/masterzone-landing

git add .
git commit -m "🎉 7 DNI ZA DARMO + strona /thank-you z filmem instruktażowym

Zmiany:
- Zmieniono ceny z \$14 na '7 DNI ZA DARMO' (5 plików)
- Dodano stronę /thank-you z filmem Wistia
- Zmieniono flow: formularz → /thank-you → Skool
- Film pokazuje: jak działa Skool, płatności USD, co zrobić w 24h

Deadline: 13.11.2025"

git push
```

---

### 3. VERCEL AUTO-DEPLOY (automatyczny)

Po push do GitHub, Vercel automatycznie zdeployuje na:
- **https://rozproszenie.masterzone.edu.pl**

Sprawdź deploy status:
1. Idź do: https://vercel.com/your-project
2. Zobacz "Deployments" → najnowszy deploy
3. Poczekaj ~2-3 minuty aż status = "Ready"

---

### 4. TEST PRODUKCYJNY (5 min)

Otwórz: **https://rozproszenie.masterzone.edu.pl**

**Sprawdź TO SAMO co lokalnie:**
- [ ] Ceny "7 DNI ZA DARMO" wszędzie
- [ ] Formularz → /thank-you → Skool
- [ ] Film Wistia działa na /thank-you
- [ ] Auto-redirect działa
- [ ] UTM params są przekazywane (test z: ?utm_source=test)

---

### 5. STARY LANDING (masterzone.edu.pl)

**Lokalizacja:** `/Users/mateuszdudek/Documents/atlas/masterzone/masterzone.edu.pl/`

Stary landing już ma zmienioną cenę (linia 1639):
```html
7 DNI ZA DARMO<span>potem $14/msc</span>
```

**Deploy starego landing:**

```bash
cd /Users/mateuszdudek/Documents/atlas/masterzone/masterzone.edu.pl

# Jeśli jest git repo:
git add .
git commit -m "Zmiana ceny: 7 DNI ZA DARMO"
git push

# Lub skopiuj plik index.html na serwer (jak zwykle deployujesz)
```

---

## 🎬 SPRAWDZENIE FILMU WISTIA

Film ID: **7ueol9vha3**
URL: https://fast.wistia.com/embed/medias/7ueol9vha3

**Test:**
1. Otwórz /thank-you
2. Sprawdź czy film się ładuje (powinien być natychmiast)
3. Play → czy działa
4. Czy pokazuje wszystko co trzeba:
   - Jak działa Skool
   - Płatności USD
   - Co zrobić w pierwszych 24h

**Jeśli film nie działa:**
- Sprawdź czy Wistia media ID jest poprawne
- Sprawdź w Wistia dashboard czy film jest public
- Sprawdź console (F12) w przeglądarce

---

## 📝 CHECKLIST FINALNY

- [ ] Test lokalny przeszedł (localhost:3000)
- [ ] Git commit + push zrobiony
- [ ] Vercel deploy zakończony (status: Ready)
- [ ] Test produkcyjny przeszedł (rozproszenie.masterzone.edu.pl)
- [ ] Film Wistia działa na /thank-you
- [ ] Stary landing zaktualizowany (masterzone.edu.pl)
- [ ] Przetestowane z prawdziwym emailem (zapisz się → obejrzyj film → wejdź do Skool)

---

## ⚠️ WAŻNE!

**Skool settings:**
- Upewnij się że w Skool masz włączone "7-day free trial"
- Sprawdź czy cena $14/msc jest ustawiona po trial
- Test: zapisz się nowym emailem i zobacz co się dzieje

**MailerLite:**
- Formularz nadal zapisuje do MailerLite
- Sprawdź czy nowi subskrybenci się pojawiają

---

## 🐛 TROUBLESHOOTING

### Film nie działa:
```bash
# Sprawdź w konsoli przeglądarki (F12)
# Błędy Wistia? Network errors?
```

### Redirect nie działa:
```bash
# Sprawdź window.location.href w /thank-you/page.tsx
# Sprawdź czy jest https://www.skool.com/masterzone
```

### Cena się nie zmieniła:
```bash
# Hard refresh (Cmd+Shift+R)
# Clear cache przeglądarki
# Sprawdź czy deploy na Vercel się skończył
```

---

**Status:** ✅ GOTOWE DO DEPLOYU
**Czas na deployment:** ~15 minut total

Powodzenia! 🚀
