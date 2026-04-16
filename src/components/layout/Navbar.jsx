"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Plus, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">
              AI Study <span className="text-primary-600">Planner</span>
            </span>
          </Link>

          {/* Nav Links */}
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

          {/* CTA Button */}
          <Link href="/goals/new">
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              New Goal
            </Button>
          </Link>

        </div>
      </div>
    </nav>
  );
}