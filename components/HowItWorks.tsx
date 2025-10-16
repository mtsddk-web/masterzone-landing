"use client";

import { trackEvent } from "./FacebookPixel";

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  sectionTitle: string;
  subtitle: string;
  steps: Step[];
  closingText: string;
  infrastructure?: string;
}

export default function HowItWorks({
  sectionTitle,
  subtitle,
  steps,
  closingText,
  infrastructure
}: HowItWorksProps) {
  return (
    <section className="section-padding bg-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{step.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-4 text-navy">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Infrastructure Info */}
        {infrastructure && (
          <div className="bg-lightblue/20 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
            <p className="text-lg text-gray-800 leading-relaxed text-center">
              {infrastructure}
            </p>
          </div>
        )}

        {/* Closing Text */}
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-navy max-w-3xl mx-auto leading-relaxed">
            {closingText}
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.skool.com/masterzone"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Lead", { source: "how_it_works_cta_button" })}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Chcę pracować w pełnym skupieniu
          </a>
        </div>
      </div>
    </section>
  );
}
