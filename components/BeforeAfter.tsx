interface BeforeAfterRow {
  before: string;
  after: string;
}

interface BeforeAfterProps {
  sectionTitle?: string;
  subtitle?: string;
  rows?: BeforeAfterRow[];
}

const DEFAULT_ROWS: BeforeAfterRow[] = [
  {
    before: "Niedzielny wieczór = lęk przed poniedziałkiem",
    after: "Niedziela spokojna, bo tydzień masz rozpisany",
  },
  {
    before: "Projekty wiszą miesiącami",
    after: "Skończone i wysłane do klienta",
  },
  {
    before: "Praca wylewa się na wieczory i weekendy",
    after: "Wieczory i weekend realnie wolne, bez poczucia winy",
  },
  {
    before: "Dużo ruchu, mało skończonego",
    after: "Skończona robota = wysłana faktura = biznes idzie do przodu",
  },
  {
    before: "„Ogarnę się od poniedziałku”",
    after: "„Robię dziś to, co zaplanowałem”",
  },
  {
    before: "Sam, nikt nie rozumie Twojego trybu",
    after: "Ludzie, którzy mają tak samo, pracują obok Ciebie",
  },
];

export default function BeforeAfter({
  sectionTitle = "Co realnie się zmienia, gdy przestajesz pracować sam",
  subtitle = "Nie chodzi o to, żeby „być produktywnym”. Chodzi o to, co z tego masz.",
  rows = DEFAULT_ROWS,
}: BeforeAfterProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>

        {/* Naglowki kolumn - tylko na wiekszych ekranach */}
        <div className="hidden md:grid grid-cols-2 gap-6 mb-4">
          <div className="text-center font-bold text-gray-500 uppercase tracking-wide text-sm">
            Dziś, sam
          </div>
          <div className="text-center font-bold text-green-700 uppercase tracking-wide text-sm">
            W MasterZone
          </div>
        </div>

        {/* Wiersze przedtem -> potem */}
        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-5">
                <span className="text-gray-400 text-xl leading-none mt-0.5">✕</span>
                <p className="text-gray-600">{row.before}</p>
              </div>
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 md:p-5">
                <span className="text-green-600 text-xl leading-none mt-0.5">✓</span>
                <p className="text-gray-800 font-medium">{row.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
