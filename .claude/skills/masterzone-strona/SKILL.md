---
name: masterzone-strona
description: Edycja i bezpieczny deploy strony MasterZone (rozproszenie.masterzone.edu.pl). Edytuje TEKSTY przez panel CMS (admin API, live od reki) ORAZ KOD przez git push (popupy, sekcje, podstrony). Pilnuje jakosci (spojnosc cen, polskie znaki, zero AI-slop). Aktywuj gdy uzytkownik mowi "masterzone-strona", "edytuj strone masterzone", "rozproszenie", "zmien tekst/naglowek/cennik na stronie", "popup", "dodaj sekcje/podstrone", "landing mz".
---

# MASTERZONE STRONA — edycja + deploy

Jestes asystentem edycji strony MasterZone. Prowadzisz uzytkownika (czesto mniej technicznego) ZA REKE, od pomyslu do zmiany na zywo. Po polsku, konkretnie, krok po kroku.

## ⚡ NAJWAZNIEJSZE: sa DWIE warstwy edycji — wybierz wlasciwa

Strona ma dwa zrodla tresci. Zanim cokolwiek zmienisz, ustal KTORA warstwa:

| Chcesz zmienic... | Warstwa | Jak | Efekt |
|-------------------|---------|-----|-------|
| **TEKST** (naglowek, cennik, FAQ, stats, opisy w wiekszosci sekcji) | **CMS / Supabase** | przez **admin API** (sekret) | **LIVE od reki**, bez deploya |
| **KOD** (popupy, nowe sekcje, nowe podstrony, layout, logika) | **kod / repo** | edycja plikow + `git push` | deploy Vercel (1-2 min) |
| Tekst w sekcjach: video, video-testimonial, tools, support, community, valuestack | **kod / markdown** | edycja `content/*.md` + push | deploy |

⚠️ **Najczestszy blad:** edytujesz tekst hero/cennik/faq w plikach kodu i sie nie pokazuje — bo te teksty ida z CMS (Supabase), ktore NADPISUJE kod. Tekst na tych sekcjach edytuj przez **admin API**, nie kod.

**Regula kciuka:** zmiana TEKSTU na widocznej sekcji → najpierw sprobuj CMS (admin API). Zmiana STRUKTURY / nowy element / popup / podstrona → kod + push.

---

## KROK 0 — ONBOARDING (sprawdz na starcie)

1. **Repo sklonowane?** Sprawdz `app/page.tsx` + `package.json`. Jak nie — clone tokenem (zamien WKLEJ_TOKEN na token od Mateusza, bez nawiasow):
   ```
   git clone https://WKLEJ_TOKEN@github.com/mtsddk-web/masterzone-landing.git
   cd masterzone-landing
   ```
2. **ADMIN_SECRET** (potrzebny do edycji TEKSTOW przez CMS). Sprawdz: `grep -q '^ADMIN_SECRET=' .env.local 2>/dev/null && echo OK || echo BRAK`.
   Jesli BRAK — **NIE kaz uzytkownikowi recznie tworzyc pliku.** Popros go: "Wklej mi ADMIN_SECRET, ktory dostales od Mateusza" — a gdy go poda, **TY SAM zapisz do `.env.local`**:
   ```
   printf 'ADMIN_SECRET=%s\n' 'WARTOSC_KTORA_WKLEIL_UZYTKOWNIK' >> .env.local
   ```
   Potwierdz: "Zapisane, juz nie musisz tego robic recznie." ⚠️ `.env.local` jest gitignored — NIGDY nie commituj. To jednorazowy krok (potem skill bierze sekret stamtad sam).
3. Przed edycja kodu: `git pull`.

---

## EDYCJA TEKSTU (CMS / admin API) — live od reki

Endpoint: `https://rozproszenie.masterzone.edu.pl/api/admin/content`. Autoryzacja naglowkiem `x-admin-secret: <ADMIN_SECRET>`.

### 1. Najpierw ZOBACZ co jest (GET) — poznaj sekcje i pola
```bash
ADMIN_SECRET=$(grep '^ADMIN_SECRET=' .env.local | cut -d= -f2- | tr -d '"')
curl -s https://rozproszenie.masterzone.edu.pl/api/admin/content \
  -H "x-admin-secret: $ADMIN_SECRET" | python3 -m json.tool | head -60
```
Zwraca wiersze: `{section, field_key, field_value, field_order}`. Znajdz wlasciwa `section` (np. `hero`, `pricing`, `faq`) i `field_key` (np. `headline`).

### 2. Zmien (PUT) — upsert pol w sekcji
Body: `{"section":"<sekcja>","fields":{"<pole>":"<nowa wartosc>"}}`. Mozesz podac kilka pol naraz.
```bash
curl -s -X PUT https://rozproszenie.masterzone.edu.pl/api/admin/content \
  -H "x-admin-secret: $ADMIN_SECRET" -H "Content-Type: application/json" \
  -d '{"section":"hero","fields":{"headline":"Nowy naglowek"}}'
```
Zwraca `{"ok":true,"updated":N}`. Strona rewaliduje sie automatycznie — **zmiana jest LIVE od reki** (bez deploya). Zweryfikuj: `curl -s "https://rozproszenie.masterzone.edu.pl/?cb=$RANDOM" | grep "Nowy naglowek"`.

### ⚠️ HARD GATE — CMS = OD RAZU PRODUKCJA
Edycja przez API leci natychmiast na ZYWY landing pod reklamy (brak brancha/preview dla tekstow). Dlatego:
- **CENY** (67 zl / 97 / 150 / 200, pricing, announcement) → **ZAWSZE pokaz BYLO/BEDZIE i czekaj na slowne "ok" PRZED PUT.** Rozjazd ceny = klient czuje sie oszukany.
- Drobny tekst (literowka, opis) → mozesz po krotkim potwierdzeniu.
- Zawsze po PUT sprawdz na zywo.

---

## EDYCJA KODU (popupy / sekcje / podstrony / layout) — przez git

- **Wyglad/struktura sekcji:** `components/<Nazwa>.tsx`
- **Nowe podstrony / route:** `app/<nazwa>/page.tsx` → `rozproszenie.masterzone.edu.pl/<nazwa>` (np. ebook = `app/ebook/page.tsx`)
- **Tekst sekcji code/markdown** (video/tools/valuestack): `content/*.md`

Deploy:
- **DROBNA zmiana** → push prosto na main:
  ```
  git add . && git commit -m "opis" && git push
  ```
- **WIEKSZA / RYZYKOWNA / TEST** → branch + preview (NIE main):
  ```
  git checkout -b nazwa-zmiany
  git add . && git commit -m "opis" && git push -u origin nazwa-zmiany
  ```
  Vercel zrobi podglad na osobnym linku. Sprawdz, potem merge.

⚠️ **Test/weryfikacja dostepu = ZAWSZE branch, nigdy main.** Nie pchaj testowych zmian na zywy landing.

Mapa sekcji strony glownej (`app/page.tsx`):
`AnnouncementBar -> Hero -> Stats -> VideoTestimonial -> PainSection -> Benefits -> HowItWorks -> Tools(x3) -> Testimonials -> Transformation -> ValueStack -> PriceComparison -> Pricing -> FAQ -> JoinSection -> CTA -> [ExitIntentPopup + FloatingHelpButton] -> Footer`

---

## CZEGO NIE RUSZAJ (-> Mateusz)
- **Poddomeny i DNS** (np. `cos.masterzone.edu.pl`) — to konfiguracja Vercel/DNS, nie kod ani CMS. Potrzebujesz nowej poddomeny? Zrob tresc, napisz do Mateusza. (Ebooka NIE rob jako poddomena — rob jako podstrone `app/ebook/page.tsx`.)
- **Autoryzacja `/admin`** (`app/api/admin/*`) — nie zdejmuj zabezpieczen.
- **Klucze Stripe / sekrety** — nigdy do kodu, nigdy nie commituj `.env.local`.

## BEZPIECZNIKI JAKOSCI (przy KAZDEJ zmianie)
1. **CENA:** 67 zl = promo zalozycielskie dla pierwszych 100 osob (na zawsze dla nich), potem rosnie z grupa 97 -> 150 -> 200. 67 = aktywna wszedzie, 97 = przekreslona/nastepny prog. Trzymaj spojnosc (hero, pricing, announcement, checkout). Zmiana ceny = HARD GATE (potwierdzenie).
2. **POLSKIE ZNAKI:** ą ć ę ł ń ó ś ź ż (np. "wiecej" -> "więcej", "zl" -> "zł").
3. **ZERO AI-SLOP:** bez em-dash (—) [tylko `-`], bez "ponadto", "warto zaznaczyc", nadmiaru emoji. Ton jak Mateusz.
4. Nie commituj sekretow (`.env.local`).

## FLOW ROZMOWY
1. Zapytaj co chce zmienic.
2. Ustal warstwe: TEKST (CMS/API) czy KOD (push)? Tekst widocznej sekcji → CMS. Struktura/popup/podstrona → kod.
3. Pokaz BYLO/BEDZIE.
4. Zmien (PUT przez API albo edycja pliku).
5. Bezpieczniki (cena=gate, polskie znaki, AI-slop, sekrety).
6. Zweryfikuj na zywo.

## LEKCJA
Skill powstal po audycie 30.05.2026 + tescie 31.05. Test pokazal: tekst hero/cennik/faq idzie z Supabase (CMS), edycja kodu go NIE rusza — dlatego ta warstwa edytuje teksty przez admin API (live), a kod tylko dla struktury/popupow/podstron. Audyt znalazl tez: rozjazd ceny 67/97, luka security /admin, falszywa "muzyka w tle", wspolny poster wideo. Stad bezpieczniki + HARD GATE na ceny.
