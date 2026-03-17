const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota POST para cadastro de usuários
router.post('/cadastro', async (req, res) => {
  try {
    console.log('Recebida requisição de cadastro:', req.body);
    
    const { nome, email, cnpj, senha } = req.body;

    // Validação básica
    if (!nome || !email || !cnpj || !senha) {
      console.log('Campos faltando:', { nome: !!nome, email: !!email, cnpj: !!cnpj, senha: !!senha });
      return res.status(400).json({
        ok: false,
        mensagem: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.findOne({
      $or: [{ email }, { cnpj }]
    });

    if (usuarioExistente) {
      console.log('Usuário já existe:', usuarioExistente.email || usuarioExistente.cnpj);
      return res.status(400).json({
        ok: false,
        mensagem: 'E-mail ou CNPJ já cadastrado'
      });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      cnpj,
      senha // Em produção, criptografar a senha
    });

    console.log('Salvando usuário:', novoUsuario);
    await novoUsuario.save();
    console.log('Usuário salvo com sucesso!');

    res.status(201).json({
      ok: true,
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cnpj: novoUsuario.cnpj
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      ok: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
