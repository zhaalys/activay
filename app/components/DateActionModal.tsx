'use client';

import { X, Plus, StickyNote } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';

interface DateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: () => void;
  onAddNote: () => void;
  selectedDate: Date;
  hasNote: boolean;
}

export function DateActionModal({ isOpen, onClose, onAddEvent, onAddNote, selectedDate, hasNote }: DateActionModalProps) {
  const dateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#2f2f2f] rounded-lg shadow-2xl w-full max-w-sm border border-[var(--notion-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--notion-border)]">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold">Pilih Aksi</h2>
            <span className="text-xs text-zinc-400 mt-0.5">{dateString}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--notion-hover)] transition-notion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              onAddEvent();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-[var(--notion-hover)] transition-notion text-left"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Tambah Event</div>
              <div className="text-xs text-zinc-400">Buat acara baru untuk tanggal ini</div>
            </div>
          </button>

          <button
            onClick={() => {
              onAddNote();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-[var(--notion-hover)] transition-notion text-left"
          >
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
              <StickyNote className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-medium">{hasNote ? 'Edit Catatan' : 'Tulis Catatan'}</div>
              <div className="text-xs text-zinc-400">{hasNote ? 'Ubah catatan untuk tanggal ini' : 'Buat catatan baru untuk tanggal ini'}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
