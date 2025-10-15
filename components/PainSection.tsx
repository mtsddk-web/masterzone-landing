interface PainSectionProps {
  sectionTitle: string;
  headline: string;
  subheadline: string;
  description: string;
  transition?: string;
  transitionItems?: string[];
  transitionNote?: string;
  transitionFooter?: string;
  solution?: string;
  sections?: {
    title: string;
    items: string[];
  }[];
  mainHeadline?: string;
  mainContent?: string;
  callout?: string;
  calloutText?: string;
}

export default function PainSection({
  sectionTitle,
  headline,
  subheadline,
  description,
  transition,
  transitionItems,
  transitionNote,
  transitionFooter,
  solution,
  sections,
  mainHeadline,
  mainContent,
  callout,
  calloutText
}: PainSectionProps) {
  return (
    <section className="section-padding bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold mb-6">
            {sectionTitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {headline}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            {subheadline}
          </p>
        </div>

        {/* Description */}
        <div className="prose prose-lg max-w-none mb-12 text-gray-700">
          {description.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Transition */}
        {transition && (
          <div className="mb-12">
            <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
              <p className="text-xl font-semibold text-blue-900">{transition}</p>
            </div>

            {transitionItems && (
              <ul className="space-y-4 mb-6">
                {transitionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-3 text-xl font-bold">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {transitionNote && (
              <p className="text-center text-xl font-bold text-red-600 mb-2">
                {transitionNote}
              </p>
            )}

            {transitionFooter && (
              <p className="text-center text-lg text-gray-700">
                {transitionFooter}
              </p>
            )}
          </div>
        )}

        {/* Sections */}
        {sections && sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{section.title}</h3>
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl font-bold">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Main Content */}
        {mainHeadline && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{mainHeadline}</h3>
            {mainContent && (
              <div className="prose prose-lg max-w-none text-gray-700">
                {mainContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Solution */}
        {solution && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-2xl shadow-lg">
            <div className="prose prose-lg max-w-none">
              {solution.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Callout */}
        {calloutText && (
          <div className="mt-12 bg-gradient-to-r from-navy to-blue-700 text-white p-8 rounded-2xl shadow-xl text-center">
            {callout && (
              <p className="text-sm uppercase tracking-wider mb-2 opacity-90">{callout}</p>
            )}
            <p className="text-2xl md:text-3xl font-bold">{calloutText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
