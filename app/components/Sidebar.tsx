'use client';

import { CalendarEvent, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_BG } from '../types/calendar';
import { Clock, Plus, Settings, Trash2 } from 'lucide-react';

interface SidebarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onNewEvent: () => void;
  onClearAll: () => void;
}

export function Sidebar({ events, onEventClick, onNewEvent, onClearAll }: SidebarProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const sortedEvents = [...events].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[var(--notion-border)] bg-[var(--notion-sidebar)] flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center justify-between px-2 py-1 mb-4">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Today</span>
          <span className="text-[11px] font-medium text-zinc-400">{dateString}</span>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="px-2 py-4 flex flex-col items-center justify-center text-center opacity-40">
            <Clock className="w-8 h-8 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">No events for today</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="group relative flex flex-col px-4 py-3 border border-[var(--notion-border)] hover:shadow-md transition-all cursor-pointer overflow-hidden"
                style={{ 
                  backgroundColor: event.completed ? '#f1f1f0' : CATEGORY_BG[event.category],
                  borderLeft: `4px solid ${event.completed ? '#9b9a97' : CATEGORY_COLORS[event.category]}`
                }}
              >
                <div className={`transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className={`text-sm font-bold leading-tight truncate ${event.completed ? 'opacity-50' : ''}`}
                      style={{ color: event.completed ? '#787774' : CATEGORY_COLORS[event.category] }}
                    >
                      {event.title}
                    </span>
                    <div className={`text-[10px] font-bold ${event.completed ? 'text-[#787774] opacity-40' : 'opacity-60'}`}>
                      {event.startTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                      style={{ 
                        backgroundColor: event.completed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)', 
                        color: event.completed ? '#9b9a97' : CATEGORY_COLORS[event.category] 
                      }}
                    >
                      {CATEGORY_LABELS[event.category]}
                    </div>
                    {event.description && (
                      <span className={`text-[10px] truncate ${event.completed ? 'text-[#787774] opacity-30' : 'opacity-50'}`}>
                        {event.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--notion-border)] flex flex-col gap-1">
        <button 
          onClick={onNewEvent}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] transition-notion text-sm opacity-60"
        >
          <Plus className="w-4 h-4" />
          <span>New page</span>
        </button>
        <button 
          onClick={onClearAll}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] transition-notion text-sm opacity-60 text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear all data</span>
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] transition-notion text-sm opacity-60">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}