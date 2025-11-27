"use client";

import { useState } from "react";
import { useEmailGate } from "@/hooks/useEmailGate";
import EmailGateModal from "./EmailGateModal";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  videoUrl?: string;
}

interface TestimonialsProps {
  sectionTitle: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ sectionTitle, testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isEmailGateOpen, openEmailGate, closeEmailGate, handleEmailSuccess } = useEmailGate();

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <>
      <EmailGateModal
        isOpen={isEmailGateOpen}
        onClose={closeEmailGate}
        onSuccess={handleEmailSuccess}
      />
      <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">
          {sectionTitle}
        </h2>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Testimonial Card */}
            <div className="bg-gray-50 rounded-xl p-10 md:p-12 shadow-lg">
              {/* Video Testimonial */}
              {currentTestimonial.videoUrl ? (
                <div className="mb-8">
                  <video
                    controls
                    className="w-full rounded-lg shadow-xl"
                    poster="/images/video-thumbnail.jpg"
                  >
                    <source src={currentTestimonial.videoUrl} type="video/mp4" />
                    Twoja przeglądarka nie obsługuje odtwarzania wideo.
                  </video>
                  {currentTestimonial.content && (
                    <p className="text-gray-600 text-sm md:text-base mt-4 italic">
                      {currentTestimonial.content}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* 5 Stars Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <div className="text-navy text-5xl mb-6">"</div>

                  {/* Content */}
                  <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed italic min-h-[120px]">
                    {currentTestimonial.content}
                  </p>
                </>
              )}

              {/* Author */}
              <div className="flex items-center">
                {currentTestimonial.avatar ? (
                  currentTestimonial.avatar.startsWith('http') ? (
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mr-4 bg-gradient-to-br from-lightblue to-blue-300 flex items-center justify-center text-4xl">
                      {currentTestimonial.avatar}
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 rounded-full mr-4 bg-navy flex items-center justify-center text-white font-bold text-xl">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-xl text-gray-900">{currentTestimonial.name}</div>
                  <div className="text-base text-gray-600">{currentTestimonial.role}</div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 bg-white hover:bg-gray-100 text-navy p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Poprzednia opinia"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 bg-white hover:bg-gray-100 text-navy p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Następna opinia"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-navy w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Przejdź do opinii ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-gray-600">
            {currentIndex + 1} / {testimonials.length}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => openEmailGate("testimonials_cta_button")}
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300 cursor-pointer"
          >
            Testuję 7 dni za darmo
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
