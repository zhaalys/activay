'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Tag, Bell, Trash2, Calendar as CalendarIcon, Check, MoreHorizontal } from 'lucide-react';
import { 
  CalendarEvent, 
  Category, 
  ReminderOption, 
  CATEGORY_COLORS, 
  CATEGORY_LABELS, 
  REMINDER_OPTIONS,
  CATEGORY_BG
} from '../types/calendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete: (id: string) => void;
  event: CalendarEvent | null;
  selectedDate: Date;
  mode: 'create' | 'edit';
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
  mode,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [completed, setCompleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && event) {
        setTitle(event.title);
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setDescription(event.description);
        setCategory(event.category);
        setReminder(event.reminder);
        setCompleted(!!event.completed);
      } else {
        setTitle('');
        setStartTime('09:00');
        setEndTime('10:00');
        setDescription('');
        setCategory('work');
        setReminder('none');
        setCompleted(false);
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, mode, event]);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Gunakan local date format YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const eventData = {
      title: title.trim(),
      date: dateStr,
      startTime,
      endTime,
      description: description.trim(),
      category,
      reminder,
      completed,
    };

    if (mode === 'edit' && event) {
      onSave({ ...eventData, id: event.id });
    } else {
      onSave(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/40 transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#191919] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[var(--notion-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--notion-border)]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 opacity-40" />
            <span className="text-[11px] font-medium opacity-40 uppercase tracking-widest">Page / Event</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-[var(--notion-hover)] transition-notion">
              <MoreHorizontal className="w-4 h-4 opacity-40" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[var(--notion-hover)] transition-notion"
            >
              <X className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-10 space-y-8">
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:opacity-20 text-[var(--foreground)]"
            autoFocus
            required
          />

          <div className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center text-sm">
              <div className="flex items-center gap-2 opacity-40">
                <Check className="w-4 h-4" />
                <span>Status</span>
              </div>
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className="flex items-center gap-2 hover:bg-[var(--notion-hover)] rounded px-2 py-1 transition-notion w-fit group"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  completed ? 'bg-[#448361] border-[#448361]' : 'border-zinc-300 dark:border-zinc-700'
                }`}>
                  {completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`transition-all ${completed ? 'font-medium text-[#448361]' : 'opacity-40 group-hover:opacity-100'}`}>
                  {completed ? 'Completed' : 'Mark as done'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center text-sm">
              <div className="flex items-center gap-2 opacity-40">
                <CalendarIcon className="w-4 h-4" />
                <span>Date</span>
              </div>
              <div className="font-medium">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center text-sm">
              <div className="flex items-center gap-2 opacity-40">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 cursor-pointer hover:bg-[var(--notion-hover)] rounded px-1 transition-notion"
                />
                <span className="opacity-40">—</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 cursor-pointer hover:bg-[var(--notion-hover)] rounded px-1 transition-notion"
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center text-sm">
              <div className="flex items-center gap-2 opacity-40">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-notion ${
                      category === cat
                        ? 'shadow-sm'
                        : 'hover:bg-[var(--notion-hover)]'
                    }`}
                    style={{ 
                      backgroundColor: category === cat ? CATEGORY_BG[cat] : 'transparent',
                      color: category === cat ? CATEGORY_COLORS[cat] : 'inherit'
                    }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-start text-sm">
              <div className="flex items-center gap-2 opacity-40 mt-1">
                <AlignLeft className="w-4 h-4" />
                <span>Description</span>
              </div>
              <textarea
                placeholder="Empty"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:opacity-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center text-sm">
              <div className="flex items-center gap-2 opacity-40">
                <Bell className="w-4 h-4" />
                <span>Reminder</span>
              </div>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value as ReminderOption)}
                className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 cursor-pointer hover:bg-[var(--notion-hover)] rounded px-1 transition-notion appearance-none"
              >
                {REMINDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-[var(--notion-border)]">
            <div className="flex gap-2">
              {mode === 'edit' && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-notion"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete page
                </button>
              )}
              {mode === 'edit' && showDeleteConfirm && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-notion"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-notion"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-medium hover:bg-[var(--notion-hover)] rounded transition-notion"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 bg-[#2383e2] text-white text-xs font-medium rounded shadow-sm hover:bg-[#1d6fc1] disabled:opacity-30 transition-notion"
              >
                {mode === 'edit' ? 'Save changes' : 'Create event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}