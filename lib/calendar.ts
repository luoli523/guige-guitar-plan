import type { Completions, FamilyProgress, Player } from './progress.ts';

export const calendarKey = 'guige-guitar-calendar-v1';
// The family confirmed this Friday was their first practice day.
export const practiceStart = '2026-10-23';
export type CalendarProgress = { version: 1; dad: Completions; guazai: Completions };

export function dateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function calendarWeek(today: string, offset = 0): string[] {
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(date);
    day.setUTCDate(day.getUTCDate() + i);
    return day.toISOString().slice(0, 10);
  });
}
function clean(value: unknown): Completions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, done]) => done === true && /^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(Date.parse(`${key}T12:00:00Z`)) && new Date(`${key}T12:00:00Z`).toISOString().slice(0, 10) === key));
}
export function readCalendar(saved: string | null, old: FamilyProgress): CalendarProgress {
  try {
    const value = JSON.parse(saved ?? 'null');
    if (value?.version === 1) return { version: 1, dad: clean(value.dad), guazai: clean(value.guazai) };
  } catch { /* Preserve the original course records during migration. */ }
  return { version: 1, dad: Object.values(old.dad).some(Boolean) ? { [practiceStart]: true } : {}, guazai: Object.values(old.guazai).some(Boolean) ? { [practiceStart]: true } : {} };
}
export function toggleDate(calendar: CalendarProgress, player: Player, date: string): CalendarProgress {
  const entries = { ...calendar[player] };
  if (entries[date]) delete entries[date];
  else entries[date] = true;
  return { ...calendar, [player]: entries };
}
export function dayStatus(date: string, today: string, done: boolean): string {
  if (done) return '已练';
  if (date < practiceStart) return '开始前';
  if (date > today) return '未到';
  return date === today ? '待练' : '未打卡';
}
