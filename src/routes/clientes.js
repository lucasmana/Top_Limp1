const express = require('express');
const router = express.Router();
const Cliente = require('../models/clientes');

// Listar todos os clientes com filtros
router.get('/clientes', async (req, res) => {
  try {
    const { nome, status, cidade } = req.query;
    let query = {};
    
    // Filtro por nome, CNPJ ou cidade
    if (nome) {
      query.$or = [
        { razaoSocial: { $regex: nome, $options: 'i' } },
        { cnpj: { $regex: nome, $options: 'i' } },
        { cidade: { $regex: nome, $options: 'i' } }
      ];
    }
    
    // Filtro por status
    if (status) {
      query.status = status;
    }
    
    // Filtro específico por cidade (se não estiver no nome)
    if (cidade && !nome) {
      query.cidade = { $regex: cidade, $options: 'i' };
    }
    
    const clientes = await Cliente.find(query).sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Buscar cliente por ID
router.get('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Criar novo cliente
router.post('/clientes', async (req, res) => {
  try {
    // Verificar se CNPJ já existe
    const clienteExistente = await Cliente.findOne({ cnpj: req.body.cnpj });
    if (clienteExistente) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    const cliente = new Cliente(req.body);
    await cliente.save();
    console.log('Cliente criado:', cliente);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(400).json({ error: error.message });
  }
});

// Atualizar cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(400).json({ error: error.message });
  }
});

// Deletar cliente
router.delete('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

module.exports = router;
