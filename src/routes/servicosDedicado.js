const express = require('express');
const router = express.Router();
const Servico = require('../models/ServicoDedicado');

// Rota de teste para verificar conexão
router.get('/test', (req, res) => {
  console.log('✅ Rota de serviços dedicada funcionando!');
  res.json({ 
    success: true, 
    message: 'Rota de serviços dedicada está ativa!',
    timestamp: new Date()
  });
});

// GET - Listar todos os serviços
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Buscando serviços na collection servico...');
    const servicos = await servico.find().sort({ createdAt: -1 });
    console.log(`📋 Encontrados ${servicos.length} serviços`);
    res.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
  }
});

// POST - Criar novo serviço
router.post('/', async (req, res) => {
  try {
    console.log('🚀 POST /api/servicos - Criando serviço no banco Servicos...');
    console.log('💾 Conexão Top_Limp - Banco: Servicos - Collection: servico');
    console.log('📦 Todos os campos recebidos:', JSON.stringify(req.body, null, 2));
    
    const {
      cliente,
      numeroOrcamento,
      tipoServico,
      descricao,
      status,
      horario,
      localEndereco,
      cidade,
      supervisorResponsavel,
      equipeMembros,
      veiculoPlaca,
      proximaExecucao,
      datasExecucao,
      estruturasRealizadas,
      acompanhanteAssinatura,
      observacoes
    } = req.body;

    console.log('📋 Dados extraídos:');
    console.log('  - cliente:', cliente);
    console.log('  - tipoServico:', tipoServico);
    console.log('  - status:', status);
    console.log('  - proximaExecucao:', proximaExecucao);
    console.log('  - datasExecucao:', datasExecucao);

    // Validar campos obrigatórios
    if (!cliente || !tipoServico) {
      return res.status(400).json({
        success: false,
        message: 'Cliente e tipo de serviço são obrigatórios'
      });
    }

    // Criar novo serviço
    console.log('🔧 Criando objeto Servico...');
    const novoServico = new Servico({
      cliente,
      numeroOrcamento,
      tipoServico,
      descricao,
      status: status || 'Vendido',
      horario,
      localEndereco,
      cidade,
      supervisorResponsavel,
      equipeMembros,
      veiculoPlaca,
      proximaExecucao,
      datasExecucao: datasExecucao || [],
      estruturasRealizadas,
      acompanhanteAssinatura,
      observacoes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('📄 Objeto criado:', JSON.stringify(novoServico, null, 2));

    // Salvar no banco
    console.log('💾 Salvando no banco Servicos - Collection servico...');
    const servicoSalvo = await novoServico.save();
    console.log('✅ Serviço salvo com sucesso no banco Servicos!');
    console.log('📁 Collection: servico');
    console.log('📊 ID do serviço:', servicoSalvo._id);

    res.status(201).json({
      success: true,
      message: 'Serviço criado com sucesso!',
      servico: servicoSalvo
    });

  } catch (error) {
    console.error('❌ Erro ao criar serviço:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar serviço no banco de dados',
      error: error.message
    });
  }
});

module.exports = router;
