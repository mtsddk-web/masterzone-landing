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
  return (
    <section className="section-padding bg-gray-50">
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

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((tool, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-green-500 text-2xl mr-4 flex-shrink-0">
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
      </div>
    </section>
  );
}
