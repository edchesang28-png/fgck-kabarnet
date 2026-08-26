"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Sermon } from "@/types/database";

const emptyForm = {
  title: "", speaker: "Bishop Cheptarus", series: "", sermon_date: "",
  scripture_reference: "", video_url: "", audio_url: "", notes_pdf_url: "",
  thumbnail_url: "", description: "", is_published: true,
};

export default function AdminSermonsPage() {
  const supabase = createClient();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("sermons").select("*").order("sermon_date", { ascending: false });
    setSermons((data ?? []) as Sermon[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(s: Sermon) {
    setForm({
      title: s.title, speaker: s.speaker, series: s.series ?? "",
      sermon_date: s.sermon_date, scripture_reference: s.scripture_reference ?? "",
      video_url: s.video_url ?? "", audio_url: s.audio_url ?? "",
      notes_pdf_url: s.notes_pdf_url ?? "", thumbnail_url: s.thumbnail_url ?? "",
      description: s.description ?? "", is_published: s.is_published,
    });
    setEditingId(s.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      speaker: form.speaker,
      series: form.series || null,
      sermon_date: form.sermon_date,
      scripture_reference: form.scripture_reference || null,
      video_url: form.video_url || null,
      audio_url: form.audio_url || null,
      notes_pdf_url: form.notes_pdf_url || null,
      thumbnail_url: form.thumbnail_url || null,
      description: form.description || null,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("sermons").update(payload).eq("id", editingId);
    } else {
      await supabase.from("sermons").insert(payload);
    }

    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this sermon?")) return;
    await supabase.from("sermons").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-royal-900">Sermon Uploader</h1>
          <p className="text-royal-700/60 text-sm mt-1">Add video/audio links and downloadable notes.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-royal-700 hover:bg-royal-600 text-white font-bold px-5 py-3 rounded-full shadow-md">
          <Plus className="w-5 h-5" /> Add Sermon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-royal-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sermons.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-royal-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-gold-600 uppercase">{s.series ?? "Sermon"}</p>
              <p className="font-display font-bold text-royal-900 mt-1">{s.title}</p>
              <p className="text-sm text-royal-700/60 mt-1">{s.speaker} · {new Date(s.sermon_date).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-royal-100 text-royal-600"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-burgundy-50 text-burgundy-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-royal-100">
              <h2 className="font-display font-bold text-lg text-royal-900">{editingId ? "Edit Sermon" : "New Sermon"}</h2>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-royal-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Title *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Speaker</label>
                  <input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Series</label>
                  <input value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-royal-900 mb-1.5">Date *</label>
                  <input required type="date" value={form.sermon_date} onChange={(e) => setForm({ ...form, sermon_date: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Scripture Reference</label>
                <input value={form.scripture_reference} onChange={(e) => setForm({ ...form, scripture_reference: e.target.value })} placeholder="e.g. Mark 11:22-24" className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Video URL (YouTube/Vimeo)</label>
                <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Audio URL (Podcast/MP3)</label>
                <input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-1.5">Sermon Notes PDF URL</label>
                <input value={form.notes_pdf_url} onChange={(e) => setForm({ ...form, notes_pdf_url: e.target.value })} className="w-full rounded-lg border border-royal-200 px-4 py-2.5 focus:border-gold-500 outline-none" />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-royal-900">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 rounded" />
                Published (visible on site)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-full border border-royal-200 text-royal-700 font-semibold hover:bg-royal-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-royal-700 hover:bg-royal-600 disabled:opacity-60 text-white font-bold shadow-md">
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Sermon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
