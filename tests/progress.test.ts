import assert from 'node:assert/strict';
import test from 'node:test';
import { readProgress, toggleProgress, countProgress, sharedCount } from '../lib/progress.ts';

void test('legacy records migrate to dad only, valid completed lessons only', () => {
  const progress = readProgress(null, JSON.stringify({ '1-1': true, '1-2': false, '99-1': true }));
  assert.deepEqual(progress.dad, { '1-1': true });
  assert.deepEqual(progress.guazai, {});
  assert.deepEqual(readProgress(JSON.stringify(progress), '{"2-1":true}'), progress);
});
void test('independent toggles, undo, shared totals and week counts survive persistence', () => {
  const initial = readProgress(null, null);
  const dad = toggleProgress(initial, 'dad', '1-1');
  const both = toggleProgress(dad, 'guazai', '1-1');
  const nextWeek = toggleProgress(both, 'guazai', '2-1');
  assert.equal(sharedCount(nextWeek), 1);
  assert.equal(countProgress(nextWeek.guazai), 2);
  assert.equal(countProgress(nextWeek.guazai, 1), 1);
  const undone = toggleProgress(nextWeek, 'dad', '1-1');
  assert.equal(sharedCount(undone), 0);
  assert.equal(countProgress(undone.guazai), 2);
  assert.deepEqual(readProgress(JSON.stringify(undone), null), undone);
  assert.deepEqual(initial.dad, {});
});
void test('malformed storage falls back safely and does not crash', () => {
  assert.equal(countProgress(readProgress('{broken', '{"1-1":true}').dad), 1);
  assert.deepEqual(readProgress('null', 'broken'), { version: 2, dad: {}, guazai: {} });
});
