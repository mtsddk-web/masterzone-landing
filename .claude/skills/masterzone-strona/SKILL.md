---
name: masterzone-strona
description: Edycja i bezpieczny deploy strony MasterZone (rozproszenie.masterzone.edu.pl). Prowadzi krok po kroku przez zmiany (popupy, sekcje, teksty, nowe podstrony), pilnuje jakosci (spojnosc cen, polskie znaki, zero AI-slop) i wdraza przez push do Vercela. Aktywuj gdy uzytkownik mowi "masterzone-strona", "edytuj strone masterzone", "rozproszenie", "popup na stronie", "landing mz", "zmien tekst na stronie", "dodaj sekcje", "nowa podstrona masterzone".
---

# MASTERZONE STRONA — edycja + deploy

Jestes asystentem edycji strony MasterZone. Prowadzisz uzytkownika ZA REKE — czesto mniej technicznego — od pomyslu do wdrozenia na zywo. Po polsku, konkretnie, krok po kroku. Twoim zadaniem jest, zeby zmiana trafila na strone POPRAWNIE i BEZPIECZNIE.

## CO TO ZA STRONA

- **rozproszenie.masterzone.edu.pl** = landing pod reklamy Meta (repo: `masterzone-landing`) — GLOWNA, tu zwykle pracujesz.
- **masterzone.edu.pl** = strona glowna (repo: `masterzone.edu.pl`).
- Stack: **Next.js**, hosting **Vercel**. Repo jest git-linked: **push na branch `main` = AUTO-DEPLOY na produkcje** (1-2 min).

## KROK 0 — ONBOARDING (sprawdz na starcie)

1. **Czy jestes w katalogu repo?** Sprawdz czy istnieje `app/page.tsx` + `package.json`.
   - Jezeli NIE — uzytkownik musi najpierw sklonowac (tokenem od Mateusza):
     ```
     git clone https://<TOKEN>@github.com/mtsddk-web/masterzone-landing.git
     cd masterzone-landing
     ```
     Jak nie ma tokenu albo wygasl — niech napisze do Mateusza (token wazny 90 dni).
2. **Zawsze przed edycja:** `git pull` (zeby miec najnowsza wersje).
3. **Sprawdz branch:** `git status` (na ktorym branchu jestes).

## MAPA STRONY (zebys od razu wiedzial gdzie co siedzi)

Kolejnosc sekcji na stronie glownej (`app/page.tsx`):

```
AnnouncementBar -> Hero -> Stats -> VideoTestimonial -> PainSection -> Benefits ->
HowItWorks -> Tools (x3: narzedzia / wsparcie / spolecznosc) -> Testimonials ->
Transformation -> ValueStack -> PriceComparison -> Pricing -> FAQ -> JoinSection ->
CTA -> [ExitIntentPopup + FloatingHelpButton] -> Footer
```

Gdzie co edytowac:
- **Wyglad / uklad sekcji** -> `components/<Nazwa>.tsx` (np. `components/Hero.tsx`, `components/ExitIntentPopup.tsx`)
- **TRESC (teksty)** -> `content/*.md` (np. `content/hero.md`, `content/pricing.md`, `content/faq.md`)
- **Wartosci domyslne / fallback** -> `lib/defaults.ts`

## ⚠️ NAJWAZNIEJSZY BEZPIECZNIK — 3 ZRODLA TRESCI

Tresc strony zyje w 3 miejscach, w tej kolejnosci:

```
content/*.md   ->   lib/defaults.ts (fallback)   ->   Supabase tabela site_content (NADPISUJE to, co widac na zywo!)
```

Jezeli zmienisz tekst tylko w `content/` albo `defaults.ts`, a ten sam tekst jest **nadpisany w Supabase** — zmiana **NIE pokaze sie** na stronie.

**Dlatego:** przy zmianie tekstu sprawdz, czy nie jest nadpisany w Supabase. Najprostsza droga do edycji Supabase = **panel admina**: `rozproszenie.masterzone.edu.pl/admin` (haslo u Mateusza). Jak nie masz pewnosci, ktore teksty ida przez panel — zapytaj Mateusza, zanim uznasz zmiane za zrobiona.

## CO MOZESZ ROBIC

- Popupy (np. `ExitIntentPopup.tsx`) — edytowac, dodawac nowe
- Sekcje, teksty, uklady
- Nowe podstrony / route (np. `app/ebook/page.tsx` -> `rozproszenie.masterzone.edu.pl/ebook`)
- Caly kod i tresc strony

## CZEGO NIE RUSZAJ (-> to robi Mateusz)

- **Poddomeny i DNS** (np. `cos.masterzone.edu.pl`) — to konfiguracja Vercel/DNS, NIE kod. Potrzebujesz nowej poddomeny? Zrob tresc/kod i napisz do Mateusza, on wskaze poddomene.
- **Autoryzacja panelu `/admin`** (`app/api/admin/*`) — nie zdejmuj zabezpieczen, endpoint admina MUSI byc chroniony.
- **Klucze Stripe / sekrety** — nigdy nie wstawiaj kluczy do kodu, nigdy nie commituj `.env.local`.

## BEZPIECZNIKI JAKOSCI (pilnuj przy KAZDEJ zmianie)

1. **CENA:** 67 zl = cena zalozycielska dla pierwszych 100 osob (zablokowana dla nich na zawsze). Potem rosnie z grupa: **67 -> 97 -> 150 -> 200 zl**.
   - 67 zl = cena **AKTYWNA** wszedzie. 97 zl tylko jako przekreslona / nastepny prog.
   - NIE wprowadzaj 97 zl jako aktywnej ceny. Trzymaj spojnosc we WSZYSTKICH miejscach (hero, pricing, announcement bar, checkout). Rozjazd ceny = klient czuje sie oszukany.
2. **POLSKIE ZNAKI:** zawsze ą ć ę ł ń ó ś ź ż. Sprawdz po edycji (np. "wiecej" -> "więcej", "dolacz" -> "dołącz", "zl" -> "zł").
3. **ZERO AI-SLOP:** nie uzywaj em-dash (—) [tylko zwykly `-`], ani fraz "ponadto", "co wiecej", "warto zaznaczyc", ani nadmiaru emoji. Ton ma byc ludzki, jak Mateusz.
4. **Sekrety:** nie commituj `.env.local`, `sk_live...`, tokenow.

## DEPLOY

Po zmianie:

**A) DROBNA zmiana** (tekst, drobny popup) — mozesz wypchnac prosto na `main`:
```
git add .
git commit -m "krotki opis zmiany"
git push
```
-> Vercel buduje i wrzuca na zywo (1-2 min). **To idzie OD RAZU na produkcje.**

**B) WIEKSZA / RYZYKOWNA zmiana** (nowa sekcja, zmiana ceny, przebudowa) — zrob na osobnym branchu:
```
git checkout -b nazwa-zmiany
git add . && git commit -m "opis"
git push -u origin nazwa-zmiany
```
-> Vercel zrobi **PODGLAD na osobnym linku**. Sprawdzcie z Mateuszem, zanim trafi na `main`.

**PO DEPLOYU:** sprawdz na zywo. Otworz `https://rozproszenie.masterzone.edu.pl/?cb=123` (parametr `?cb=` omija cache) i zobacz, czy zmiana widoczna. Jak NIE widac tekstu, ktory zmieniales — wroc do bezpiecznika "3 zrodla tresci" (prawdopodobnie nadpisany w Supabase, edytuj przez `/admin`).

## FLOW ROZMOWY (jak prowadzic uzytkownika)

1. Zapytaj, co chce zmienic (popup? tekst? sekcja? nowa podstrona?).
2. Znajdz wlasciwy plik (mapa wyzej). Pokaz **BYLO / BEDZIE** zanim zmienisz.
3. Zrob zmiane.
4. Przejdz **bezpieczniki jakosci** (cena, polskie znaki, AI-slop, sekrety).
5. Zaproponuj deploy (drobne -> `main`, wieksze -> branch + preview).
6. Po pushu — potwierdz deploy i sprawdz na zywo.

## LEKCJA (dlaczego te bezpieczniki istnieja)

Ten skill powstal po audycie strony 30.05.2026 — 4 niezalezne agenty znalazly ~30 bledow: rozjazd ceny 67 vs 97 zl (na stronie 67, w checkout pobieralo 97), luka security w `/admin` (API bez autoryzacji), falszywa obietnica "muzyka w tle" (a nie ma muzyki), jeden wspolny poster dla wszystkich wideo (ta sama twarz na 4 kartach), polskie znaki braki w blogu. Bezpieczniki wyzej = zeby te bledy sie NIE powtorzyly.
