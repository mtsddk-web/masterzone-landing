"use client";

import { trackEvent } from "./FacebookPixel";
import { scrollToContactForm } from "@/lib/scrollToForm";

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

        {/* TOOLS SECTION - Vertical list with large icons */}
        {isToolsSection && (
          <div className="max-w-5xl mx-auto space-y-6 mb-12">
            {items.map((tool, index) => (
              <div
                key={index}
                className="flex items-start gap-6 p-8 bg-white border-l-8 border-green-500 rounded-r-2xl shadow-lg hover:shadow-2xl hover:border-green-600 transition-all duration-300 hover:translate-x-2"
              >
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-green-50 rounded-2xl">
                  <span className="text-5xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">
                    {tool.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUPPORT SECTION - Timeline/numbered steps */}
        {isSupportSection && (
          <div className="max-w-4xl mx-auto mb-12">
            {items.map((tool, index) => (
              <div
                key={index}
                className="relative flex gap-6 mb-8 last:mb-0"
              >
                {/* Timeline line */}
                {index < items.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-200" />
                )}

                {/* Number badge */}
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-2xl rounded-full shadow-lg z-10">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-orange-200 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-300">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{tool.icon}</span>
                    <h3 className="font-bold text-xl text-gray-900 mt-1">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed ml-12">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMMUNITY SECTION - Big highlight boxes with special styling */}
        {isCommunitySection && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {items.map((tool, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500" />

                  {/* Card content */}
                  <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 rounded-3xl border-2 border-blue-300 shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                        <span className="text-4xl filter drop-shadow-md">{tool.icon}</span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 flex-1">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button - for all sections */}
        <div className="text-center">
          <a
            href="#contact-form"
            id="skool-cta"
            onClick={(e) => {
              trackEvent("Lead", { source: ctaSource });
              scrollToContactForm(e);
            }}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
          >
            Chcę pracować w pełnym skupieniu
          </a>
        </div>
      </div>
    </section>
  );
}
