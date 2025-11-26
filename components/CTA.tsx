"use client";

import { useEmailGate } from "@/hooks/useEmailGate";
import EmailGateModal from "./EmailGateModal";

interface CTAProps {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonUrl: string;
}

export default function CTA({ headline, subheadline, buttonText, buttonUrl }: CTAProps) {
  const { isEmailGateOpen, openEmailGate, closeEmailGate, handleEmailSuccess } = useEmailGate();

  return (
    <>
      <EmailGateModal
        isOpen={isEmailGateOpen}
        onClose={closeEmailGate}
        onSuccess={handleEmailSuccess}
      />
      <section className="section-padding bg-gradient-to-r from-navy to-blue-700 text-white">
      <div className="container-custom text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {headline}
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-blue-100">
          {subheadline}
        </p>
        <button
          onClick={() => openEmailGate("cta_bottom_button")}
          id="skool-cta"
          className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300 cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </section>
    </>
  );
}
