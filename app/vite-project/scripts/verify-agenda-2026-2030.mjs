import assert from 'node:assert/strict';

const YEARS = [2026, 2027, 2028, 2029, 2030];

const easterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12, 0, 0);
};

const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12, 0, 0);
const toKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function buildNational(year) {
  const easter = easterSunday(year);
  const fixed = [
    [1, 1],
    [4, 21],
    [5, 1],
    [9, 7],
    [10, 12],
    [11, 2],
    [11, 15],
    [11, 20],
    [12, 25]
  ];
  const offsets = [-48, -47, -2, 60];
  const keys = new Set(fixed.map(([m, d]) => toKey(new Date(year, m - 1, d, 12, 0, 0))));
  offsets.forEach((o) => keys.add(toKey(addDays(easter, o))));
  return keys;
}

function getMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1, 12, 0, 0);
  const startOffset = first.getDay();
  const start = addDays(first, -startOffset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

function main() {
  YEARS.forEach((year) => {
    const easter = easterSunday(year);
    assert.ok(easter.getMonth() === 2 || easter.getMonth() === 3, `Easter month should be Mar/Apr for ${year}`);
    const national = buildNational(year);
    assert.ok(national.has(`${year}-01-01`));
    assert.ok(national.has(`${year}-12-25`));
    assert.ok(national.has(toKey(addDays(easter, 60))), `Corpus Christi should exist for ${year}`);

    for (let month = 0; month < 12; month++) {
      const grid = getMonthGrid(year, month);
      assert.equal(grid.length, 42);
      assert.equal(grid[0].getDay(), 0, `Grid should start on Sunday for ${year}-${month + 1}`);
    }
  });

  console.log('OK: Agenda 2026–2030 (grid e feriados nacionais) validado.');
}

main();

