"use client";

import { useState } from "react";

interface VideoItem {
  videoUrl: string;
  poster?: string;
  name: string;
  role: string;
}

interface VideoTestimonialProps {
  sectionTitle?: string;
  description?: string;
  videos?: VideoItem[];
}

function VideoCard({ video }: { video: VideoItem }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 border border-blue-100">
      {/* Video Player z gracefull fallbackiem gdy plik się nie ładuje */}
      <div className="mb-4">
        {failed ? (
          <div className="w-full max-w-md mx-auto rounded-lg shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100 aspect-video flex items-center justify-center text-center px-6">
            <p className="text-sm text-gray-600">
              Wideo chwilowo niedostępne. Napisz na kontakt@masterzone.edu.pl, podeślemy link.
            </p>
          </div>
        ) : (
          <video
            controls
            className="w-full max-w-md mx-auto rounded-lg shadow-lg aspect-video bg-gray-900"
            preload="none"
            poster={video.poster || "/images/hero-poster.jpg"}
            onError={() => setFailed(true)}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzania wideo.
          </video>
        )}
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
  );
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

        {/* Videos Grid - 4 w jednym rzedzie na duzym ekranie (lg+), 2x2 na tablecie, stos na telefonie */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {videos.map((video) => (
            <VideoCard key={video.videoUrl} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
