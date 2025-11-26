# MailerLite Automation - Email Gate dla MasterZone

## 🎯 Cel
Wysłanie instant emaila z linkiem do Skool po zapisaniu się przez Email Gate na landing page.

---

## ⚙️ Konfiguracja w MailerLite

### 1. Utwórz nową Automation
- Wejdź do MailerLite Dashboard
- Kliknij **Automations** → **Create automation**
- Nazwa: **"Skool Trial - Instant Access"**

### 2. Trigger (Wyzwalacz)
**Typ:** Subscriber is added

**Warunki:**
- Source field contains: "Email Gate"
- LUB
- Last interest field is not empty

### 3. Email Content

#### Subject Line (Temat):
```
✅ Twój dostęp do MasterZone - 7 dni ZA DARMO
```

#### Preview Text:
```
Kliknij link poniżej i zacznij pracować w pełnym skupieniu już dziś
```

#### Email Body:

```html
Cześć {{subscriber.first_name | default: "tam"}}! 👋

Dzięki za zainteresowanie MasterZone!

🎁 Twój 7-dniowy trial jest gotowy. Kliknij link poniżej aby rozpocząć:

👉 [ROZPOCZNIJ 7-DNIOWY TRIAL](https://www.skool.com/masterzone)

---

## Co znajdziesz w MasterZone?

✅ **Codzienne livestreamy o 7:00** - Zacznij dzień z grupą, nie sam
✅ **Narzędzia AI do produktywności** - ChatGPT, Claude, Notion AI i więcej
✅ **Społeczność 120+ osób** - Freelancerzy, VA, content creators
✅ **24/7 support** - Pomoc w każdej chwili

---

## ⏱️ Jak działa trial?

1. Kliknij link powyżej i dołącz do Skool
2. Masz **7 dni dostępu FREE** do wszystkiego
3. **Bez karty kredytowej** - anuluj kiedy chcesz
4. Po 7 dniach: 49 zł/miesiąc (możesz zrezygnować w każdej chwili)

---

## 🔥 Jutro o 7:00 - Pierwszy Livestream

Dołącz już jutro rano do livestreamu i poznaj społeczność. Pokażę Ci:
- Jak skonfigurować swój workspace do deep work
- Jakie narzędzia AI używać do konkretnych zadań
- Jak planować dzień aby osiągnąć maksimum

**Nie przegap:** Livestreamy są nagrywane, ale energia na żywo jest nie do zastąpienia 💪

---

Masz pytania? Odpowiedz na tego maila - czytam każdą wiadomość.

Do zobaczenia w MasterZone!

Mateusz Dudek
Founder, MasterZone

P.S. To jedyna szansa na 7-dniowy trial ZA DARMO. Nie czekaj - społeczność rośnie każdego dnia 🚀
```

### 4. Timing (Kiedy wysłać)
**Immediately** - Instant po zapisaniu emaila

Opcjonalnie możesz dodać delay 2-5 minut jeśli chcesz aby user najpierw zobaczył stronę Skool.

### 5. Follow-up (Opcjonalnie)

#### Email 2 - Reminder (24h po zapisie)
**Temat:** "Widziałeś już livestream? 🎥"

```
Hej {{subscriber.first_name | default: "tam"}}!

Wczoraj wysłałem Ci link do MasterZone. Widziałeś go?

Jeśli jeszcze nie dołączyłeś, to idealny moment:

👉 [TAK, CHCĘ DOŁĄCZYĆ](https://www.skool.com/masterzone)

Jutro o 7:00 mamy livestream - byłoby super Cię tam zobaczyć!

Mateusz
```

#### Email 3 - Last Chance (48h po zapisie)
**Temat:** "⏰ Ostatnia szansa na 7-dniowy trial"

```
Hej {{subscriber.first_name | default: "tam"}}!

Widzę że jeszcze nie aktywowałeś swojego triala...

Nie chcę być natrętny, ale naprawdę warto spróbować.

Społeczność MasterZone pomogła już 120+ osobom:
- Podwoić produktywność
- Nauczyć się AI tools
- Budować dyscyplinę przez codzienne livestreamy

Masz jeszcze szansę na 7 dni ZA DARMO:

👉 [OSTATNIA SZANSA - ROZPOCZNIJ TRIAL](https://www.skool.com/masterzone)

Jeśli teraz nie jest dobry moment - rozumiem. Napisz mi co Cię powstrzymuje - może pomogę.

Mateusz

P.S. Po tym emailu nie będę już wysyłał przypominajek. Decyzja należy do Ciebie 🙂
```

---

## 📊 Tracking & Analytics

Śledź w MailerLite:
- **Open rate** - Ile osób otwiera emaile
- **Click rate** - Ile klika w link do Skool
- **Unsubscribe rate** - Czy content jest odpowiedni

Cel:
- Open rate > 40%
- Click rate > 20%
- Unsubscribe < 1%

---

## 🎯 Segmentacja (Advanced)

Po kilku dniach możesz stworzyć segmenty:

**Segment 1: "Opened but not clicked"**
- Otworzył email ale nie kliknął linka
- Wyślij przypominajkę z innym angle (np. social proof, case study)

**Segment 2: "Not opened"**
- Nie otworzył emaila w ogóle
- Testuj różne subject lines
- Wyślij z innej pory dnia

**Segment 3: "Clicked link"**
- Kliknął link ale nie dołączył do Skool (zobacz w Skool analytics)
- Zapytaj o blockers: "Co Cię powstrzymało?"

---

## ✅ Checklist Implementacji

- [ ] Utwórz automation w MailerLite
- [ ] Skonfiguruj trigger: "Subscriber is added"
- [ ] Napisz welcome email z linkiem do Skool
- [ ] Ustaw timing: "Immediately"
- [ ] Test: Zapisz testowy email przez landing page
- [ ] Sprawdź czy email przyszedł
- [ ] Sprawdź czy link działa
- [ ] Opcjonalnie: Dodaj follow-up emails (24h, 48h)
- [ ] Monitor analytics przez pierwszy tydzień
- [ ] Optymalizuj na podstawie wyników

---

## 🚀 Pro Tips

1. **Personalizacja:** Użyj {{subscriber.first_name}} jeśli zbierasz imię
2. **Mobile-first:** 60%+ otworzy na telefonie - testuj na mobile
3. **CTA above the fold:** Link do Skool powinien być widoczny bez scrollowania
4. **Social proof:** Dodaj screenshot społeczności lub testimonial
5. **Urgency:** "Livestream jutro o 7:00" tworzy FOMO
6. **Preview text:** 50-100 znaków dodatkowej zachęty w inbox preview

---

## 📞 Potrzebujesz pomocy?

Jeśli masz pytania o konfigurację:
1. Screenshot swojego setup w MailerLite
2. Opisz problem
3. Wyślij do mnie - pomogę

Powodzenia! 🚀
