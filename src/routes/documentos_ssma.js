// routes/documentos_ssma.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const DocumentoSSMA = require('../models/DocumentoSSMA');

// Importar a conexão do banco para verificar estado
const colaboradoresDB = mongoose.createConnection('mongodb://127.0.0.1:27017/Colaboradores');

// Eventos de conexão para depuração
colaboradoresDB.on('connected', () => {
  console.log('documentos_ssma.js: Conexão MongoDB estabelecida com banco Colaboradores');
});

colaboradoresDB.on('error', (err) => {
  console.error('documentos_ssma.js: Erro na conexão MongoDB:', err);
});

colaboradoresDB.on('disconnected', () => {
  console.log('documentos_ssma.js: Desconectado do MongoDB');
});

// Rota de teste para verificar se a API está funcionando
router.get('/documentos_ssma/test', (req, res) => {
  console.log('GET /api/documentos_ssma/test - Rota de teste');
  res.json({
    success: true,
    message: 'API Documentos SSMA está funcionando!',
    timestamp: new Date(),
    uploadDir: path.join(__dirname, '../../uploads/documentos_ssma')
  });
});

// Criar pasta de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads/documentos_ssma');
console.log('Verificando pasta de uploads:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('Pasta não existe, criando...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Pasta de uploads criada:', uploadDir);
} else {
  console.log('Pasta de uploads já existe:', uploadDir);
}

// Servir arquivos estáticos com caminho absoluto
const uploadsPath = path.join(__dirname, '../../uploads');
router.use('/uploads', express.static(uploadsPath));
console.log('📁 Servindo arquivos estáticos de:', uploadsPath);

// GET - Abrir arquivo diretamente pelo caminho
router.get('/documentos_ssma/arquivo/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/documentos_ssma', filename);
    
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
    } else if (ext === '.jpg' || ext === '.jpeg') {
      res.contentType('image/jpeg');
    } else if (ext === '.png') {
      res.contentType('image/png');
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

// POST - Criar novo documento SSMA
router.post('/documentos_ssma', async (req, res) => {
  console.log('=== POST /api/documentos_ssma - FLUXO COMPLETO DE UPLOAD ===');
  
  try {
    // 1. Verificar se recebeu dados
    if (!req.body) {
      console.log('ERRO: Body está vazio');
      return res.status(400).json({ success: false, message: 'Body está vazio' });
    }
    
    console.log('1. Body recebido:', Object.keys(req.body));
    
    // 2. Extrair dados do formulário
    const {
      colaboradorId,
      colaboradorNome,
      tipo,
      nome,
      dataRealizacao,
      dataVencimento,
      emitidoPor,
      arquivoBase64,
      arquivoNome,
      arquivoTipo,
      observacoes
    } = req.body;

    console.log('2. Dados extraídos:', { colaboradorId, tipo, nome, temArquivo: !!arquivoBase64 });
    
    // 3. Validar campos obrigatórios
    if (!tipo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tipo de documento é obrigatório' 
      });
    }

    let arquivoPath = null;
    
    // 4. FLUXO DE UPLOAD: Primeiro salvar arquivo na pasta
    if (arquivoBase64 && arquivoNome) {
      console.log('4. Iniciando upload do arquivo...');
      
      try {
        // Remover prefixo data:image/...;base64, se existir
        const base64Data = arquivoBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        // Gerar nome único para o arquivo
        const timestamp = Date.now();
        const extension = path.extname(arquivoNome);
        const uniqueFileName = `${colaboradorId}_${timestamp}${extension}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        
        console.log('5. Caminho do arquivo:', filePath);
        
        // Salvar arquivo no disco
        fs.writeFileSync(filePath, base64Data, 'base64');
        
        arquivoPath = uniqueFileName;
        console.log('6. Arquivo salvo com sucesso na pasta:', uniqueFileName);
        
      } catch (fileError) {
        console.error('ERRO ao salvar arquivo:', fileError);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao salvar arquivo no disco',
          error: fileError.message 
        });
      }
    } else {
      console.log('4. Nenhum arquivo para upload (continuando sem arquivo)');
    }

    // 5. DEPOIS salvar no banco de dados (com o caminho do arquivo)
    console.log('7. Salvando no banco de dados...');
    
    const documentoData = {
      colaboradorId,
      colaboradorNome,
      tipo,
      nome,
      dataRealizacao,
      dataVencimento,
      emitidoPor,
      arquivo: arquivoPath, // Caminho do arquivo salvo na pasta
      arquivoNome,
      arquivoTipo,
      observacoes
    };
    
    console.log('8. Dados para salvar no banco:', documentoData);
    
    const novoDocumento = new DocumentoSSMA(documentoData);
    await novoDocumento.save();
    
    console.log('9. SUCESSO: Documento salvo no banco:', novoDocumento._id);

    res.json({
      success: true,
      message: 'Documento criado com sucesso',
      documento: novoDocumento,
      arquivoSalvo: arquivoPath ? 'SIM' : 'NÃO'
    });

  } catch (error) {
    console.error('=== ERRO COMPLETO ===');
    console.error('Tipo do erro:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar documento',
      error: error.message,
      errorType: error.constructor.name
    });
  }
});

// GET - Buscar documentos por colaborador
router.get('/documentos_ssma/colaborador/:colaboradorId', async (req, res) => {
  try {
    const colaboradorId = req.params.colaboradorId;
    
    console.log('🔍 Buscando documentos do colaborador:', colaboradorId);
    
    const documentos = await DocumentoSSMA.find({ colaboradorId })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Encontrados ${documentos.length} documentos`);
    
    res.json({
      success: true,
      documentos: documentos
    });

  } catch (error) {
    console.error('❌ Erro ao buscar documentos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar documentos',
      error: error.message 
    });
  }
});

// DELETE - Deletar documento
router.delete('/documentos_ssma/:id', async (req, res) => {
  try {
    const documentoId = req.params.id;
    
    console.log('🗑️ Deletando documento:', documentoId);
    
    const documento = await DocumentoSSMA.findById(documentoId);
    
    if (!documento) {
      return res.status(404).json({ 
        success: false, 
        message: 'Documento não encontrado' 
      });
    }
    
    // Deletar arquivo do disco se existir
    if (documento.arquivo) {
      const filePath = path.join(uploadDir, documento.arquivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('✅ Arquivo deletado:', filePath);
      }
    }
    
    // Deletar documento do banco
    await DocumentoSSMA.findByIdAndDelete(documentoId);
    
    console.log('✅ Documento deletado do banco');
    
    res.json({
      success: true,
      message: 'Documento deletado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar documento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao deletar documento',
      error: error.message 
    });
  }
});

module.exports = router;
