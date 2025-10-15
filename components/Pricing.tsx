interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  featured?: boolean;
  note?: string;
  guarantee?: string;
}

interface PricingProps {
  sectionTitle: string;
  sectionSubtitle: string;
  plans: Plan[];
}

export default function Pricing({
  sectionTitle,
  sectionSubtitle,
  plans
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-1 gap-8 max-w-lg mx-auto">
          {plans && plans.map((plan, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-navy to-blue-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                {/* Popular Badge */}
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-bl-lg">
                    NAJPOPULARNIEJSZE
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                <p className="text-center text-indigo-200 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold mb-2">{plan.price}</div>
                  <p className="text-indigo-200">{plan.period}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
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
                  href={plan.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-lightblue hover:bg-blue-400 text-navy text-center font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {plan.ctaText}
                </a>

                {/* Note */}
                {plan.note && (
                  <p className="text-center mt-4 text-sm text-indigo-200">
                    {plan.note}
                  </p>
                )}

                {/* Guarantee */}
                {plan.guarantee && (
                  <p className="text-center mt-2 text-sm text-yellow-300 font-semibold">
                    {plan.guarantee}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
