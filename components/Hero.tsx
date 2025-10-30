"use client";

import Script from "next/script";
import { trackEvent } from "./FacebookPixel";
import { appendUTM } from "@/lib/utmUtils";

interface HeroProps {
  preheadline?: string;
  headline: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  videoMediaId?: string;
  videoAspectRatio?: string;
}

export default function Hero({
  preheadline,
  headline,
  description,
  ctaText,
  ctaUrl,
  videoMediaId,
  videoAspectRatio = "1.6"
}: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white py-4 md:py-16 lg:py-20 flex items-center relative">
      {/* Logo - lewy górny róg (tylko desktop) */}
      <div className="hidden md:block absolute top-6 left-6 z-10">
        <img
          src="/images/logo-masterzone.png"
          alt="MasterZone Logo"
          className="w-16 h-16 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="container-custom text-center">
        {/* Preheadline - wyróżniony tekst nad nagłówkiem - UKRYTY NA MOBILE */}
        {preheadline && (
          <div className="hidden md:inline-block mb-6 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-8 py-3 text-base lg:text-lg font-bold text-yellow-300">
            {preheadline}
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          {headline}
        </h1>

        {/* Description - PO H1, PRZED VIDEO */}
        {description && (
          <>
            {/* Mobile - krótka wersja */}
            <p className="md:hidden text-sm mb-4 max-w-4xl mx-auto text-white/90 px-3 leading-snug">
              Nie potrzebujesz więcej dyscypliny — potrzebujesz środowiska, które trzyma Cię w skupieniu.
            </p>
            {/* Desktop - pełna wersja */}
            <p className="hidden md:block text-lg lg:text-xl mb-6 max-w-4xl mx-auto text-white/80 px-4 leading-snug">
              {description}
            </p>
          </>
        )}

        {/* Video Player - PO DESCRIPTION */}
        {videoMediaId && (
          <>
            <Script
              src="https://fast.wistia.com/player.js"
              strategy="afterInteractive"
            />
            <Script
              src={`https://fast.wistia.com/embed/${videoMediaId}.js`}
              strategy="afterInteractive"
              type="module"
            />
            <div className="max-w-4xl mx-auto mt-4 mb-4 md:mb-8 px-3 md:px-4">
              <div className="rounded-lg md:rounded-2xl overflow-hidden shadow-2xl">
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      wistia-player[media-id='${videoMediaId}']:not(:defined) {
                        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${videoMediaId}/swatch');
                        display: block;
                        filter: blur(5px);
                        padding-top: ${(100 / parseFloat(videoAspectRatio)).toFixed(2)}%;
                      }
                    </style>
                    <wistia-player media-id="${videoMediaId}" aspect="${videoAspectRatio}"></wistia-player>
                  `
                }} />
              </div>
            </div>
          </>
        )}

        {/* CTA Button - PO VIDEO */}
        <div className="mb-3 md:mb-8">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="skool-cta"
            onClick={(e) => {
              trackEvent("Lead", { source: "hero_primary_button" });
              appendUTM(e);
            }}
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-navy font-black py-3 px-8 md:py-4 md:px-12 rounded-xl transition-all duration-300 text-base md:text-xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 animate-pulse-slow"
          >
            👉 {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
