// routes/orcamentos.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Conectar ao banco Orcamentos para orçamentos (CONEXÃO DEDICADA)
const orcamentoDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Orcamentos');

// Schema para orçamento
const orcamentoSchema = new mongoose.Schema({
  numero: { type: String, required: false },
  status: { type: String, required: false, default: 'ativo' },
  descricaoServico: { type: String, required: false },
  tipoServico: { type: String, required: false },
  periodicidade: { type: String, required: false },
  validade: { type: String, required: false },
  valor: { type: String, required: false },
  parcelas: { type: String, required: false },
  dataAprovacao: { type: String, default: '' },
  incluiColeta: { type: Boolean, default: false },
  incluiRelatorio: { type: Boolean, default: false },
  arquivoPdf: { type: String, default: null }, // Caminho do arquivo
  arquivoWord: { type: String, default: null }, // Caminho do arquivo Word
  arquivoNome: { type: String, default: null }, // Nome original do arquivo
  arquivoTipo: { type: String, default: null }, // Tipo do arquivo (pdf/doc/docx)
  observacoes: { type: String, default: '' },
  clienteId: { type: String, required: false },
  clienteNome: { type: String, required: false },
  clienteCnpj: { type: String, required: false },
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

// Criar modelo na collection orcamento_cliente do banco Orcamentos (USANDO CONEXÃO DEDICADA)
const Orcamento = orcamentoDB.model('orcamento_cliente', orcamentoSchema, 'orcamento_cliente');

// Criar pasta de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads/orcamentos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Pasta de uploads criada:', uploadDir);
}

// Servir arquivos estáticos com caminho absoluto
const uploadsPath = path.join(__dirname, '../../uploads');
router.use('/uploads', express.static(uploadsPath));
console.log('📁 Servindo arquivos estáticos de:', uploadsPath);

// GET - Abrir arquivo diretamente pelo caminho
router.get('/orcamentos/arquivo/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/orcamentos', filename);
    
    console.log('📄 Tentando abrir arquivo:', filePath);
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.log('❌ Arquivo não encontrado:', filePath);
      return res.status(404).json({ 
        success: false, 
        message: 'Arquivo não encontrado' 
      });
    }
    
    console.log('✅ Arquivo encontrado, enviando...');
    
    // Determinar o tipo de arquivo
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') {
      res.contentType('application/pdf');
    } else if (ext === '.doc' || ext === '.docx') {
      res.contentType('application/msword');
    }
    
    // Enviar o arquivo
    res.sendFile(filePath);
    
  } catch (error) {
    console.error('❌ Erro ao abrir arquivo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao abrir arquivo' 
    });
  }
});

// GET - Buscar orçamentos por cliente (nome ou CNPJ)
router.get('/orcamentos/cliente/:clienteInfo', async (req, res) => {
  try {
    const clienteInfo = req.params.clienteInfo;
    console.log('🔍 Buscando orçamentos para cliente:', clienteInfo);
    
    // Buscar por nome ou CNPJ (case insensitive)
    const orcamentos = await Orcamento.find({
      $or: [
        { clienteNome: { $regex: clienteInfo, $options: 'i' } },
        { clienteCnpj: clienteInfo }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Encontrados ${orcamentos.length} orçamentos para o cliente`);
    
    res.json({ 
      ok: true, 
      orcamentos,
      total: orcamentos.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar orçamentos por cliente:', error);
    res.status(500).json({ 
      ok: false, 
      mensagem: 'Erro ao buscar orçamentos por cliente' 
    });
  }
});

// GET - Listar todos os orçamentos
router.get('/orcamentos', async (req, res) => {
  try {
    const orcamentos = await Orcamento.find().sort({ createdAt: -1 });
    res.json({ ok: true, orcamentos });
  } catch (error) {
    console.error('❌ Erro ao buscar orçamentos:', error);
    res.status(500).json({ ok: false, mensagem: 'Erro ao buscar orçamentos' });
  }
});

// GET - Buscar orçamento por ID
router.get('/orcamentos/:id', async (req, res) => {
  try {
    const orcamento = await Orcamento.findById(req.params.id);
    if (!orcamento) {
      return res.status(404).json({ ok: false, mensagem: 'Orçamento não encontrado' });
    }
    res.json({ ok: true, orcamento });
  } catch (error) {
    console.error('❌ Erro ao buscar orçamento:', error);
    res.status(500).json({ ok: false, mensagem: 'Erro ao buscar orçamento' });
  }
});

// POST - Criar novo orçamento COM ARQUIVO
router.post('/orcamentos', async (req, res) => {
  try {
    console.log('='.repeat(50));
    console.log('📥 REQUISIÇÃO RECEBIDA - POST /orcamentos');
    console.log('📦 req.body:', req.body);
    console.log('📦 req.files:', req.files);
    console.log('='.repeat(50));

    // Verificar campos obrigatórios
    const camposObrigatorios = ['numeroOrcamento', 'valorTotal', 'tipoServico', 'periodicidade', 'validade', 'parcelas'];
    const camposFaltantes = camposObrigatorios.filter(campo => !req.body[campo]);
    
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        ok: false,
        mensagem: 'Campos obrigatórios faltando',
        camposFaltantes
      });
    }

    // PROCESSAR ARQUIVO
 // PROCESSAR ARQUIVO
let caminhoArquivo = null;
let arquivoNome = null;
let arquivoTipo = null;

// CORREÇÃO AQUI - mudar de 'arquivo' para 'arquivoPdf'
if (req.files && req.files.arquivoPdf) {
  const arquivo = req.files.arquivoPdf;  // Agora pega o campo correto
  
  console.log('📄 ARQUIVO RECEBIDO:');
  console.log('  Nome:', arquivo.name);
  console.log('  Tamanho:', arquivo.size, 'bytes');
  console.log('  Tipo:', arquivo.mimetype);
  


      // Validar tipo (PDF ou Word)
      const extensao = path.extname(arquivo.name).toLowerCase();
      const tiposPermitidos = ['.pdf', '.doc', '.docx'];
      
      if (!tiposPermitidos.includes(extensao)) {
        return res.status(400).json({
          ok: false,
          mensagem: 'Apenas arquivos PDF ou Word (.pdf, .doc, .docx) são permitidos'
        });
      }

      // Criar nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const nomeArquivo = `arquivo_${timestamp}_${randomString}${extensao}`;
      const caminhoCompleto = path.join(uploadDir, nomeArquivo);

      // Mover arquivo
      await new Promise((resolve, reject) => {
        arquivo.mv(caminhoCompleto, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Caminho relativo para salvar no banco
      caminhoArquivo = `/uploads/orcamentos/${nomeArquivo}`;
      arquivoNome = arquivo.name;
      arquivoTipo = extensao === '.pdf' ? 'pdf' : 'word';
      
      console.log('✅ Arquivo salvo em:', caminhoCompleto);
      console.log('📌 Caminho relativo:', caminhoArquivo);
    } else {
      console.log('⚠️ Nenhum arquivo enviado');
    }

    // Processar estruturas se vier como string JSON
    let estruturas = [];
    if (req.body.estruturas) {
      try {
        estruturas = typeof req.body.estruturas === 'string' 
          ? JSON.parse(req.body.estruturas) 
          : req.body.estruturas;
      } catch (e) {
        console.log('⚠️ Erro ao parsear estruturas:', e.message);
        estruturas = [];
      }
    }

    // Mapear dados para o schema (TODOS opcionais)
    const dadosMapeados = {
      numero: req.body.numeroOrcamento || '',
      status: req.body.status || 'ativo',
      descricaoServico: req.body.referente || req.body.descricaoServico || '',
      tipoServico: req.body.tipoServico || '',
      periodicidade: req.body.periodicidade || '',
      validade: req.body.validade || '',
      valor: req.body.valorTotal || '',
      parcelas: req.body.parcelas || '',
      dataAprovacao: req.body.dataAprovacao || '',
      incluiColeta: req.body.incluiColeta === 'true' || req.body.incluiColeta === true || false,
      incluiRelatorio: req.body.incluiRelatorio === 'true' || req.body.incluiRelatorio === true || false,
      observacoes: req.body.observacoes || '',
      clienteId: req.body.clienteId || '',
      clienteNome: req.body.clienteNome || '',
      clienteCnpj: req.body.clienteCnpj || '',
      dataCriacao: req.body.dataCriacao || new Date(),
      estruturas: estruturas || [],
      // Campos do arquivo
      arquivoPdf: arquivoTipo === 'pdf' ? caminhoArquivo : null,
      arquivoWord: arquivoTipo === 'word' ? caminhoArquivo : null,
      arquivoNome: arquivoNome || null,
      arquivoTipo: arquivoTipo || null
    };

    console.log('📦 Dados para salvar no banco:');
    console.log(JSON.stringify(dadosMapeados, null, 2));

    // Criar e salvar orçamento
    const orcamento = new Orcamento(dadosMapeados);
    const orcamentoSalvo = await orcamento.save();

    console.log('✅ ORÇAMENTO SALVO COM SUCESSO!');
    console.log('  ID:', orcamentoSalvo._id);
    console.log('  Número:', orcamentoSalvo.numero);
    console.log('  Arquivo:', orcamentoSalvo.arquivoNome || 'Nenhum');

    res.status(201).json({
      ok: true,
      mensagem: 'Orçamento criado com sucesso!',
      orcamento: orcamentoSalvo
    });

  } catch (error) {
    console.error('❌ ERRO AO CRIAR ORÇAMENTO:');
    console.error('  Mensagem:', error.message);
    console.error('  Stack:', error.stack);
    
    res.status(500).json({
      ok: false,
      mensagem: 'Erro ao criar orçamento',
      erro: error.message
    });
  }
});

// POST - Upload de arquivo (separado)
router.post('/orcamentos/upload', async (req, res) => {
  try {
    console.log('=== UPLOAD DE ARQUIVO ===');
    
    if (!req.files || !req.files.arquivoPdf) {
      return res.status(400).json({
        ok: false,
        mensagem: 'Nenhum arquivo enviado'
      });
    }
    
    const arquivo = req.files.arquivo;
    const extensao = path.extname(arquivo.name).toLowerCase();
    
    console.log('📄 Arquivo:', arquivo.name, arquivo.size, 'bytes');
    
    // Validar tipo (PDF ou Word)
    const tiposPermitidos = ['.pdf', '.doc', '.docx'];
    if (!tiposPermitidos.includes(extensao)) {
      return res.status(400).json({
        ok: false,
        mensagem: 'Apenas arquivos PDF ou Word (.pdf, .doc, .docx) são permitidos'
      });
    }
    
    // Criar nome único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const nomeArquivo = `upload_${timestamp}_${randomString}${extensao}`;
    const caminhoCompleto = path.join(uploadDir, nomeArquivo);
    
    // Mover arquivo
    await new Promise((resolve, reject) => {
      arquivo.mv(caminhoCompleto, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    const caminhoRelativo = `/uploads/orcamentos/${nomeArquivo}`;
    const tipoArquivo = extensao === '.pdf' ? 'pdf' : 'word';
    
    console.log('✅ Arquivo salvo:', caminhoRelativo);
    
    res.json({
      ok: true,
      mensagem: 'Arquivo enviado com sucesso!',
      arquivo: {
        nomeOriginal: arquivo.name,
        nomeSalvo: nomeArquivo,
        caminho: caminhoRelativo,
        tamanho: arquivo.size,
        tipo: tipoArquivo,
        extensao: extensao
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({
      ok: false,
      mensagem: 'Erro ao fazer upload',
      erro: error.message
    });
  }
});

// GET - Download do arquivo
router.get('/orcamentos/:id/download', async (req, res) => {
  try {
    console.log('=== DOWNLOAD DE ARQUIVO ===');
    console.log('📋 ID do orçamento:', req.params.id);
    
    const orcamento = await Orcamento.findById(req.params.id);
    
    if (!orcamento) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Orçamento não encontrado'
      });
    }
    
    // Verificar qual arquivo existe
    const caminhoArquivo = orcamento.arquivoPdf || orcamento.arquivoWord;
    
    if (!caminhoArquivo) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Arquivo não encontrado para este orçamento'
      });
    }
    
    const caminhoCompleto = path.join(__dirname, '../..', caminhoArquivo);
    
    if (!fs.existsSync(caminhoCompleto)) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Arquivo não encontrado no servidor'
      });
    }
    
    // Usar nome original se disponível, senão criar um nome
    const nomeDownload = orcamento.arquivoNome || `orcamento_${orcamento.numero}${path.extname(caminhoArquivo)}`;
    
    console.log('📄 Enviando arquivo:', nomeDownload);
    res.download(caminhoCompleto, nomeDownload);
    
  } catch (error) {
    console.error('❌ Erro no download:', error);
    res.status(500).json({
      ok: false,
      mensagem: 'Erro no download',
      erro: error.message
    });
  }
});

// GET - Visualizar arquivo (para PDFs)
router.get('/orcamentos/:id/visualizar', async (req, res) => {
  try {
    console.log('=== VISUALIZAR ARQUIVO ===');
    console.log('📋 ID do orçamento:', req.params.id);
    
    const orcamento = await Orcamento.findById(req.params.id);
    
    if (!orcamento) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Orçamento não encontrado'
      });
    }
    
    const caminhoArquivo = orcamento.arquivoPdf || orcamento.arquivoWord;
    
    if (!caminhoArquivo) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Arquivo não encontrado para este orçamento'
      });
    }
    
    const caminhoCompleto = path.join(__dirname, '../..', caminhoArquivo);
    
    if (!fs.existsSync(caminhoCompleto)) {
      return res.status(404).json({
        ok: false,
        mensagem: 'Arquivo não encontrado no servidor'
      });
    }
    
    console.log('📄 Visualizando arquivo:', caminhoCompleto);
    
    // Se for PDF, mostra no navegador
    if (caminhoArquivo.endsWith('.pdf')) {
      res.contentType('application/pdf');
      res.sendFile(caminhoCompleto);
    } else {
      // Se for Word, força download
      res.download(caminhoCompleto, orcamento.arquivoNome || `orcamento_${orcamento.numero}${path.extname(caminhoArquivo)}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao visualizar:', error);
    res.status(500).json({
      ok: false,
      mensagem: 'Erro ao visualizar arquivo',
      erro: error.message
    });
  }
});

module.exports = router;