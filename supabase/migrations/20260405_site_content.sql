-- ============================================
-- MasterZone Landing — Site Content Management
-- Run in Supabase SQL Editor
-- ============================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS site_content (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_value TEXT NOT NULL DEFAULT '',
  field_type TEXT NOT NULL DEFAULT 'text',  -- text | textarea | emoji | number | url
  field_label TEXT NOT NULL DEFAULT '',
  field_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section, field_key)
);

-- 2. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);

-- 3. Auto-update timestamp
CREATE OR REPLACE FUNCTION update_site_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated ON site_content;
CREATE TRIGGER site_content_updated
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_site_content_timestamp();

-- 4. RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public can read (for SSR)
CREATE POLICY "site_content_public_read" ON site_content
  FOR SELECT USING (true);

-- Service role can do everything
CREATE POLICY "site_content_service_all" ON site_content
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Seed data from current markdown content
-- ===========================================

-- HERO (6 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('hero', 'preheadline', 'Pracujesz z domu i nie możesz się skupić?', 'text', 'Preheadline', 1),
('hero', 'headline', 'Przestań prokrastynować w samotności. Dołącz do ludzi, którzy pracują razem — i kończą to, co zaczęli', 'textarea', 'Nagłówek główny', 2),
('hero', 'description', 'Nie potrzebujesz więcej dyscypliny. Potrzebujesz body doubling — pracy w obecności innych, która naturalnie trzyma Cię w skupieniu. W MasterZone freelancerzy i soloprzedsiębiorcy codziennie pracują razem na żywo. Bez samotności, bez prokrastynacji, bez skakania po zadaniach.', 'textarea', 'Opis', 3),
('hero', 'ctaText', 'Dołącz do MasterZone', 'text', 'Tekst przycisku', 4),
('hero', 'trialInfo', '97 PLN/miesiąc • Bez umów • Anulujesz kiedy chcesz', 'text', 'Info pod przyciskiem', 5),
('hero', 'securityInfo', '🔒 Bezpieczne płatności – ten sam system co Netflix i Spotify', 'text', 'Info bezpieczeństwo', 6)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- STATS (10 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('stats', 'sectionTitle', 'Społeczność, Która Naprawdę Pracuje Razem', 'text', 'Tytuł sekcji', 1),
('stats', 'stat1_number', '39', 'text', 'Statystyka 1 — liczba', 2),
('stats', 'stat1_label', 'Freelancerów i Soloprzedsiębiorców', 'text', 'Statystyka 1 — opis', 3),
('stats', 'stat1_icon', '👥', 'emoji', 'Statystyka 1 — ikona', 4),
('stats', 'stat2_number', '2,400+', 'text', 'Statystyka 2 — liczba', 5),
('stats', 'stat2_label', 'Godzin Wspólnej Pracy Rocznie', 'text', 'Statystyka 2 — opis', 6),
('stats', 'stat2_icon', '⏱️', 'emoji', 'Statystyka 2 — ikona', 7),
('stats', 'stat3_number', '92%', 'text', 'Statystyka 3 — liczba', 8),
('stats', 'stat3_label', 'Członków Zostaje Dłużej Niż 3 Miesiące', 'text', 'Statystyka 3 — opis', 9),
('stats', 'stat3_icon', '🔄', 'emoji', 'Statystyka 3 — ikona', 10),
('stats', 'stat4_number', '97 PLN', 'text', 'Statystyka 4 — liczba', 11),
('stats', 'stat4_label', 'Miesięcznie — Mniej Niż Coworking', 'text', 'Statystyka 4 — opis', 12),
('stats', 'stat4_icon', '💰', 'emoji', 'Statystyka 4 — ikona', 13),
('stats', 'footer', 'To nie kolejna grupa na Facebooku. To ludzie, którzy codziennie włączają kamerę i pracują razem.', 'textarea', 'Tekst pod statystykami', 14)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- PAIN (7 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('pain', 'sectionTitle', 'WIEMY CO CIĘ BLOKUJE', 'text', 'Tytuł sekcji', 1),
('pain', 'headline', 'Nie brakuje Ci ambicji. Brakuje Ci ludzi obok.', 'text', 'Nagłówek', 2),
('pain', 'subheadline', 'Pracujesz z domu. Sam. I to właśnie jest problem.', 'text', 'Podtytuł', 3),
('pain', 'description', E'Wstajesz z planem na cały dzień. O 17:00 patrzysz — i znowu nic nie zrobiłeś.\n\nNie dlatego, że jesteś leniwy. Dlatego, że pracujesz w pustym mieszkaniu, gdzie nikt nie widzi, czy pracujesz, czy scrollujesz.\n\nOtwierasz laptopa i zamiast najważniejszego zadania — sprawdzasz maile. Potem Slacka. Potem „jeszcze tylko jedno" na YouTube.\n\nA te naprawdę ważne rzeczy? Przesuwasz na jutro. Znowu.\n\nI najgorsze? Nikt tego nie widzi. Nikt nie pyta „hej, jak Ci idzie?". Nikt nie siedzi obok.\n\nBo pracujesz sam. I ta samotność zabija Twoją produktywność.', 'textarea', 'Opis problemu', 4),
('pain', 'painItems', E'Odkładasz najtrudniejsze zadania na ''po obiedzie'' — ale po obiedzie przychodzi kolejne ''jutro''\nSkaczesz między 5 zadaniami naraz i żadnego nie kończysz do końca\nCałymi dniami nie rozmawiasz z nikim o pracy — bo kto ma to zrozumieć?\nPróbowałeś Pomodoro, aplikacji, blokowania stron — nic nie działa na dłużej\nCzujesz, że mógłbyś robić 2x więcej — ale coś Cię ciągle hamuje\nWeekend zaczyna się z poczuciem winy, bo znowu nie dowieźliście tego, co planowaliście', 'textarea', 'Lista problemów (każdy w nowej linii)', 5),
('pain', 'mainHeadline', 'To nie Twoja wina. To brak środowiska.', 'text', 'Nagłówek rozwiązania', 6),
('pain', 'mainContent', E'Badania pokazują: **82% osób pracujących zdalnie czuje izolację**, a **78% doświadcza wypalenia**. To nie kwestia dyscypliny — to kwestia biologii.\n\nTwój mózg potrzebuje **obecności innych ludzi**, żeby się skupić. To zjawisko nazywa się **body doubling** — i działa nawet przez kamerę.\n\nDlatego w kawiarni pracujesz lepiej niż w domu. Nie magia — nauka.\n\n**MasterZone** daje Ci to codziennie — bez wychodzenia z domu:\n\n• koniec prokrastynacji — pracujesz z ludźmi, nie sam,\n• koniec samotności — otaczasz się przedsiębiorcami, którzy rozumieją,\n• koniec chaosu — planujesz tydzień raz, z jasnością.', 'textarea', 'Treść rozwiązania', 7)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- BENEFITS (9 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('benefits', 'sectionTitle', 'Dlaczego MasterZone Działa', 'text', 'Tytuł sekcji', 1),
('benefits', 'sectionSubtitle', 'Body doubling + społeczność + struktura = koniec prokrastynacji', 'text', 'Podtytuł sekcji', 2),
('benefits', 'benefit1_title', 'Body doubling — pracujesz z innymi, skupiasz się naturalnie', 'text', 'Korzyść 1 — tytuł', 3),
('benefits', 'benefit1_description', 'W kawiarni pracujesz lepiej niż w domu? To body doubling — mechanizm, w którym obecność innych reguluje Twoją uwagę. W MasterZone masz to codziennie, na żywo, przez kamerę. Bez dojazdu, bez kawy za 18 zł.', 'textarea', 'Korzyść 1 — opis', 4),
('benefits', 'benefit2_title', 'Koniec samotności pracy z domu', 'text', 'Korzyść 2 — tytuł', 5),
('benefits', 'benefit2_description', 'Nie musisz już pracować sam w pustym mieszkaniu. Codziennie spotykasz freelancerów i przedsiębiorców, którzy wiedzą, jak to jest — bo sami tak pracują. To nie networking. To ludzie, z którymi po prostu pracujesz.', 'textarea', 'Korzyść 2 — opis', 6),
('benefits', 'benefit3_title', 'Planowanie, które faktycznie działa', 'text', 'Korzyść 3 — tytuł', 7),
('benefits', 'benefit3_description', E'Raz w tygodniu planujesz z grupą. Mówisz na głos, co chcesz zrobić. A potem ktoś pyta: ''I jak, zrobiłeś?''. Ta odpowiedzialność zmienia wszystko — bo nie chcesz powiedzieć ''nie''.', 'textarea', 'Korzyść 3 — opis', 8),
('benefits', 'benefit4_title', 'Nie potrzebujesz więcej dyscypliny', 'text', 'Korzyść 4 — tytuł', 9),
('benefits', 'benefit4_description', 'Przestań się zmuszać. MasterZone to środowisko, które robi robotę za Ciebie — logujesz się, widzisz ludzi, pracujesz. Nie musisz się motywować. Wystarczy się pojawić.', 'textarea', 'Korzyść 4 — opis', 10)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- HOWITWORKS (11 fields - title + subtitle + 9 steps)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('howitworks', 'sectionTitle', 'Jak Działa MasterZone', 'text', 'Tytuł sekcji', 1),
('howitworks', 'subtitle', 'Trzy filary, które kończą prokrastynację: body doubling + planowanie + społeczność. Nie musisz się zmuszać — wystarczy się pojawić.', 'textarea', 'Podtytuł', 2),
('howitworks', 'step1_title', 'Codzienne bloki pracy — body doubling na żywo', 'text', 'Krok 1 — tytuł', 3),
('howitworks', 'step1_description', 'Od poniedziałku do piątku — 3-4 bloki skupionej pracy na żywo. Włączasz kamerę, widzisz innych przy pracy, Twój mózg mówi: ''ok, pracujemy''. To body doubling — ten sam mechanizm, który sprawia, że w kawiarni pracujesz lepiej niż sam w domu. 90 minut, w których robisz więcej niż normalnie w pół dnia.', 'textarea', 'Krok 1 — opis', 4),
('howitworks', 'step2_title', 'Wspólne planowanie tygodnia', 'text', 'Krok 2 — tytuł', 5),
('howitworks', 'step2_description', E'Raz w tygodniu planujesz z grupą. Mówisz na głos co zrobisz. A za tydzień ktoś pyta: ''I jak, dowieźliście?''. Koniec z chaotycznymi poniedziałkami, koniec z planami tylko w głowie. Weekend masz naprawdę wolny.', 'textarea', 'Krok 2 — opis', 6),
('howitworks', 'step3_title', 'Społeczność, która rozumie Twoją codzienność', 'text', 'Krok 3 — tytuł', 7),
('howitworks', 'step3_description', E'Freelancerzy, soloprzedsiębiorcy, właściciele małych firm. Ludzie, którzy wiedzą jak to jest pracować sam — bo sami tak pracowali. Tu nie musisz tłumaczyć czemu ''praca z domu'' to nie ''wolne''. Tu każdy to rozumie.', 'textarea', 'Krok 3 — opis', 8),
('howitworks', 'closingText', 'W MasterZone nie musisz się zmuszać do pracy. Wystarczy się pojawić — resztę robi środowisko.', 'textarea', 'Tekst zamykający', 9),
('howitworks', 'infrastructure', 'Wszystko w jednym miejscu — na platformie Skool. Kalendarz, społeczność, kursy, nagrania. Logujesz się raz — i masz wszystko pod ręką.', 'textarea', 'Info o infrastrukturze', 10)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- TESTIMONIALS (16 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('testimonials', 'sectionTitle', 'Co Mówią Członkowie MasterZone', 'text', 'Tytuł sekcji', 1),
('testimonials', 't1_name', 'Iza', 'text', 'Opinia 1 — imię', 2),
('testimonials', 't1_role', 'Wirtualna Asystentka', 'text', 'Opinia 1 — rola', 3),
('testimonials', 't1_content', 'Zamiast toczyć poranną walkę z budzikiem, dzięki Blokom Pracy Głębokiej o 7:56 zbieram się do pracy w ekspresowym tempie. Już o 8:00 działam, a o 8:55 świętuje pierwsze sukcesy! To jak poranny zastrzyk energii, który działa lepiej niż kawa – wsiadasz do pociągu produktywności i omijasz stacje prokrastynacji.', 'textarea', 'Opinia 1 — treść', 4),
('testimonials', 't2_name', 'Mikołaj Olejnik', 'text', 'Opinia 2 — imię', 5),
('testimonials', 't2_role', 'Członek MasterZone', 'text', 'Opinia 2 — rola', 6),
('testimonials', 't2_content', 'Ja lubię tę godzinę bo czas leci mi bardzo szybko i też pracuję szybko i sprawnie. I fajna jest też ta świadomość że inni pracują co bywa motywujące przy pracy zdalnej.', 'textarea', 'Opinia 2 — treść', 7),
('testimonials', 't3_name', 'Patrycja', 'text', 'Opinia 3 — imię', 8),
('testimonials', 't3_role', 'Członek MasterZone', 'text', 'Opinia 3 — rola', 9),
('testimonials', 't3_content', E'Odnośnie pracy głębokiej: myślę, że warto spróbować, bo sam fakt, że jesteś ''na wizji'' mobilizuje, jak również dzielenie się później z uczestnikami, czy udało się zrealizować założony cel. Dodatkowo na mnie osobiście dobrze wpływa świadomość, że to tylko godzina, więc trzeba być szybkim i wydajnym.', 'textarea', 'Opinia 3 — treść', 10),
('testimonials', 't4_name', 'Patryk Tokarz', 'text', 'Opinia 4 — imię', 11),
('testimonials', 't4_role', 'Aplikacja', 'text', 'Opinia 4 — rola', 12),
('testimonials', 't4_content', 'Mega sesja pracy głębokiej z Radkiem! Wziąłem udział w sesji i muszę przyznać – to była petarda! Dzięki temu, że inni patrzyli mi na ręce, maksymalnie się skupiłem i zrobiłem dużo więcej w krótszym czasie. Blok czasowy wymusił pełne skupienie, a wymiana spostrzeżeń na koniec dodała jeszcze więcej wartości.', 'textarea', 'Opinia 4 — treść', 13),
('testimonials', 't5_name', 'Uczestnik bloków', 'text', 'Opinia 5 — imię', 14),
('testimonials', 't5_role', 'Członek MasterZone', 'text', 'Opinia 5 — rola', 15),
('testimonials', 't5_content', E'Tak naprawdę, dla mnie, te bloki Radka to połączenie przyjemnego z pożytecznym. W ciągu godziny jest miejsce na chwilę rozmowy, zobaczenie znajomych (lub nie) ''pysków'' i zrobienie czegoś dla siebie ważnego. Każdy we własnym zakresie. Więc śmiało, można wbijać - przetestowałem, jest bezpiecznie, jest w porządku i jest efektywnie!', 'textarea', 'Opinia 5 — treść', 16)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- TRANSFORMATION (8 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('transformation', 'headline', 'Jak Wygląda Zmiana w MasterZone', 'text', 'Nagłówek', 1),
('transformation', 'subtitle', 'Nie uczymy Cię produktywności z książek. Dajemy Ci środowisko, w którym produktywność przychodzi sama — bo pracujesz z ludźmi, nie sam.', 'textarea', 'Podtytuł', 2),
('transformation', 'step1', 'Dołączasz i dostajesz onboarding 1:1 — od razu wiesz jak wszystko działa. Żadnego chaosu na start.', 'textarea', 'Krok 1', 3),
('transformation', 'step2', 'Włączasz się na pierwszy blok pracy. Widzisz ludzi przy komputerach. Twój mózg mówi: ''ok, pracujemy''. Body doubling w akcji.', 'textarea', 'Krok 2', 4),
('transformation', 'step3', E'W piątek planujesz tydzień z grupą. Mówisz na głos co chcesz zrobić. Nagle masz plan — i ludzi, którzy zapytają czy go dowieźliście.', 'textarea', 'Krok 3', 5),
('transformation', 'step4', 'Po tygodniu zauważasz: kończysz zadania, nie odkładasz na jutro, weekendy są wolne od poczucia winy.', 'textarea', 'Krok 4', 6),
('transformation', 'step5', 'Po miesiącu to Twój nowy tryb pracy. Nie wyobrażasz sobie wrócić do samotnego siedzenia w domu bez nikogo.', 'textarea', 'Krok 5', 7),
('transformation', 'closingText', 'To nie magia. To body doubling + społeczność + struktura. Trzy rzeczy, których Twój mózg potrzebuje, żeby się skupić — i których nie dostajesz pracując sam.', 'textarea', 'Tekst zamykający', 8)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- PRICING (5 fields - core editable)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('pricing', 'sectionTitle', 'Prosty, Przejrzysty Cennik', 'text', 'Tytuł sekcji', 1),
('pricing', 'sectionSubtitle', 'Wszystko w jednej cenie — bez ukrytych kosztów, bez umów', 'text', 'Podtytuł', 2),
('pricing', 'price', '97 PLN', 'text', 'Cena', 3),
('pricing', 'planName', 'MasterZone Community', 'text', 'Nazwa planu', 4),
('pricing', 'guarantee', '97 PLN/miesiąc. Bez umów. Anulujesz kiedy chcesz. 30-dniowa gwarancja zwrotu — jeśli nie zrobisz więcej w 90 min, oddajemy pieniądze.', 'textarea', 'Gwarancja', 5)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- FAQ (17 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('faq', 'sectionTitle', 'Najczęściej Zadawane Pytania', 'text', 'Tytuł sekcji', 1),
('faq', 'q1', '97 PLN/miesiąc — czy to nie za dużo?', 'text', 'Pytanie 1', 2),
('faq', 'a1', 'To mniej niż 5 kaw w kawiarni, gdzie idziesz żeby ''mieć ludzi obok''. Albo mniej niż 1 godzina z coachem produktywności. W MasterZone dostajesz codzienne wsparcie, 20+ bloków pracy na żywo i społeczność. Większość członków mówi, że to najlepsza inwestycja w ich produktywność.', 'textarea', 'Odpowiedź 1', 3),
('faq', 'q2', 'Próbowałem już wszystkiego — Pomodoro, aplikacje, kursy. Nic nie działa.', 'text', 'Pytanie 2', 4),
('faq', 'a2', E'Bo te narzędzia wymagają od Ciebie dyscypliny, której brakuje. MasterZone działa inaczej — bazuje na body doubling, czyli obecności innych ludzi. Nie musisz się zmuszać. Logujesz się, widzisz ludzi przy pracy, i Twój mózg automatycznie przełącza się w tryb skupienia. To biologia, nie silna wola.', 'textarea', 'Odpowiedź 2', 5),
('faq', 'q3', 'Nie chcę włączać kamery. Czy muszę?', 'text', 'Pytanie 3', 6),
('faq', 'a3', E'Kamera jest rekomendowana — bo właśnie to ''bycie widzianym'' uruchamia efekt body doubling. Ale nie musisz mówić, prezentować się ani wyglądać idealnie. Większość osób pracuje w dresie z kubkiem kawy. Chodzi o obecność, nie o występ.', 'textarea', 'Odpowiedź 3', 7),
('faq', 'q4', 'Jak często odbywają się bloki pracy?', 'text', 'Pytanie 4', 8),
('faq', 'a4', 'Bloki odbywają się codziennie od poniedziałku do piątku, 3-4 razy dziennie o stałych godzinach. Wybierasz te, które pasują do Twojego harmonogramu. Nie musisz być na wszystkich — dołączasz wtedy, gdy potrzebujesz.', 'textarea', 'Odpowiedź 4', 9),
('faq', 'q5', 'Mam ADHD / cechy ADHD — czy to dla mnie?', 'text', 'Pytanie 5', 10),
('faq', 'a5', E'Zdecydowanie tak. Body doubling to jedna z najbardziej polecanych technik przez terapeutów ADHD. Obecność innych ludzi pomaga Twojemu mózgowi w regulacji uwagi. Wielu naszych członków ma ADHD i mówi, że MasterZone to jedyna metoda, która działa na dłużej niż tydzień.', 'textarea', 'Odpowiedź 5', 11),
('faq', 'q6', 'Co jeśli nie mam czasu na kolejny program?', 'text', 'Pytanie 6', 12),
('faq', 'a6', 'MasterZone nie dodaje pracy — odejmuje chaos. Zamiast walczyć z prokrastynacją sam, dostajesz środowisko, które trzyma Cię w skupieniu. Większość członków mówi, że w 90 minut na bloku robią więcej niż normalnie w 4 godziny.', 'textarea', 'Odpowiedź 6', 13),
('faq', 'q7', 'Czy mogę zrezygnować w każdej chwili?', 'text', 'Pytanie 7', 14),
('faq', 'a7', 'Tak. Bez umów, bez okresu wypowiedzenia. Anulujesz kiedy chcesz. Ale 92% członków zostaje — bo wreszcie mają środowisko, w którym produktywność przychodzi naturalnie.', 'textarea', 'Odpowiedź 7', 15),
('faq', 'q8', 'Jak wygląda pierwszy tydzień?', 'text', 'Pytanie 8', 16),
('faq', 'a8', E'Po dołączeniu dostajesz onboarding 1:1. Następnie dołączasz do pierwszego bloku pracy i sesji planowania. Większość osób mówi, że różnicę czują już pierwszego dnia — bo sam fakt, że ktoś obok pracuje, zmienia wszystko.', 'textarea', 'Odpowiedź 8', 17)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- CTA (4 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('cta', 'headline', 'Ile jeszcze poniedziałków zaczniesz bez planu?', 'text', 'Nagłówek', 1),
('cta', 'subheadline', 'Dołącz do MasterZone i zacznij pracować w skupieniu — z ludźmi, którzy rozumieją Twoją codzienność.', 'textarea', 'Podtytuł', 2),
('cta', 'buttonText', 'Dołącz do MasterZone', 'text', 'Tekst przycisku', 3),
('cta', 'buttonUrl', 'https://www.skool.com/masterzone', 'url', 'Link przycisku', 4)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- JOINSECTION (7 fields)
INSERT INTO site_content (section, field_key, field_value, field_type, field_label, field_order) VALUES
('joinsection', 'headline', 'Dołącz do MasterZone i przestań pracować sam', 'text', 'Nagłówek', 1),
('joinsection', 'subtitle', 'Codziennie pracujesz z ludźmi, którzy rozumieją Twoją codzienność. Planujesz raz w tygodniu z jasnością. I wreszcie kończysz to, co zaczynasz — bez zmuszania się.', 'textarea', 'Podtytuł', 2),
('joinsection', 'block1_title', 'Body doubling — Twoje wirtualne biuro', 'text', 'Blok 1 — tytuł', 3),
('joinsection', 'block1_description', 'Zamiast pustego mieszkania — codziennie pracujesz z innymi na żywo. Kamera włączona, muzyka w tle, każdy robi swoje. Twój mózg przełącza się w tryb skupienia automatycznie — bo widzi, że inni pracują.', 'textarea', 'Blok 1 — opis', 4),
('joinsection', 'block2_title', '97 PLN/miesiąc — bez umów, pełna kontrola', 'text', 'Blok 2 — tytuł', 5),
('joinsection', 'block2_description', 'Nie ma haczyków ani umów. Zostajesz tak długo, jak to działa. Anulujesz kiedy chcesz. To mniej niż coworking, a dostajesz codzienne wsparcie, planowanie i społeczność.', 'textarea', 'Blok 2 — opis', 6),
('joinsection', 'contrastText', E'Jutro możesz znów siedzieć sam, scrollować telefon i obiecywać sobie że ''od poniedziałku się ogarnę''. Albo możesz dołączyć do ludzi, którzy już to zrobili.', 'textarea', 'Tekst kontrastowy', 7)
ON CONFLICT (section, field_key) DO UPDATE SET field_value = EXCLUDED.field_value;

-- Done! Check count:
-- SELECT section, count(*) FROM site_content GROUP BY section ORDER BY section;
