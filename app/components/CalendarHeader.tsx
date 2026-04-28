'use client';

import { ChevronLeft, ChevronRight, Calendar, MoreHorizontal } from 'lucide-react';

interface CalendarHeaderProps {
  monthName: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  monthName,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 bg-white dark:bg-[#191919] border-b border-[var(--notion-border)]">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--notion-hover)] cursor-pointer transition-notion">
          <Calendar className="w-4 h-4 opacity-60" />
          <span className="text-sm font-medium truncate">Activay / {monthName}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToday}
          className="px-2 py-1 text-sm rounded hover:bg-[var(--notion-hover)] transition-notion"
        >
          Today
        </button>
        
        <div className="flex items-center ml-1">
          <button
            onClick={onPreviousMonth}
            className="p-1 rounded hover:bg-[var(--notion-hover)] transition-notion"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 opacity-60" />
          </button>
          
          <button
            onClick={onNextMonth}
            className="p-1 rounded hover:bg-[var(--notion-hover)] transition-notion"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </div>

        <button className="p-1 ml-2 rounded hover:bg-[var(--notion-hover)] transition-notion">
          <MoreHorizontal className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </header>
  );
}