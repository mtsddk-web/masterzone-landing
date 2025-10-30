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
        {/* Preheadline - wyróżniony tekst nad nagłówkiem */}
        {preheadline && (
          <div className="inline-block mb-2 md:mb-6 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400 rounded-full px-4 py-1 md:px-8 md:py-3 text-xs md:text-base lg:text-lg font-bold text-yellow-300">
            {preheadline}
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold mb-0 md:mb-6 leading-none md:leading-tight">
          {headline}
        </h1>

        {/* Video Player - ZARAZ POD H1 */}
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
            <div className="max-w-4xl mx-auto mb-2 md:mb-8 px-0 md:px-4">
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

        {/* Description - PO VIDEO */}
        {description && (
          <p className="text-sm md:text-lg lg:text-xl mb-3 md:mb-8 max-w-4xl mx-auto text-white/80 px-4 leading-snug">
            {description}
          </p>
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
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-2 px-6 md:py-4 md:px-12 rounded-lg transition-all duration-300 text-sm md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
