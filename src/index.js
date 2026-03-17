const express = require('express');
const connectDB = require('./config/database');
const cadastroRoutes = require('./routes/cadastro');
const loginRoutes = require('./routes/login');
const clientesRoutes = require('./routes/clientes');
const orcamentosRoutes = require('./routes/orcamentos');

// Conectar ao MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rotas
app.use('/api', cadastroRoutes);
app.use('/api', loginRoutes);
app.use('/api', clientesRoutes);
app.use('/api', orcamentosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Top Limp está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});