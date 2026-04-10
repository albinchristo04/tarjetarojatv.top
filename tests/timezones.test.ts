import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTimezoneRow, getTimezoneDisplay, toIsoDate, zonedDateTimeToUtc } from '../src/lib/timezones';

test('toIsoDate converts dd-mm-yyyy strings', () => {
  assert.equal(toIsoDate('08-04-2026'), '2026-04-08');
});

test('timezone display returns the configured labels', () => {
  const items = getTimezoneDisplay('08-04-2026', '21:00');
  assert.deepEqual(
    items.map((item) => item.label),
    ['Madrid', 'CDMX', 'Bogota', 'Buenos Aires', 'Paris']
  );
  items.forEach((item) => assert.match(item.value, /^\d{2}:\d{2}$/));
});

test('timezone row formats a readable joined string', () => {
  const row = buildTimezoneRow('08-04-2026', '21:00');
  assert.match(row, /Madrid/);
  assert.match(row, /CDMX/);
  assert.match(row, /Buenos Aires/);
});

test('zonedDateTimeToUtc returns a valid Date', () => {
  const date = zonedDateTimeToUtc('08-04-2026', '21:00');
  assert.equal(Number.isNaN(date.getTime()), false);
});

