const mongoose = require('mongoose');

// Schema para cliente
const ClienteSchema = new mongoose.Schema({
  razaoSocial: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  grupoEconomico: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    type: String,
    trim: true
  },
  cidade: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 2
  },
  contatoResponsavel: {
    type: String,
    trim: true
  },
  telefoneResponsavel: {
    type: String,
    trim: true
  },
  tipoServicoPrincipal: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['ativo', 'vencido', 'avencer', 'sem-agendamento', 'inativo'],
    default: 'ativo'
  },
  linkPortal: {
    type: String,
    trim: true
  },
  emailPortal: {
    type: String,
    trim: true,
    lowercase: true
  },
  documentosExigidos: {
    type: String,
    trim: true
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Conectar ao banco Cadastro para clientes
const cadastroDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Cadastro');

// Evento de erro para evitar crash
cadastroDB.on('error', (err) => {
  console.error('Clientes: Erro na conexão MongoDB:', err);
});

module.exports = cadastroDB.model('clientes', ClienteSchema, 'clientes');
