const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota de teste para login
router.get('/test', (req, res) => {
  console.log('✅ Rota de teste de login funcionando!');
  res.json({ 
    success: true, 
    message: 'Rota de login está ativa!',
    timestamp: new Date()
  });
});

// Rota POST para login de usuários
router.post('/login', async (req, res) => {
  try {
    console.log('🚀 POST /api/login - Iniciando login...');
    console.log('📦 Corpo da requisição:', req.body);

    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      console.log('Campos faltando:', { email: !!email, senha: !!senha });
      return res.status(400).json({
        ok: false,
        mensagem: 'E-mail e senha são obrigatórios'
      });
    }

    // Verificar se é o usuário administrativo específico (VERIFICAR PRIMEIRO)
    if (email === 'sup.operacional@toplimppe.com.br' && senha === 'ADM0p3rac1onal2026@T0p') {
      console.log('Login administrativo detectado:', email);

      res.status(200).json({
        ok: true,
        mensagem: 'Login administrativo realizado com sucesso!',
        usuario: {
          id: 'admin-operacional',
          nome: 'Operacional ADM',
          email: email,
          tipo: 'administrativo',
          redirect: '/portaladm'
        }
      });
      return;
    }

    // Verificar se é o usuário Lucas (usuário especial)
    if (email === 'lucasmanamfs2020@gmail.com' && senha === 'Lucas2026@Top') {
      console.log('Login usuário Lucas detectado:', email);

      res.status(200).json({
        ok: true,
        mensagem: 'Login realizado com sucesso!',
        usuario: {
          id: 'user-lucas',
          nome: 'Lucas Manasses',
          email: email,
          tipo: 'usuario',
          redirect: '/portaladm'
        }
      });
      return;
    }

    // Buscar usuário pelo e-mail (apenas se não for o administrativo)
    console.log('🔍 Buscando usuário pelo e-mail:', email);
    const usuario = await Usuario.findOne({ email });

    console.log('📋 Usuário encontrado:', usuario ? 'SIM' : 'NÃO');

    if (!usuario) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({
        ok: false,
        mensagem: 'Usuário não encontrado ou não cadastrado'
      });
    }

    // Verificar senha (em produção, usar bcrypt para comparar senhas criptografadas)
    if (usuario.senha !== senha) {
      console.log('Senha incorreta para o usuário:', email);
      return res.status(401).json({
        ok: false,
        mensagem: 'Senha incorreta'
      });
    }

    console.log('Login realizado com sucesso:', usuario.email);

    res.status(200).json({
      ok: true,
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        cnpj: usuario.cnpj
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    console.error('❌ Stack trace:', error.stack);

    // Verificar se é erro de conexão
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(500).json({
        ok: false,
        mensagem: 'Erro de conexão com o banco de dados'
      });
    }

    res.status(500).json({
      ok: false,
      mensagem: 'Erro interno do servidor',
      erro: error.message
    });
  }
});

module.exports = router;
