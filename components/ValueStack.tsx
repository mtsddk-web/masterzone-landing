"use client";

interface ValueStackItem {
  name: string;
  description: string;
  value: string;
}

interface ValueStackProps {
  sectionTitle: string;
  sectionSubtitle: string;
  items: ValueStackItem[];
  totalValue: string;
  actualPrice: string;
  savings: string;
  savingsPercent: string;
}

export default function ValueStack({
  sectionTitle,
  sectionSubtitle,
  items,
  totalValue,
  actualPrice,
  savings,
  savingsPercent,
}: ValueStackProps) {
  return (
    <section className="section-padding bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Value Stack Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border-4 border-indigo-100">
          {/* Items List */}
          <div className="space-y-4 mb-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-gray-700 text-base md:text-lg whitespace-nowrap">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Value */}
          <div className="border-t-4 border-gray-300 pt-6 mb-6">
            <div className="flex justify-between items-center text-xl md:text-2xl font-bold">
              <span className="text-gray-900">CAŁKOWITA WARTOŚĆ:</span>
              <span className="text-gray-900">{totalValue}/msc</span>
            </div>
          </div>

          {/* Your Price */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-300">
            <div className="text-center">
              <span className="text-xl md:text-2xl font-bold text-gray-900 block mb-2">
                TWOJA CENA DZIŚ:
              </span>
              <span className="text-3xl md:text-5xl font-black text-green-600">
                {actualPrice}
              </span>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
            <p className="text-lg md:text-2xl font-bold text-gray-900">
              💎 {savings}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
