const mongoose = require('mongoose');

// Criar conexão dedicada para o banco Servicos - Conexão Top_Limp
const servicosDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Servicos');

// Eventos de conexão
servicosDB.on('connected', () => {
  console.log('✅ Conectado ao MongoDB - Conexão Top_Limp');
  console.log('📊 Banco de dados: Servicos');
  console.log('📁 Collection: servico');
});

servicosDB.on('error', (err) => {
  console.error('❌ Erro na conexão de Serviços:', err);
});

servicosDB.on('disconnected', () => {
  console.log('❌ Desconectado do MongoDB para Serviços');
});

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
    required: false,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Vendido', 'Programado', 'Executado', 'Cancelado', 'Pendente', 'Nao Agendado', 'Em execucao', 'Vencido', 'Agendado'],
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

const Servico = servicosDB.models.Servico || servicosDB.model('Servico', ServicoSchema, 'servico');

module.exports = Servico;
