const express = require('express');
const mongoose = require('mongoose');

console.log('🚀 Iniciando servidor...');

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Cadastro')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

const app = express();
const PORT = process.env.PORT || 3001;

// Importar modelos
const Cliente = require('./src/models/clientes');
const Usuario = require('./src/models/Usuario');

// Importar rotas
const loginRoutes = require('./src/routes/login');
const cadastroRoutes = require('./src/routes/cadastro');
const clientesRoutes = require('./src/routes/clientes');

// Schema para orçamentos
const orcamentoSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  status: { type: String, required: true },
  descricaoServico: { type: String, required: true },
  tipoServico: { type: String, required: true },
  periodicidade: { type: String, required: true },
  validade: { type: String, required: true },
  valor: { type: String, required: true },
  parcelas: { type: String, required: true },
  dataAprovacao: { type: String, default: '' },
  incluiColeta: { type: Boolean, default: false },
  incluiRelatorio: { type: Boolean, default: false },
  arquivoPdf: { type: mongoose.Schema.Types.Mixed, default: null },
  observacoes: { type: String, default: '' },
  clienteId: { type: String, required: true },
  clienteNome: { type: String, required: true },
  clienteCnpj: { type: String, required: true },
  dataCriacao: { type: Date, default: Date.now },
  estruturas: [{
    tipo: String,
    descricao: String,
    capacidade: String,
    relatorios: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Orcamento = mongoose.model('orcamento', orcamentoSchema);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (liberado para frontend)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// ================= ROTAS IMPORTADAS =================

// Usar rotas existentes
app.use('/api', loginRoutes);
app.use('/api', cadastroRoutes);
app.use('/api', clientesRoutes);

// ================= ROTAS DIRETAS (BACKUP) =================

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
      health: '/health'
    }
  });
});

// ================= ERROS =================

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
  console.log(`🔐 Login: http://localhost:${PORT}/api/login`);
  console.log(`📝 Cadastro: http://localhost:${PORT}/api/cadastro`);
  console.log(`� Clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:5174`);
});

module.exports = app;