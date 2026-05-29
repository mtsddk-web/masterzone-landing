"use client";

interface AnnouncementBarProps {
  message?: string;
}

// Founding-member scarcity (authentic, no fake countdown).
// Price escalates with group size: 67 → 97 → 150 → 200 zł.
const DEFAULT_MESSAGE =
  "Promo założycielskie: 67 zł/mc na zawsze dla pierwszych 100 osób. Potem cena rośnie z grupą (97 → 150 → 200 zł).";

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true">🔥</span>
          <p className="text-center text-sm md:text-base font-bold">
            {message || DEFAULT_MESSAGE}
          </p>
        </div>
      </div>
    </div>
  );
}
