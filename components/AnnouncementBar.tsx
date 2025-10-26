"use client";

interface AnnouncementBarProps {
  message: string;
}

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 shadow-lg">
      <div className="container-custom">
        <p className="text-center text-sm md:text-base font-bold animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
