'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  availability?: string[];
  onDateSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
  minDate?: Date;
  pricePerNight?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BookingCalendar({
  availability = [],
  onDateSelect,
  minDate = new Date(),
  pricePerNight = 50,
}: BookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const unavailableDates = useMemo(() => new Set(availability), [availability]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isPrevDisabled = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.has(dateStr) || date < today;
  };

  const isDateInRange = (date: Date) => {
    const start = checkIn;
    const end = checkIn && (checkOut || hoverDate);
    if (!start || !end) return false;
    const [s, e] = start <= end ? [start, end] : [end, start];
    return date > s && date < e;
  };

  const isCheckIn = (date: Date) => checkIn?.toDateString() === date.toDateString();
  const isCheckOut = (date: Date) => checkOut?.toDateString() === date.toDateString();

  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      onDateSelect?.(date, null);
    } else if (date > checkIn) {
      const range = Array.from({ length: Math.ceil((date.getTime() - checkIn.getTime()) / 86400000) + 1 },
        (_, i) => new Date(checkIn.getTime() + i * 86400000));
      const hasBlocked = range.some(d => isDateUnavailable(d));
      if (hasBlocked) {
        setCheckIn(date);
        setCheckOut(null);
        onDateSelect?.(date, null);
      } else {
        setCheckOut(date);
        onDateSelect?.(checkIn, date);
      }
    } else {
      setCheckIn(date);
      setCheckOut(null);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * pricePerNight;
  };

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), disabled: true, prevMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ date, disabled: isDateUnavailable(date), prevMonth: false });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: new Date(year, month + 1, d), disabled: true, prevMonth: false });
  }

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <button onClick={prevMonth} disabled={isPrevDisabled}
          className={cn('p-2 border border-[var(--border)] hover:border-[var(--gold)] transition-colors', isPrevDisabled && 'opacity-30 cursor-not-allowed')}>
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-serif text-lg text-white">{MONTHS[month]} {year}</h3>
        <button onClick={nextMonth} className="p-2 border border-[var(--border)] hover:border-[var(--gold)] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest font-bold">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map(({ date, disabled, prevMonth: isPrev }, i) => {
          const inRange = isDateInRange(date);
          const isStart = isCheckIn(date);
          const isEnd = isCheckOut(date);
          const isToday = date.toDateString() === today.toDateString();
          const isBlocked = !disabled && !isPrev && isDateUnavailable(date);

          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => !disabled && checkIn && !checkOut && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              disabled={disabled}
              className={cn(
                'aspect-square flex items-center justify-center text-xs transition-all relative',
                disabled && 'text-[var(--text-subtle)]/30 cursor-not-allowed',
                !disabled && !isPrev && 'hover:bg-[var(--gold)]/10 cursor-pointer',
                isPrev && 'text-[var(--text-subtle)]/20',
                inRange && !isStart && !isEnd && 'bg-[var(--gold)]/10',
                isStart && 'bg-[var(--gold)] text-[#080808] font-bold',
                isEnd && 'bg-[var(--gold)] text-[#080808] font-bold',
                isToday && !isStart && !isEnd && 'ring-1 ring-[var(--gold)]/50',
                !disabled && !isStart && !isEnd && !inRange && 'text-white',
              )}
            >
              {date.getDate()}
              {isBlocked && <span className="absolute inset-x-0 bottom-0.5 h-px bg-red-500/50" />}
            </button>
          );
        })}
      </div>

      {(checkIn || checkOut) && (
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[var(--text-muted)]">Check-in:</span>
            <span className="text-white">{checkIn ? checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[var(--text-muted)]">Check-out:</span>
            <span className="text-white">{checkOut ? checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</span>
          </div>
          {calculateNights() > 0 && (
            <>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Nights:</span>
                <span className="text-white">{calculateNights()}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-[var(--border)]">
                <span className="text-white">Total:</span>
                <span className="text-[var(--gold)]">${calculateTotal()}</span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-3 border-t border-[var(--border)] flex items-center gap-4 text-[0.6rem]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-[var(--gold)] bg-[var(--gold)]" />
          <span className="text-[var(--text-muted)]">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[var(--gold)]/10" />
          <span className="text-[var(--text-muted)]">Range</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 relative">
            <div className="absolute inset-0 border border-red-500/50" />
            <span className="absolute inset-x-0 bottom-0 h-px bg-red-500/50" />
          </div>
          <span className="text-[var(--text-muted)]">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
