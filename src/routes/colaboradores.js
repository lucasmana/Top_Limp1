const express = require('express');

const Colaborador = require('../models/Colaborador');
const CadastroColaborador = require('../models/CadastroColaborador');
const { normalizeCpfDigits, isValidCpf, parseDateInput, hashSecret } = require('../utils/colaboradoresUtils');

const router = express.Router();

const STATUS_VALUES = new Set(['ativo', 'inativo', 'afastado', 'ferias', 'folga', 'desligado']);
const ESCALA_VALUES = new Set(['6x1', '5x2', '12x36', 'outros']);
const FOLGA_VALUES = new Set(['', 'domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado']);

const requireWriteAccess = (req, res, next) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return next();
  const auth = String(req.headers.authorization ?? '');
  const ok = auth === `Bearer ${token}`;
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Não autorizado' });
  }
  next();
};

const buildQuery = ({ q, status, tipoEscala, diaFolgaSemanal, arquivados }) => {
  const query = {};

  const archived = String(arquivados ?? '').trim();
  if (archived === '1' || archived === 'true') query.arquivado = true;
  if (archived === '0' || archived === 'false') query.arquivado = false;

  const statusValue = String(status ?? '').trim();
  if (statusValue && STATUS_VALUES.has(statusValue)) query.status = statusValue;

  const escalaValue = String(tipoEscala ?? '').trim();
  if (escalaValue && ESCALA_VALUES.has(escalaValue)) query.tipoEscala = escalaValue;

  const folgaValue = String(diaFolgaSemanal ?? '').trim();
  if (FOLGA_VALUES.has(folgaValue) && folgaValue !== '') query.diaFolgaSemanal = folgaValue;

  const term = String(q ?? '').trim();
  if (term) {
    const digits = normalizeCpfDigits(term);
    query.$or = [
      { nome: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } }
    ];
    if (digits) query.$or.push({ cpf: { $regex: digits, $options: 'i' } });
  }

  return query;
};

const normalizePayload = (body, presentKeys) => {
  const isPartial = presentKeys instanceof Set;
  const has = (key) => (isPartial ? presentKeys.has(key) : true);

  const payload = {};
  const raw = {};

  if (has('nome')) payload.nome = String(body?.nome ?? '').trim();
  if (has('funcao')) payload.funcao = String(body?.funcao ?? '').trim();

  if (has('status')) {
    const status = String(body?.status ?? 'ativo').trim().toLowerCase();
    payload.status = STATUS_VALUES.has(status) ? status : 'ativo';
  }

  if (has('cpf')) payload.cpf = normalizeCpfDigits(body?.cpf);
  if (has('rg')) payload.rg = String(body?.rg ?? '').trim();
  if (has('ctps')) payload.ctps = String(body?.ctps ?? '').trim();
  if (has('pis')) payload.pis = String(body?.pis ?? '').trim();

  if (has('dataNascimento')) {
    raw.dataNascimento = body?.dataNascimento;
    payload.dataNascimento = parseDateInput(body?.dataNascimento);
  }

  if (has('dataAdmissao')) {
    raw.dataAdmissao = body?.dataAdmissao;
    payload.dataAdmissao = parseDateInput(body?.dataAdmissao);
  }

  if (has('telefone')) payload.telefone = String(body?.telefone ?? '').trim();
  if (has('email')) payload.email = String(body?.email ?? '').trim().toLowerCase();

  if (has('tipoEscala')) {
    const tipoEscala = String(body?.tipoEscala ?? '6x1').trim().toLowerCase();
    payload.tipoEscala = ESCALA_VALUES.has(tipoEscala) ? tipoEscala : '6x1';
  }

  if (has('diaFolgaSemanal')) {
    const folga = String(body?.diaFolgaSemanal ?? '').trim().toLowerCase();
    payload.diaFolgaSemanal = FOLGA_VALUES.has(folga) ? folga : '';
  }

  if (has('observacoes')) payload.observacoes = String(body?.observacoes ?? '').trim();

  if (has('senhaPortal')) {
    const senhaPortal = String(body?.senhaPortal ?? '').trim();
    if (senhaPortal) {
      const { salt, hash, algo } = hashSecret(senhaPortal);
      payload.senhaPortalSalt = salt;
      payload.senhaPortalHash = hash;
      payload.senhaPortalAlgo = algo;
    } else {
      payload.senhaPortalSalt = null;
      payload.senhaPortalHash = null;
      payload.senhaPortalAlgo = null;
    }
  }

  if (has('arquivado') && typeof body?.arquivado === 'boolean') {
    payload.arquivado = body.arquivado;
    payload.arquivadoAt = body.arquivado ? new Date() : null;
  }

  return { payload, raw };
};

const validatePayload = (payload, { presentKeys, raw }) => {
  const errors = {};
  const isPartial = presentKeys instanceof Set;
  const has = (key) => (isPartial ? presentKeys.has(key) : true);

  if (has('nome')) {
    if (!payload.nome) errors.nome = 'Nome Completo é obrigatório';
  }

  if (has('funcao')) {
    if (!payload.funcao) errors.funcao = 'Função é obrigatória';
  }

  if (has('cpf')) {
    if (!payload.cpf) errors.cpf = 'CPF é obrigatório';
  }

  if (has('email') && payload.email) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!ok) errors.email = 'E-mail inválido';
  }

  return errors;
};

const persistBoth = async ({ op, data, id }) => {
  if (op === 'create') {
    const docA = await Colaborador.create(data);
    try {
      const docB = await CadastroColaborador.create({ ...data, cpf: docA.cpf });
      return { primary: docA, secondary: docB };
    } catch (err) {
      await Colaborador.deleteOne({ _id: docA._id }).catch(() => {});
      throw err;
    }
  }

  if (op === 'update') {
    const updatedA = await Colaborador.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedA) return { primary: null, secondary: null };
    await CadastroColaborador.findOneAndUpdate({ cpf: updatedA.cpf }, data, { new: true, runValidators: true, upsert: true });
    return { primary: updatedA, secondary: null };
  }

  if (op === 'delete') {
    const doc = await Colaborador.findByIdAndDelete(id);
    if (!doc) return { primary: null, secondary: null };
    await CadastroColaborador.deleteOne({ cpf: doc.cpf }).catch(() => {});
    return { primary: doc, secondary: null };
  }

  throw new Error('Operação inválida');
};

router.get('/colaboradores', async (req, res) => {
  const startedAt = Date.now();
  try {
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 12) || 12));
    const sortBy = String(req.query.sortBy ?? 'nome').trim();
    const sortDir = String(req.query.sortDir ?? 'asc').trim().toLowerCase() === 'desc' ? -1 : 1;

    const query = buildQuery({
      q: req.query.q ?? req.query.pesquisa ?? '',
      status: req.query.status ?? '',
      tipoEscala: req.query.tipoEscala ?? '',
      diaFolgaSemanal: req.query.diaFolgaSemanal ?? '',
      arquivados: req.query.arquivados ?? req.query.arquivado ?? ''
    });
    if (!('arquivados' in req.query) && !('arquivado' in req.query)) query.arquivado = false;

    const sort = {};
    if (['nome', 'cpf', 'createdAt', 'updatedAt', 'status'].includes(sortBy)) sort[sortBy] = sortDir;
    else sort.nome = 1;

    const [total, items] = await Promise.all([
      Colaborador.countDocuments(query),
      Colaborador.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    const elapsedMs = Date.now() - startedAt;
    console.log(`GET /api/colaboradores - ${items.length} itens (total ${total}) em ${elapsedMs}ms`);

    res.json({
      success: true,
      message: 'Colaboradores encontrados com sucesso',
      page,
      limit,
      total,
      items
    });
  } catch (error) {
    console.error('Erro ao listar colaboradores:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar colaboradores' });
  }
});

router.get('/colaboradores/:id', async (req, res) => {
  try {
    const item = await Colaborador.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Colaborador não encontrado' });
    res.json({ success: true, message: 'Colaborador encontrado', item });
  } catch (error) {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar colaborador' });
  }
});

router.post('/colaboradores', requireWriteAccess, async (req, res) => {
  try {
    console.log('📋 POST /api/colaboradores - Dados recebidos:', req.body);
    const { payload, raw } = normalizePayload(req.body, null);
    console.log('📊 Payload normalizado:', payload);
    console.log('📊 Raw data:', raw);
    const errors = validatePayload(payload, { presentKeys: null, raw });
    console.log('❌ Erros de validação:', errors);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Dados inválidos', errors });

    const { primary } = await persistBoth({ op: 'create', data: payload });
    console.log(`✅ POST /api/colaboradores - criado cpf=${primary.cpf} id=${primary._id}`);
    res.status(201).json({ success: true, message: 'Colaborador criado com sucesso', item: primary });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'CPF já cadastrado' });
    }
    console.error('❌ Erro ao criar colaborador:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar colaborador' });
  }
});

router.put('/colaboradores/:id', requireWriteAccess, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID inválido' });

    const presentKeys = new Set(Object.keys(req.body ?? {}));
    if (presentKeys.has('cpf')) return res.status(400).json({ success: false, message: 'CPF não pode ser alterado' });
    const { payload, raw } = normalizePayload(req.body, presentKeys);
    const errors = validatePayload(payload, { presentKeys, raw });
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Dados inválidos', errors });

    const { primary } = await persistBoth({ op: 'update', id, data: payload });
    if (!primary) return res.status(404).json({ success: false, message: 'Colaborador não encontrado' });
    console.log(`PUT /api/colaboradores/${id} - atualizado cpf=${primary.cpf}`);
    res.json({ success: true, message: 'Colaborador atualizado com sucesso', item: primary });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'CPF já cadastrado' });
    }
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar colaborador' });
  }
});

router.delete('/colaboradores/:id', requireWriteAccess, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID inválido' });

    const { primary } = await persistBoth({ op: 'delete', id });
    if (!primary) return res.status(404).json({ success: false, message: 'Colaborador não encontrado' });
    console.log(`DELETE /api/colaboradores/${id} - removido cpf=${primary.cpf}`);
    res.json({ success: true, message: 'Colaborador removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover colaborador:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover colaborador' });
  }
});

module.exports = router;
