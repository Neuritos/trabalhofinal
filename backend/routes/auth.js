const express = require('express');
const router = express.Router();

const USUARIO_FIXO = {
  username: 'admin',
  password: '1234'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USUARIO_FIXO.username && password === USUARIO_FIXO.password) {
    req.session.usuario = username;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check', (req, res) => {
  if (req.session.usuario) {
    res.json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

module.exports = router;
