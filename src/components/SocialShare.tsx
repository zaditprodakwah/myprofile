'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, MessageCircle, Send, Check, Hash, Users, Globe } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-[#25D366] hover:bg-[#25D366]/10'
    },
    {
      name: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#229ED9] hover:bg-[#229ED9]/10'
    },
    {
      name: 'X (Twitter)',
      icon: Hash,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#000000] hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/10'
    },
    {
      name: 'LinkedIn',
      icon: Users,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10'
    },
    {
      name: 'Facebook',
      icon: Globe,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10'
    }
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
        Bagikan Artikel
      </span>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share to ${link.name}`}
              className={`w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-text-muted transition-all duration-300 ${link.color}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
        <button
          onClick={handleCopy}
          aria-label="Copy link"
          className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-text-muted hover:text-teal-accent hover:bg-teal-accent/10 hover:border-teal-accent transition-all duration-300 relative group"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-teal-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Link2 className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Tooltip */}
          <span className="absolute -top-8 bg-brand-slate text-white text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {copied ? 'Tersalin!' : 'Salin Tautan'}
          </span>
        </button>
      </div>
    </div>
  );
}
