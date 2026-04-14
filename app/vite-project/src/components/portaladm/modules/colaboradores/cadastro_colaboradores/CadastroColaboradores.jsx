import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import './CadastroColaboradores.css';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'afastado', label: 'Afastado' },
  { value: 'ferias', label: 'Férias' },
  { value: 'folga', label: 'Folga' },
  { value: 'desligado', label: 'Desligado' }
];

const ESCALA_OPTIONS = [
  { value: '6x1', label: '6x1' },
  { value: '5x2', label: '5x2' },
  { value: '12x36', label: '12x36' },
  { value: 'outros', label: 'Outros' }
];

const FOLGA_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'domingo', label: 'Domingo' },
  { value: 'segunda-feira', label: 'Segunda-feira' },
  { value: 'terca-feira', label: 'Terça-feira' },
  { value: 'quarta-feira', label: 'Quarta-feira' },
  { value: 'quinta-feira', label: 'Quinta-feira' },
  { value: 'sexta-feira', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' }
];

const FUNCAO_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'tecnico-limpeza', label: 'Técnico de Limpeza' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'motorista', label: 'Motorista' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'outro', label: 'Outro' }
];

const normalizeText = (value) => {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const normalizeCpfDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 11);

const normalizeDateDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 8);

const formatCpf = (cpfValue) => {
  const digits = normalizeCpfDigits(cpfValue);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 9);
  const p4 = digits.slice(9, 11);
  if (!digits) return '';
  if (digits.length <= 3) return p1;
  if (digits.length <= 6) return `${p1}.${p2}`;
  if (digits.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
};

const formatDateBr = (dateValue) => {
  const digits = normalizeDateDigits(dateValue);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  if (!digits) return '';
  if (digits.length <= 2) return dd;
  if (digits.length <= 4) return `${dd}/${mm}`;
  return `${dd}/${mm}/${yyyy}`;
};

const collatorPtBr = new Intl.Collator('pt-BR', { sensitivity: 'base' });

const API_BASE = 'http://localhost:3001/api';

const fetchColaboradores = async ({ signal, q, status, archivedOnly, page, limit }) => {
  const url = new URL(`${API_BASE}/colaboradores`);
  if (q) url.searchParams.set('q', q);
  if (status && status !== 'todos') url.searchParams.set('status', status);
  url.searchParams.set('arquivados', archivedOnly ? '1' : '0');
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sortBy', 'nome');
  url.searchParams.set('sortDir', 'asc');

  const response = await fetch(url, { signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: Number(data?.total ?? 0) || 0,
    page: Number(data?.page ?? page) || page,
    limit: Number(data?.limit ?? limit) || limit
  };
};

const createColaborador = async (payload) => {
  const response = await fetch(`${API_BASE}/colaboradores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
  return data;
};

const updateColaborador = async (id, payload) => {
  const response = await fetch(`${API_BASE}/colaboradores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
  return data;
};

const IconBox = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M21 8.5l-9 5.2l-9-5.2V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5Zm-9 3.2L21 6.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v.5l9 5.2Z"
    />
  </svg>
);

const IconEdit = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArchive = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M21 8v13H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 3H1v5h22V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Modal = ({ open, title, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="cc-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()} />
      <div ref={modalRef} className="cc-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="cc-modal-header">
          <h3 className="cc-modal-title">{title}</h3>
          <button className="cc-modal-close" type="button" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="cc-modal-body">{children}</div>
      </div>
    </>
  );
};

const CollaboratorCard = ({ colaborador, onOpen, onEdit, onArchive }) => {
  const initial = String(colaborador?.nome || ' ').trim().slice(0, 1).toUpperCase() || '?';
  return (
    <article
      className="cc-card"
      aria-label={`Colaborador ${colaborador.nome || 'Sem nome'}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(colaborador)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(colaborador);
      }}
    >
      <header className="cc-card-header">
        <div className="cc-card-identity">
          <div className="cc-avatar" aria-hidden="true">
            {initial}
          </div>
          <div className="cc-card-title">
            <h3 className="cc-card-name">{colaborador.nome || '—'}</h3>
            <div className="cc-card-role">{colaborador.funcao || '—'}</div>
          </div>
        </div>
        <div className={`cc-card-status cc-status-${colaborador.status || 'ativo'}`}>
          {colaborador.statusLabel || colaborador.status || 'Ativo'}
        </div>
      </header>

      <footer className="cc-card-actions">
        <div className="cc-card-meta cc-card-meta-bottom">
          <div className="cc-meta-line">CPF: {formatCpf(colaborador.cpf) || '—'}</div>
          <div className="cc-meta-line">Escala: {colaborador.escala || '—'}</div>
        </div>
        <div className="cc-card-actions-right">
          <button
            className="cc-btn cc-btn-edit"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(colaborador);
            }}
            aria-label="Editar colaborador"
          >
            <IconEdit size={12} />
            Editar
          </button>
          <button
            className="cc-btn cc-btn-archive"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(colaborador);
            }}
            aria-label="Arquivar colaborador"
            title="Arquivar"
          >
            <IconArchive size={12} />
          </button>
        </div>
      </footer>
    </article>
  );
};

const CadastroColaboradores = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState('todos');
  const [showArchived, setShowArchived] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    nome: '',
    funcao: '',
    status: 'ativo',
    cpf: '',
    rg: '',
    ctps: '',
    pis: '',
    dataNascimento: '',
    dataAdmissao: '',
    telefone: '',
    email: '',
    tipoEscala: '6x1',
    diaFolgaSemanal: '',
    senhaPortal: '',
    observacoes: ''
  });

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, status, showArchived]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      setLoading(true);
      setError('');
    });
    fetchColaboradores({
      signal: controller.signal,
      q: deferredSearch,
      status,
      archivedOnly: showArchived,
      page,
      limit
    })
      .then((data) => {
        setItems(Array.isArray(data?.items) ? data.items : []);
        setTotal(Number(data?.total ?? 0) || 0);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError('Não foi possível carregar os colaboradores.');
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [deferredSearch, status, showArchived, page, limit, reloadToken]);

  const displayItems = useMemo(() => {
    const funcaoLabelByValue = new Map(FUNCAO_OPTIONS.map((o) => [o.value, o.label]));
    const statusLabelByValue = new Map(STATUS_OPTIONS.map((o) => [o.value, o.label]));

    const list = (items || []).map((c) => {
      const statusValue = normalizeText(c?.status || 'ativo') || 'ativo';
      return {
        id: String(c?._id || c?.id || '').trim(),
        nome: c?.nome || '',
        cpf: c?.cpf || '',
        funcao: funcaoLabelByValue.get(c?.funcao) || c?.funcao || c?.cargo || '',
        escala: c?.tipoEscala || c?.escala || '',
        status: statusValue,
        statusLabel: statusLabelByValue.get(statusValue) || c?.status || 'Ativo',
        arquivado: Boolean(c?.arquivado),
        raw: c
      };
    });

    list.sort((a, b) => collatorPtBr.compare(a.nome || '', b.nome || ''));
    return list;
  }, [items]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const toDateDigits = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = String(d.getFullYear()).padStart(4, '0');
    return `${dd}${mm}${yyyy}`;
  };

  const openCreateModal = () => {
    setSubmitError('');
    setFieldErrors({});
    setFormMode('create');
    setEditingId(null);
    setForm({
      nome: '',
      funcao: '',
      status: 'ativo',
      cpf: '',
      rg: '',
      ctps: '',
      pis: '',
      dataNascimento: '',
      dataAdmissao: '',
      telefone: '',
      email: '',
      tipoEscala: '6x1',
      diaFolgaSemanal: '',
      senhaPortal: '',
      observacoes: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const openEditModal = (c) => {
    const raw = c?.raw || c;
    setSubmitError('');
    setFieldErrors({});
    setFormMode('edit');
    setEditingId(String(raw?._id || c?.id || ''));
    setForm({
      nome: raw?.nome || '',
      funcao: raw?.funcao || '',
      status: raw?.status || 'ativo',
      cpf: raw?.cpf || '',
      rg: raw?.rg || '',
      ctps: raw?.ctps || '',
      pis: raw?.pis || '',
      dataNascimento: toDateDigits(raw?.dataNascimento),
      dataAdmissao: toDateDigits(raw?.dataAdmissao),
      telefone: raw?.telefone || '',
      email: raw?.email || '',
      tipoEscala: raw?.tipoEscala || '6x1',
      diaFolgaSemanal: raw?.diaFolgaSemanal || '',
      senhaPortal: '',
      observacoes: raw?.observacoes || ''
    });
    setModalOpen(true);
  };

  const handleOpenDetails = (c) => {
    setViewItem(c?.raw || c);
    setViewOpen(true);
  };

  const handleArchive = async (c) => {
    const id = String(c?.id || c?.raw?._id || c?._id || '');
    if (!id) return;
    setError('');
    try {
      await updateColaborador(id, { arquivado: !c?.arquivado });
      setReloadToken((t) => t + 1);
    } catch {
      setError('Não foi possível atualizar o status de arquivamento.');
    }
  };

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!normalizeText(form.nome)) next.nome = 'Informe o nome completo.';
    if (!normalizeText(form.funcao)) next.funcao = 'Selecione a função.';
    if (!normalizeCpfDigits(form.cpf)) next.cpf = 'Informe o CPF.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const basePayload = {
        nome: form.nome.trim(),
        funcao: form.funcao,
        status: form.status,
        rg: form.rg.trim(),
        ctps: form.ctps.trim(),
        pis: form.pis.trim(),
        dataNascimento: form.dataNascimento || null,
        dataAdmissao: form.dataAdmissao || null,
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        tipoEscala: form.tipoEscala,
        diaFolgaSemanal: form.diaFolgaSemanal,
        observacoes: form.observacoes.trim()
      };

      if (formMode === 'create') {
        const payload = {
          ...basePayload,
          cpf: normalizeCpfDigits(form.cpf),
          senhaPortal: form.senhaPortal
        };
        await createColaborador(payload);
      } else {
        const payload = { ...basePayload };
        if (form.senhaPortal.trim()) payload.senhaPortal = form.senhaPortal;
        await updateColaborador(editingId, payload);
      }
      setModalOpen(false);
      setReloadToken((t) => t + 1);
    } catch {
      setSubmitError(formMode === 'create' ? 'Não foi possível criar o colaborador.' : 'Não foi possível atualizar o colaborador.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cc-page" aria-label="Cadastro de colaboradores">
      <header className="cc-header">
        <h2 className="cc-title">Colaboradores</h2>
        <button className="cc-btn cc-btn-primary" type="button" onClick={openCreateModal}>
          + Novo Colaborador
        </button>
      </header>

      <section className="cc-filters" aria-label="Filtros">
        <div className="cc-search">
          <label className="cc-label" htmlFor="cc-search">
            Buscar por CPF ou nome
          </label>
          <div className="cc-search-container">
            <svg className="cc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15.5 15.5M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              id="cc-search"
              className="cc-input cc-input-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por CPF ou nome"
              inputMode="search"
            />
          </div>
        </div>

        <div className="cc-filter-actions">
          <div className="cc-status">
            <label className="cc-label" htmlFor="cc-status">
              Status
            </label>
            <select
              id="cc-status"
              className="cc-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`cc-btn cc-btn-archived ${showArchived ? 'is-active' : ''}`}
            type="button"
            onClick={() => setShowArchived((v) => !v)}
          >
            <IconBox size={16} />
            Arquivados
          </button>
        </div>
      </section>

      {error && (
        <div className="cc-feedback cc-feedback-error" role="status">
          <div className="cc-feedback-title">Atenção</div>
          <div className="cc-feedback-text">{error}</div>
          <button
            className="cc-btn cc-btn-secondary"
            type="button"
            onClick={() => setReloadToken((t) => t + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section className="cc-list" aria-label="Listagem de colaboradores">
        {loading ? (
          <div className="cc-skeleton-grid" aria-label="Carregando colaboradores">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="cc-skeleton-card"></div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="cc-empty" role="status">
            Nenhum colaborador encontrado.
          </div>
        ) : (
          <div className="cc-grid">
            {displayItems.map((c) => (
              <CollaboratorCard key={c.id} colaborador={c} onOpen={handleOpenDetails} onEdit={openEditModal} onArchive={handleArchive} />
            ))}
          </div>
        )}

        {!loading && total > 0 && (
          <div className="cc-pagination" aria-label="Paginação">
            <div className="cc-pagination-info">
              Página {page} de {pageCount} • {total} colaboradores
            </div>
            <div className="cc-pagination-actions">
              <button className="cc-btn cc-btn-secondary" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Anterior
              </button>
              <button className="cc-btn cc-btn-secondary" type="button" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>
                Próxima
              </button>
            </div>
          </div>
        )}
      </section>

      <Modal open={modalOpen} title={formMode === 'create' ? 'Novo Colaborador' : 'Editar Colaborador'} onClose={closeModal}>
        <form className="cc-form" onSubmit={handleSubmit}>
          <div className="cc-form-grid">
            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-nome">
                Nome Completo *
              </label>
              <input
                id="cc-nome"
                className={`cc-input ${fieldErrors.nome ? 'is-error' : ''}`}
                type="text"
                value={form.nome}
                onChange={(e) => setField('nome', e.target.value)}
                autoComplete="name"
                autoFocus
              />
              {fieldErrors.nome && <div className="cc-field-error">{fieldErrors.nome}</div>}
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-funcao">
                Função *
              </label>
              <select
                id="cc-funcao"
                className={`cc-select ${fieldErrors.funcao ? 'is-error' : ''}`}
                value={form.funcao}
                onChange={(e) => setField('funcao', e.target.value)}
              >
                {FUNCAO_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {fieldErrors.funcao && <div className="cc-field-error">{fieldErrors.funcao}</div>}
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-status-form">
                Status
              </label>
              <select
                id="cc-status-form"
                className="cc-select"
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                {STATUS_OPTIONS.filter((o) => o.value !== 'todos').map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-cpf">
                CPF *
              </label>
              <input
                id="cc-cpf"
                className={`cc-input ${fieldErrors.cpf ? 'is-error' : ''}`}
                type="text"
                value={form.cpf}
                onChange={(e) => setField('cpf', e.target.value)}
                placeholder="Digite o CPF (apenas números)"
                inputMode="numeric"
                autoComplete="off"
                disabled={formMode === 'edit'}
              />
              {fieldErrors.cpf && <div className="cc-field-error">{fieldErrors.cpf}</div>}
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-rg">
                RG
              </label>
              <input id="cc-rg" className="cc-input" type="text" value={form.rg} onChange={(e) => setField('rg', e.target.value)} />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-ctps">
                CTPS
              </label>
              <input id="cc-ctps" className="cc-input" type="text" value={form.ctps} onChange={(e) => setField('ctps', e.target.value)} />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-pis">
                PIS
              </label>
              <input id="cc-pis" className="cc-input" type="text" value={form.pis} onChange={(e) => setField('pis', e.target.value)} />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-nascimento">
                Data de Nascimento
              </label>
              <input
                id="cc-nascimento"
                className="cc-input"
                type="text"
                value={formatDateBr(form.dataNascimento)}
                onChange={(e) => setField('dataNascimento', e.target.value)}
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                autoComplete="bday"
              />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-admissao">
                Data de Admissão
              </label>
              <input
                id="cc-admissao"
                className="cc-input"
                type="text"
                value={formatDateBr(form.dataAdmissao)}
                onChange={(e) => setField('dataAdmissao', e.target.value)}
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
              />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-telefone">
                Telefone
              </label>
              <input
                id="cc-telefone"
                className="cc-input"
                type="tel"
                value={form.telefone}
                onChange={(e) => setField('telefone', e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-email">
                E-mail
              </label>
              <input
                id="cc-email"
                className="cc-input"
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-escala">
                Tipo de Escala
              </label>
              <select
                id="cc-escala"
                className="cc-select"
                value={form.tipoEscala}
                onChange={(e) => setField('tipoEscala', e.target.value)}
              >
                {ESCALA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cc-form-field">
              <label className="cc-label" htmlFor="cc-folga">
                Dia de Folga Semanal
              </label>
              <select
                id="cc-folga"
                className="cc-select"
                value={form.diaFolgaSemanal}
                onChange={(e) => setField('diaFolgaSemanal', e.target.value)}
              >
                {FOLGA_OPTIONS.map((o) => (
                  <option key={o.value || o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="cc-form-field cc-span-2">
              <label className="cc-label" htmlFor="cc-senha">
                Senha Portal Colaborador
              </label>
              <input
                id="cc-senha"
                className="cc-input"
                type="password"
                value={form.senhaPortal}
                onChange={(e) => setField('senhaPortal', e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="cc-form-field cc-span-2">
              <label className="cc-label" htmlFor="cc-obs">
                Observações
              </label>
              <textarea
                id="cc-obs"
                className="cc-textarea"
                value={form.observacoes}
                onChange={(e) => setField('observacoes', e.target.value)}
                rows={4}
              ></textarea>
            </div>
          </div>

          {submitError && (
            <div className="cc-field-error cc-submit-error" role="status">
              {submitError}
            </div>
          )}

          <div className="cc-form-actions">
            <button className="cc-btn cc-btn-secondary" type="button" onClick={closeModal} disabled={submitting}>
              Cancelar
            </button>
            <button className="cc-btn cc-btn-primary" type="submit" disabled={submitting}>
              {submitting ? (formMode === 'create' ? 'Criando...' : 'Salvando...') : formMode === 'create' ? 'Criar Colaborador' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={viewOpen} title="Detalhes do Colaborador" onClose={() => setViewOpen(false)}>
        {viewItem ? (
          <div className="cc-details">
            <div className="cc-details-actions">
              <button className="cc-btn cc-btn-secondary" type="button" onClick={() => openEditModal(viewItem)}>
                <IconEdit size={16} />
                Editar
              </button>
              <button className="cc-btn cc-btn-secondary" type="button" onClick={() => handleArchive({ ...viewItem, arquivado: Boolean(viewItem?.arquivado) })}>
                <IconArchive size={16} />
                {viewItem?.arquivado ? 'Desarquivar' : 'Arquivar'}
              </button>
            </div>

            <div className="cc-details-grid">
              <div className="cc-details-item">
                <div className="cc-details-label">Nome Completo</div>
                <div className="cc-details-value">{viewItem?.nome || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Função</div>
                <div className="cc-details-value">{viewItem?.funcao || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Status</div>
                <div className="cc-details-value">{viewItem?.status || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">CPF</div>
                <div className="cc-details-value">{formatCpf(viewItem?.cpf) || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">RG</div>
                <div className="cc-details-value">{viewItem?.rg || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">CTPS</div>
                <div className="cc-details-value">{viewItem?.ctps || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">PIS</div>
                <div className="cc-details-value">{viewItem?.pis || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Data de Nascimento</div>
                <div className="cc-details-value">{viewItem?.dataNascimento ? new Date(viewItem.dataNascimento).toLocaleDateString('pt-BR') : '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Data de Admissão</div>
                <div className="cc-details-value">{viewItem?.dataAdmissao ? new Date(viewItem.dataAdmissao).toLocaleDateString('pt-BR') : '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Telefone</div>
                <div className="cc-details-value">{viewItem?.telefone || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">E-mail</div>
                <div className="cc-details-value">{viewItem?.email || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Tipo de Escala</div>
                <div className="cc-details-value">{viewItem?.tipoEscala || '—'}</div>
              </div>
              <div className="cc-details-item">
                <div className="cc-details-label">Dia de Folga Semanal</div>
                <div className="cc-details-value">{viewItem?.diaFolgaSemanal || '—'}</div>
              </div>
              <div className="cc-details-item cc-details-span">
                <div className="cc-details-label">Observações</div>
                <div className="cc-details-value cc-details-value-multiline">{viewItem?.observacoes || '—'}</div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default CadastroColaboradores;
