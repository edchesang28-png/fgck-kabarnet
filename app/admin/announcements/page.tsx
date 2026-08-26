"use client";

import { useEffect, useState, FormEvent } from "react";
import { Megaphone, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Announcement } from "@/types/database";

export default function AdminAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"info" | "urgent" | "celebration">("info");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("Learn more");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setAnnouncements((data ?? []) as Announcement[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Deactivate any currently active announcement first (only one banner shows at a time)
    await supabase.from("announcements").update({ is_active: false }).eq("is_active", true);

    await supabase.from("announcements").insert({
      message,
      severity,
      link_url: linkUrl || null,
      link_label: linkLabel,
      is_active: true,
    });

    setMessage("");
    setLinkUrl("");
    setSaving(false);
    load();
  }

  async function toggleActive(a: Announcement) {
    if (!a.is_active) {
      // Turning this one on — turn everything else off first
      await supabase.from("announcements").update({ is_active: false }).eq("is_active", true);
    }
    await supabase.from("announcements").update({ is_active: !a.is_active }).eq("id", a.id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-royal-900 mb-1">
        Announcement Banner
      </h1>
      <p className="text-royal-700/60 text-sm mb-8">
        Only one announcement can be active at a time — it appears as a bar at the top of every page.
      </p>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm mb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-royal-900 mb-1.5">Message *</label>
          <input
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Youth Kesha this Friday 9PM — all invited!"
            className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-royal-900 mb-1.5">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as typeof severity)}
              className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
            >
              <option value="info">Info (Blue)</option>
              <option value="urgent">Urgent (Burgundy)</option>
              <option value="celebration">Celebration (Gold)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-royal-900 mb-1.5">Link URL (optional)</label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/ministries"
              className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-royal-900 mb-1.5">Link Label</label>
            <input
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-royal-700 hover:bg-royal-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full shadow-md"
        >
          <Megaphone className="w-4 h-4" /> {saving ? "Publishing..." : "Publish Banner"}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12 text-royal-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-royal-100 p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <p className="text-royal-900 font-medium">{a.message}</p>
                <p className="text-xs text-royal-400 mt-1 capitalize">{a.severity} · {new Date(a.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(a)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    a.is_active ? "bg-green-100 text-green-700" : "bg-royal-100 text-royal-500"
                  }`}
                >
                  {a.is_active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-burgundy-50 text-burgundy-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
