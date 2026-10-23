import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseNotation, type PlaybackSpec } from '@/lib/notation';
import { scheduleNotation } from '@/lib/notation-audio';

export function NotationPlayer({ notation, spec }: { notation: string; spec: PlaybackSpec }) {
  const score = useMemo(() => parseNotation(notation, spec), [notation, spec]);
  const compound = spec.meter === '6/8';
  const beatsPerBar = score.slotsPerBar / score.slotsPerBeat;
  const [bpm, setBpm] = useState(60);
  const [metronome, setMetronome] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [slot, setSlot] = useState<number | null>(null);
  const [error, setError] = useState('');
  const context = useRef<AudioContext | null>(null);
  const stopAudio = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const generation = useRef(0);

  function stop() {
    generation.current += 1;
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
    stopAudio.current?.();
    stopAudio.current = null;
    setPlaying(false);
    setSlot(null);
  }

  useEffect(() => () => {
    generation.current += 1;
    if (timer.current !== null) clearInterval(timer.current);
    stopAudio.current?.();
    void context.current?.close().catch(() => {});
  }, []);

  async function play() {
    stop();
    const run = generation.current;
    setError('');
    setPlaying(true);
    try {
      const ctx = context.current ?? new AudioContext();
      context.current = ctx;
      await ctx.resume();
      if (run !== generation.current) return;
      const audio = scheduleNotation(ctx, notation, spec, bpm, metronome);
      stopAudio.current = audio.stop;
      const update = () => {
        if (run !== generation.current) return;
        // Timers only update the display. Audio timing stays independent of UI work.
        const elapsed = ctx.currentTime - audio.start;
        const next = Math.max(-score.slotsPerBar, Math.floor(elapsed / audio.seconds) - score.slotsPerBar);
        if (next >= score.totalSlots) { stop(); return; }
        setSlot(next);
      };
      timer.current = setInterval(update, 50);
      update();
    } catch {
      if (run !== generation.current) return;
      stop();
      setError('声音未能启动，请检查浏览器声音权限后重试。');
    }
  }

  const currentBeat = slot === null ? 0 : Math.floor((slot % score.slotsPerBar) / score.slotsPerBeat) + 1;
  const countIn = slot === null ? 0 : Math.floor((slot + score.slotsPerBar) / score.slotsPerBeat) + 1;
  return (
    <div className="mt-3 space-y-4 rounded-lg bg-[var(--cream)] p-4 text-[var(--ink)]">
      <p className="text-sm">{spec.label} · {spec.meter}</p>
      <p className="text-xs leading-5 text-muted-foreground">{compound ? '每格为八分音符，三格一大拍；速度按附点四分音符计。数“1-la-li 2-la-li”。' : '每格一拍；速度按四分音符计。'}横线延长一格，不重新拨弦。</p>
      <div className={`grid gap-3 ${compound ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`} aria-label="练习简谱">
        {score.bars.map((bar, barIndex) => (
          <div key={barIndex} className="min-w-0 border-l-2 border-border pl-2">
            <span className="text-xs text-muted-foreground">第 {barIndex + 1} 小节</span>
            <div className="mt-1 flex justify-between gap-1 font-mono text-lg sm:text-xl">
              {bar.map((token, index) => {
                const active = slot === barIndex * score.slotsPerBar + index;
                return <span key={index} aria-current={active ? 'true' : undefined} className={`rounded px-1 ${compound && index === 3 ? 'ml-3' : ''} ${active ? 'bg-[var(--ink)] font-bold text-[var(--paper)] ring-2 ring-[var(--rust)]' : ''}`}><span className={compound && token !== '—' ? 'underline underline-offset-4' : ''}>{token}</span></span>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={playing ? stop : () => void play()}>{playing ? <Square /> : <Play />}{playing ? '停止' : '播放简谱'}</Button>
        <label className="flex items-center gap-2 text-sm">速度
          <select aria-label="试听速度" className="rounded border border-border bg-card px-2 py-2" value={bpm} disabled={playing} onChange={event => setBpm(Number(event.target.value))}>
            {[40, 50, 60, 72, 80, 100].map(value => <option key={value} value={value}>{value} BPM</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={metronome} disabled={playing} onChange={event => setMetronome(event.target.checked)} />节拍器</label>
      </div>
      {error && <p role="alert" className="text-sm">{error}</p>}
      <output aria-live="off" className="block min-h-5 text-sm">{slot !== null && slot < 0 ? `准备：${countIn} / ${beatsPerBar}${compound ? ' 大拍' : ' 拍'}` : playing && slot !== null ? `第 ${Math.floor(slot / score.slotsPerBar) + 1} 小节 · 第 ${currentBeat}${compound ? ' 大拍' : ' 拍'}${compound ? ` · ${[String(currentBeat), 'la', 'li'][slot % 3]}` : ''}` : `先听一小节预备（${beatsPerBar}${compound ? ' 大拍' : ' 拍'}），再跟着旋律唱。`}</output>
      <p className="text-xs leading-5 text-muted-foreground">合成拨弦音色 · 单旋律示范，不含和弦伴奏。先听一遍，再唱一遍，最后跟弹。</p>
    </div>
  );
}
