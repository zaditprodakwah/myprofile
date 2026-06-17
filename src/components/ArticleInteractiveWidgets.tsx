'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Volume2, Eye } from 'lucide-react';

export default function ArticleInteractiveWidgets({ articleId }: { articleId?: string }) {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate fetching views and likes from API or LocalStorage
    const storedLikes = localStorage.getItem(`likes_${articleId}`);
    const storedViews = localStorage.getItem(`views_${articleId}`);
    
    setLikes(storedLikes ? parseInt(storedLikes) : Math.floor(Math.random() * 50) + 10);
    
    const newViews = (storedViews ? parseInt(storedViews) : Math.floor(Math.random() * 500) + 100) + 1;
    setViews(newViews);
    localStorage.setItem(`views_${articleId}`, newViews.toString());
  }, [articleId]);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      localStorage.setItem(`likes_${articleId}`, (likes + 1).toString());
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
      localStorage.setItem(`likes_${articleId}`, (likes - 1).toString());
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Maaf, browser Anda tidak mendukung fitur Voice Reader.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Grab text from the article content
    const articleBody = document.getElementById('article-content');
    if (articleBody) {
      const text = articleBody.innerText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian
      utterance.rate = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // cleanup TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4 py-4 border-y border-brand-border my-6">
      <button 
        onClick={handleLike} 
        className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono transition-colors ${isLiked ? 'text-red-500' : 'text-text-muted hover:text-red-500'}`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likes} Likes
      </button>
      
      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted">
        <Eye className="w-4 h-4" /> {views} Views
      </span>

      <div className="flex-1" />

      <button 
        onClick={handleTTS} 
        className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono transition-colors ${isPlaying ? 'text-teal-accent' : 'text-text-muted hover:text-teal-accent'}`}
        title="Dengarkan Artikel"
      >
        <Volume2 className="w-4 h-4" /> {isPlaying ? 'Berhenti' : 'Dengarkan'}
      </button>

      <button 
        onClick={handleBookmark} 
        className={`inline-flex items-center gap-1.5 text-xs font-bold font-mono transition-colors ${isBookmarked ? 'text-gold-accent' : 'text-text-muted hover:text-gold-accent'}`}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} /> Simpan
      </button>
    </div>
  );
}
