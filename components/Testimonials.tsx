"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

interface TestimonialsProps {
  sectionTitle: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ sectionTitle, testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setFade(true);
      }, 500); // Wait for fade out before changing
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">
          {sectionTitle}
        </h2>

        {/* Single Testimonial with Fade Animation */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-lightblue/10 rounded-2xl p-8 md:p-12 shadow-lg">
              {/* Quote Icon */}
              <div className="mb-6">
                <svg
                  className="w-12 h-12 text-navy/20 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  {currentTestimonial.content}
                </p>
              </div>

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
                  <p className="font-bold text-navy text-lg">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-gray-600">{currentTestimonial.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setFade(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setFade(true);
                  }, 500);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-navy w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
