'use client';

import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`
          flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#202020] border border-[var(--notion-border)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-md
        `}
      >
        <div 
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: type === 'success' ? '#448361' : '#ac5454' }}
        />
        <span className="text-sm font-medium opacity-90">{message}</span>
      </div>
    </div>
  );
}