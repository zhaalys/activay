'use client';

import { useState, useCallback, useMemo } from 'react';
import { CalendarHeader, CalendarGrid, EventModal, Sidebar, Toast, NoteModal, DateActionModal } from './components';
import { useCalendar } from './hooks/useCalendar';
import { useEvents } from './hooks/useEvents';
import { useNotes } from './hooks/useNotes';
import { CalendarEvent, Note } from './types/calendar';

export default function Home() {
  const {
    monthName,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    isCalendarLoaded,
  } = useCalendar();

  const {
    isLoaded: isEventsLoaded,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    getTodayEvents,
  } = useEvents();

  const {
    isLoaded: isNotesLoaded,
    saveNote,
    getTodayNote,
    getNoteForDate,
  } = useNotes();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDateActionOpen, setIsDateActionOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsDateActionOpen(true);
  }, []);

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setModalMode('create');
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
    if (modalMode === 'edit' && 'id' in eventData) {
      updateEvent(eventData.id, eventData);
      showToast('Event updated');
    } else {
      addEvent(eventData);
      showToast('Event added');
    }
  }, [modalMode, addEvent, updateEvent, showToast]);

  const handleDeleteEvent = useCallback((id: string) => {
    deleteEvent(id);
    showToast('Event deleted');
  }, [deleteEvent, showToast]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleClearAll = useCallback(() => {
    if (confirm('Clear all events? This action cannot be undone.')) {
      localStorage.removeItem('activay_events');
      window.location.reload();
    }
  }, []);

  const handleSaveNote = useCallback((content: string) => {
    saveNote(selectedDate, content);
    setIsNoteModalOpen(false);
    showToast('Catatan disimpan');
  }, [saveNote, selectedDate, showToast]);

  const handleOpenNote = useCallback(() => {
    setIsNoteModalOpen(true);
  }, []);

  const handleNoteClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsNoteModalOpen(true);
  }, []);

  const todayEvents = useMemo(() => {
    return getTodayEvents();
  }, [getTodayEvents]);

  const todayNote = useMemo(() => {
    return getTodayNote();
  }, [getTodayNote]);

  if (!isCalendarLoaded || !isEventsLoaded || !isNotesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isCalendarLoaded || !isEventsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#191919]">
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#191919] text-[var(--foreground)] selection:bg-[rgba(35,131,226,0.28)]">
      <CalendarHeader
        monthName={monthName}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-[#191919]">
          <CalendarGrid
            days={calendarDays}
            getEventsForDate={getEventsForDate}
            getNoteForDate={getNoteForDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onNoteClick={handleNoteClick}
          />
        </div>

        <Sidebar
          events={todayEvents}
          onEventClick={handleEventClick}
          onNewEvent={() => handleDateClick(new Date())}
          onClearAll={handleClearAll}
          onNewNote={handleOpenNote}
          hasNote={!!todayNote}
          todayNote={todayNote}
        />
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
        mode={modalMode}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        note={getNoteForDate(selectedDate)}
        selectedDate={selectedDate}
      />

      <DateActionModal
        isOpen={isDateActionOpen}
        onClose={() => setIsDateActionOpen(false)}
        onAddEvent={handleAddEvent}
        onAddNote={() => {
          setIsDateActionOpen(false);
          setIsNoteModalOpen(true);
        }}
        selectedDate={selectedDate}
        hasNote={!!getNoteForDate(selectedDate)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}