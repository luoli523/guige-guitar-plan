import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarWeek, dateKey, dayStatus, readCalendar, toggleDate } from '../lib/calendar.ts';
import { readProgress } from '../lib/progress.ts';

void test('first Friday belongs to the real Monday-Sunday calendar week', () => {
  assert.deepEqual(calendarWeek('2026-10-23'), ['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-24','2026-10-25']);
  assert.equal(dayStatus('2026-10-19','2026-10-23',false),'开始前');
  assert.equal(dayStatus('2026-10-23','2026-10-23',true),'已练');
  assert.equal(dayStatus('2026-10-24','2026-10-23',false),'未到');
  assert.equal(dayStatus('2026-10-23','2026-10-24',false),'未打卡');
  assert.equal(dateKey(new Date('2026-10-23T16:00:00Z')),'2026-10-24');
  assert.equal(calendarWeek('2027-01-01')[0], '2026-12-28');
});
void test('undated course records map once to the confirmed first day and stay separate', () => {
  const courses = readProgress('{"version":2,"dad":{"1-1":true,"1-3":true},"guazai":{"1-1":true}}', null);
  const calendar = readCalendar(null, courses);
  assert.deepEqual(calendar.dad, {'2026-10-23':true});
  assert.deepEqual(calendar.guazai, {'2026-10-23':true});
  const undone = toggleDate(calendar, 'dad', '2026-10-23');
  assert.deepEqual(readCalendar(JSON.stringify(undone), courses), undone);
  assert.equal(courses.dad['1-1'],true);
  assert.equal(undone.guazai['2026-10-23'],true);
  assert.deepEqual(readCalendar(null, readProgress(null,null)).dad, {});
});
