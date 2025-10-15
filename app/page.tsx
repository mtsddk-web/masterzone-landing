import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function Home() {
  // Te dane będą edytowalne przez Decap CMS
  const heroData = {
    headline: "Koniec z Rozproszeniem. Czas na Głęboką Pracę.",
    subheadline: "Dołącz do społeczności MasterZone i odzyskaj kontrolę nad swoim czasem, fokusem i produktywnością.",
    ctaText: "Dołącz Teraz",
    ctaUrl: "https://www.skool.com/masterzone",
    statsText: "✨ Ponad 100+ członków już działa!"
  };

  const benefitsData = {
    sectionTitle: "Co Zyskujesz w MasterZone?",
    sectionSubtitle: "Program kompleksowego wsparcia w walce z rozproszeniem",
    benefits: [
      {
        icon: "🎯",
        title: "Bloki Głębokiej Pracy",
        description: "Wspólne sesje skupienia z innymi członkami społeczności. Pracuj głęboko, bez rozpraszaczy, w towarzystwie zmotywowanych ludzi."
      },
      {
        icon: "📚",
        title: "Kursy i Zasoby",
        description: "Dostęp do sprawdzonych technik zarządzania czasem, fokusem i produktywnością. Od podstaw do zaawansowanych strategii."
      },
      {
        icon: "👥",
        title: "Społeczność",
        description: "Wsparcie grupy osób, które przechodzą tę samą transformację. Dziel się postępami, wyzwaniami i sukcesami."
      },
      {
        icon: "📅",
        title: "Wspólne Planowanie",
        description: "Cotygodniowe sesje planowania celów. Zaplanuj tydzień z innymi i trzymaj się planu dzięki accountability."
      },
      {
        icon: "🧠",
        title: "Narzędzia Fokusowania",
        description: "Sprawdzone techniki: Pomodoro, Deep Work, Cal Newport's principles. Wszystko w jednym miejscu."
      },
      {
        icon: "📈",
        title: "Śledzenie Postępów",
        description: "Monitoruj swoje postępy, buduj nawyki i obserwuj jak Twoja produktywność rośnie z tygodnia na tydzień."
      }
    ]
  };

  const pricingData = {
    sectionTitle: "Prosty, Przejrzysty Cennik",
    sectionSubtitle: "Jeden plan, wszystkie możliwości",
    price: "$9",
    priceDescription: "miesięcznie",
    features: [
      "Nieograniczony dostęp do wszystkich kursów",
      "Udział we wszystkich blokach głębokiej pracy",
      "Dostęp do społeczności 24/7",
      "Cotygodniowe sesje planowania",
      "Wszystkie narzędzia i zasoby",
      "Wsparcie community",
      "Anuluj w każdej chwili"
    ],
    ctaText: "Rozpocznij Teraz za $9/miesiąc",
    ctaUrl: "https://www.skool.com/masterzone",
    moneyBackText: "🔒 Bezpieczna płatność • Anuluj kiedy chcesz"
  };

  const testimonialsData = {
    sectionTitle: "Co Mówią Nasi Członkowie",
    testimonials: [
      {
        name: "Anna Kowalska",
        role: "Freelancer",
        content: "MasterZone całkowicie zmienił sposób, w jaki pracuję. Wreszcie jestem w stanie skupić się na jednej rzeczy przez dłuższy czas. Moja produktywność wzrosła o 300%!"
      },
      {
        name: "Piotr Nowak",
        role: "Student",
        content: "Bloki głębokiej pracy to game-changer. Uczę się razem z innymi, co motywuje mnie do działania. Nie mogę się doczekać każdej sesji!"
      },
      {
        name: "Kasia Wiśniewska",
        role: "Przedsiębiorca",
        content: "Społeczność MasterZone to najlepsza inwestycja w moją produktywność. Wsparcie i accountability od grupy ludzi o podobnych celach to bezcenne."
      }
    ]
  };

  const faqData = {
    sectionTitle: "Najczęściej Zadawane Pytania",
    faqs: [
      {
        question: "Czym jest MasterZone?",
        answer: "MasterZone to społeczność na platformie Skool, która pomaga ludziom odzyskać fokus i produktywność. Oferujemy wspólne bloki głębokiej pracy, kursy, narzędzia i wsparcie community."
      },
      {
        question: "Jak działają bloki głębokiej pracy?",
        answer: "Bloki głębokiej pracy to wspólne sesje, podczas których członkowie społeczności pracują razem nad swoimi zadaniami w skupieniu. Pracujemy w określonych odstępach czasu (np. 90 minut), bez rozpraszaczy, z krótkimi przerwami."
      },
      {
        question: "Czy mogę anulować w każdej chwili?",
        answer: "Tak! Członkostwo jest miesięczne i możesz je anulować w dowolnym momencie, bez żadnych zobowiązań."
      },
      {
        question: "Ile czasu muszę poświęcić?",
        answer: "To zależy od Ciebie! Możesz dołączać do bloków głębokiej pracy kiedy chcesz. Polecamy minimum 2-3 sesje tygodniowo, żeby zobaczyć realne rezultaty."
      },
      {
        question: "Czy to działa dla każdego?",
        answer: "MasterZone jest idealny dla osób pracujących zdalnie, freelancerów, studentów i przedsiębiorców, którzy zmagają się z rozproszeniem. Jeśli czujesz, że Twoja produktywność mogłaby być lepsza - to miejsce dla Ciebie!"
      },
      {
        question: "Co jeśli nie jestem zadowolony?",
        answer: "Jeśli MasterZone nie spełnia Twoich oczekiwań, po prostu anuluj subskrypcję. Bez żadnych zobowiązań czy ukrytych opłat."
      }
    ]
  };

  const ctaData = {
    headline: "Gotowy na Transformację?",
    subheadline: "Dołącz do MasterZone już dziś i zacznij pracować głęboko, skupiać się na tym co ważne i osiągać więcej w krótszym czasie.",
    buttonText: "Dołącz za $9/miesiąc",
    buttonUrl: "https://www.skool.com/masterzone"
  };

  return (
    <main>
      <Hero {...heroData} />
      <Benefits {...benefitsData} />
      <Testimonials {...testimonialsData} />
      <Pricing {...pricingData} />
      <FAQ {...faqData} />
      <CTA {...ctaData} />
    </main>
  );
}
