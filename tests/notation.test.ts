import assert from 'node:assert/strict';
import test from 'node:test';
import { getPracticeSession, weeks } from '../lib/course.ts';
import { midiFrequency, parseNotation, slotSeconds } from '../lib/notation.ts';

void test('all 84 sessions have a complete, finite, correctly pitched playable score', () => {
  for (const week of weeks) for (let day = 1; day <= 7; day++) {
    const session = getPracticeSession(week, day);
    const score = parseNotation(session.notation, session.playback);
    assert.equal(score.bars.length, 4);
    assert.equal(score.notes.reduce((sum, note) => sum + note.duration, 0), score.totalSlots);
    for (const [index, note] of score.notes.entries()) {
      assert.ok(Number.isFinite(midiFrequency(note.midi)));
      assert.ok(note.midi >= 55 && note.midi <= 81);
      assert.equal(note.slot + note.duration, score.notes[index + 1]?.slot ?? score.totalSlots);
    }
  }
});

void test('first-day melody preserves its pitches, holds and 16-beat timing', () => {
  const score = parseNotation(weeks[0].notation, weeks[0].playback);
  assert.deepEqual(score.notes.map(note => note.midi), [60, 64, 67, 64, 62, 60, 62, 64, 67, 64, 62, 60]);
  assert.deepEqual(score.notes.map(note => note.slot), [0, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14]);
  assert.equal(score.notes[0].duration, 2);
  assert.equal(score.notes.at(-1)?.duration, 2);
  assert.equal(score.totalSlots * slotSeconds('4/4', 60), 16);
  assert.equal(score.totalSlots * slotSeconds('4/4', 100), 9.6);
  assert.ok(Math.abs(midiFrequency(60) - 261.626) < 0.001);
});

void test('minor accidentals and G-major demos resolve to the intended sounding notes', () => {
  const aMinor = parseNotation(weeks[3].notation, weeks[3].playback);
  assert.deepEqual(aMinor.notes.slice(0, 4).map(note => note.midi), [64, 65, 64, 60]); // E4 F4 E4 C4
  assert.equal(aMinor.notes.at(-1)?.midi, 57); // A3
  const gMajor = parseNotation(weeks[1].notation, weeks[1].playback);
  assert.deepEqual(gMajor.notes.slice(0, 4).map(note => note.midi), [62, 55, 57, 59]);
});

void test('6/8 has two dotted-quarter beats per bar, and a full-bar final hold', () => {
  const score = parseNotation(weeks[5].notation, weeks[5].playback);
  assert.equal(score.slotsPerBar, 6);
  assert.equal(score.slotsPerBeat, 3);
  assert.equal(score.totalSlots, 24);
  assert.equal(score.totalSlots * slotSeconds('6/8', 60), 8);
  assert.equal(score.notes.at(-1)?.duration, 6);
});

void test('malformed notation and invalid tempos fail explicitly', () => {
  const spec = weeks[0].playback;
  for (const text of ['', '1 2 3', '— 1 2 3', '1 2 x 4']) assert.throws(() => parseNotation(text, spec));
  for (const bpm of [0, -1, NaN, Infinity]) assert.throws(() => slotSeconds('4/4', bpm));
});
