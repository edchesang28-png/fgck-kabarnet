import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-royal-900 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display font-bold text-xl text-white mb-3">
            Full Gospel Churches <span className="text-gold-400">of Kenya</span>
          </p>
          <p className="text-sm leading-relaxed">
            Kabarnet, Baringo County — a Spirit-filled family proclaiming the
            full Gospel of Jesus Christ under the leadership of Bishop
            Cheptarus.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 hover:text-royal-900 flex items-center justify-center transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 hover:text-royal-900 flex items-center justify-center transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white mb-4">Quick Links</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-gold-400">About Us</Link></li>
            <li><Link href="/sermons" className="hover:text-gold-400">Sermons & Media</Link></li>
            <li><Link href="/ministries" className="hover:text-gold-400">Ministries</Link></li>
            <li><Link href="/giving" className="hover:text-gold-400">Giving & Tithe</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-4">Service Times</p>
          <ul className="space-y-2.5 text-sm">
            <li>Sunday — 8:00 AM & 10:30 AM</li>
            <li>Wednesday — 5:30 PM Bible Study</li>
            <li>Friday — 5:30 PM Youth Service</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-4">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-400" />
              Kabarnet, Baringo County, Kenya
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 text-gold-400" />
              +254 7XX XXX XXX
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0 text-gold-400" />
              info@fgckkabarnet.org
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Full Gospel Churches of Kenya — Kabarnet. All rights reserved.
        <Link href="/admin/login" className="ml-2 hover:text-gold-400">Admin</Link>
      </div>
    </footer>
  );
}
