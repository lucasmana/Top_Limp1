import assert from 'node:assert/strict';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

async function main() {
  const url = new URL('/api/Servicos', baseUrl);
  const res = await fetch(url);
  assert.equal(res.ok, true, `Request failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  assert.equal(typeof data, 'object');
  assert.equal(data.success, true, 'Expected data.success === true');
  assert.equal(Array.isArray(data.servicos), true, 'Expected data.servicos to be an array');
  assert.ok(data.servicos.length >= 0, 'Expected data.servicos length to be >= 0');
  console.log(`OK: /api/Servicos retornou ${data.servicos.length} serviços`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

