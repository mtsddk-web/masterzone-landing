"use client";

import { useCheckout } from "@/hooks/useCheckout";

interface AlternativeItem {
  name: string;
  description: string;
  value: string;
}

interface IncludedItem {
  name: string;
  description: string;
  included: boolean;
}

interface ValueStackProps {
  sectionTitle: string;
  sectionSubtitle: string;
  comparisonTitle: string;
  alternativeItems: AlternativeItem[];
  alternativeTotalMin: string;
  alternativeTotalMax: string;
  items: IncludedItem[];
  actualPrice: string;
  monthlyPrice: string;
  savingsText: string;
  ctaText?: string;
}

export default function ValueStack({
  sectionTitle,
  sectionSubtitle,
  comparisonTitle,
  alternativeItems,
  alternativeTotalMin,
  alternativeTotalMax,
  items,
  actualPrice,
  monthlyPrice,
  savingsText,
  ctaText
}: ValueStackProps) {
  const { goToCheckout } = useCheckout();

  return (
    <section className="section-padding bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ALTERNATIVE: Buying Separately */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-4 border-red-200">
            <div className="text-center mb-6">
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-lg mb-2">
                ❌ {comparisonTitle}
              </div>
            </div>

            {/* Alternative Items List */}
            <div className="space-y-4 mb-6">
              {alternativeItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start gap-3 pb-3 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-red-600 text-sm whitespace-nowrap">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Alternative Total */}
            <div className="border-t-4 border-red-300 pt-4">
              <div className="text-center">
                <span className="text-sm text-gray-600 block mb-1">RAZEM MIESIĘCZNIE:</span>
                <span className="text-2xl md:text-3xl font-black text-red-600">
                  {alternativeTotalMin}–{alternativeTotalMax}
                </span>
              </div>
            </div>
          </div>

          {/* MASTERZONE: All Included */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-green-400 relative">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                ✨ NAJLEPSZA WARTOŚĆ
              </div>
            </div>

            <div className="text-center mb-6 mt-4">
              <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg mb-2">
                ✅ W MasterZone DOSTAJESZ:
              </div>
            </div>

            {/* Included Items List */}
            <div className="space-y-3 mb-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/60 rounded-lg p-3"
                >
                  <span className="text-green-600 text-2xl flex-shrink-0">✓</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* MasterZone Price */}
            <div className="border-t-4 border-green-400 pt-4 mb-4">
              <div className="text-center">
                <span className="text-sm text-gray-700 block mb-1">TWOJA CENA:</span>
                <span className="text-xl font-bold text-gray-800 block mb-2">
                  {actualPrice}
                </span>
                <span className="text-3xl md:text-4xl font-black text-green-600">
                  {monthlyPrice}
                </span>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-400">
              <p className="text-center text-sm md:text-base font-bold text-gray-900">
                💰 {savingsText}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {ctaText && (
          <div className="text-center">
            <button
              onClick={() => goToCheckout("valuestack_cta_button")}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl md:text-2xl font-bold py-5 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-yellow-300 cursor-pointer"
            >
              👉 {ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
