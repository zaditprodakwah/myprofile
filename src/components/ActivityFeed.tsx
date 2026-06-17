'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Activity, GitCommit, CheckCircle2, CloudLightning } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data to simulate live ecosystem activity
const ACTIVITIES = [
  { id: 1, type: 'commit', repo: 'zadit/nextjs-core', message: 'feat: optimize LCP for mobile view', time: 'Just now', icon: GitCommit, color: 'text-teal-accent' },
  { id: 2, type: 'deploy', repo: 'Production Vercel', message: 'Successful deployment to edge network', time: '2 mins ago', icon: CloudLightning, color: 'text-blue-500' },
  { id: 3, type: 'audit', repo: 'Lighthouse CI', message: 'Performance score reached 100/100', time: '15 mins ago', icon: CheckCircle2, color: 'text-green-500' },
  { id: 4, type: 'commit', repo: 'zadit/supabase-schema', message: 'fix: RLS policies for leads table', time: '1 hour ago', icon: GitCommit, color: 'text-teal-accent' },
  { id: 5, type: 'deploy', repo: 'Staging Environment', message: 'Branch merged & built successfully', time: '3 hours ago', icon: CloudLightning, color: 'text-blue-500' }
];

export default function ActivityFeed() {
  const [activeItems, setActiveItems] = useState(ACTIVITIES.slice(0, 3));
  const [isLive, setIsLive] = useState(true);

  // Simulate a live feed rotating items
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setActiveItems(prev => {
        // Rotate: take the last 2, and add a new "random" one from the pool at the top
        const pool = ACTIVITIES.filter(a => !prev.find(p => p.id === a.id));
        if (pool.length === 0) return prev; // All shown
        
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        const newArr = [randomItem, ...prev.slice(0, 2)];
        return newArr;
      });
    }, 8000); // rotate every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-white border border-brand-border/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-brand-border/40 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-accent" />
          <h3 className="text-sm font-heading-sans font-bold text-text-primary uppercase tracking-wider">
            Live Ecosystem
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-accent opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isLive ? "bg-teal-accent" : "bg-text-muted")}></span>
          </span>
          <span className="text-[10px] font-mono text-text-muted uppercase">
            {isLive ? 'System Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4 relative min-h-[180px]">
        <AnimatePresence>
          {activeItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-offwhite transition-colors group"
                layout
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-offwhite border border-brand-border", item.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-heading-sans font-semibold text-text-primary truncate">
                    {item.repo}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                    {item.message}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[10px] font-mono text-text-muted/60">
                    {item.time}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {/* Fader at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <div className="mt-4 pt-4 border-t border-brand-border/40 text-center">
        <a href="https://github.com/zaditprodakwah" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-muted hover:text-teal-accent transition-colors uppercase tracking-wider">
          <GitBranch className="w-3.5 h-3.5" />
          View Full Repository Log
        </a>
      </div>
    </div>
  );
}
