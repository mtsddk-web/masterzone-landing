import Link from "next/link";

export const metadata = {
  title: "Ebook | MasterZone",
  description:
    "Darmowy ebook MasterZone - jak przestać prokrastynować w samotności i zacząć kończyć to, co zaczynasz.",
};

export default function EbookPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
        <Link href="/" className="text-yellow-300 hover:text-yellow-200 text-sm mb-6 inline-block">
          ← Powrót do strony głównej
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Ebook MasterZone</h1>
        <p className="text-white/60 text-sm mb-8">Wkrótce dostępny do pobrania</p>

        <section className="space-y-6 text-white/90 leading-relaxed">
          <p>
            To miejsce na ebooka MasterZone. Treść jest w przygotowaniu. Niedługo
            znajdziesz tu materiał o tym, jak przestać prokrastynować w samotności
            i codziennie kończyć to, co zaczynasz.
          </p>
          <p className="text-white/60">
            (Tekst przykładowy do podmiany na właściwą treść ebooka.)
          </p>
        </section>
      </div>
    </main>
  );
}
