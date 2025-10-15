"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "./FacebookPixel";

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

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [fade, setFade] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(testimonial);

  useEffect(() => {
    // Random interval between 4-7 seconds for each card
    const randomInterval = 4000 + Math.random() * 3000;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        // This would cycle through testimonials, but we'll keep it simple for now
        setCurrentTestimonial(testimonial);
        setFade(true);
      }, 500);
    }, randomInterval);

    return () => clearInterval(interval);
  }, [testimonial]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="text-navy text-4xl mb-4">"</div>

        {/* Content */}
        <p className="text-gray-700 mb-6 leading-relaxed italic flex-grow">
          {currentTestimonial.content}
        </p>

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
            <div className="font-bold text-gray-900">{currentTestimonial.name}</div>
            <div className="text-sm text-gray-600">{currentTestimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ sectionTitle, testimonials }: TestimonialsProps) {
  // Show first 3 testimonials
  const displayedTestimonials = testimonials.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">
          {sectionTitle}
        </h2>

        {/* Testimonials Grid - 3 cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.skool.com/masterzone"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Lead", { source: "testimonials_cta_button" })}
            className="inline-block bg-lightblue hover:bg-blue-400 text-navy font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Chcę pracować w pełnym skupieniu
          </a>
        </div>
      </div>
    </section>
  );
}
