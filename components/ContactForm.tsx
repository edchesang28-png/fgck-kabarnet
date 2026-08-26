"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-royal-100">
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-royal-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-royal-700/70">
          Thank you for reaching out. Our team will get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-burgundy-600 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 sm:p-10 border border-royal-100 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-royal-900 mb-1.5">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-royal-900 mb-1.5">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="07XX XXX XXX"
            className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-royal-900 mb-1.5">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-royal-900 mb-1.5">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Prayer request, visit inquiry, etc."
          className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-royal-900 mb-1.5">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-royal-200 px-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-burgundy-600 text-sm bg-burgundy-50 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn w-full flex items-center justify-center gap-2 bg-burgundy-600 hover:bg-burgundy-500 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full shadow-md transition-colors"
      >
        <Send className="w-5 h-5" />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
