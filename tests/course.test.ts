import assert from 'node:assert/strict';
import test from 'node:test';

import { getPracticeSession, weeks } from '../lib/course.ts';

void test('the course provides twelve complete weekly plans', () => {
  assert.equal(weeks.length, 12);
  assert.ok(
    weeks.every((week) =>
      Array.from({ length: 7 }, (_, index) => getPracticeSession(week, index + 1)).every(
        (session) => session.blocks.length === 5,
      ),
    ),
  );
});

void test('each generated practice session has a timed, playable structure', () => {
  const session = getPracticeSession(weeks[0], 1);

  assert.equal(session.blocks.reduce((sum, block) => sum + block.minutes, 0), 35);
  assert.ok(session.notation.includes('|'));
  assert.ok(session.chords.length > 0);
});
