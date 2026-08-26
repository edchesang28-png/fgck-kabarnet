import LocationSection from "@/components/LocationSection";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database";

export const revalidate = 60;

export default async function ContactPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <>
      <section className="bg-royal-gradient py-20 px-4 text-center">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
          Contact & Location
        </h1>
        <p className="text-white/70 max-w-xl mx-auto">
          We would love to hear from you and welcome you in person.
        </p>
      </section>

      <section className="py-20 px-4 bg-royal-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-royal-900 mb-8 text-center">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>
      </section>

      <LocationSection settings={settings as SiteSettings | null} />
    </>
  );
}
