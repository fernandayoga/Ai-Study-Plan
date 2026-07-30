"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Plus, Sparkles, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const disableDashboardPaths = ["/dashboard"]; 

const disabledPath = ["/goals/new", "/goals/[id]"]; // Path yang dianggap "aktif" tapi belum ada link di navbar
export default function Navbar() {
  const pathname = usePathname();
  console.log("Current path:", pathname); // Debugging: cek path saat ini
  const showNavLinks = !disabledPath.includes(pathname); 
  const ShowDashboard = !disableDashboardPaths.includes(pathname);

  // Sembunyikan Navbar di halaman login dan register
  if (["/login", "/register","/"].includes(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white">
              AI Study <span className="text-primary-400">Planner</span>
            </span>
          </Link>

          {/* Nav Links */}
          {/* { ShowDashboard && (
            <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-surface-100"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          )} */}
          

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* {showNavLinks && (
              <Link href="/goals/new">
                <Button size="sm">
                  <Plus size={16} className="mr-1.5" />
                  New Goal
                </Button>
              </Link>
            )} */}

            {!["/", "/login", "/register"].includes(pathname) && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
              >
                <LogOut size={16} className="mr-1.5" />
                Logout
              </Button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}