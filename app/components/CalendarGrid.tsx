'use client';

import React from 'react';
import { DayData, CalendarEvent } from '../types/calendar';
import { CalendarEventCard } from './EventCard';

interface CalendarGridProps {
  days: DayData[];
  getEventsForDate: (date: Date) => CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e?: React.MouseEvent) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarGrid({ days, getEventsForDate, onDateClick, onEventClick }: CalendarGridProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#191919]">
      <div className="grid grid-cols-7 border-b border-[var(--notion-border)]">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="py-1.5 text-center text-[11px] font-medium text-zinc-400 uppercase tracking-tight"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-auto custom-scrollbar">
        {days.map((dayData, index) => {
          const dayEvents = getEventsForDate(dayData.date);
          return (
            <DayCell
              key={index}
              dayData={dayData}
              events={dayEvents}
              onDateClick={onDateClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface DayCellProps {
  dayData: DayData;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e?: React.MouseEvent) => void;
}

function DayCell({ dayData, events, onDateClick, onEventClick }: DayCellProps) {
  const { day, isCurrentMonth, isToday, date } = dayData;

  return (
    <div
      onClick={() => onDateClick(date)}
      className={`
        min-h-[120px] p-2 border-b border-r border-[var(--notion-border)] cursor-default
        transition-notion group relative
        ${!isCurrentMonth ? 'bg-[var(--notion-sidebar)]/30 opacity-40' : 'bg-white dark:bg-[#191919]'}
        hover:bg-[var(--notion-hover)]
      `}
    >
      <div className="flex items-center justify-center mb-2">
        <span
          className={`
            text-[13px] font-medium w-6 h-6 flex items-center justify-center rounded-full
            ${isToday 
              ? 'bg-[#2383e2] text-white' 
              : 'text-[var(--foreground)] opacity-70'
            }
          `}
        >
          {day}
        </span>
      </div>

      <div className="space-y-0.5">
        {events.map(event => (
          <CalendarEventCard
            key={event.id}
            event={event}
            onClick={(evt, ev) => {
              if (ev) ev.stopPropagation();
              onEventClick(event, ev || undefined);
            }}
          />
        ))}
      </div>
    </div>
  );
}