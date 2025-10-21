"use client";

import { trackEvent } from "./FacebookPixel";
import { appendUTM } from "@/lib/utmUtils";

interface HeroProps {
  preheadline?: string;
  headline: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
}

export default function Hero({
  preheadline,
  headline,
  description,
  ctaText,
  ctaUrl
}: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white section-padding min-h-screen flex items-center">
      <div className="container-custom text-center">
        {/* Preheadline - wyróżniony tekst nad nagłówkiem */}
        {preheadline && (
          <div className="inline-block mb-6 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-8 py-3 text-base md:text-lg font-bold text-yellow-300">
            {preheadline}
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-white/80">
            {description}
          </p>
        )}

        {/* CTA Button */}
        <div className="mb-8">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="skool-cta"
            onClick={(e) => {
              trackEvent("Lead", { source: "hero_primary_button" });
              appendUTM(e);
            }}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {ctaText}
          </a>
        </div>

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
