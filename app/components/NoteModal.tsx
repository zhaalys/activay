'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Note } from '../types/calendar';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  note?: Note | null;
  selectedDate: Date;
}

export function NoteModal({ isOpen, onClose, onSave, note, selectedDate }: NoteModalProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (isOpen) {
      setContent(note?.content || '');
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, note]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#2f2f2f] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-[var(--notion-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--notion-border)]">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Catatan</h2>
            <span className="text-xs text-zinc-400 mt-0.5">{dateString}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis catatan untuk hari ini..."
            className="w-full h-64 resize-none bg-transparent text-sm leading-relaxed placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--notion-border)]">
          <span className="text-xs text-zinc-400">
            {note ? 'Terakhir diubah: ' + new Date(note.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Catatan baru'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded hover:bg-[var(--notion-hover)] transition-notion"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#337ea9] text-white rounded hover:bg-[#2b6d94] transition-notion disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
