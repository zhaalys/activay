'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';

const STORAGE_KEY = 'activay_events';

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch {
      setEvents([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      const dateStr = formatDate(date);
      return events.filter(event => event.date === dateStr);
    },
    [events]
  );

  const addEvent = useCallback(
    (eventData: Omit<CalendarEvent, 'id'>) => {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: crypto.randomUUID(),
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    },
    []
  );

  const updateEvent = useCallback(
    (id: string, eventData: Partial<Omit<CalendarEvent, 'id'>>) => {
      setEvents(prev =>
        prev.map(event => (event.id === id ? { ...event, ...eventData } : event))
      );
    },
    []
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setEvents(prev =>
      prev.map(event => (event.id === id ? { ...event, completed: !event.completed } : event))
    );
  }, []);

  const getTodayEvents = useCallback((): CalendarEvent[] => {
    return getEventsForDate(new Date());
  }, [getEventsForDate]);

  return {
    events,
    isLoaded,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
    getTodayEvents,
    formatDate,
  };
}