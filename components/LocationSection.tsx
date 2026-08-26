import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import type { SiteSettings } from "@/types/database";

interface Props {
  settings: SiteSettings | null;
}

export default function LocationSection({ settings }: Props) {
  const lat = settings?.latitude ?? 0.4919;
  const lng = settings?.longitude ?? 35.7419;
  const address = settings?.church_address ?? "FGCK Kabarnet, Baringo County, Kenya";

  // Google Maps embed — no API key required for the basic embed iframe
  const mapEmbedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-burgundy-600 font-semibold tracking-widest uppercase text-sm mb-2">
            Come Visit Us
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-royal-900">
            Find Our Church in Kabarnet
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-xl border border-royal-100">
          {/* Info panel */}
          <div className="lg:col-span-2 bg-royal-gradient p-8 sm:p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-2xl mb-6">
                Visit Us This Sunday
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-white/70 text-sm mt-1">{address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Service Times</p>
                    <ul className="text-white/70 text-sm mt-1 space-y-1">
                      <li>{settings?.sunday_service_1 ?? "8:00 AM — First Service"}</li>
                      <li>{settings?.sunday_service_2 ?? "10:30 AM — Main Service"}</li>
                      <li>{settings?.wednesday_service ?? "Wed 5:30 PM — Bible Study"}</li>
                      <li>{settings?.friday_service ?? "Fri 5:30 PM — Youth Service"}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-white/70 text-sm mt-1">
                      {settings?.church_phone_1 ?? "+254 7XX XXX XXX"}
                      {settings?.church_phone_2 ? ` · ${settings.church_phone_2}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-white/70 text-sm mt-1">
                      {settings?.church_email ?? "info@fgckkabarnet.org"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-8 w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-royal-900 font-bold px-6 py-3.5 rounded-full shadow-md transition-colors"
            >
              <Navigation className="w-5 h-5" /> Get Directions
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 min-h-[400px] lg:min-h-full">
            <iframe
              title="FGCK Kabarnet location map"
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
