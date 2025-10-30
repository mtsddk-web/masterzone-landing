"use client";

import CountdownTimer from "./CountdownTimer";

interface AnnouncementBarProps {
  message: string;
}

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 shadow-lg">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          <p className="text-center text-sm md:text-base font-bold">
            {message}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-semibold">Kończy się za:</span>
            <CountdownTimer targetDate="2025-11-01T00:00:00+01:00" />
          </div>
        </div>
      </div>
    </div>
  );
}
