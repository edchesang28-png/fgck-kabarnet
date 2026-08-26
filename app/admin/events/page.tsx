"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Star, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChurchEvent, EventCategory } from "@/types/database";

const categories: EventCategory[] = [
  "general", "youth", "kesha", "conference", "revival", "crusade", "wedding", "funeral", "training",
];

const emptyForm = {
  title: "",
  description: "",
  category: "general" as EventCategory,
  event_date: "",
  start_time: "",
  end_time: "",
  location: "FGCK Kabarnet Main Sanctuary",
  flyer_url: "",
  is_featured: false,
  is_published: true,
};

export default function AdminEventsPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  async function loadEvents() {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    setEvents((data ?? []) as ChurchEvent[]);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function openCreateModal() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(event: ChurchEvent) {
    setForm({
      title: event.title,
      description: event.description ?? "",
      category: event.category,
      event_date: event.event_date,
      start_time: event.start_time?.slice(0, 5) ?? "",
      end_time: event.end_time?.slice(0, 5) ?? "",
      location: event.location ?? "",
      flyer_url: event.flyer_url ?? "",
      is_featured: event.is_featured,
      is_published: event.is_published,
    });
    setEditingId(event.id);
    setModalOpen(true);
  }

  async function handleFlyerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFlyer(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("flyers").upload(fileName, file);

    if (!error) {
      const { data: publicUrlData } = supabase.storage.from("flyers").getPublicUrl(fileName);
      setForm((f) => ({ ...f, flyer_url: publicUrlData.publicUrl }));
    }
    setUploadingFlyer(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      event_date: form.event_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      location: form.location || null,
      flyer_url: form.flyer_url || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("events").update(payload).eq("id", editingId);
    } else {
      await supabase.from("events").insert(payload);
    }

    setSaving(false);
    setModalOpen(false);
    loadEvents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event permanently? This cannot be undone.")) return;
    await supabase.from("events").delete().eq("id", id);
    loadEvents();
  }

  async function togglePublished(event: ChurchEvent) {
    await supabase
      .from("events")
      .update({ is_published: !event.is_published })
      .eq("id", event.id);
    loadEvents();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-royal-900">
            Event Manager
          </h1>
          <p className="text-royal-700/60 text-sm mt-1">
            Add, edit, or remove upcoming church events, rallies, and keshas.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn flex items-center gap-2 bg-royal-700 hover:bg-royal-600 text-white font-bold px-5 py-3 rounded-full shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-royal-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-royal-100 p-12 text-center text-royal-700/50">
          No events yet. Click "Add Event" to create your first one.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-royal-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-royal-50 text-royal-700/70 text-left">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Event</th>
                <th className="px-5 py-3.5 font-semibold hidden sm:table-cell">Category</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold hidden md:table-cell">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-royal-50">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-royal-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {event.is_featured && <Star className="w-4 h-4 text-gold-500 fill-gold-500" />}
                      <span className="font-medium text-royal-900">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell capitalize text-royal-700/70">
                    {event.category}
                  </td>
                  <td className="px-5 py-4 text-royal-700/70">
                    {new Date(event.event_date).toLocaleDateString("en-KE", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <button
                      onClick={() => togglePublished(event)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        event.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-royal-100 text-royal-500"
                      }`}
                    >
                      {event.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {event.is_published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 rounded-lg hover:bg-royal-100 text-royal-600"
                        aria-label="Edit event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 rounded-lg hover:bg-burgundy-50 text-burgundy-600"
                        aria-label="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-royal-100">
              <h2 className="font-display font-bold text-lg text-royal-900">
                {editingId ? "Edit Event" : "New Event"}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X className="w-5 h-5 text-royal-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
                  placeholder="e.g. Annual Youth Rally 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}
                    className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Date *</label>
                  <input
                    required
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Flyer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFlyerUpload}
                  className="w-full text-sm text-royal-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-royal-100 file:text-royal-700 file:font-semibold hover:file:bg-royal-200"
                />
                {uploadingFlyer && <p className="text-xs text-royal-400 mt-1">Uploading...</p>}
                {form.flyer_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.flyer_url} alt="Flyer preview" className="mt-3 h-28 rounded-lg object-cover" />
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-royal-900">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Featured event
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-royal-900">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Published (visible on site)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-royal-200 text-royal-700 font-semibold hover:bg-royal-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-full bg-royal-700 hover:bg-royal-600 disabled:opacity-60 text-white font-bold shadow-md"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
