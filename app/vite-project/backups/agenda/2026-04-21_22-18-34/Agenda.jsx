import React, { useEffect, useMemo, useState } from 'react';
import './AgendaCalendar.css';
import { buildServicosIndexByDate, toDateKey } from './agendaSchedule';

const YEARS = [2026, 2027, 2028, 2029, 2030];
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12, 0, 0);

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

const holidayRules = {
  national: [
    { type: 'fixed', month: 1, day: 1, name: 'Confraternização Universal' },
    { type: 'fixed', month: 4, day: 21, name: 'Tiradentes' },
    { type: 'fixed', month: 5, day: 1, name: 'Dia do Trabalho' },
    { type: 'fixed', month: 9, day: 7, name: 'Independência do Brasil' },
    { type: 'fixed', month: 10, day: 12, name: 'Nossa Senhora Aparecida' },
    { type: 'fixed', month: 11, day: 2, name: 'Finados' },
    { type: 'fixed', month: 11, day: 15, name: 'Proclamação da República' },
    { type: 'fixed', month: 11, day: 20, name: 'Consciência Negra' },
    { type: 'fixed', month: 12, day: 25, name: 'Natal' },
    { type: 'easterOffset', offsetDays: -48, name: 'Carnaval (Segunda-feira)' },
    { type: 'easterOffset', offsetDays: -47, name: 'Carnaval (Terça-feira)' },
    { type: 'easterOffset', offsetDays: -2, name: 'Sexta-feira Santa' },
    { type: 'easterOffset', offsetDays: 60, name: 'Corpus Christi' }
  ]
};

const buildHolidaysForYear = (year) => {
  const map = new Map();
  const pushHoliday = (date, name) => {
    const key = toDateKey(date);
    const current = map.get(key) || [];
    current.push({ name, scope: 'Nacional' });
    map.set(key, current);
  };

  const easter = easterSunday(year);
  holidayRules.national.forEach((rule) => {
    if (rule.type === 'fixed') pushHoliday(new Date(year, rule.month - 1, rule.day, 12, 0, 0), rule.name);
    if (rule.type === 'easterOffset') pushHoliday(addDays(easter, rule.offsetDays), rule.name);
  });

  return map;
};

const clampDateToRange = (date) => {
  const y = date.getFullYear();
  if (y < 2026) return new Date(2026, 0, 1, 12, 0, 0);
  if (y > 2030) return new Date(2030, 11, 1, 12, 0, 0);
  return date;
};

const getMonthGrid = (year, monthIndex) => {
  const first = new Date(year, monthIndex, 1, 12, 0, 0);
  const startOffset = first.getDay();
  const gridStart = addDays(first, -startOffset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
};

const formatPtBrDate = (value) => {
  if (!value) return '—';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('pt-BR');
};

const dateFromKey = (key) => new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10)), 12, 0, 0);

const formatWeekdayUpper = (date) => {
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  return String(weekday).toUpperCase();
};

const Agenda = () => {
  const today = startOfDay(new Date());
  const initial = clampDateToRange(new Date(today.getFullYear(), today.getMonth(), 1, 12, 0, 0));

  const [year, setYear] = useState(initial.getFullYear());
  const [monthIndex, setMonthIndex] = useState(initial.getMonth());
  const [servicos, setServicos] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [erroServicos, setErroServicos] = useState('');
  const [selectedDayKey, setSelectedDayKey] = useState('');
  const [modalDayKey, setModalDayKey] = useState('');

  const holidays = useMemo(() => buildHolidaysForYear(year), [year]);
  const days = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);
  const servicosByDate = useMemo(() => buildServicosIndexByDate(servicos), [servicos]);

  useEffect(() => {
    const cached = localStorage.getItem('agenda:servicos-cache:v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setServicos(parsed);
      } catch {
        localStorage.removeItem('agenda:servicos-cache:v1');
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoadingServicos(true);
      setErroServicos('');
      try {
        const response = await fetch('http://localhost:3001/api/Servicos');
        const data = await response.json();
        if (!active) return;
        if (data?.success && Array.isArray(data?.servicos)) {
          setServicos(data.servicos);
          localStorage.setItem('agenda:servicos-cache:v1', JSON.stringify(data.servicos));
          return;
        }
        setErroServicos(data?.message || 'Erro ao carregar serviços');
      } catch {
        if (!active) return;
        setErroServicos('Erro ao carregar serviços');
      } finally {
        if (active) setLoadingServicos(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const handlePrev = () => {
    const next = new Date(year, monthIndex - 1, 1, 12, 0, 0);
    const clamped = clampDateToRange(next);
    setYear(clamped.getFullYear());
    setMonthIndex(clamped.getMonth());
  };

  const handleNext = () => {
    const next = new Date(year, monthIndex + 1, 1, 12, 0, 0);
    const clamped = clampDateToRange(next);
    setYear(clamped.getFullYear());
    setMonthIndex(clamped.getMonth());
  };

  const title = `${MONTHS[monthIndex]} de ${year}`;
  const selectedEntries = selectedDayKey ? (servicosByDate.get(selectedDayKey) || []) : [];
  const selectedDateLabel = selectedDayKey ? dateFromKey(selectedDayKey).toLocaleDateString('pt-BR') : '';
  const selectedWeekdayUpper = selectedDayKey ? formatWeekdayUpper(dateFromKey(selectedDayKey)) : '';
  const selectedHolidayList = selectedDayKey ? (holidays.get(selectedDayKey) || []) : [];
  const modalEntries = modalDayKey ? (servicosByDate.get(modalDayKey) || []) : [];
  const modalDateLabel = modalDayKey ? dateFromKey(modalDayKey).toLocaleDateString('pt-BR') : '';

  const buildDayShareText = (dayKey) => {
    if (!dayKey) return '';
    const dt = dateFromKey(dayKey);
    const header = `Programação\n${formatWeekdayUpper(dt)} - ${dt.toLocaleDateString('pt-BR')}`;
    const holidayLines = (holidays.get(dayKey) || []).map((h) => `🔴 ${h.name} (${h.scope})`);
    const entries = servicosByDate.get(dayKey) || [];
    const serviceLines = entries.map((e) => `${e.horario} • ${e.cliente} • ${e.tipoServico} • ${e.statusData || e.status}`);
    return [header, ...holidayLines, '', ...serviceLines].join('\n').trim();
  };

  const handleCopy = async () => {
    const text = buildDayShareText(selectedDayKey);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const handleWhatsApp = () => {
    const text = buildDayShareText(selectedDayKey);
    if (!text) return;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const handlePrintDay = () => {
    if (!selectedDayKey) return;
    document.body.classList.add('agenda-print-mode');
    const cleanup = () => {
      document.body.classList.remove('agenda-print-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  const renderEntry = (item, idx) => (
    <div key={`${item.id}-${idx}`} className="agenda-item">
      <div className="agenda-item-top">
        <div className="agenda-item-main">
          <div className="agenda-item-client">{item.cliente}</div>
          <div className="agenda-item-meta">
            {item.tipoServico} • {item.horario} • {item.statusData || item.status}
          </div>
        </div>
        <div className="agenda-item-badge">{item.cidade}</div>
      </div>
      <div className="agenda-item-row">
        <div className="agenda-item-label">Próxima execução</div>
        <div className="agenda-item-value">{formatPtBrDate(item.proximaExecucao)}</div>
      </div>
      <div className="agenda-item-row">
        <div className="agenda-item-label">Datas de execução</div>
        <div className="agenda-item-value">
          {Array.isArray(item?.raw?.datasExecucao) && item.raw.datasExecucao.length > 0
            ? item.raw.datasExecucao
              .map((d) => `${formatPtBrDate(d?.data)} (${d?.status || 'Programado'})`)
              .join(' • ')
            : '—'}
        </div>
      </div>
      <div className="agenda-item-row">
        <div className="agenda-item-label">Local</div>
        <div className="agenda-item-value">{item.localEndereco}</div>
      </div>
      <div className="agenda-item-row">
        <div className="agenda-item-label">Observação do dia</div>
        <div className="agenda-item-value">{item.observacaoDia || '—'}</div>
      </div>
      <div className="agenda-item-row">
        <div className="agenda-item-label">Observações gerais</div>
        <div className="agenda-item-value">{item.observacoes || '—'}</div>
      </div>
      <details className="agenda-item-details">
        <summary className="agenda-item-summary">Ver objeto completo</summary>
        <pre className="agenda-item-pre">{JSON.stringify(item.raw || {}, null, 2)}</pre>
      </details>
    </div>
  );

  return (
    <section className="portaladm-agenda" aria-label="Agenda Operacional">
      <header className="agenda-header">
        <div className="agenda-title">
          <h2>Agenda Operacional</h2>
          <p className="agenda-subtitle">Calendário 2026–2030 (pt-BR)</p>
        </div>
        <div className="agenda-meta" aria-live="polite">
          {loadingServicos ? 'Carregando serviços…' : (erroServicos ? erroServicos : `${servicos.length} serviços carregados`)}
        </div>
      </header>

      <div className="agenda-controls" role="group" aria-label="Navegação do calendário">
        <div className="agenda-nav">
          <button className="btn-nav" type="button" onClick={handlePrev} aria-label="Mês anterior">◀</button>
          <div className="agenda-period" aria-live="polite">{title}</div>
          <button className="btn-nav" type="button" onClick={handleNext} aria-label="Próximo mês">▶</button>
        </div>

        <div className="agenda-pickers">
          <div className="agenda-field">
            <label className="agenda-label" htmlFor="agenda-month">Mês</label>
            <select
              id="agenda-month"
              className="agenda-select"
              value={monthIndex}
              onChange={(e) => setMonthIndex(Number(e.target.value))}
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
          <div className="agenda-field">
            <label className="agenda-label" htmlFor="agenda-year">Ano</label>
            <select
              id="agenda-year"
              className="agenda-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="agenda-calendar" role="region" aria-label={`Calendário de ${title}`}>
        <div className="agenda-weekdays" aria-hidden="true">
          {WEEKDAYS.map((d) => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        <div className="agenda-grid" role="grid" aria-label="Dias do mês">
          {days.map((date) => {
            const key = toDateKey(date);
            const isCurrentMonth = date.getMonth() === monthIndex;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const holidayList = holidays.get(key) || [];
            const isHoliday = holidayList.length > 0;
            const isToday = toDateKey(date) === toDateKey(today);
            const entries = servicosByDate.get(key) || [];
            const hasServices = entries.length > 0;
            const tooltip = holidayList.map((h) => `${h.name} • ${h.scope}`).join('\n');

            return (
              <div
                key={key}
                role="gridcell"
                className={[
                  'agenda-cell',
                  isCurrentMonth ? 'is-current' : 'is-outside',
                  isWeekend ? 'is-weekend' : '',
                  isHoliday ? 'is-holiday' : '',
                  isToday ? 'is-today' : '',
                  hasServices ? 'has-services' : '',
                  selectedDayKey === key ? 'is-selected' : ''
                ].filter(Boolean).join(' ')}
                tabIndex={isCurrentMonth ? 0 : -1}
                aria-label={`${date.toLocaleDateString('pt-BR')}${isHoliday ? `, feriado: ${holidayList.map(h => h.name).join(', ')}` : ''}`}
                title={isHoliday ? tooltip : ''}
                onClick={() => {
                  setSelectedDayKey(key);
                  setModalDayKey(key);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDayKey(key);
                    setModalDayKey(key);
                  }
                }}
              >
                <div className="cell-top">
                  <span className="cell-day">{date.getDate()}</span>
                </div>
                {hasServices && (
                  <div className="cell-services" aria-hidden="true">
                    <span className="cell-service-marker">⚠️</span>
                    <span className="cell-service-count">{entries.length}</span>
                  </div>
                )}
                {isHoliday && (
                  <div className="cell-holiday" aria-hidden="true">
                    {holidayList[0]?.name}
                    {holidayList.length > 1 ? ` +${holidayList.length - 1}` : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="agenda-legend" aria-label="Legenda">
          <div className="legend-item">
            <span className="legend-swatch swatch-weekend" aria-hidden="true"></span>
            <span>Fim de semana</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch swatch-holiday" aria-hidden="true"></span>
            <span>Feriado</span>
          </div>
        </div>
      </div>

      <div id="agenda-day-panel" className="agenda-day-panel" aria-label="Detalhes do dia selecionado">
        <div className="agenda-day-panel-header">
          <div className="agenda-day-panel-title">
            <h3>Programação</h3>
            <div className="agenda-day-panel-subtitle">
              {selectedDayKey ? `${selectedWeekdayUpper} - ${selectedDateLabel}` : 'Selecione um dia no calendário'}
            </div>
            {selectedDayKey && selectedHolidayList.length > 0 && (
              <div className="agenda-day-panel-holidays">
                {selectedHolidayList.map((h) => (
                  <div key={h.name} className="agenda-day-panel-holiday">🔴 {h.name} ({h.scope})</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="agenda-day-panel-body">
          {!selectedDayKey ? (
            <div className="agenda-empty">Clique em um dia para ver os serviços programados.</div>
          ) : selectedEntries.length === 0 ? (
            <div className="agenda-empty">Nenhum serviço programado para este dia.</div>
          ) : (
            <div className="agenda-day-panel-list">
              {selectedEntries.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="agenda-day-panel-line">
                  <div className="agenda-day-panel-line-top">
                    <div className="agenda-day-panel-line-left">
                      <span className="agenda-day-time">{item.horario}</span>
                      <span className="agenda-day-client">{item.cliente}</span>
                    </div>
                    <div className="agenda-day-panel-line-right">
                      <span className="agenda-day-type">{item.tipoServico}</span>
                      <span className="agenda-day-status">{item.statusData || item.status}</span>
                    </div>
                  </div>

                  <div className="agenda-day-panel-fields">
                    <div className="agenda-day-field">
                      <span className="agenda-day-field-label">Local</span>
                      <span className="agenda-day-field-value">{item.localEndereco || 'N/A'}</span>
                    </div>
                    <div className="agenda-day-field">
                      <span className="agenda-day-field-label">Supervisor</span>
                      <span className="agenda-day-field-value">{item.supervisorResponsavel || 'N/A'}</span>
                    </div>
                    <div className="agenda-day-field">
                      <span className="agenda-day-field-label">Equipe</span>
                      <span className="agenda-day-field-value">{item.equipeMembros || 'N/A'}</span>
                    </div>
                    <div className="agenda-day-field">
                      <span className="agenda-day-field-label">Observações</span>
                      <span className="agenda-day-field-value is-multiline">{item.observacoes || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="agenda-day-actions" aria-label="Ações do dia">
          <button className="agenda-day-action" type="button" onClick={handleCopy} disabled={!selectedDayKey}>
            Copiar
          </button>
          <button className="agenda-day-action" type="button" onClick={handleWhatsApp} disabled={!selectedDayKey}>
            WhatsApp
          </button>
          <button className="agenda-day-action" type="button" onClick={handlePrintDay} disabled={!selectedDayKey}>
            Imprimir
          </button>
        </div>
      </div>

      {modalDayKey && (
        <div
          className="agenda-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Serviços programados em ${modalDateLabel}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalDayKey('');
          }}
        >
          <div className="agenda-modal">
            <div className="agenda-modal-header">
              <div className="agenda-modal-title">
                <h3>Programação do dia</h3>
                <div className="agenda-modal-subtitle">{modalDateLabel}</div>
              </div>
              <button className="agenda-modal-close" type="button" onClick={() => setModalDayKey('')}>
                Fechar
              </button>
            </div>

            <div className="agenda-modal-body">
              {modalEntries.length === 0 ? (
                <div className="agenda-empty">Nenhum serviço programado para este dia.</div>
              ) : (
                <div className="agenda-list">
                  {modalEntries.map((item, idx) => renderEntry(item, idx))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Agenda;
