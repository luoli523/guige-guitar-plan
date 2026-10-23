import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { countProgress, type FamilyProgress, type Player } from '@/lib/progress';
import { calendarWeek, dayStatus, practiceStart, type CalendarProgress } from '@/lib/calendar';

export const players: { id: Player; name: string; color: string; position: string }[] = [
  { id: 'dad', name: '爸爸', color: 'var(--rust)', position: '72% 14%' },
  { id: 'guazai', name: '瓜仔', color: '#287665', position: '28% 35%' },
];

export function FamilyProgressPanel({ progress, calendar, today, onToggleDate }: { progress: FamilyProgress; calendar: CalendarProgress; today: string; onToggleDate: (player: Player, date: string) => void }) {
  const [offset, setOffset] = useState(0);
  const dates = calendarWeek(today, offset);
  const shared = Object.keys(calendar.dad).filter(date => calendar.dad[date] && calendar.guazai[date]).length;
  return <section aria-labelledby="family-progress-title" className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id="family-progress-title" className="text-lg font-semibold">父子练琴进度</h2>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button type="button" className="min-h-10 underline disabled:opacity-40" disabled={dates[0] <= practiceStart} onClick={() => setOffset(offset - 1)}>上一周</button>
        <span>{dates[0].slice(5)} — {dates[6].slice(5)}</span>
        <button type="button" className="min-h-10 underline disabled:opacity-40" disabled={offset === 0} onClick={() => setOffset(offset + 1)}>下一周</button>
        {offset !== 0 && <button type="button" className="min-h-10 underline" onClick={() => setOffset(0)}>回到本周</button>}
      </div>
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {players.map(({ id, name, color, position }) => {
        const total = countProgress(progress[id]);
        const weekly = dates.filter(date => calendar[id][date]).length;
        const practiceDays = countProgress(calendar[id]);
        return <div key={id} className="rounded-lg border border-border bg-[var(--paper)] p-4" style={{ borderTop: `3px solid ${color}` }}>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="size-12 shrink-0 rounded-full" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}family-guitar-hero.webp)`, backgroundSize: '500% auto', backgroundPosition: position }} />
            <h3 className="font-semibold">{name}</h3>
            <span className="ml-auto text-xs" style={{ color }}>{calendar[id][today] ? '✓ 今天已练' : '○ 今天待练'}</span>
          </div>
          <div className="mt-4 flex justify-between text-sm"><span>本日历周已练</span><strong>{weekly} 天</strong></div>
          <div aria-label={`${name}每周打卡`} className="mt-3 grid grid-cols-7 gap-1 sm:gap-2">
            {['一', '二', '三', '四', '五', '六', '日'].map((label, index) => {
              const key = dates[index];
              const done = !!calendar[id][key];
              const selected = today === key;
              const status = dayStatus(key, today, done);
              return <button type="button" key={key}
                aria-label={`${name} ${key} 周${label}，${status}`}
                aria-current={selected ? 'date' : undefined}
                aria-pressed={done}
                disabled={key < practiceStart || key > today}
                onClick={() => onToggleDate(id, key)}
                className={`flex min-h-24 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border text-xs transition-colors disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${selected ? 'ring-2 ring-[var(--ink)] ring-offset-1' : ''} ${done ? 'border-transparent text-white' : 'border-dashed border-border bg-card text-muted-foreground'}`}
                style={done ? { backgroundColor: color } : undefined}>
                <span>周{label}</span><span className="text-[10px]">{key.slice(5).replace('-', '/')}</span><span aria-hidden="true" className="text-xl leading-6">{done ? '✓' : key < practiceStart || key > today ? '—' : '○'}</span><span className="text-[10px]">{status}</span>
              </button>;
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">外框标记今天 · 点击日期打卡或撤销，可补记过去的练习</p>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>全课程完成</span><span>{total} / 84 · {Math.round(total / 84 * 100)}%</span></div>
          <Progress value={total / 84 * 100} aria-label={`${name}全课程完成 ${total} / 84`} className="mt-2 h-1" />
          <div className="mt-3 flex flex-wrap gap-2" aria-label={`${name}坚持徽章`}>
            {[7, 14, 28].map((milestone) => <span key={milestone} className={`rounded-full px-2 py-1 text-xs ${practiceDays >= milestone ? 'bg-[var(--signal)] text-[var(--ink)]' : 'bg-[var(--cream)] text-muted-foreground'}`}>{practiceDays >= milestone ? '★' : '☆'} {milestone} 天练习</span>)}
          </div>
        </div>;
      })}
    </div>
    <p className="mt-4 text-sm">🎸 父子共同练琴 <strong>{shared}</strong> 天 · 一起把练琴变成习惯</p>
    <p className="mt-2 text-xs text-muted-foreground">从 2026/10/23 开始 · 按新加坡时间记录真实日期，课程可以按自己的速度完成。记录仅保存在本设备。</p>
  </section>;
}
