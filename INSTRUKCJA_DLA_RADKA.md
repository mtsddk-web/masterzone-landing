# 📝 Instrukcja dla Radka - Edycja Landing Page MasterZone

## ✅ Co Jest Gotowe:

- ✅ Landing page zdeployowany na: **https://rozproszenie.masterzone.edu.pl**
- ✅ Kod na GitHub: https://github.com/mtsddk-web/masterzone-landing
- ✅ Auto-deployment: każdy commit automatycznie deployuje się na Vercel
- ✅ Możesz edytować przez przeglądarkę (zero instalacji!)

---

## 🎯 JAK EDYTOWAĆ TREŚĆ (Najprostsza Metoda)

### Krok 1: Zaloguj się na GitHub
1. Wejdź na: https://github.com
2. Zaloguj się na swoje konto GitHub
3. Jeśli nie masz konta - załóż za darmo (zajmuje 2 minuty)

### Krok 2: Dostęp do repozytorium
4. Wejdź na: https://github.com/mtsddk-web/masterzone-landing
5. **WAŻNE:** Mateusz musi dodać Cię jako "Collaborator":
   - Mateusz: Settings → Collaborators → Add people
   - Wpisz GitHub username Radka
   - Radek otrzyma email z zaproszeniem - kliknij "Accept"

### Krok 3: Edytuj pliki
6. Otwórz folder **`content/`**
7. Kliknij na plik który chcesz zmienić (np. `hero.md`)
8. Kliknij ikonę **ołówka** (📝 Edit) w prawym górnym rogu
9. Edytuj tekst między `---` (to jest zawartość strony)
10. Scroll na dół strony

### Krok 4: Zapisz zmiany
11. W polu "Commit message" wpisz co zmieniłeś (np. "Zmiana nagłówka hero")
12. Kliknij zielony przycisk **"Commit changes"**
13. **GOTOWE!** 🎉

### Krok 5: Sprawdź efekt
14. Poczekaj 2-3 minuty
15. Wejdź na: https://rozproszenie.masterzone.edu.pl
16. Odśwież stronę (F5 lub Cmd+R)
17. Twoje zmiany są już live!

---

## 📂 Pliki Do Edycji

Wszystkie pliki znajdują się w folderze **`content/`**:

### `hero.md` - Główna sekcja (nagłówek)
```yaml
---
headline: "Koniec z Rozproszeniem. Czas na Głęboką Pracę."
subheadline: "Dołącz do społeczności MasterZone..."
ctaText: "Dołącz Teraz"
ctaUrl: "https://www.skool.com/masterzone"
statsText: "✨ Ponad 100+ członków już działa!"
---
```

### `benefits.md` - Lista korzyści
```yaml
---
sectionTitle: "Co Zyskujesz w MasterZone?"
benefits:
  - icon: "🎯"
    title: "Bloki Głębokiej Pracy"
    description: "Wspólne sesje skupienia..."
---
```

### `pricing.md` - Cennik
```yaml
---
sectionTitle: "Prosty, Przejrzysty Cennik"
plans:
  - name: "MasterZone Community"
    price: "$14"
    period: "/miesiąc"
---
```

### `testimonials.md` - Opinie klientów
```yaml
---
sectionTitle: "Co Mówią Członkowie MasterZone"
testimonials:
  - name: "Anna K."
    role: "Przedsiębiorca"
    quote: "MasterZone pomogło mi..."
---
```

### `faq.md` - Pytania i odpowiedzi
```yaml
---
sectionTitle: "Najczęściej Zadawane Pytania"
questions:
  - question: "Jak często odbywają się bloki pracy?"
    answer: "Organizujemy je codziennie..."
---
```

### `cta.md` - Końcowe wezwanie do działania
```yaml
---
headline: "Gotowy na Zmianę?"
subheadline: "Dołącz do MasterZone już dziś..."
ctaText: "Rozpocznij Teraz"
ctaUrl: "https://www.skool.com/masterzone"
---
```

---

## 🎨 PRZYKŁAD: Jak Zmienić Nagłówek?

### Przed:
```yaml
headline: "Koniec z Rozproszeniem. Czas na Głęboką Pracę."
```

### Po:
```yaml
headline: "Odzyskaj Fokus i Produktywność z MasterZone"
```

### Kroki:
1. Otwórz `content/hero.md`
2. Znajdź linię z `headline:`
3. Zmień tekst w cudzysłowach
4. Kliknij "Commit changes"
5. Poczekaj 2-3 minuty
6. Sprawdź na https://rozproszenie.masterzone.edu.pl

---

## 💡 WSKAZÓWKI

### ✅ DO:
- Zawsze zmieniaj tylko tekst w cudzysłowach `"tutaj"`
- Zachowuj strukturę YAML (wcięcia, dwukropki)
- Pisz krótkie opisy zmian w "Commit message"
- Testuj zmiany na stronie po 2-3 minutach

### ❌ NIE:
- Nie usuwaj linii z `---`
- Nie zmieniaj nazw pól (np. `headline:`)
- Nie usuwaj cudzysłowów `"`
- Nie usuwaj wcięć (spacji na początku linii)

---

## 🚀 TWORZENIE WARIANTÓW DLA RÓŻNYCH REKLAM

### Metoda 1: Edycja content files
Aby stworzyć landing page pod konkretną reklamę:

1. **Edytuj treść** w plikach `content/*.md`
2. **Zmień nagłówki**, benefity, testimoniale pod konkretny pain point
3. **Commit** z opisem np. "Wariant dla reklamy FB - ból prokrastynacji"
4. **Vercel deployuje automatycznie**

### Metoda 2: Branches (zaawansowane)
Jeśli chcesz mieć kilka wariantów jednocześnie:

1. Stwórz nowy branch: `git checkout -b wariant-fb-ads`
2. Zmień content w tym branchu
3. Push: `git push -u origin wariant-fb-ads`
4. W Vercel stwórz deployment z tego brancha
5. Będziesz miał 2 wersje live jednocześnie!

---

## 🆘 POMOC

### Problem: Nie widzę zmian po 3 minutach
- Sprawdź czy commit się zapisał (powinien być na liście commitów)
- Otwórz Vercel Dashboard: https://vercel.com
- Sprawdź status deploymentu (powinno być "Ready")
- Odśwież stronę z Ctrl+Shift+R (hard refresh)

### Problem: Strona się zepsuła po edycji
- To pewnie błąd składni YAML
- Wejdź na GitHub → kliknij "History" przy pliku
- Znajdź poprzednią wersję i kliknij "View"
- Skopiuj zawartość i nadpisz aktualny plik
- Commit jako "Cofnięcie błędnej zmiany"

### Kontakt:
- Mateusz - właściciel repozytorium
- GitHub Issues: https://github.com/mtsddk-web/masterzone-landing/issues

---

## 📊 MONITORING

- **Strona Live**: https://rozproszenie.masterzone.edu.pl
- **Vercel Dashboard**: https://vercel.com/mateusz-s-projects-3c07c74b/masterzone-landing
- **GitHub Commits**: https://github.com/mtsddk-web/masterzone-landing/commits/main

---

**Powodzenia, Radek! 🚀**

Jeśli coś nie działa - napisz do Mateusza lub stwórz Issue na GitHubie.
