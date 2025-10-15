"use client";

import { useState, useEffect, useRef } from "react";
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

// Shared state to track which testimonials are currently displayed
const displayedIndices = new Set<number>();

function TestimonialCard({
  allTestimonials,
  initialIndex,
  interval
}: {
  allTestimonials: Testimonial[];
  initialIndex: number;
  interval: number;
}) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(initialIndex);
  const currentIndexRef = useRef(initialIndex);

  // Initialize with unique testimonial
  useEffect(() => {
    displayedIndices.add(initialIndex);
    currentIndexRef.current = initialIndex;

    return () => {
      displayedIndices.delete(currentIndexRef.current);
    };
  }, [initialIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);

      setTimeout(() => {
        // Remove current index from displayed set
        displayedIndices.delete(currentIndexRef.current);

        // Pick a random testimonial that's not currently displayed
        let randomIndex;
        let attempts = 0;
        do {
          randomIndex = Math.floor(Math.random() * allTestimonials.length);
          attempts++;
        } while (displayedIndices.has(randomIndex) && attempts < 20);

        // Add new index to displayed set
        displayedIndices.add(randomIndex);
        currentIndexRef.current = randomIndex;
        setCurrentTestimonialIndex(randomIndex);
      }, 300); // Change content mid-flip

      setTimeout(() => {
        setIsFlipping(false);
      }, 600); // Complete flip animation
    }, interval);

    return () => clearInterval(timer);
  }, [allTestimonials, interval]);

  const currentTestimonial = allTestimonials[currentTestimonialIndex];

  return (
    <div className="perspective-1000">
      <div
        className={`transition-transform duration-600 transform-style-3d ${
          isFlipping ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        <div className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col backface-hidden">
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
    </div>
  );
}

export default function Testimonials({ sectionTitle, testimonials }: TestimonialsProps) {
  // Intervals for each card: 5s, 7s, 9s
  const intervals = [5000, 7000, 9000];

  // Clear displayed indices on mount
  useEffect(() => {
    displayedIndices.clear();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900">
          {sectionTitle}
        </h2>

        {/* Testimonials Grid - 3 cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[0, 1, 2].map((index) => (
            <TestimonialCard
              key={index}
              allTestimonials={testimonials}
              initialIndex={index}
              interval={intervals[index]}
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
