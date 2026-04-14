const mongoose = require('mongoose');

// Conectar ao banco Cadastro para usuarios
const cadastroDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Cadastro');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [3, 'Senha deve ter pelo menos 3 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = cadastroDB.model('Usuario', usuarioSchema, 'usuarios');
