"use client";

import { trackEvent } from "./FacebookPixel";

interface Tool {
  icon: string;
  title: string;
  description: string;
  checked?: boolean;
}

interface ToolsProps {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  tools?: Tool[];
  support?: Tool[];
  community?: Tool[];
}

export default function Tools({
  sectionTitle,
  sectionSubtitle,
  description,
  tools,
  support,
  community
}: ToolsProps) {
  // Use whichever array is provided
  const items = tools || support || community || [];

  // Determine section type for styling
  const isToolsSection = !!tools;
  const isSupportSection = !!support;
  const isCommunitySection = !!community;

  // Different backgrounds for each section
  const bgColor = isToolsSection
    ? "bg-white"
    : isSupportSection
    ? "bg-amber-50"
    : "bg-blue-50";

  // Different card styles for each section
  const cardStyle = isToolsSection
    ? "bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:border-gray-300"
    : isSupportSection
    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-amber-300"
    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-lg hover:shadow-2xl hover:border-blue-300";

  // Different icon colors
  const iconColor = isToolsSection
    ? "text-green-600"
    : isSupportSection
    ? "text-orange-500"
    : "text-blue-600";

  // CTA tracking source
  const ctaSource = isToolsSection
    ? "tools_cta_button"
    : isSupportSection
    ? "support_cta_button"
    : "community_cta_button";

  return (
    <section className={`section-padding ${bgColor}`}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            {sectionSubtitle}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {items.map((tool, index) => (
            <div
              key={index}
              className={`flex items-start p-6 ${cardStyle} transition-all duration-300`}
            >
              <span className={`${iconColor} text-2xl mr-4 flex-shrink-0`}>
                {tool.icon}
              </span>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {tool.title}
                </h3>
                <p className="text-gray-600">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - for all sections */}
        <div className="text-center">
          <a
            href="https://www.skool.com/masterzone"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Lead", { source: ctaSource })}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Chcę pracować w pełnym skupieniu
          </a>
        </div>
      </div>
    </section>
  );
}
