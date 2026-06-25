"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Bell,
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  FileText,
  MessageSquare,
  Shield,
  Hotel,
  Settings,
  UserCog,
  Mail,
  Send,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: MessageSquare },
  { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
  { label: "Hospitals", href: "/admin/hospitals", icon: Building2 },
  { label: "Treatments", href: "/admin/treatments", icon: FileText },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: Users },
  { label: "Insurance", href: "/admin/insurance", icon: Shield },
  { label: "Hotels", href: "/admin/hotels", icon: Hotel },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { label: "Email Marketing", href: "/admin/email-marketing", icon: Send },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const activePage = sidebarLinks
    .slice()
    .reverse()
    .find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-hairline-dark p-6">
        <Link href="/admin" className="font-display text-heading-sm tracking-wide text-on-primary">
          Asians <span className="text-link-mint">Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebar(false)}
          className="text-link-cool-2 hover:text-on-primary lg:hidden"
          aria-label="Close admin navigation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="border-b border-hairline-dark px-4 py-3">
        <p className="text-micro uppercase tracking-[0.12em] text-link-cool-2">Operations Console</p>
        <p className="mt-1 text-caption text-link-cool-3">Inquiries, partners, content, and settings</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileSidebar(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 text-caption transition-colors",
                isActive
                  ? "bg-canvas-night-elevated text-on-primary"
                  : "text-link-cool-2 hover:bg-canvas-night-elevated hover:text-on-primary"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-hairline-dark p-4">
        <Link href="/" className="flex items-center gap-2 rounded-md px-4 py-3 text-caption text-link-cool-2 transition-colors hover:bg-canvas-night-elevated hover:text-on-primary">
          <ArrowLeft size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-4 py-3 text-caption text-link-cool-2 transition-colors hover:bg-canvas-night-elevated hover:text-red-400"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-canvas-cream overflow-x-hidden">
      <aside className="fixed hidden h-full w-64 shrink-0 flex-col bg-canvas-night text-on-primary lg:flex">
        {sidebar}
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
          <aside className="relative h-full w-64 bg-canvas-night">{sidebar}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-hairline-light bg-canvas-light/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebar(true)}
                className="-ml-1 p-1 text-ink lg:hidden"
                aria-label="Open admin navigation"
              >
                <Menu size={24} />
              </button>
              <div>
                <p className="text-micro uppercase tracking-[0.12em] text-shade-40">Admin Panel</p>
                <h1 className="font-display text-heading-sm text-ink">{activePage?.label || "Dashboard"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hidden text-sm sm:inline-flex btn-outline !px-4 !py-2">
                View Site
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline-light text-shade-50 transition-colors hover:bg-canvas-cream hover:text-ink"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}
