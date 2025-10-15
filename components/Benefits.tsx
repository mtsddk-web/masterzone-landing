interface Benefit {
  icon: string;
  title: string;
  description: string;
  checked?: boolean;
}

interface BenefitsProps {
  sectionTitle: string;
  sectionSubtitle: string;
  description?: string;
  benefits: Benefit[];
}

export default function Benefits({ sectionTitle, sectionSubtitle, description, benefits }: BenefitsProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            {sectionSubtitle}
          </p>
          {description && (
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {/* Icon/Checkmark */}
              <div className="text-3xl mr-4 flex-shrink-0 text-green-500">
                {benefit.icon}
              </div>

              <div>
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
