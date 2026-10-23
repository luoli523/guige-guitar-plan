import { Progress } from '@/components/ui/progress';
import { countProgress, sharedCount, type FamilyProgress, type Player } from '@/lib/progress';

export const players: { id: Player; name: string; color: string; position: string }[] = [
  { id: 'dad', name: '爸爸', color: 'var(--rust)', position: '72% 14%' },
  { id: 'guazai', name: '瓜仔', color: '#287665', position: '28% 35%' },
];

export function FamilyProgressPanel({ progress, week, sessionKey }: { progress: FamilyProgress; week: number; sessionKey: string }) {
  return <section aria-labelledby="family-progress-title" className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id="family-progress-title" className="text-lg font-semibold">父子练琴进度</h2>
      <span className="text-sm text-muted-foreground">第 {week} 周 · 每周都是新的开始</span>
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {players.map(({ id, name, color, position }) => {
        const total = countProgress(progress[id]);
        const weekly = countProgress(progress[id], week);
        return <div key={id} className="rounded-lg border border-border bg-[var(--paper)] p-4" style={{ borderTop: `3px solid ${color}` }}>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="size-12 shrink-0 rounded-full" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}family-guitar-hero.webp)`, backgroundSize: '500% auto', backgroundPosition: position }} />
            <h3 className="font-semibold">{name}</h3>
            <span className="ml-auto text-xs" style={{ color }}>{progress[id][sessionKey] ? '✓ 本训练日已完成' : '○ 本训练日待完成'}</span>
          </div>
          <div className="mt-4 flex justify-between text-sm"><span>本训练周</span><strong>{weekly} / 7</strong></div>
          <Progress value={weekly / 7 * 100} aria-label={`${name}本训练周完成 ${weekly} / 7`} className="mt-2" />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>全课程完成</span><span>{total} / 84 · {Math.round(total / 84 * 100)}%</span></div>
          <Progress value={total / 84 * 100} aria-label={`${name}全课程完成 ${total} / 84`} className="mt-2 h-1" />
          <div className="mt-3 flex flex-wrap gap-2" aria-label={`${name}坚持徽章`}>
            {[7, 14, 28].map((milestone) => <span key={milestone} className={`rounded-full px-2 py-1 text-xs ${total >= milestone ? 'bg-[var(--signal)] text-[var(--ink)]' : 'bg-[var(--cream)] text-muted-foreground'}`}>{total >= milestone ? '★' : '☆'} {milestone} 次练习</span>)}
          </div>
        </div>;
      })}
    </div>
    <p className="mt-4 text-sm">🎸 父子共同完成 <strong>{sharedCount(progress)}</strong> 个训练日 · 一起把练琴变成习惯</p>
    <p className="mt-2 text-xs text-muted-foreground">两人可按各自节奏练习。记录保存在本设备浏览器，不会自动跨设备同步。</p>
  </section>;
}
