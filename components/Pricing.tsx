interface PricingProps {
  sectionTitle: string;
  sectionSubtitle: string;
  price: string;
  priceDescription: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  moneyBackText: string;
}

export default function Pricing({
  sectionTitle,
  sectionSubtitle,
  price,
  priceDescription,
  features,
  ctaText,
  ctaUrl,
  moneyBackText
}: PricingProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-bl-lg">
              NAJPOPULARNIEJSZE
            </div>

            {/* Price */}
            <div className="text-center mb-8 mt-6">
              <div className="text-6xl font-bold mb-2">{price}</div>
              <p className="text-indigo-200">{priceDescription}</p>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-indigo-600 text-center font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {ctaText}
            </a>

            {/* Money Back Guarantee */}
            <p className="text-center mt-6 text-sm text-indigo-200">
              {moneyBackText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
