export type PlaybackSpec = {
  tonicMidi: number;
  meter: '4/4' | '6/8';
  label: string;
};

export type ScoreNote = { midi: number; slot: number; duration: number };

const majorIntervals = [0, 2, 4, 5, 7, 9, 11];

// The same tokens drive the visible score, note onsets, holds and highlighting.
// 4/4 slots are quarter notes; 6/8 slots are eighth notes.
export function parseNotation(notation: string, spec: PlaybackSpec) {
  const slotsPerBar = spec.meter === '6/8' ? 6 : 4;
  const slotsPerBeat = spec.meter === '6/8' ? 3 : 1;
  const bars = notation.split('|').map(bar => bar.trim().split(/\s+/));
  if (!bars.length || bars.some(bar => bar.length !== slotsPerBar)) {
    throw new Error(`Each ${spec.meter} bar must have ${slotsPerBar} slots`);
  }
  const notes: ScoreNote[] = [];
  bars.flat().forEach((token, slot) => {
    if (token === '—') {
      const previous = notes.at(-1);
      if (!previous) throw new Error('A hold must follow a note');
      previous.duration += 1;
      return;
    }
    const match = /^([♭♯]?)([1-7])$/.exec(token);
    if (!match) throw new Error(`Unsupported note: ${token}`);
    const accidental = match[1] === '♭' ? -1 : match[1] === '♯' ? 1 : 0;
    notes.push({ midi: spec.tonicMidi + majorIntervals[Number(match[2]) - 1] + accidental, slot, duration: 1 });
  });
  return { bars, notes, slotsPerBar, slotsPerBeat, totalSlots: bars.length * slotsPerBar };
}

export function slotSeconds(meter: PlaybackSpec['meter'], bpm: number) {
  if (!Number.isFinite(bpm) || bpm <= 0) throw new Error('Tempo must be positive');
  return 60 / bpm / (meter === '6/8' ? 3 : 1);
}

export function midiFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}
