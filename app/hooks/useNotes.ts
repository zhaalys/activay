'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/calendar';

const STORAGE_KEY = 'activay_notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch {
      setNotes([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNoteForDate = useCallback(
    (date: Date): Note | undefined => {
      const dateStr = formatDate(date);
      return notes.find(note => note.date === dateStr);
    },
    [notes]
  );

  const saveNote = useCallback(
    (date: Date, content: string) => {
      const dateStr = formatDate(date);
      const now = new Date().toISOString();
      setNotes(prev => {
        const existingIndex = prev.findIndex(note => note.date === dateStr);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], content, updatedAt: now };
          return updated;
        }
        return [...prev, { id: crypto.randomUUID(), date: dateStr, content, updatedAt: now }];
      });
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const getTodayNote = useCallback((): Note | undefined => {
    return getNoteForDate(new Date());
  }, [getNoteForDate]);

  return {
    notes,
    isLoaded,
    getNoteForDate,
    saveNote,
    deleteNote,
    getTodayNote,
    formatDate,
  };
}
