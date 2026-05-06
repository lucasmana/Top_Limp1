const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');

console.log('🚀 Iniciando servidor...');

// Nota: Cada modelo usa sua própria conexão dedicada via mongoose.createConnection()
// Não usamos mongoose.connect() para evitar criar collections no banco errado

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - PRIMEIRO MIDDLEWARE (deve ser o primeiro)
app.use((req, res, next) => {
  console.log('CORS Middleware - Method:', req.method, 'Path:', req.path);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    console.log('CORS - Responding to OPTIONS request');
    return res.sendStatus(200);
  }

  next();
});

// Importar rotas (mantendo apenas essenciais para testar)
const loginRoutes = require('./src/routes/login');
// const cadastroRoutes = require('./src/routes/cadastro');
// const clientesRoutes = require('./src/routes/clientes');
// const orcamentosRoutes = require('./src/routes/orcamentos');
// const colaboradoresRoutes = require('./src/routes/colaboradores');
// const documentosSSMARoutes = require('./src/routes/documentos_ssma');
// const servicosRoutes = require('./src/routes/servicosDedicado'); // Não usado


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURAÇÃO DO FILE UPLOAD
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  createParentPath: true,
  abortOnLimit: true,
  responseOnLimit: 'Arquivo muito grande. Máximo 50MB',
  useTempFiles: false,
  safeFileNames: true,
  preserveExtension: true
}));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const metrics = {
  startedAt: Date.now(),
  requestsTotal: 0,
  byMethod: {},
  byStatus: {},
  byPath: {},
  durationsMs: []
};

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    metrics.requestsTotal += 1;
    metrics.byMethod[req.method] = (metrics.byMethod[req.method] || 0) + 1;
    metrics.byStatus[res.statusCode] = (metrics.byStatus[res.statusCode] || 0) + 1;
    metrics.byPath[req.path] = (metrics.byPath[req.path] || 0) + 1;
    metrics.durationsMs.push(ms);
    if (metrics.durationsMs.length > 5000) metrics.durationsMs.shift();
  });
  next();
});

// ================= ROTAS IMPORTADAS =================

// Usar rotas existentes (apenas login para testar)
app.use('/api', loginRoutes);
// app.use('/api', cadastroRoutes);
// app.use('/api', clientesRoutes);
// app.use('/api', orcamentosRoutes);
// app.use('/api', colaboradoresRoutes);
// app.use('/api', documentosSSMARoutes);
// app.use('/api', servicosRoutes); // Removido para evitar conflito

// Rota direta para /api/Servicos - Simplificada
app.post('/api/Servicos', async (req, res) => {
  console.log('🚀 POST /api/Servicos - Criando serviço...');
  
  try {
    const Servico = require('./src/models/ServicoDedicado');
    const ServicoPlural = Servico?.Plural;
    
    const {
      cliente,
      numeroOrcamento,
      tipoServico,
      descricao,
      status,
      horario,
      localEndereco,
      cidade,
      supervisorResponsavel,
      equipeMembros,
      veiculoPlaca,
      proximaExecucao,
      datasExecucao,
      estruturasRealizadas,
      acompanhanteAssinatura,
      observacoes
    } = req.body;

    console.log('📋 Dados recebidos:');
    console.log('  - cliente:', cliente);
    console.log('  - tipoServico:', tipoServico);
    console.log('  - descricao:', descricao);
    console.log('  - status:', status);
    console.log('  - proximaExecucao:', proximaExecucao);
    console.log('  - datasExecucao:', datasExecucao);

    // Validar campos obrigatórios
    if (!cliente || !tipoServico) {
      return res.status(400).json({
        success: false,
        message: 'Cliente e tipo de serviço são obrigatórios'
      });
    }

    // Criar novo serviço
    const novoServico = new ServicoPlural({
      cliente,
      numeroOrcamento: numeroOrcamento || '',
      tipoServico,
      descricao: descricao || '',
      status: status || 'Vendido',
      horario: horario || '',
      localEndereco: localEndereco || '',
      cidade: cidade || '',
      supervisorResponsavel: supervisorResponsavel || '',
      equipeMembros: equipeMembros || '',
      veiculoPlaca: veiculoPlaca || '',
      proximaExecucao,
      datasExecucao: datasExecucao || [],
      estruturasRealizadas: estruturasRealizadas || '',
      acompanhanteAssinatura: acompanhanteAssinatura || '',
      observacoes: observacoes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('💾 Salvando no banco Servicos - Collection servico...');
    const servicoSalvo = await novoServico.save();
    console.log('✅ Serviço salvo com sucesso!');
    console.log(' ID do serviço:', servicoSalvo._id);

    res.status(201).json({
      success: true,
      message: 'Serviço criado com sucesso na collection servico!',
      servico: servicoSalvo
    });

  } catch (error) {
    console.error('❌ Erro ao criar serviço:', error);
    
    // Se for erro de validação de status, mostrar valores válidos
    if (error.message.includes('enum value for path `status`')) {
      console.log('💡 Valores válidos para status:', ['Vendido', 'Programado', 'Executado', 'Cancelado', 'Pendente', 'Nao Agendado', 'Em execucao', 'Vencido', 'Agendado']);
      res.status(400).json({
        success: false,
        message: 'Status inválido. Valores permitidos: Vendido, Programado, Executado, Cancelado, Pendente, Nao Agendado, Em execucao, Vencido, Agendado',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar serviço no banco de dados',
        error: error.message
      });
    }
  }
});

console.log('✅ Sistema de serviços iniciado!');
console.log('📋 Apenas rota direta /api/Servicos está ativa');
console.log('💾 Banco: Servicos - Collection: servico');
console.log('🔧 Usando modelo ServicoDedicado.js');
console.log('🌐 Todas as rotas registradas:');
console.log('  - POST /api/Servicos (criar serviço)');
console.log('  - GET /api/Servicos (listar serviços)');
console.log('  - PUT /api/Servicos/:id (atualizar serviço) ✨ NOVA!');
console.log('  - DELETE /api/Servicos/:id (remover serviço) ✨ NOVA!');
console.log('  - GET /api/Servicos/test (teste)');
console.log('  - GET /health (status)');

// Rota GET para buscar todos os serviços
app.get('/api/Servicos', async (req, res) => {
  console.log('🔍 GET /api/Servicos - Buscando serviços...');
  
  try {
    const Servico = require('./src/models/ServicoDedicado');
    const {
      pesquisa,
      cliente,
      numeroOrcamento,
      numeroOrcament,
      tipoServico,
      status
    } = req.query;

    const conditions = [];
    const numeroOrcamentoParam = numeroOrcamento || numeroOrcament;

    if (pesquisa) {
      conditions.push({
        $or: [
          { cliente: { $regex: pesquisa, $options: 'i' } },
          { numeroOrcamento: { $regex: pesquisa, $options: 'i' } },
          { tipoServico: { $regex: pesquisa, $options: 'i' } }
        ]
      });
    }

    if (cliente) {
      conditions.push({ cliente: { $regex: cliente, $options: 'i' } });
    }

    if (numeroOrcamentoParam) {
      conditions.push({ numeroOrcamento: { $regex: numeroOrcamentoParam, $options: 'i' } });
    }

    if (tipoServico) {
      conditions.push({ tipoServico: { $regex: tipoServico, $options: 'i' } });
    }

    if (status) {
      conditions.push({ status });
    }

    const query = conditions.length === 0 ? {} : (conditions.length === 1 ? conditions[0] : { $and: conditions });
    const servicos = await Servico.find(query).sort({ createdAt: -1 });
    console.log(`📋 Encontrados ${servicos.length} serviços no banco Servicos (collection: servico)`);
    
    res.status(200).json({
      success: true,
      message: 'Serviços encontrados com sucesso!',
      servicos: servicos
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar serviços:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar serviços no banco de dados',
      error: error.message
    });
  }
});

// Rota PUT para atualizar serviço
app.put('/api/Servicos/:id', async (req, res) => {
  console.log('🔄 PUT /api/Servicos/:id - Atualizando serviço...');
  console.log('📋 ID recebido:', req.params.id);
  
  try {
    const Servico = require('./src/models/ServicoDedicado');
    const { id } = req.params;
    
    // Validar ID
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. O ID deve ter 24 caracteres.'
      });
    }
    
    console.log('🔍 Buscando serviço para atualizar...');
    
    // Verificar se serviço existe
    const servicoExistente = await Servico.findById(id);
    if (!servicoExistente) {
      console.log('❌ Serviço não encontrado no banco');
      return res.status(404).json({
        success: false,
        message: 'Serviço não encontrado no banco de dados'
      });
    }
    
    console.log('✅ Serviço encontrado, atualizando...');
    console.log('📊 Dados recebidos para atualização:', req.body);
    
    // Atualizar serviço com os novos dados
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    console.log('✅ Serviço atualizado com sucesso!');
    console.log('📋 Dados atualizados:');
    console.log('  - ID:', servicoAtualizado._id);
    console.log('  - Cliente:', servicoAtualizado.cliente);
    console.log('  - Tipo:', servicoAtualizado.tipoServico);
    console.log('  - Status:', servicoAtualizado.status);
    
    res.status(200).json({
      success: true,
      message: 'Serviço atualizado com sucesso no banco de dados!',
      servicoAtualizado: {
        _id: servicoAtualizado._id,
        cliente: servicoAtualizado.cliente,
        tipoServico: servicoAtualizado.tipoServico,
        status: servicoAtualizado.status,
        updatedAt: servicoAtualizado.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar serviço:', error);
    
    // Se for erro de ObjectId inválido
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Formato de ObjectId incorreto.'
      });
    }
    
    // Se for erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      console.log('💡 Erro de validação:', error.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos. Verifique os campos enviados.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar serviço no banco de dados',
      error: error.message
    });
  }
});

// Rota DELETE para remover serviço
app.delete('/api/Servicos/:id', async (req, res) => {
  console.log('🗑️ DELETE /api/Servicos/:id - Removendo serviço...');
  console.log('📋 ID recebido:', req.params.id);
  
  try {
    const Servico = require('./src/models/ServicoDedicado');
    const { id } = req.params;
    
    // Validar ID
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. O ID deve ter 24 caracteres.'
      });
    }
    
    console.log('🔍 Buscando serviço para deletar...');
    
    // Buscar e deletar o serviço
    const servicoDeletado = await Servico.findByIdAndDelete(id);
    
    if (!servicoDeletado) {
      console.log('❌ Serviço não encontrado no banco');
      return res.status(404).json({
        success: false,
        message: 'Serviço não encontrado no banco de dados'
      });
    }
    
    console.log('✅ Serviço deletado com sucesso!');
    console.log('📋 Dados do serviço removido:');
    console.log('  - ID:', servicoDeletado._id);
    console.log('  - Cliente:', servicoDeletado.cliente);
    console.log('  - Tipo:', servicoDeletado.tipoServico);
    
    res.status(200).json({
      success: true,
      message: 'Serviço deletado com sucesso do banco de dados!',
      servicoDeletado: {
        _id: servicoDeletado._id,
        cliente: servicoDeletado.cliente,
        tipoServico: servicoDeletado.tipoServico
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao deletar serviço:', error);
    
    // Se for erro de ObjectId inválido
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Formato de ObjectId incorreto.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar serviço do banco de dados',
      error: error.message
    });
  }
});

// Rota de teste para /api/Servicos
app.get('/api/Servicos/test', (req, res) => {
  console.log('✅ Rota de teste /api/Servicos/test funcionando!');
  res.json({ 
    success: true, 
    message: 'Rota de serviços está ativa!',
    banco: 'Servicos',
    collection: 'servico',
    timestamp: new Date()
  });
});

// ================= ROTAS DIRETAS (BACKUP) =================

app.get('/metrics', (req, res) => {
  const durations = metrics.durationsMs.slice().sort((a, b) => a - b);
  const pct = (p) => {
    if (durations.length === 0) return 0;
    const idx = Math.min(durations.length - 1, Math.max(0, Math.floor((p / 100) * durations.length)));
    return Math.round(durations[idx] * 100) / 100;
  };

  res.json({
    success: true,
    message: 'Métricas do servidor',
    uptimeMs: Date.now() - metrics.startedAt,
    requestsTotal: metrics.requestsTotal,
    byMethod: metrics.byMethod,
    byStatus: metrics.byStatus,
    byPath: metrics.byPath,
    latencyMs: {
      p50: pct(50),
      p95: pct(95),
      p99: pct(99)
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Top Limp API Server',
    version: '1.0.0',
    endpoints: {
      login: '/api/login',
      cadastro: '/api/cadastro',
      clientes: '/api/clientes',
      orcamentos: '/api/orcamentos',
      colaboradores: '/api/colaboradores',
      servicos: '/api/Servicos',
      metrics: '/metrics',
      health: '/health'
    }
  });
});

// ================= ERROS =================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mensagem: 'Backend funcionando!',
    porta: PORT,
    timestamp: new Date().toISOString(),
    rotas: {
      login: '/api/login',
      cadastro: '/api/cadastro',
      clientes: '/api/clientes',
      orcamentos: '/api/orcamentos',
      servicos: '/api/Servicos',
      servicos_test: '/api/Servicos/test',
      health: '/health'
    }
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.stack);

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: err.message
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('📋 Rotas disponíveis:');
  console.log('  - GET /health');
  console.log('  - POST /api/login');
  console.log('  - GET /api/clientes');
  console.log('  - POST /api/Servicos (criar serviço)');
  console.log('  - GET /api/Servicos (listar serviços)');
  console.log('  - PUT /api/Servicos/:id (atualizar serviço) ✨ NOVA!');
  console.log('  - DELETE /api/Servicos/:id (remover serviço) ✨ NOVA!');
  console.log('✅ Sistema pronto para receber requisições!');
  console.log(`🔐 Login: http://localhost:${PORT}/api/login`);
  console.log(`📝 Cadastro: http://localhost:${PORT}/api/cadastro`);
  console.log(`👥 Clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`📊 Orçamentos: http://localhost:${PORT}/api/orcamentos`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:5174`);
});

module.exports = app;
