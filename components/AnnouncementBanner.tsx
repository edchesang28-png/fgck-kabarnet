"use client";

import { useEffect, useState } from "react";
import { X, Megaphone, AlertTriangle, PartyPopper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Announcement } from "@/types/database";

const severityStyles = {
  info: { bg: "bg-royal-700", icon: Megaphone },
  urgent: { bg: "bg-burgundy-600", icon: AlertTriangle },
  celebration: { bg: "bg-gold-600", icon: PartyPopper },
};

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAnnouncement() {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        // Respect expiry if set
        if (data.expires_at && new Date(data.expires_at) < new Date()) return;

        // Don't re-show an announcement the user already dismissed this session
        const dismissedId = sessionStorage.getItem("fgck_dismissed_announcement");
        if (dismissedId === data.id) return;

        setAnnouncement(data);
      }
    }

    fetchAnnouncement();
  }, []);

  if (!announcement || dismissed) return null;

  const style = severityStyles[announcement.severity] ?? severityStyles.info;
  const Icon = style.icon;

  function handleDismiss() {
    if (announcement) {
      sessionStorage.setItem("fgck_dismissed_announcement", announcement.id);
    }
    setDismissed(true);
  }

  return (
    <div className={`${style.bg} text-white relative`} role="alert">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm sm:text-base">
        <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        <p className="text-center font-medium leading-snug">
          {announcement.message}
          {announcement.link_url && (
            <a
              href={announcement.link_url}
              className="underline decoration-gold-400 decoration-2 underline-offset-2 ml-2 font-semibold hover:text-gold-300"
            >
              {announcement.link_label}
            </a>
          )}
        </p>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 sm:right-6 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
