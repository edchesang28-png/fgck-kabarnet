"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1920&auto=format&fit=crop",
    alt: "Congregation worshipping together",
  },
  {
    image:
      "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?q=80&w=1920&auto=format&fit=crop",
    alt: "Hands raised in worship",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1920&auto=format&fit=crop",
    alt: "Church community gathering",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[index].image}
            alt={slides[index].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal-900/85 via-royal-900/70 to-royal-900/95" />

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-gold-400" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
