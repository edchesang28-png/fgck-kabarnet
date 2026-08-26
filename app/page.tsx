import Link from "next/link";
import { Play, HandCoins, MapPin, Calendar, ArrowRight, Quote } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import ServiceCountdown from "@/components/ServiceCountdown";
import { createClient } from "@/lib/supabase/server";
import type { ChurchEvent, Sermon, SiteSettings } from "@/types/database";

export const revalidate = 60; // ISR: re-fetch fresh content at most every 60s

async function getHomeData() {
  const supabase = createClient();

  const [{ data: settings }, { data: events }, { data: sermons }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString().slice(0, 10))
        .order("event_date", { ascending: true })
        .limit(3),
      supabase
        .from("sermons")
        .select("*")
        .eq("is_published", true)
        .order("sermon_date", { ascending: false })
        .limit(3),
    ]);

  return {
    settings: settings as SiteSettings | null,
    events: (events ?? []) as ChurchEvent[],
    sermons: (sermons ?? []) as Sermon[],
  };
}

const categoryLabels: Record<string, string> = {
  general: "Church Event",
  youth: "Youth Rally",
  kesha: "Kesha (Night Vigil)",
  conference: "Conference",
  revival: "Revival",
  crusade: "Crusade",
  wedding: "Wedding",
  funeral: "Funeral Service",
  training: "Training",
};

export default async function HomePage() {
  const { settings, events, sermons } = await getHomeData();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4">
        <HeroSlider />

        <div className="relative z-10 max-w-4xl mx-auto py-24">
          <span className="inline-block bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            Welcome Home
          </span>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6 animate-fade-up">
            Full Gospel Churches
            <span className="block text-gold-gradient mt-1">of Kenya — Kabarnet</span>
          </h1>

          <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.15s" }}>
            A Spirit-filled family proclaiming the full Gospel of Jesus
            Christ — saving, healing, baptizing, and sending. Come as you
            are, and encounter His presence with us.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href={settings?.livestream_url ?? "/sermons"}
              className="btn w-full sm:w-auto flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-royal-900 font-bold px-8 py-3.5 rounded-full shadow-xl transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" /> Watch Live Stream
            </Link>
            <Link
              href="/giving"
              className="btn w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            >
              <HandCoins className="w-5 h-5" /> Give a Tithe / Offering
            </Link>
            <Link
              href="/contact"
              className="btn w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            >
              <MapPin className="w-5 h-5" /> Find Us
            </Link>
          </div>

          <ServiceCountdown targetDate={settings?.next_service_datetime ?? null} />
        </div>
      </section>

      {/* ================= BISHOP'S QUOTE ================= */}
      <section className="bg-royal-900 py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-gold-500 mx-auto mb-6" />
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-white leading-relaxed italic mb-8">
            "{settings?.bishop_weekly_word ??
              "The Gospel is not merely good advice — it is good news, and it is for everyone. Come, let us encounter Jesus together."}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center font-display font-bold text-royal-900">
              BC
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Bishop Cheptarus</p>
              <p className="text-gold-400 text-sm">Overseer, FGCK Kabarnet</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-burgundy-600 font-semibold tracking-widest uppercase text-sm mb-2">
                Mark Your Calendar
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-royal-900">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/ministries"
              className="flex items-center gap-1.5 text-burgundy-600 font-semibold hover:text-burgundy-500"
            >
              View All Ministries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-royal-700/60 text-center py-12">
              No upcoming events are published right now — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group rounded-2xl overflow-hidden border border-royal-100 shadow-sm hover:shadow-xl transition-shadow bg-white"
                >
                  <div className="relative h-48 bg-royal-100 overflow-hidden">
                    {event.flyer_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.flyer_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-royal-gradient flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gold-400/60" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-gold-500 text-royal-900 text-xs font-bold px-3 py-1 rounded-full">
                      {categoryLabels[event.category] ?? "Event"}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-burgundy-600 font-semibold text-sm mb-1">
                      {new Date(event.event_date).toLocaleDateString("en-KE", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      {event.start_time && ` · ${event.start_time.slice(0, 5)}`}
                    </p>
                    <h3 className="font-display font-bold text-lg text-royal-900 mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-royal-700/70 text-sm leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= LATEST SERMONS ================= */}
      <section className="py-20 px-4 bg-royal-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-burgundy-600 font-semibold tracking-widest uppercase text-sm mb-2">
                Feed Your Spirit
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-royal-900">
                Recent Messages
              </h2>
            </div>
            <Link
              href="/sermons"
              className="flex items-center gap-1.5 text-burgundy-600 font-semibold hover:text-burgundy-500"
            >
              Browse All Sermons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {sermons.length === 0 ? (
            <p className="text-royal-700/60 text-center py-12">
              Sermons will appear here once uploaded by the admin team.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow border border-royal-100"
                >
                  <div className="relative h-44 bg-royal-gradient flex items-center justify-center">
                    {sermon.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-full object-cover" />
                    ) : (
                      <Play className="w-12 h-12 text-gold-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-gold-600 text-xs font-bold uppercase tracking-wide mb-1">
                      {sermon.series ?? "Sunday Message"}
                    </p>
                    <h3 className="font-display font-bold text-lg text-royal-900 mb-1">
                      {sermon.title}
                    </h3>
                    <p className="text-royal-700/60 text-sm">
                      {sermon.speaker} ·{" "}
                      {new Date(sermon.sermon_date).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= QUICK LINKS STRIP ================= */}
      <section className="bg-burgundy-600 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <Link href="/sermons" className="group">
            <Play className="w-8 h-8 text-gold-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold">Watch / Listen</p>
            <p className="text-white/60 text-sm">Catch up on messages</p>
          </Link>
          <Link href="/giving" className="group">
            <HandCoins className="w-8 h-8 text-gold-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold">Give Online</p>
            <p className="text-white/60 text-sm">M-Pesa & card giving</p>
          </Link>
          <Link href="/contact" className="group">
            <MapPin className="w-8 h-8 text-gold-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold">Visit Us</p>
            <p className="text-white/60 text-sm">Find our location</p>
          </Link>
        </div>
      </section>
    </>
  );
}
