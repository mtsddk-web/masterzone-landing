"use client";

interface VideoTestimonialProps {
  sectionTitle?: string;
  videoUrl: string;
  name: string;
  role: string;
  description?: string;
}

export default function VideoTestimonial({
  sectionTitle = "Prawdziwa Opinia Uczestnika",
  videoUrl,
  name,
  role,
  description
}: VideoTestimonialProps) {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container-custom max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          {description && (
            <p className="text-lg md:text-xl text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border-2 border-blue-200">
          {/* Video Player */}
          <div className="mb-6">
            <video
              controls
              className="w-full rounded-xl shadow-lg"
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              Twoja przeglądarka nie obsługuje odtwarzania wideo.
            </video>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t-2 border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
              🎥
            </div>
            <div className="text-center md:text-left">
              <div className="font-bold text-xl text-gray-900">{name}</div>
              <div className="text-base text-gray-600">{role}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
