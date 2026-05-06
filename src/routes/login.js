const express = require('express');
const router = express.Router();
// const Usuario = require('../models/Usuario'); // Temporariamente desativado para testar

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
    if (email === 'ADM0p3rac1onal2026@T0p' && senha === 'T0p') {
      console.log('Login administrativo detectado:', email);

      res.status(200).json({
        ok: true,
        mensagem: 'Login administrativo realizado com sucesso!',
        usuario: {
          id: 'admin-operacional',
          nome: 'Administrador Top Limp',
          email: email,
          tipo: 'administrativo',
          redirect: '/portaladm'
        }
      });
      return;
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
    // Temporariamente desativado para testar
    console.log('Busca de usuário por e-mail temporariamente desativada');
    
    return res.status(401).json({
      ok: false,
      mensagem: 'Login por banco de dados temporariamente desativado. Use usuário admin.'
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
