const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota POST para login de usuários
router.post('/login', async (req, res) => {
  try {
    console.log('Recebida requisição de login:', req.body);
    
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      console.log('Campos faltando:', { email: !!email, senha: !!senha });
      return res.status(400).json({
        ok: false,
        mensagem: 'E-mail e senha são obrigatórios'
      });
    }

    // Buscar usuário pelo e-mail
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('Usuário não encontrado:', email);
      return res.status(401).json({
        ok: false,
        mensagem: 'Usuário não encontrado ou não cadastrado'
      });
    }

    // Verificar se é o usuário administrativo específico
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
    console.error('Erro no login:', error);
    res.status(500).json({
      ok: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
