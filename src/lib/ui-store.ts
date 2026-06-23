import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type EventCallback = (data?: any) => void;
const listeners: Record<string, EventCallback[]> = {};

function emit(event: string, data?: any) {
  if (listeners[event]) {
    listeners[event].forEach(cb => cb(data));
  }
}

function on(event: string, callback: EventCallback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };
}

export const toast = {
  success: (message: string) => emit('TOAST', { id: Date.now().toString(), message, type: 'success' }),
  error: (message: string) => emit('TOAST', { id: Date.now().toString(), message, type: 'error' }),
  info: (message: string) => emit('TOAST', { id: Date.now().toString(), message, type: 'info' })
};

export const globalLoading = {
  show: (message?: string) => emit('LOADING', { show: true, message }),
  hide: () => emit('LOADING', { show: false })
};

export function useGlobalUI() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  useEffect(() => {
    const unsubToast = on('TOAST', (t: Toast) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(item => item.id !== t.id));
      }, 5000); 
    });

    const unsubLoading = on('LOADING', (data: { show: boolean, message?: string }) => {
      setIsLoading(data.show);
      setLoadingMsg(data.message || 'Memproses...');
    });

    return () => {
      unsubToast();
      unsubLoading();
    };
  }, []);

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return { toasts, isLoading, loadingMsg, removeToast };
}
