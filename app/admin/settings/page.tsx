"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/types/database";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      setSettings(data as SiteSettings);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    const { id, updated_at, bishop_word_updated_at, ...rest } = settings;
    await supabase
      .from("site_settings")
      .update({ ...rest, bishop_word_updated_at: new Date().toISOString() })
      .eq("id", 1);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading || !settings) {
    return <div className="flex justify-center py-24 text-royal-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-royal-900 mb-1">Site Settings</h1>
      <p className="text-royal-700/60 text-sm mb-8">
        Update service times, the Bishop's weekly word, and church contact details site-wide.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <section className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-royal-900 mb-4">Bishop's Weekly Word</h2>
          <textarea
            value={settings.bishop_weekly_word}
            onChange={(e) => update("bishop_weekly_word", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 outline-none resize-none"
            placeholder="A short quote or word that appears on the homepage"
          />
        </section>

        <section className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-royal-900 mb-4">Service Times</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Sunday — First Service</label>
              <input value={settings.sunday_service_1} onChange={(e) => update("sunday_service_1", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Sunday — Main Service</label>
              <input value={settings.sunday_service_2} onChange={(e) => update("sunday_service_2", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Wednesday Service</label>
              <input value={settings.wednesday_service} onChange={(e) => update("wednesday_service", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Friday Youth Service</label>
              <input value={settings.friday_service} onChange={(e) => update("friday_service", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-royal-900 mb-1.5">Next Service Date/Time (drives homepage countdown)</label>
            <input
              type="datetime-local"
              value={settings.next_service_datetime ? settings.next_service_datetime.slice(0, 16) : ""}
              onChange={(e) => update("next_service_datetime", e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-royal-900 mb-4">Contact & Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Address</label>
              <input value={settings.church_address} onChange={(e) => update("church_address", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Phone 1</label>
              <input value={settings.church_phone_1} onChange={(e) => update("church_phone_1", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Phone 2</label>
              <input value={settings.church_phone_2 ?? ""} onChange={(e) => update("church_phone_2", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Email</label>
              <input value={settings.church_email} onChange={(e) => update("church_email", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Livestream URL</label>
              <input value={settings.livestream_url ?? ""} onChange={(e) => update("livestream_url", e.target.value)} placeholder="https://youtube.com/live/..." className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Map Latitude</label>
              <input type="number" step="0.0001" value={settings.latitude} onChange={(e) => update("latitude", Number(e.target.value))} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Map Longitude</label>
              <input type="number" step="0.0001" value={settings.longitude} onChange={(e) => update("longitude", Number(e.target.value))} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-royal-100 p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-royal-900 mb-4">Giving Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">M-Pesa Paybill Number</label>
              <input value={settings.paybill_number} onChange={(e) => update("paybill_number", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-royal-900 mb-1.5">Account Number Label</label>
              <input value={settings.paybill_account_label} onChange={(e) => update("paybill_account_label", e.target.value)} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-royal-700 hover:bg-royal-600 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full shadow-md"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </form>
    </div>
  );
}
