'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'process', label: 'Proses' },
  { id: 'case-studies', label: 'Studi Kasus' },
  { id: 'services', label: 'Layanan' },
  { id: 'contact', label: 'Kemitraan' },
];

export default function SidebarNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers = navItems.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 bg-white/85 backdrop-blur-md p-3 rounded-full border border-brand-border shadow-sm">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group relative flex items-center justify-end"
          aria-label={`Scroll ke ${item.label}`}
        >
          <span className="absolute right-8 scale-0 group-hover:scale-100 transition-all origin-right bg-brand-slate text-alabaster border border-brand-slate text-xs px-2.5 py-1 rounded font-mono uppercase tracking-wider whitespace-nowrap pointer-events-none">
            {item.label}
          </span>
          <span
            className={cn(
              "w-3.5 h-3.5 rounded-full transition-all border",
              activeSection === item.id
                ? "bg-teal-accent border-teal-accent scale-125 shadow-[0_0_10px_rgba(13,148,136,0.3)]"
                : "bg-transparent border-brand-border hover:border-teal-accent hover:scale-110"
            )}
          />
        </a>
      ))}
    </div>
  );
}
