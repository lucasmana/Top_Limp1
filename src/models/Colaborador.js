const mongoose = require('mongoose');

const colaboradoresDB =
  global.__TOPLIMP_COLAB_DB ||
  (global.__TOPLIMP_COLAB_DB = mongoose.createConnection('mongodb://127.0.0.1:27017/Colaboradores'));

if (!global.__TOPLIMP_COLAB_DB_EVENTS) {
  global.__TOPLIMP_COLAB_DB_EVENTS = true;
  colaboradoresDB.on('connected', () => {
    console.log('✅ MongoDB conectado ao banco Colaboradores (módulo Colaboradores)');
  });
  colaboradoresDB.on('error', (err) => {
    console.error('❌ Erro na conexão MongoDB (Colaboradores):', err);
  });
}

const STATUS_VALUES = ['ativo', 'inativo', 'afastado', 'ferias', 'folga', 'desligado'];
const ESCALA_VALUES = ['6x1', '5x2', '12x36', 'outros'];
const FOLGA_VALUES = ['', 'domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];

const colaboradorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Nome é obrigatório'], trim: true, minlength: 2, maxlength: 160 },
    funcao: { type: String, required: [true, 'Função é obrigatória'], trim: true, minlength: 2, maxlength: 80 },
    status: { type: String, enum: STATUS_VALUES, default: 'ativo' },
    cpf: { type: String, required: [true, 'CPF é obrigatório'], trim: true, minlength: 11, maxlength: 11 },
    rg: { type: String, trim: true, maxlength: 30, default: '' },
    ctps: { type: String, trim: true, maxlength: 30, default: '' },
    pis: { type: String, trim: true, maxlength: 30, default: '' },
    dataNascimento: { type: Date, default: null },
    dataAdmissao: { type: Date, default: null },
    telefone: { type: String, trim: true, maxlength: 30, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    tipoEscala: { type: String, enum: ESCALA_VALUES, default: '6x1' },
    diaFolgaSemanal: { type: String, enum: FOLGA_VALUES, default: '' },
    senhaPortalHash: { type: String, select: false, default: null },
    senhaPortalSalt: { type: String, select: false, default: null },
    senhaPortalAlgo: { type: String, select: false, default: null },
    observacoes: { type: String, trim: true, maxlength: 3000, default: '' },
    arquivado: { type: Boolean, default: false },
    arquivadoAt: { type: Date, default: null }
  },
  { timestamps: true }
);

colaboradorSchema.index({ cpf: 1 }, { unique: true });
colaboradorSchema.index({ arquivado: 1, status: 1, nome: 1 });
colaboradorSchema.index({ nome: 'text', cpf: 'text', email: 'text' });

module.exports = colaboradoresDB.models.Colaborador || colaboradoresDB.model('Colaborador', colaboradorSchema, 'cadastro_colaboradores');
