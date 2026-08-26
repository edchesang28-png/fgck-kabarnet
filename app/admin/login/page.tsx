"use client";
export const dynamic = "force-dynamic";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, LogIn, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") ?? "/admin/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-royal-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center font-display font-bold text-royal-900 text-2xl mx-auto mb-4 shadow-lg">
            FG
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            Admin Dashboard
          </h1>
          <p className="text-white/60 text-sm mt-1">
            FGCK Kabarnet — Church Leadership Portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 text-burgundy-600 text-sm bg-burgundy-50 rounded-lg px-4 py-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-royal-900 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-royal-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-royal-200 pl-11 pr-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
                placeholder="admin@fgckkabarnet.org"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-royal-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-royal-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-royal-200 pl-11 pr-4 py-3 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full flex items-center justify-center gap-2 bg-royal-700 hover:bg-royal-600 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full shadow-md transition-colors"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Access restricted to authorized church administrators only.
        </p>
      </div>
    </div>
  );
}
