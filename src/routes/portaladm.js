const express = require('express');
const path = require('path');
const router = express.Router();

// Middleware para verificar se é usuário administrativo
const verificarAdmin = (req, res, next) => {
  // Em produção, verificar token JWT ou sessão
  // Por enquanto, permite acesso direto para desenvolvimento
  next();
};

// Rota GET para portaladm
router.get('/portaladm', verificarAdmin, (req, res) => {
  // Servir o arquivo HTML do portal administrativo
  res.sendFile(path.join(__dirname, '../../app/vite-project/index.html'));
});

module.exports = router;