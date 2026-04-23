import Link from "next/link";

export const metadata = {
  title: "Polityka prywatności | MasterZone",
  description: "Polityka prywatności MasterZone — zasady przetwarzania danych osobowych (RODO).",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
        <Link href="/" className="text-yellow-300 hover:text-yellow-200 text-sm mb-6 inline-block">
          ← Powrót do strony głównej
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Polityka prywatności</h1>
        <p className="text-white/60 text-sm mb-8">Ostatnia aktualizacja: 23 kwietnia 2026</p>

        <section className="space-y-6 text-white/90 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">1. Administrator danych</h2>
            <p>
              Administratorem Twoich danych osobowych jest <strong>Sundek Energia sp. z o.o.</strong> z siedzibą
              w Mikołowie (43-190), ul. Żwirki i Wigury 56, NIP: 6351863563, KRS: 0001000487.
            </p>
            <p className="mt-2">
              Kontakt w sprawach prywatności: <a href="mailto:kontakt@masterzone.edu.pl" className="text-yellow-300 underline">kontakt@masterzone.edu.pl</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">2. Jakie dane zbieramy</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Imię i adres e-mail — przy zapisie do trialu, newsletera lub zakupie</li>
              <li>Dane z formularzy kontaktowych — gdy piszesz do nas</li>
              <li>Dane płatnicze (obsługiwane wyłącznie przez Stripe/PayU — my ich nie przechowujemy)</li>
              <li>Dane techniczne — adres IP, typ przeglądarki, czas wizyty (w celach analitycznych)</li>
              <li>Identyfikatory reklamowe (piksel Meta/Facebook) — w celu dopasowania reklam</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">3. Cel i podstawa przetwarzania</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Realizacja umowy</strong> (art. 6 ust. 1 lit. b RODO) — dostarczenie dostępu do MasterZone</li>
              <li><strong>Zgoda</strong> (art. 6 ust. 1 lit. a RODO) — newsletter, marketing, ciasteczka analityczne</li>
              <li><strong>Prawnie uzasadniony interes</strong> (art. 6 ust. 1 lit. f RODO) — obsługa zapytań, bezpieczeństwo, analityka</li>
              <li><strong>Obowiązek prawny</strong> (art. 6 ust. 1 lit. c RODO) — księgowość, podatki</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">4. Odbiorcy danych</h2>
            <p>Dane przekazujemy wyłącznie zaufanym dostawcom usług:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Stripe, PayU — obsługa płatności</li>
              <li>Skool — dostarczenie społeczności</li>
              <li>Meta (Facebook) — reklamy i piksel konwersji</li>
              <li>Microsoft Clarity, Vercel Analytics — analityka strony</li>
              <li>Sender.net / MailerLite — wysyłka e-maili</li>
              <li>Biuro rachunkowe — rozliczenia księgowe</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">5. Okres przechowywania</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Dane subskrybentów — do czasu wycofania zgody</li>
              <li>Dane klientów (zakupy) — 5 lat od końca roku podatkowego (obowiązek księgowy)</li>
              <li>Logi techniczne — do 12 miesięcy</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">6. Twoje prawa</h2>
            <p>Zgodnie z RODO masz prawo do:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>dostępu do swoich danych i otrzymania ich kopii</li>
              <li>sprostowania nieprawidłowych danych</li>
              <li>usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;)</li>
              <li>ograniczenia przetwarzania</li>
              <li>przenoszenia danych</li>
              <li>sprzeciwu wobec przetwarzania</li>
              <li>wycofania zgody w dowolnym momencie</li>
              <li>wniesienia skargi do Prezesa UODO (uodo.gov.pl)</li>
            </ul>
            <p className="mt-2">
              Aby skorzystać z tych praw, napisz na: <a href="mailto:kontakt@masterzone.edu.pl" className="text-yellow-300 underline">kontakt@masterzone.edu.pl</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">7. Pliki cookies</h2>
            <p>
              Używamy ciasteczek niezbędnych do działania serwisu oraz ciasteczek analitycznych i marketingowych
              (Meta Pixel, Microsoft Clarity). Możesz wyłączyć je w ustawieniach przeglądarki.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-yellow-300">8. Zmiany polityki</h2>
            <p>
              Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. Istotne zmiany ogłosimy na tej stronie
              oraz poinformujemy subskrybentów e-mailowo.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-white/10 text-white/60 text-sm">
          <p>Sundek Energia sp. z o.o. | NIP: 6351863563 | KRS: 0001000487</p>
          <p>ul. Żwirki i Wigury 56, 43-190 Mikołów</p>
        </div>
      </div>
    </main>
  );
}
