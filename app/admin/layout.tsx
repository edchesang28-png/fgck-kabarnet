"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  Play,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/sermons", label: "Sermons", icon: Play },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page renders standalone, without the dashboard chrome
  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-royal-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-900 text-white flex-col hidden md:flex fixed h-screen">
        <div className="p-6 border-b border-white/10">
          <p className="font-display font-bold text-lg">FGCK Kabarnet</p>
          <p className="text-gold-400 text-xs">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold-500 text-royal-900"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-burgundy-600 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-royal-900 text-white z-40 px-4 py-3 flex items-center justify-between">
        <p className="font-display font-bold">FGCK Admin</p>
        <button onClick={handleLogout} className="text-white/70 text-sm flex items-center gap-1.5">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-royal-900 text-white z-40 flex justify-around py-2 border-t border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] font-medium ${
                active ? "text-gold-400" : "text-white/60"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
