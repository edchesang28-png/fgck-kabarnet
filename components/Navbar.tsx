"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Type, Play, HandCoins } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons & Media" },
  { href: "/ministries", label: "Ministries" },
  { href: "/giving", label: "Giving" },
  { href: "/contact", label: "Contact & Location" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleLargeText() {
    const next = !largeText;
    setLargeText(next);
    document.documentElement.classList.toggle("large-text", next);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-royal-700/98 backdrop-blur-md shadow-lg"
          : "bg-royal-700"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Church name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center font-display font-bold text-royal-900 text-lg shadow-md group-hover:scale-105 transition-transform">
              FG
            </div>
            <div className="leading-tight">
              <p className="text-white font-display font-bold text-base sm:text-lg tracking-tight">
                Full Gospel Churches
              </p>
              <p className="text-gold-400 text-xs sm:text-sm font-medium tracking-wide">
                of Kenya — Kabarnet
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-white/90 hover:text-gold-400 hover:bg-white/5 font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLargeText}
              aria-pressed={largeText}
              title="Toggle large text for easier reading"
              className="flex items-center gap-1.5 text-white/80 hover:text-gold-400 text-sm px-2 py-2 rounded-md transition-colors"
            >
              <Type className="w-4 h-4" />
              <span className="hidden xl:inline">Text Size</span>
            </button>
            <Link
              href="/sermons"
              className="flex items-center gap-2 text-white/90 hover:text-gold-400 font-medium text-sm px-3 py-2 transition-colors"
            >
              <Play className="w-4 h-4" /> Watch Live
            </Link>
            <Link
              href="/giving"
              className="btn flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-royal-900 font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-colors"
            >
              <HandCoins className="w-4 h-4" /> Give Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-royal-800 border-t border-white/10">
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-gold-400 font-medium text-base transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleLargeText}
              className="flex items-center gap-2 px-4 py-3.5 text-white/80 font-medium text-base"
            >
              <Type className="w-5 h-5" /> Toggle Large Text
            </button>
            <Link
              href="/giving"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 bg-gold-500 text-royal-900 font-bold text-base px-5 py-3.5 rounded-full shadow-md"
            >
              <HandCoins className="w-5 h-5" /> Give Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
