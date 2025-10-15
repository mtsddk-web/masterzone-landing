# MasterZone Landing Page

Landing page dla społeczności MasterZone - program walki z rozproszeniem i budowania głębokiej pracy.

## 🚀 Stack Technologiczny

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Decap CMS** - Content management dla Radka

## 📁 Struktura Projektu

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Strona główna
├── components/            # React components
│   ├── Hero.tsx          # Sekcja hero
│   ├── Benefits.tsx      # Korzyści
│   ├── Pricing.tsx       # Cennik
│   ├── Testimonials.tsx  # Opinie
│   ├── FAQ.tsx           # Pytania
│   └── CTA.tsx           # Call-to-action
├── content/              # Pliki markdown z treścią (edytowalne przez CMS)
│   ├── hero.md
│   ├── benefits.md
│   ├── pricing.md
│   ├── testimonials.md
│   ├── faq.md
│   └── cta.md
└── public/
    ├── admin/            # Decap CMS admin panel
    │   ├── index.html
    │   └── config.yml
    └── images/           # Obrazy i media

```

## 🛠️ Instalacja i Uruchomienie

### Lokalne uruchomienie:

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

### Panel CMS dla Radka:

Po deploymencie na Vercel, panel admin będzie dostępny pod adresem:
```
https://masterzone.edu.pl/admin
```

## ✏️ Jak Edytować Treść (dla Radka)

### Opcja 1: Przez Panel Admin (po deploymencie)
1. Wejdź na `https://masterzone.edu.pl/admin`
2. Zaloguj się przez GitHub
3. Edytuj dowolną sekcję:
   - Hero Section - główny nagłówek
   - Benefits - lista korzyści
   - Pricing - cennik
   - Testimonials - opinie klientów
   - FAQ - pytania i odpowiedzi
   - CTA - końcowe wezwanie do działania
4. Zapisz zmiany - strona zaktualizuje się automatycznie!

### Opcja 2: Edycja bezpośrednio w plikach markdown

Jeśli wolisz edytować pliki bezpośrednio:

1. Otwórz folder `content/`
2. Edytuj odpowiedni plik `.md` (np. `hero.md`)
3. Zmień tekst między `---` (YAML frontmatter)
4. Zapisz i commituj do GitHuba
5. Vercel automatycznie zdeployuje zmiany

**Przykład edycji `content/hero.md`:**

```markdown
---
headline: "Twój Nowy Nagłówek"
subheadline: "Zmieniony podtytuł"
ctaText: "Dołącz Teraz"
ctaUrl: "https://www.skool.com/masterzone"
statsText: "✨ Ponad 200+ członków!"
---
```

## 🎨 Zmiana Wariantów dla Reklam

Aby stworzyć nowy wariant landing page (np. pod inną reklamę):

### Metoda 1: Duplikuj content files
```bash
cp content/hero.md content/hero-variant-2.md
# Edytuj hero-variant-2.md
```

### Metoda 2: Użyj CMS
1. W panelu admin dodaj nową wersję sekcji
2. Panel pozwala zapisywać różne wersje treści
3. Przełączaj między nimi zmieniając pliki

### Metoda 3: Gałęzie Git (najbardziej zaawansowana)
```bash
git checkout -b variant-2
# Zmień treści w content/
git commit -m "Variant 2 dla reklamy FB"
git push
# Stwórz drugi deployment na Vercel z tej gałęzi
```

## 📦 Deployment na Vercel

1. Wejdź na [vercel.com](https://vercel.com)
2. Zaloguj się przez GitHub
3. Kliknij "New Project"
4. Wybierz repo `masterzone-landing`
5. Kliknij "Deploy"
6. Po deploymencie dodaj custom domain: `masterzone.edu.pl`

## 🔗 Linki

- **Strona główna**: https://masterzone.edu.pl
- **Panel Admin (CMS)**: https://masterzone.edu.pl/admin
- **Skool Community**: https://www.skool.com/masterzone

## 📝 Notatki Techniczne

- CMS używa Git jako backendu - wszystkie zmiany są commitowane do repo
- Automatyczny deployment po każdym pushu do main
- SEO-friendly (metadata w `app/layout.tsx`)
- Mobile-responsive
- Fast page loads dzięki Next.js

## 🆘 Pomoc

Jeśli coś nie działa:
1. Sprawdź czy `npm run dev` działa lokalnie
2. Sprawdź logi deploymentu na Vercel
3. Upewnij się że pliki w `content/` mają poprawny format YAML

## 🎯 TODO

- [ ] Dodać więcej opinii klientów
- [ ] Dodać grafiki/zdjęcia
- [ ] Podłączyć analytics (Google Analytics / Plausible)
- [ ] A/B testing różnych wariantów
