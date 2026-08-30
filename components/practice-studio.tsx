'use client';

import { CheckCircle2, Circle, Clock3, ExternalLink, Headphones, Music2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { coursePrinciples, getPracticeSession, weeks } from '@/lib/course';

const storageKey = 'guige-guitar-plan-completed';
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function PracticeStudio() {
  const [weekIndex, setWeekIndex] = useState(0);
  const [day, setDay] = useState(1);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as Record<string, boolean> : {};
  });
  const week = weeks[weekIndex];
  const session = useMemo(() => getPracticeSession(week, day), [week, day]);
  const sessionKey = `${week.week}-${day}`;
  const completedCount = Object.values(completed).filter(Boolean).length;

  function toggleComplete() {
    const next = { ...completed, [sessionKey]: !completed[sessionKey] };
    setCompleted(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function selectWeek(index: number) {
    setWeekIndex(index);
    setDay(1);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-7 sm:pt-10 lg:px-10">
      <header className="border-b border-border pb-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-[var(--signal)] text-[var(--ink)]">12 WEEK PRACTICE STUDIO</Badge>
          <span className="text-sm text-muted-foreground">每天 30–45 分钟 · 原声为主，电吉他专项补强</span>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[0.96] tracking-tight text-foreground sm:text-6xl">把旋律弹成<br /><em className="font-normal text-[var(--rust)]">你自己的 solo。</em></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">不靠六线谱堆手势。每天从听唱、和弦内音、技巧到录音，完成一个可听见的动作。</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm"><span className="font-medium">已完成练习</span><span className="font-mono text-[var(--rust)]">{completedCount} / 84</span></div>
            <Progress value={(completedCount / 84) * 100} className="mt-3" />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">完成状态仅保存在这台设备的浏览器中。</p>
          </div>
        </div>
        <figure className="relative mt-7 overflow-hidden rounded-xl border border-border bg-[var(--cream)]">
          {/* oxlint-disable-next-line nextjs/no-img-element -- GitHub Pages serves this static local asset directly. */}
          <img
            src={`${import.meta.env.BASE_URL}guige-guitar-hero.png`}
            alt="鬼哥在温暖的练习角落用原声吉他练习旋律，身旁放着电吉他和练习笔记。"
            className="h-52 w-full object-cover object-center sm:h-72"
          />
          <figcaption className="absolute bottom-3 left-3 rounded-md bg-[var(--ink)]/90 px-3 py-1.5 text-xs text-[var(--paper)] backdrop-blur-sm">
            鬼哥的练习现场 · 从原声旋律到电吉他表达
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="weeks-title" className="pt-7">
        <div className="flex items-baseline justify-between gap-4"><h2 id="weeks-title" className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">选择训练周</h2><span className="text-sm text-muted-foreground">当前：第 {week.week} 周 · {week.phase}</span></div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {weeks.map((item, index) => (
            <Button key={item.week} variant={index === weekIndex ? 'default' : 'outline'} className="h-auto min-h-16 flex-col items-start px-3 py-2.5 text-left" onClick={() => selectWeek(index)}>
              <span className="font-mono text-xs opacity-70">W{String(item.week).padStart(2, '0')}</span><span className="mt-0.5 text-xs leading-4">{item.phase}</span>
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="border border-border bg-card shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3"><div><Badge variant="outline">第 {week.week} 周 · {week.phase}</Badge><CardTitle className="mt-3 text-2xl">{week.title}</CardTitle><CardDescription className="mt-2 max-w-2xl leading-6">{week.objective}</CardDescription></div><span className="rounded-full bg-[var(--cream-deep)] px-3 py-1.5 font-mono text-xs text-[var(--ink)]">{week.key}</span></div>
            </CardHeader>
            <CardContent><p className="rounded-lg border-l-4 border-[var(--signal)] bg-[var(--cream)] px-4 py-3 text-sm leading-6"><strong>本周交付：</strong>{week.outcome}</p></CardContent>
          </Card>

          <nav aria-label="选择训练日" className="grid grid-cols-7 gap-1.5">
            {days.map((label, index) => { const active = day === index + 1; const done = completed[`${week.week}-${index + 1}`]; return <Button key={label} variant={active ? 'default' : 'outline'} className="h-14 flex-col gap-0 px-1 text-xs" onClick={() => setDay(index + 1)}><span>{label}</span>{done ? <CheckCircle2 className="mt-1 size-3" aria-label="已完成" /> : <Circle className="mt-1 size-3 opacity-45" aria-hidden="true" />}</Button>; })}
          </nav>

          <Card className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] shadow-none">
            <CardHeader><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-xs text-[var(--signal)]">TODAY&apos;S SESSION · 35 MIN</p><CardTitle className="mt-2 text-2xl text-[var(--paper)]">{session.title}</CardTitle></div><Clock3 className="size-6 text-[var(--signal)]" /></div></CardHeader>
            <CardContent><ol className="divide-y divide-white/15">{session.blocks.map((block, index) => <li key={block.label} className="grid grid-cols-[2rem_3.3rem_1fr] gap-3 py-3.5"><span className="font-mono text-xs text-[var(--signal)]">0{index + 1}</span><span className="font-mono text-xs text-white/65">{block.minutes}′</span><div><h3 className="font-medium">{block.label}</h3><p className="mt-1 text-sm leading-6 text-white/70">{block.instruction}</p></div></li>)}</ol></CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-none">
            <CardHeader><div className="flex items-center gap-2"><Music2 className="size-5 text-[var(--rust)]" /><div><CardTitle>今天的原创简谱短句</CardTitle><CardDescription>用于练音级、落点和乐句；不是受版权保护曲目的转录。</CardDescription></div></div></CardHeader>
            <CardContent><p className="font-mono text-sm text-muted-foreground">和弦：{session.chords}</p><pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--cream)] p-4 font-mono text-lg leading-8 text-[var(--ink)] sm:text-xl">{session.notation}</pre><p className="mt-3 text-sm leading-6 text-muted-foreground">{session.cue}</p></CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-[var(--paper)] p-4">
            <p className="max-w-xl text-sm leading-6 text-muted-foreground"><strong className="text-foreground">录音提示：</strong>{session.recordingPrompt}</p>
            <Button onClick={toggleComplete} variant={completed[sessionKey] ? 'secondary' : 'default'}>{completed[sessionKey] ? <CheckCircle2 /> : <Circle />}{completed[sessionKey] ? '今天已完成' : '标记今天完成'}</Button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <Card className="border border-border bg-card shadow-none"><CardHeader><div className="flex items-center gap-2"><Headphones className="size-5 text-[var(--rust)]" /><CardTitle>本周曲目入口</CardTitle></div></CardHeader><CardContent><p className="text-lg font-medium">{week.piece.title}</p><Badge variant="secondary" className="mt-2">{week.piece.type}</Badge><p className="mt-3 text-sm leading-6 text-muted-foreground">{week.piece.sourceLabel}</p>{week.piece.sourceUrl !== '#' ? <a className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--rust)] underline underline-offset-4" href={week.piece.sourceUrl} target="_blank" rel="noreferrer">打开合法资料 / 聆听入口 <ExternalLink className="size-3.5" /></a> : <p className="mt-4 text-sm text-muted-foreground">本周直接使用本站原创练习。</p>}</CardContent></Card>
          <Card className="border border-border bg-card shadow-none"><CardHeader><div className="flex items-center gap-2"><Sparkles className="size-5 text-[var(--rust)]" /><CardTitle>三条不变原则</CardTitle></div></CardHeader><CardContent><ul className="space-y-3">{coursePrinciples.map((principle) => <li className="flex gap-2 text-sm leading-6 text-muted-foreground" key={principle}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--signal)]" />{principle}</li>)}</ul></CardContent></Card>
        </aside>
      </section>
    </main>
  );
}
