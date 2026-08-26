"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Megaphone, Play, Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    activeAnnouncement: false,
    totalSermons: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const today = new Date().toISOString().slice(0, 10);

      const [{ count: eventsCount }, { data: announcement }, { count: sermonsCount }, { count: messagesCount }] =
        await Promise.all([
          supabase.from("events").select("*", { count: "exact", head: true }).eq("is_published", true).gte("event_date", today),
          supabase.from("announcements").select("id").eq("is_active", true).limit(1).maybeSingle(),
          supabase.from("sermons").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        ]);

      setStats({
        upcomingEvents: eventsCount ?? 0,
        activeAnnouncement: !!announcement,
        totalSermons: sermonsCount ?? 0,
        unreadMessages: messagesCount ?? 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: CalendarDays, href: "/admin/events", color: "bg-royal-700" },
    { label: "Announcement Banner", value: stats.activeAnnouncement ? "Active" : "Off", icon: Megaphone, href: "/admin/announcements", color: "bg-burgundy-600" },
    { label: "Sermons Uploaded", value: stats.totalSermons, icon: Play, href: "/admin/sermons", color: "bg-gold-600" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: Mail, href: "/admin/dashboard", color: "bg-royal-500" },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-royal-900 mb-1">
        Welcome back
      </h1>
      <p className="text-royal-700/60 text-sm mb-8">
        Here's what's happening on the FGCK Kabarnet website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-royal-900">{card.value}</p>
              <p className="text-royal-700/60 text-sm mt-1 flex items-center gap-1">
                {card.label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/events" className="bg-royal-gradient rounded-2xl p-6 text-white shadow-md hover:scale-[1.02] transition-transform">
          <CalendarDays className="w-6 h-6 text-gold-400 mb-3" />
          <p className="font-semibold">Add an Event</p>
          <p className="text-white/60 text-sm mt-1">Youth rally, kesha, or conference</p>
        </Link>
        <Link href="/admin/announcements" className="bg-burgundy-600 rounded-2xl p-6 text-white shadow-md hover:scale-[1.02] transition-transform">
          <Megaphone className="w-6 h-6 text-gold-300 mb-3" />
          <p className="font-semibold">Post an Announcement</p>
          <p className="text-white/60 text-sm mt-1">Show an urgent notice site-wide</p>
        </Link>
        <Link href="/admin/settings" className="bg-royal-700 rounded-2xl p-6 text-white shadow-md hover:scale-[1.02] transition-transform">
          <Play className="w-6 h-6 text-gold-300 mb-3" />
          <p className="font-semibold">Update Bishop's Word</p>
          <p className="text-white/60 text-sm mt-1">Change the weekly homepage quote</p>
        </Link>
      </div>
    </div>
  );
}
