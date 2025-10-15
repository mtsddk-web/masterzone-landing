"use client";

import Script from "next/script";

interface VideoProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  mediaId: string;
  aspectRatio?: string;
}

export default function Video({
  sectionTitle,
  sectionSubtitle,
  mediaId,
  aspectRatio = "1.6"
}: VideoProps) {
  return (
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
        </div>
      </div>
    </section>
  );
}
