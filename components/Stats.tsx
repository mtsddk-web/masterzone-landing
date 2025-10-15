"use client";

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface StatsProps {
  sectionTitle: string;
  stats: Stat[];
  highlights: string[];
  footer?: string;
  note?: string;
}

export default function Stats({
  sectionTitle,
  stats,
  highlights,
  footer,
  note
}: StatsProps) {
  return (
    <section className="section-padding bg-gradient-to-br from-navy via-blue-900 to-blue-950 text-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {sectionTitle}
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-300">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-white/90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="max-w-3xl mx-auto mb-8">
          <ul className="space-y-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">•</span>
                <span className="text-lg text-white/90">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        {footer && (
          <p className="text-center text-lg md:text-xl font-medium text-white/95 mb-4">
            {footer}
          </p>
        )}

        {/* Note */}
        {note && (
          <p className="text-center text-sm text-white/70 border-t border-white/20 pt-6 max-w-4xl mx-auto">
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
