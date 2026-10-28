'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Utensils, LayoutDashboard, Search, User, History, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/meals', label: 'Meal Plan', icon: Sparkles },
    { href: '/recipes', label: 'Recipe Catalog', icon: Search },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5 text-emerald-950 font-bold" />
          </div>
          <div>
            <span className="font-bold text-lg text-emerald-100 tracking-tight block">NutriBharat ML</span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase block -mt-1">IFCT 2017 Powered</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800/60 text-amber-300 border border-emerald-700/50'
                    : 'text-emerald-200 hover:bg-emerald-900/50 hover:text-emerald-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Plan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
