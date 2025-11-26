"use client";

import Script from "next/script";
import { useEmailGate } from "@/hooks/useEmailGate";
import EmailGateModal from "./EmailGateModal";

interface VideoProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  mediaId: string;
  aspectRatio?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export default function Video({
  sectionTitle,
  sectionSubtitle,
  mediaId,
  aspectRatio = "1.6",
  ctaText,
  ctaUrl
}: VideoProps) {
  const { isEmailGateOpen, openEmailGate, closeEmailGate, handleEmailSuccess } = useEmailGate(ctaUrl);

  return (
    <>
      <EmailGateModal
        isOpen={isEmailGateOpen}
        onClose={closeEmailGate}
        onSuccess={handleEmailSuccess}
      />
      <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        {sectionTitle && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Video Container */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Script
              src="https://fast.wistia.com/player.js"
              strategy="afterInteractive"
            />
            <Script
              src={`https://fast.wistia.com/embed/${mediaId}.js`}
              strategy="afterInteractive"
              type="module"
            />
            <div dangerouslySetInnerHTML={{
              __html: `
                <style>
                  wistia-player[media-id='${mediaId}']:not(:defined) {
                    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');
                    display: block;
                    filter: blur(5px);
                    padding-top: ${(100 / parseFloat(aspectRatio)).toFixed(2)}%;
                  }
                </style>
                <wistia-player media-id="${mediaId}" aspect="${aspectRatio}"></wistia-player>
              `
            }} />
          </div>

          {/* CTA Button under video */}
          {ctaText && (
            <div className="text-center mt-8">
              <button
                onClick={() => openEmailGate("video_cta_button")}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
              >
                {ctaText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
