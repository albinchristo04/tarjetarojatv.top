import { SOURCE_TIMEZONE, TIMEZONE_OPTIONS } from './config';
import type { TimezoneDisplay } from './types';

function extractParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || '0');

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
  };
}

function partsToUtcMs(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
}

export function toIsoDate(date: string): string {
  const [day, month, year] = date.split('-').map(Number);
  if (!day || !month || !year) {
    return date;
  }
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function zonedDateTimeToUtc(date: string, time: string, sourceTimeZone = SOURCE_TIMEZONE): Date {
  const [year, month, day] = toIsoDate(date).split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const desired = { year, month, day, hour, minute };

  for (let index = 0; index < 3; index += 1) {
    const actual = extractParts(candidate, sourceTimeZone);
    const diffMinutes = (partsToUtcMs(desired) - partsToUtcMs(actual)) / 60000;
    if (diffMinutes === 0) {
      return candidate;
    }
    candidate = new Date(candidate.getTime() + diffMinutes * 60_000);
  }

  return candidate;
}

export function formatTimeForZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function getTimezoneDisplay(date: string, time: string): TimezoneDisplay[] {
  const utcDate = zonedDateTimeToUtc(date, time);
  return TIMEZONE_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
    zone: option.zone,
    value: formatTimeForZone(utcDate, option.zone),
  }));
}

export function buildTimezoneRow(date: string, time: string): string {
  return getTimezoneDisplay(date, time)
    .map((entry) => `${entry.value} ${entry.label}`)
    .join(' · ');
}

export function formatSpanishDate(date: string): string {
  const isoDate = toIsoDate(date);
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

