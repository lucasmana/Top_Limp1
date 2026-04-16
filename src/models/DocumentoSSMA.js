const mongoose = require('mongoose');

// Conectar ao banco Colaboradores para documentos SSMA (mesmo banco dos colaboradores)
const colaboradoresDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Colaboradores');

// Schema para documento SSMA
const documentoSSMASchema = new mongoose.Schema({
  colaboradorId: { type: String, required: true },
  colaboradorNome: { type: String, required: true },
  tipo: { type: String, required: true },
  nome: { type: String, required: false },
  dataRealizacao: { type: String, required: false },
  dataVencimento: { type: String, required: false },
  emitidoPor: { type: String, required: false },
  arquivo: { type: String, default: null }, // Caminho do arquivo
  arquivoNome: { type: String, default: null }, // Nome original do arquivo
  arquivoTipo: { type: String, default: null }, // Tipo do arquivo
  observacoes: { type: String, default: '' },
  dataCriacao: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Criar modelo na collection documentos do banco Colaboradores
const DocumentoSSMA = colaboradoresDB.model('DocumentoSSMA', documentoSSMASchema, 'documentos');

module.exports = DocumentoSSMA;
