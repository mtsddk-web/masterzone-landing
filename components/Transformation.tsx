"use client";

import { trackEvent } from "./FacebookPixel";

interface TransformationStep {
  number: string;
  description: string;
}

interface TransformationProps {
  headline: string;
  subtitle: string;
  steps: TransformationStep[];
  closingText: string;
  ctaText: string;
  ctaUrl: string;
}

export default function Transformation({
  headline,
  subtitle,
  steps,
  closingText,
  ctaText,
  ctaUrl
}: TransformationProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {headline}
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-6 bg-lightblue/10 rounded-xl hover:bg-lightblue/20 transition-all duration-300"
            >
              {/* Number */}
              <div className="flex-shrink-0 w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-xl">
                {step.number}
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed pt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Text */}
        <div className="bg-gradient-to-r from-navy/10 to-blue-700/10 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
          <p className="text-xl text-gray-800 leading-relaxed text-center font-semibold">
            {closingText}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Lead", { source: "transformation_cta_button" })}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
