"use client";

import { useCheckout } from "@/hooks/useCheckout";

export default function PriceComparison() {
  const { goToCheckout } = useCheckout();

  const items = [
    { icon: "🏢", name: "Coworking", price: "500–1500 zł", period: "/msc" },
    { icon: "🧑‍🏫", name: "Personal coach", price: "2000+ zł", period: "/msc" },
    { icon: "🎯", name: "MasterZone", price: "97 zł", period: "/msc", featured: true },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Ile kosztuje skupienie?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 text-center transition-all ${
                item.featured
                  ? "border-2 border-blue-600 shadow-lg bg-blue-50"
                  : "border border-gray-200 bg-gray-50"
              }`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
              <p
                className={`text-2xl font-bold ${
                  item.featured ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {item.price}
                <span className="text-sm font-normal text-gray-400">{item.period}</span>
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm md:text-base">
          Wszystko w jednej cenie — sesje, planowanie, społeczność, kursy.
        </p>
      </div>
    </section>
  );
}
