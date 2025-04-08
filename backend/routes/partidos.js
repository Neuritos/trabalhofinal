const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware para verificar login
function verificarLogin(req, res, next) {
  if (req.session.usuario) return next();
  return res.status(401).json({ error: 'Não autorizado' });
}

// Listar todos os partidos
router.get('/', verificarLogin, (req, res) => {
  db.all('SELECT * FROM partidos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar novo partido
router.post('/', verificarLogin, (req, res) => {
  const { nome, sigla, numero } = req.body;
  if (!nome || !sigla || !numero) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const sql = 'INSERT INTO partidos (nome, sigla, numero) VALUES (?, ?, ?)';
  db.run(sql, [nome, sigla, numero], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Editar partido
router.put('/:id', verificarLogin, (req, res) => {
  const { nome, sigla, numero } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE partidos SET nome = ?, sigla = ?, numero = ? WHERE id = ?';
  db.run(sql, [nome, sigla, numero, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Deletar partido
router.delete('/:id', verificarLogin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM partidos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
