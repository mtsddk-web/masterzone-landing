"use client";

import { trackEvent } from "./FacebookPixel";

interface HeroProps {
  headline: string;
  subheadline: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  statsText: string;
  secondaryCta?: string;
}

export default function Hero({
  headline,
  subheadline,
  description,
  ctaText,
  ctaUrl,
  statsText,
  secondaryCta
}: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white section-padding min-h-screen flex items-center">
      <div className="container-custom text-center">
        {/* Stats Badge */}
        <div className="inline-block mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
          {statsText}
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-white/90">
          {subheadline}
        </p>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-white/80">
            {description}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Lead", { source: "hero_primary_button" })}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {ctaText}
          </a>

          {secondaryCta && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("Lead", { source: "hero_secondary_button" })}
              className="inline-block bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-12 rounded-lg border-2 border-white/30 transition-all duration-300 text-lg"
            >
              {secondaryCta}
            </a>
          )}
        </div>

        {/* Trust Badge */}
        <p className="text-sm text-white/70">
          🔒 Dołącz za jedyne 9$ miesięcznie. Anuluj w każdej chwili.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
