import assert from 'node:assert/strict';
import { buildServicosIndexByDate } from '../src/components/portaladm/modules/agenda/agendaSchedule.js';

const sample = [
  {
    _id: 'a1',
    cliente: 'Cliente A',
    tipoServico: 'Limpeza',
    status: 'Agendado',
    horario: '08:00',
    localEndereco: 'Rua 1',
    cidade: 'SP',
    observacoes: 'Geral',
    datasExecucao: [
      { data: '2026-03-10T00:00:00.000Z', status: 'Programado', observacao: 'Obs 10' },
      { data: '2026-03-11T00:00:00.000Z', status: 'Programado', observacao: 'Obs 11' }
    ]
  },
  {
    _id: 'b2',
    cliente: 'Cliente B',
    tipoServico: 'Coleta',
    status: 'Vendido',
    proximaExecucao: '2026-03-10T00:00:00.000Z',
    datasExecucao: []
  }
];

const idx = buildServicosIndexByDate(sample);
assert.ok(idx.get('2026-03-10')?.length >= 1);
assert.ok(idx.get('2026-03-11')?.length === 1);
console.log('OK: indexação de serviços por data validada.');

