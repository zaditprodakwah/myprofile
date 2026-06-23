'use client';
import { useGlobalUI } from '@/lib/ui-store';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export function GlobalUI() {
  const { toasts, isLoading, loadingMsg, removeToast } = useGlobalUI();

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl max-w-xs text-center">
              <Loader2 className="w-10 h-10 text-teal-accent animate-spin" />
              <p className="text-sm font-sans font-medium text-text-primary">{loadingMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`pointer-events-auto rounded-xl p-4 shadow-lg border flex items-start gap-3 bg-white`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-sans text-text-primary">{t.message}</p>
              </div>
              <button onClick={() => removeToast(t.id)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
