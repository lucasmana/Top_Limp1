export const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const normalizeToMidday = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const y = Number(match[1]);
      const m = Number(match[2]);
      const d = Number(match[3]);
      if (y && m && d) return new Date(y, m - 1, d, 12, 0, 0);
    }
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0);
};

export const buildServicosIndexByDate = (servicos) => {
  const map = new Map();
  const push = (dateKey, entry) => {
    const list = map.get(dateKey) || [];
    list.push(entry);
    map.set(dateKey, list);
  };

  (servicos || []).forEach((servico) => {
    const base = {
      id: String(servico?._id || servico?.id || ''),
      cliente: servico?.cliente || 'N/A',
      tipoServico: servico?.tipoServico || 'N/A',
      status: servico?.status || 'N/A',
      horario: servico?.horario || 'N/A',
      localEndereco: servico?.localEndereco || 'N/A',
      equipeMembros: servico?.equipeMembros || servico?.equipe || 'N/A',
      supervisorResponsavel: servico?.supervisorResponsavel || servico?.supervisor || 'N/A',
      cidade: servico?.cidade || 'N/A',
      observacoes: servico?.observacoes || '',
      proximaExecucao: servico?.proximaExecucao || null,
      raw: servico
    };

    const datas = Array.isArray(servico?.datasExecucao) ? servico.datasExecucao : [];
    datas.forEach((item) => {
      const dt = normalizeToMidday(item?.data);
      if (!dt) return;
      const key = toDateKey(dt);
      push(key, {
        ...base,
        data: dt,
        statusData: item?.status || 'Programado',
        observacaoDia: item?.observacao || ''
      });
    });
  });

  for (const [key, list] of map.entries()) {
    list.sort((a, b) => {
      if (a.horario === b.horario) return (a.cliente || '').localeCompare(b.cliente || '');
      return (a.horario || '').localeCompare(b.horario || '');
    });
    map.set(key, list);
  }

  return map;
};
