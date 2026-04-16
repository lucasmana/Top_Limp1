// routes/documentos_ssma.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const DocumentoSSMA = require('../models/DocumentoSSMA');

// Criar pasta de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads/documentos_ssma');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Pasta de uploads criada:', uploadDir);
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
  try {
    console.log('📝 Recebendo dados do documento:', req.body);
    
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

    // Validar campos obrigatórios
    if (!tipo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tipo de documento é obrigatório' 
      });
    }

    let arquivoPath = null;
    
    // Se houver arquivo em base64, salvar no disco
    if (arquivoBase64 && arquivoNome) {
      try {
        // Remover prefixo data:image/...;base64, se existir
        const base64Data = arquivoBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        // Gerar nome único para o arquivo
        const timestamp = Date.now();
        const extension = path.extname(arquivoNome);
        const uniqueFileName = `${colaboradorId}_${timestamp}${extension}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        
        // Salvar arquivo no disco
        fs.writeFileSync(filePath, base64Data, 'base64');
        
        arquivoPath = uniqueFileName;
        console.log('✅ Arquivo salvo:', filePath);
      } catch (fileError) {
        console.error('❌ Erro ao salvar arquivo:', fileError);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao salvar arquivo' 
        });
      }
    }

    // Criar documento no banco de dados
    const novoDocumento = new DocumentoSSMA({
      colaboradorId,
      colaboradorNome,
      tipo,
      nome,
      dataRealizacao,
      dataVencimento,
      emitidoPor,
      arquivo: arquivoPath,
      arquivoNome,
      arquivoTipo,
      observacoes
    });

    await novoDocumento.save();
    console.log('✅ Documento salvo no banco:', novoDocumento);

    res.json({
      success: true,
      message: 'Documento criado com sucesso',
      documento: novoDocumento
    });

  } catch (error) {
    console.error('❌ Erro ao criar documento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar documento',
      error: error.message 
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
