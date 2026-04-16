const mongoose = require('mongoose');

// Conectar ao banco Servicos para serviços
const servicosDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Servicos');

const ServicoSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: true,
    trim: true
  },
  numeroOrcamento: {
    type: String,
    trim: true
  },
  tipoServico: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Vendido', 'Programado', 'Executado', 'Cancelado', 'Pendente'],
    default: 'Vendido'
  },
  horario: {
    type: String,
    trim: true
  },
  localEndereco: {
    type: String,
    trim: true
  },
  cidade: {
    type: String,
    trim: true
  },
  supervisorResponsavel: {
    type: String,
    trim: true
  },
  equipeMembros: {
    type: String,
    trim: true
  },
  veiculoPlaca: {
    type: String,
    trim: true
  },
  proximaExecucao: {
    type: Date
  },
  datasExecucao: [{
    data: Date,
    status: {
      type: String,
      enum: ['Programado', 'Executado', 'Cancelado']
    },
    observacao: {
      type: String,
      trim: true
    }
  }],
  estruturasRealizadas: {
    type: String,
    trim: true
  },
  acompanhanteAssinatura: {
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

module.exports = servicosDB.model('Servicos', ServicoSchema, 'cad_servicos');
