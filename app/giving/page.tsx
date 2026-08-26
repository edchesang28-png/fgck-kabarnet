import { Smartphone, CreditCard, Heart, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database";

export const revalidate = 60;

export default async function GivingPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = settings as SiteSettings | null;

  return (
    <>
      <section className="bg-royal-gradient py-20 px-4 text-center">
        <Heart className="w-10 h-10 text-gold-400 mx-auto mb-5" />
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
          Giving & Tithing
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
          "Bring the whole tithe into the storehouse, that there may be food
          in my house." — Malachi 3:10. Your giving fuels ministry, missions,
          and the work of the Gospel in Kabarnet and beyond.
        </p>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* M-Pesa Card */}
          <div className="rounded-2xl border-2 border-gold-400 bg-gold-50 p-8 shadow-md">
            <div className="w-14 h-14 rounded-xl bg-gold-500 flex items-center justify-center mb-5">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-royal-900 mb-4">
              Give via M-Pesa
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-royal-700/60 mb-1">Go to M-Pesa Menu</p>
                <p className="font-semibold text-royal-900">Lipa na M-Pesa → Pay Bill</p>
              </div>
              <div>
                <p className="text-sm text-royal-700/60 mb-1">Business Number (Paybill)</p>
                <p className="font-display font-bold text-3xl text-royal-900 tracking-wide flex items-center gap-2">
                  {s?.paybill_number ?? "000000"}
                </p>
              </div>
              <div>
                <p className="text-sm text-royal-700/60 mb-1">Account Number</p>
                <p className="font-semibold text-royal-900">
                  {s?.paybill_account_label ?? "Your Name / Tithe / Offering"}
                </p>
              </div>
              <div>
                <p className="text-sm text-royal-700/60 mb-1">Amount</p>
                <p className="text-royal-700">Enter your tithe or offering amount</p>
              </div>
            </div>

            <p className="text-xs text-royal-700/50 mt-6 leading-relaxed">
              Confirm the recipient name matches "Full Gospel Churches of
              Kenya - Kabarnet" before completing your transaction.
            </p>
          </div>

          {/* Card Payment */}
          <div className="rounded-2xl border border-royal-100 bg-royal-50 p-8 shadow-md">
            <div className="w-14 h-14 rounded-xl bg-royal-700 flex items-center justify-center mb-5">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-royal-900 mb-4">
              Give by Card
            </h2>
            <p className="text-royal-700/70 leading-relaxed mb-6">
              Card giving (Visa/Mastercard) is coming soon. In the meantime,
              you're welcome to give via M-Pesa, or in person during any of
              our services.
            </p>
            <div className="bg-white rounded-xl p-5 border border-royal-100">
              <p className="text-sm font-semibold text-royal-900 mb-1">Prefer to give in person?</p>
              <p className="text-sm text-royal-700/70">
                Offering baskets are available at every service, or speak
                with an usher for assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-16">
          <h3 className="font-display font-bold text-xl text-royal-900 mb-3">
            Why We Give
          </h3>
          <p className="text-royal-700/70 leading-relaxed">
            Tithing is an act of worship and trust in God's provision. Every
            offering supports our ministries — youth outreach, community
            support, church operations, and the spread of the Gospel across
            Baringo County and beyond. Thank you for partnering with us.
          </p>
        </div>
      </section>
    </>
  );
}
