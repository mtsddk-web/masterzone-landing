"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, mounted]);

  if (!mounted || !timeLeft) {
    return (
      <div className="flex gap-2 justify-center items-center text-sm md:text-base">
        <span className="font-mono">Ładowanie...</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-center items-center text-sm md:text-base">
      <div className="flex flex-col items-center bg-white/10 rounded-lg px-2 py-1 min-w-[50px]">
        <span className="font-bold text-lg md:text-2xl font-mono">{timeLeft.days}</span>
        <span className="text-xs opacity-80">dni</span>
      </div>
      <span className="text-lg font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg px-2 py-1 min-w-[50px]">
        <span className="font-bold text-lg md:text-2xl font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs opacity-80">godz</span>
      </div>
      <span className="text-lg font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg px-2 py-1 min-w-[50px]">
        <span className="font-bold text-lg md:text-2xl font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs opacity-80">min</span>
      </div>
      <span className="text-lg font-bold md:inline hidden">:</span>
      <div className="md:flex hidden flex-col items-center bg-white/10 rounded-lg px-2 py-1 min-w-[50px]">
        <span className="font-bold text-lg md:text-2xl font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs opacity-80">sek</span>
      </div>
    </div>
  );
}
