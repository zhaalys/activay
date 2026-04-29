export type Category = 'work' | 'personal' | 'meeting' | 'reminder';

export type ReminderOption = 'none' | '5min' | '15min' | '30min' | '1hour';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  category: Category;
  reminder: ReminderOption;
  completed?: boolean;
}

export interface DayData {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  work: '#337ea9', // Notion Blue
  personal: '#ac5454', // Notion Brown/Red
  meeting: '#d9730d', // Notion Orange
  reminder: '#448361', // Notion Green
};

export const CATEGORY_BG: Record<Category, string> = {
  work: '#e7f3f8',
  personal: '#f5e0e0',
  meeting: '#faebdd',
  reminder: '#eaf2ed',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  work: 'Work',
  personal: 'Personal',
  meeting: 'Meeting',
  reminder: 'Reminder',
};

export const REMINDER_OPTIONS: { value: ReminderOption; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '5min', label: '5 minutes before' },
  { value: '15min', label: '15 minutes before' },
  { value: '30min', label: '30 minutes before' },
  { value: '1hour', label: '1 hour before' },
];

export interface Note {
  id: string;
  date: string;
  content: string;
  updatedAt: string;
}