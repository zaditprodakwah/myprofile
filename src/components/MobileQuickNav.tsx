'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderSearch, Activity, BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileQuickNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/directory', label: 'B2B', icon: FolderSearch },
    { href: '/utility/audit-engine', label: 'Audit', icon: Activity },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ];

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden w-[90%] max-w-sm">
      <nav className="bg-brand-slate/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-full py-2.5 px-6 shadow-2xl flex justify-between items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-teal-accent transition-colors duration-200 relative p-1.5 focus:outline-none"
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-accent' : ''}`} />
              <span className={`text-[8px] font-mono tracking-wider uppercase ${isActive ? 'text-teal-accent font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 w-1 h-1 bg-teal-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Search Trigger inside Dock */}
        <button
          onClick={triggerSearch}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-teal-accent transition-colors duration-200 p-1.5 focus:outline-none cursor-pointer"
          aria-label="Cari"
        >
          <Search className="w-5 h-5" />
          <span className="text-[8px] font-mono tracking-wider uppercase">Cari</span>
        </button>
      </nav>
    </div>
  );
}
