import assert from 'node:assert/strict';

const normalizeText = (value) => {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const normalizeCpfDigits = (value) => String(value ?? '').replace(/\D/g, '');

const collatorPtBr = new Intl.Collator('pt-BR', { sensitivity: 'base' });

const filterSort = ({ list, search, status }) => {
  const term = normalizeText(search);
  const termDigits = normalizeCpfDigits(search);
  const filtered = list.filter((c) => {
    if (status !== 'todos' && c.status !== status) return false;
    if (!term && !termDigits) return true;
    const nameMatch = term && normalizeText(c.nome).includes(term);
    const cpfMatch = termDigits && normalizeCpfDigits(c.cpf).includes(termDigits);
    return Boolean(nameMatch || cpfMatch);
  });
  filtered.sort((a, b) => collatorPtBr.compare(a.nome || '', b.nome || ''));
  return filtered;
};

const list = [
  { nome: 'Álvaro', cpf: '123.456.789-00', status: 'ativo' },
  { nome: 'Bruno', cpf: '00000000000', status: 'inativo' },
  { nome: 'Ana', cpf: '111.222.333-44', status: 'ativo' }
];

const byName = filterSort({ list, search: 'a', status: 'todos' }).map((x) => x.nome);
assert.deepEqual(byName, ['Álvaro', 'Ana']);

const byCpf = filterSort({ list, search: '111222', status: 'todos' }).map((x) => x.nome);
assert.deepEqual(byCpf, ['Ana']);

const byStatus = filterSort({ list, search: '', status: 'inativo' }).map((x) => x.nome);
assert.deepEqual(byStatus, ['Bruno']);

console.log('OK: filtro e ordenação do Cadastro de Colaboradores validados.');

