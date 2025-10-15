interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsProps {
  sectionTitle: string;
  sectionSubtitle: string;
  benefits: Benefit[];
}

export default function Benefits({ sectionTitle, sectionSubtitle, benefits }: BenefitsProps) {
  return (
    <section className="section-padding bg-gray-50">
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

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{benefit.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
