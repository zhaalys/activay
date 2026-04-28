'use client';

import { CalendarEvent, CATEGORY_COLORS, CATEGORY_BG } from '../types/calendar';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, e?: React.MouseEvent) => void;
  showTime?: boolean;
}

export function CalendarEventCard({
  event,
  onClick,
  showTime = true,
}: CalendarEventCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    onClick(event, e);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col gap-0.5 px-2 py-1.5 rounded-sm cursor-pointer transition-all border border-[var(--notion-border)] hover:shadow-sm active:scale-[0.98] mb-1 last:mb-0 overflow-hidden"
      style={{ 
        backgroundColor: event.completed ? '#f1f1f0' : CATEGORY_BG[event.category],
        borderLeft: `4px solid ${event.completed ? '#9b9a97' : CATEGORY_COLORS[event.category]}`
      }}
    >
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${event.completed ? 'opacity-60' : 'opacity-100'}`}>
        <div 
          className="text-[11px] font-bold truncate leading-tight"
          style={{ color: event.completed ? '#787774' : CATEGORY_COLORS[event.category] }}
        >
          {event.title}
        </div>
      </div>
      {showTime && (
        <div className={`text-[9px] font-medium shrink-0 transition-opacity duration-300 ${event.completed ? 'opacity-40 text-[#787774]' : 'opacity-60 text-[#37352f] dark:text-zinc-100'}`}>
          {event.startTime}
        </div>
      )}
    </div>
  );
}