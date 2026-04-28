'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { DayData } from '../types/calendar';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    setToday(new Date());
  }, []);

  const initializedDate = currentDate ?? new Date(2026, 3, 28);
  const initializedToday = today ?? new Date(2026, 3, 28);

  const currentMonth = initializedDate.getMonth();
  const currentYear = initializedDate.getFullYear();

  const monthName = useMemo(() => {
    return initializedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [initializedDate]);

  const calendarDays = useMemo(() => {
    const days: DayData[] = [];
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    for (let i = adjustedStart - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date,
        day,
        month: currentMonth - 1,
        year: currentYear,
        isCurrentMonth: false,
        isToday: isSameDay(date, initializedToday),
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isSameDay(date, initializedToday),
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        day,
        month: currentMonth + 1,
        year: currentYear,
        isCurrentMonth: false,
        isToday: isSameDay(date, initializedToday),
      });
    }
    
    return days;
  }, [currentMonth, currentYear, initializedToday]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => new Date((prev ?? new Date()).getFullYear(), (prev ?? new Date()).getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date((prev ?? new Date()).getFullYear(), (prev ?? new Date()).getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentDate(now);
    setToday(now);
  }, []);

  return {
    currentDate: initializedDate,
    currentMonth,
    currentYear,
    monthName,
    calendarDays,
    today: initializedToday,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    isCalendarLoaded: currentDate !== null && today !== null,
  };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}