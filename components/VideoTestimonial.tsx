"use client";

interface VideoItem {
  videoUrl: string;
  name: string;
  role: string;
}

interface VideoTestimonialProps {
  sectionTitle?: string;
  description?: string;
  videos?: VideoItem[];
}

export default function VideoTestimonial({
  sectionTitle = "Prawdziwe Opinie Uczestników",
  description,
  videos = []
}: VideoTestimonialProps) {
  // Safety check
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container-custom max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {sectionTitle}
          </h2>
          {description && (
            <p className="text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Videos Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-4 md:p-6 border border-blue-100">
              {/* Video Player */}
              <div className="mb-4">
                <video
                  controls
                  className="w-full rounded-lg shadow-lg"
                  preload="metadata"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Twoja przeglądarka nie obsługuje odtwarzania wideo.
                </video>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                  🎥
                </div>
                <div>
                  <div className="font-bold text-base text-gray-900">{video.name}</div>
                  <div className="text-sm text-gray-600">{video.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
