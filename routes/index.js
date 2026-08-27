const express = require('express');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'crm-portaria'
  });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portaria.local';
  const adminPassword = process.env.ADMIN_PASSWORD || '123456';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }

  const accessToken = jwt.sign(
    { sub: adminEmail, role: 'admin' },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { sub: adminEmail, type: 'refresh' },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );

  return res.json({
    success: true,
    user: {
      email: adminEmail,
      role: 'admin'
    },
    accessToken,
    refreshToken
  });
});

router.get('/auth/me', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint ativo'
  });
});

module.exports = router;
