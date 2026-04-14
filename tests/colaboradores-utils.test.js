const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeCpfDigits, isValidCpf, parseDateInput, hashSecret } = require('../src/utils/colaboradoresUtils');

test('normalizeCpfDigits mantém apenas dígitos e limita em 11', () => {
  assert.equal(normalizeCpfDigits('123.456.789-00'), '12345678900');
  assert.equal(normalizeCpfDigits('123456789001234'), '12345678900');
  assert.equal(normalizeCpfDigits(null), '');
});

test('isValidCpf valida CPFs válidos e rejeita inválidos', () => {
  assert.equal(isValidCpf('529.982.247-25'), true);
  assert.equal(isValidCpf('111.111.111-11'), false);
  assert.equal(isValidCpf('123'), false);
});

test('parseDateInput aceita dd/mm/aaaa e dígitos ddmmaaaa', () => {
  const d1 = parseDateInput('01/02/2026');
  assert.ok(d1 instanceof Date);
  assert.equal(d1.toISOString().slice(0, 10), '2026-02-01');

  const d2 = parseDateInput('01022026');
  assert.ok(d2 instanceof Date);
  assert.equal(d2.toISOString().slice(0, 10), '2026-02-01');
});

test('parseDateInput rejeita datas inválidas', () => {
  assert.equal(parseDateInput('31/02/2026'), null);
  assert.equal(parseDateInput(''), null);
  assert.equal(parseDateInput('99/99/9999'), null);
});

test('hashSecret retorna salt e hash e não reutiliza salt', () => {
  const a = hashSecret('senha-123');
  const b = hashSecret('senha-123');
  assert.ok(a.salt && b.salt);
  assert.ok(a.hash && b.hash);
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.hash, b.hash);
  assert.equal(a.algo, 'scrypt');
});

