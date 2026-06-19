'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Activity, GitCommit, GitPullRequest, GitMerge, Star, Code, CloudLightning } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActivityFeed() {
  const [activeItems, setActiveItems] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubEvents() {
      try {
        const res = await fetch('https://api.github.com/users/zaditprodakwah/events/public', {
          // GitHub API version header
          headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        // Map GitHub events to our UI format
        const mapped = data.slice(0, 5).map((ev: any) => {
          let icon = GitCommit;
          let color = 'text-teal-accent';
          let message = 'Repository activity';

          if (ev.type === 'PushEvent') {
            icon = GitCommit;
            color = 'text-blue-500';
            message = ev.payload.commits?.[0]?.message || 'Pushed commits';
          } else if (ev.type === 'PullRequestEvent') {
            icon = GitPullRequest;
            color = 'text-emerald-500';
            message = `${ev.payload.action} pull request`;
          } else if (ev.type === 'WatchEvent') {
            icon = Star;
            color = 'text-amber-500';
            message = 'Starred a repository';
          } else if (ev.type === 'CreateEvent') {
            icon = Code;
            color = 'text-violet-500';
            message = `Created ${ev.payload.ref_type || 'repository'}`;
          }

          // simple relative time
          const date = new Date(ev.created_at);
          const now = new Date();
          const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
          let timeStr = diffMins < 60 ? `${diffMins} mins ago` : `${Math.floor(diffMins/60)} hrs ago`;
          if (diffMins === 0) timeStr = 'Just now';

          return {
            id: ev.id,
            repo: ev.repo.name,
            message,
            time: timeStr,
            icon,
            color
          };
        });

        setActiveItems(mapped);
      } catch (err) {
        console.error('GitHub fetch error', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubEvents();
  }, []);

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
            {isLive && !isLoading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-accent opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isLive ? "bg-teal-accent" : "bg-text-muted")}></span>
          </span>
          <span className="text-[10px] font-mono text-text-muted uppercase">
            {isLoading ? 'Fetching...' : isLive ? 'System Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4 relative min-h-[180px]">
        {isLoading && activeItems.length === 0 ? (
          <div className="flex items-center justify-center h-[180px]">
            <span className="text-xs text-text-muted font-mono animate-pulse">Syncing GitHub data...</span>
          </div>
        ) : (
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
        )}
        
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
