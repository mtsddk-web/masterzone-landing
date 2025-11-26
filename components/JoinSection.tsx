"use client";

import { trackEvent } from "./FacebookPixel";

interface ContentBlock {
  icon: string;
  title: string;
  description: string;
}

interface JoinSectionProps {
  headline: string;
  subtitle: string;
  blocks: ContentBlock[];
  contrastText: string;
  ctaText: string;
  ctaUrl: string;
  guarantee?: string;
  stats?: string;
}

export default function JoinSection({
  headline,
  subtitle,
  blocks,
  contrastText,
  ctaText,
  ctaUrl,
  guarantee,
  stats
}: JoinSectionProps) {
  return (
    <section className="section-padding bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {headline}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{block.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
              <p className="text-blue-100 leading-relaxed">
                {block.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contrast Text */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <p className="text-2xl font-semibold text-yellow-300 leading-relaxed">
            {contrastText}
          </p>
        </div>

        {/* CTA - Direct to Skool */}
        <div className="text-center mb-8">
          <a
            href="https://www.skool.com/masterzone"
            onClick={() => {
              trackEvent("Lead", { source: "join_section_cta_button" });
            }}
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300"
          >
            {ctaText}
          </a>
        </div>

        {/* Guarantee & Stats */}
        {(guarantee || stats) && (
          <div className="text-center space-y-4">
            {guarantee && (
              <p className="text-sm text-blue-200">
                {guarantee}
              </p>
            )}
            {stats && (
              <p className="text-sm text-blue-200 font-semibold">
                {stats}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
