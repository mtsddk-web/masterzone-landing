"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useCheckout } from "@/hooks/useCheckout";

interface HeroProps {
  preheadline?: string;
  headline: string;
  description?: string;
  descriptionShort?: string;
  ctaText: string;
  ctaUrl: string;
  videoMediaId?: string;
  videoAspectRatio?: string;
  videoFallbackImage?: string;
  trialInfo?: string;
  securityInfo?: string;
  skoolInfo?: string;
}

export default function Hero({
  preheadline,
  headline,
  description,
  descriptionShort,
  ctaText,
  ctaUrl,
  videoMediaId,
  videoAspectRatio = "1.6",
  videoFallbackImage = "/images/hero-fallback.jpg",
  trialInfo,
  securityInfo,
  skoolInfo
}: HeroProps) {
  const { goToCheckout } = useCheckout();
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!videoMediaId || !videoLoaded) return;

    const checkVideo = () => {
      const player = document.querySelector(`wistia-player[media-id='${videoMediaId}']`);
      if (!player) {
        setVideoFailed(true);
        return;
      }
      const textContent = (player.textContent || "") + (player.shadowRoot?.textContent || "");
      if (textContent.includes("Media not found")) {
        setVideoFailed(true);
        return;
      }
      if (!player.shadowRoot?.querySelector("video")) {
        setVideoFailed(true);
      }
    };

    const timer1 = setTimeout(checkVideo, 3000);
    const timer2 = setTimeout(checkVideo, 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [videoMediaId, videoLoaded]);

  // Render headline with highlighted key numbers
  const renderHighlightedHeadline = () => {
    let text = headline;

    // Replace "4 godziny" with orange/red highlighted version
    text = text.replace(
      /4 godziny/gi,
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">4 godziny</span>'
    );

    // Replace "2x więcej" with green highlighted version
    text = text.replace(
      /2x więcej/gi,
      '<span class="text-green-400">2x więcej</span>'
    );

    return { __html: text };
  };

  return (
    <section className="bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white py-8 md:py-16 lg:py-20 flex items-center relative">
      {/* Logo - lewy górny róg (tylko desktop) */}
      <div className="hidden md:block absolute top-6 left-6 z-10">
        <img
          src="/images/logo-masterzone.png"
          alt="MasterZone Logo"
          className="w-16 h-16 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="container-custom text-center">
        {/* Preheadline - eyebrow/tagline (NIE button — usunieto border/rounded/pill styling) */}
        {preheadline && (
          <p className="mb-3 md:mb-6 text-sm md:text-base lg:text-lg font-medium text-yellow-300/90 uppercase tracking-wider">
            {preheadline}
          </p>
        )}

        {/* Main Headline */}
        <h1
          className="text-3xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-6 leading-tight"
          dangerouslySetInnerHTML={renderHighlightedHeadline()}
        />

        {/* Description — mobile: short (2 lines), desktop: full */}
        {descriptionShort && (
          <p className="md:hidden text-sm mb-4 max-w-2xl mx-auto text-white/80 px-4">
            {descriptionShort}
          </p>
        )}
        {description && (
          <p className={`${descriptionShort ? "hidden md:block" : ""} text-base md:text-lg lg:text-xl mb-4 md:mb-8 max-w-4xl mx-auto text-white/80 px-4`}>
            {description}
          </p>
        )}

        {/* Video Player with fallback */}
        {videoMediaId && (
          <div className="max-w-4xl mx-auto mb-4 md:mb-8 px-4">
            <div className="rounded-lg md:rounded-2xl overflow-hidden shadow-2xl">
              {videoFailed ? (
                /* Fallback placeholder when Wistia video is unavailable */
                <div
                  className="relative bg-gradient-to-br from-blue-800/80 to-indigo-900/80 backdrop-blur-sm"
                  style={{ paddingTop: `${(100 / parseFloat(videoAspectRatio)).toFixed(2)}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-5xl md:text-6xl mb-4 opacity-80">🎯</div>
                      <p className="text-lg md:text-xl font-semibold text-white/90 mb-2">
                        Wspólna praca w skupieniu
                      </p>
                      <p className="text-sm md:text-base text-white/60">
                        4 bloki dziennie &middot; freelancerzy &middot; soloprzedsiębiorcy
                      </p>
                    </div>
                  </div>
                </div>
              ) : !videoLoaded ? (
                /* Poster + play button — Wistia scripts ladowane dopiero po kliknieciu */
                <button
                  type="button"
                  onClick={() => setVideoLoaded(true)}
                  aria-label="Odtworz wideo"
                  className="group relative block w-full cursor-pointer bg-black"
                  style={{ paddingTop: `${(100 / parseFloat(videoAspectRatio)).toFixed(2)}%` }}
                >
                  <img
                    src={`https://fast.wistia.com/embed/medias/${videoMediaId}/swatch`}
                    alt="Zobacz jak dzialaja bloki pracy gl\u0119bokiej"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 text-red-600 ml-1" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded font-semibold">
                    Zobacz jak to dziala
                  </div>
                </button>
              ) : (
                <>
                  <link rel="preconnect" href="https://fast.wistia.com" />
                  <Script
                    src="https://fast.wistia.com/player.js"
                    strategy="afterInteractive"
                  />
                  <Script
                    src={`https://fast.wistia.com/embed/${videoMediaId}.js`}
                    strategy="afterInteractive"
                    type="module"
                  />
                  <div dangerouslySetInnerHTML={{
                    __html: `
                      <style>
                        wistia-player[media-id='${videoMediaId}']:not(:defined) {
                          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${videoMediaId}/swatch');
                          display: block;
                          padding-top: ${(100 / parseFloat(videoAspectRatio)).toFixed(2)}%;
                        }
                      </style>
                      <wistia-player media-id="${videoMediaId}" aspect="${videoAspectRatio}" autoplay="true"></wistia-player>
                    `
                  }} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Trial Info */}
        {trialInfo && (
          <div className="mb-4 text-lg md:text-xl font-semibold text-yellow-300">
            {trialInfo}
          </div>
        )}

        {/* CTA Button - Goes to Checkout */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => goToCheckout("hero_primary_button")}
            id="skool-cta"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-lg transition-all duration-300 text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300 cursor-pointer"
          >
            {ctaText}
          </button>
        </div>

        {/* Security Info */}
        {securityInfo && (
          <div className="mb-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto">
            {securityInfo}
          </div>
        )}

        {/* Social Proof Micro-Testimonial - Above the Fold */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-left max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-yellow-400/40 shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 shadow-lg">
            👩‍💼
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-base md:text-lg">⭐</span>
              ))}
            </div>
            <p className="text-sm md:text-base text-white/95 italic leading-relaxed mb-2">
              "W ciągu godziny robię więcej niż zwykle w cały dzień. To jak poranny zastrzyk energii!"
            </p>
            <p className="text-xs md:text-sm text-yellow-300 font-semibold">— Iza, Wirtualna Asystentka</p>
          </div>
        </div>

        {/* Skool Info */}
        {skoolInfo && (
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-lg max-w-3xl mx-auto border border-white/20">
            <p className="text-sm md:text-base text-white/90">
              ℹ️ {skoolInfo}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
