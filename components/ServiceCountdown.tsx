"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string | null; // ISO datetime string from site_settings.next_service_datetime
}

function getNextSundayServiceFallback(): Date {
  // If admin hasn't set an explicit next_service_datetime, default to
  // the coming Sunday 8:00 AM as a sensible fallback so the countdown
  // never looks broken.
  const now = new Date();
  const result = new Date(now);
  const day = now.getDay(); // 0 = Sunday
  let daysUntilSunday = (7 - day) % 7;
  result.setDate(now.getDate() + daysUntilSunday);
  result.setHours(8, 0, 0, 0);
  if (result <= now) result.setDate(result.getDate() + 7);
  return result;
}

function calculateTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export default function ServiceCountdown({ targetDate }: Props) {
  const target = targetDate ? new Date(targetDate) : getNextSundayServiceFallback();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex flex-col items-center">
      <p className="text-gold-400 font-semibold text-sm tracking-widest uppercase mb-3">
        {timeLeft.done ? "Service is starting!" : "Next Service Begins In"}
      </p>
      <div className="flex gap-3 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 sm:w-20 py-3 flex flex-col items-center"
          >
            <span className="text-2xl sm:text-3xl font-display font-bold text-white tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wide mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
