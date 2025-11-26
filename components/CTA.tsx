"use client";

import { trackEvent } from "./FacebookPixel";

interface CTAProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonUrl: string;
}

export default function CTA({ headline, subheadline, buttonText, buttonUrl }: CTAProps) {
  return (
    <section className="section-padding bg-gradient-to-r from-navy to-blue-700 text-white">
      <div className="container-custom text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {headline}
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-blue-100">
          {subheadline}
        </p>
        <a
          href="https://www.skool.com/masterzone"
          id="skool-cta"
          onClick={() => {
            trackEvent("Lead", { source: "cta_bottom_button" });
          }}
          className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
