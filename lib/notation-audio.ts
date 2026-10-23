import { midiFrequency, parseNotation, slotSeconds, type PlaybackSpec } from './notation.ts';

// Synthesized pluck, not a recorded guitar sample. All onsets use the audio clock.
export function scheduleNotation(ctx: AudioContext, notation: string, spec: PlaybackSpec, bpm: number, metronome: boolean) {
  const score = parseNotation(notation, spec);
  const seconds = slotSeconds(spec.meter, bpm);
  const start = ctx.currentTime + 0.1;
  const output = ctx.createGain();
  output.gain.value = 0.65;
  output.connect(ctx.destination);
  const sources = new Set<OscillatorNode>();
  const gains = new Set<GainNode>();
  const stop = () => {
    for (const source of sources) { source.stop(); source.disconnect(); }
    for (const gain of gains) gain.disconnect();
    sources.clear();
    gains.clear();
    output.disconnect();
  };
  function tone(frequency: number, onset: number, duration: number, click = false) {
    for (const harmonic of click ? [1] : [1, 2, 3, 4]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      sources.add(osc);
      gains.add(gain);
      osc.frequency.value = frequency * harmonic;
      gain.gain.setValueAtTime(0, onset);
      gain.gain.linearRampToValueAtTime((click ? 0.12 : 0.22) / harmonic ** 2, onset + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, onset + duration - 0.015);
      gain.gain.linearRampToValueAtTime(0, onset + duration);
      osc.connect(gain).connect(output);
      osc.start(onset);
      osc.stop(onset + duration);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); sources.delete(osc); gains.delete(gain); };
    }
  }
  try {
    for (let i = 0; i < score.slotsPerBar + score.totalSlots; i += score.slotsPerBeat) {
      if (i < score.slotsPerBar || metronome) {
        tone(i % score.slotsPerBar === 0 ? 1200 : 900, start + i * seconds, 0.055, true);
      }
    }
    for (const note of score.notes) {
      tone(midiFrequency(note.midi), start + (score.slotsPerBar + note.slot) * seconds, note.duration * seconds * 0.95);
    }
  } catch (error) { stop(); throw error; }
  return { start, seconds, stop };
}
