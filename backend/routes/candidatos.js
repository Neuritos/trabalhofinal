const express = require('express');
const router = express.Router();
const db = require('../db');

function verificarLogin(req, res, next) {
  if (req.session.usuario) return next();
  return res.status(401).json({ error: 'Não autorizado' });
}

// Listar candidatos
router.get('/', verificarLogin, (req, res) => {
  db.all(`
    SELECT candidatos.*, partidos.nome AS partido_nome
    FROM candidatos
    JOIN partidos ON candidatos.partido_id = partidos.id
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar candidato
router.post('/', verificarLogin, (req, res) => {
  const {
    cpf, titulo_eleitor, nome, endereco, numero,
    bairro, cidade, uf, cep, renda_mensal, partido_id
  } = req.body;

  if (
    !cpf || !titulo_eleitor || !nome || !endereco || !numero || !bairro ||
    !cidade || !uf || !cep || !renda_mensal || !partido_id
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const sql = `
    INSERT INTO candidatos (
      cpf, titulo_eleitor, nome, endereco, numero, bairro, cidade, uf, cep, renda_mensal, partido_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [
    cpf, titulo_eleitor, nome, endereco, numero,
    bairro, cidade, uf, cep, renda_mensal, partido_id
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Editar candidato
router.put('/:id', verificarLogin, (req, res) => {
  const {
    cpf, titulo_eleitor, nome, endereco, numero,
    bairro, cidade, uf, cep, renda_mensal, partido_id
  } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE candidatos SET
      cpf = ?, titulo_eleitor = ?, nome = ?, endereco = ?, numero = ?, bairro = ?,
      cidade = ?, uf = ?, cep = ?, renda_mensal = ?, partido_id = ?
    WHERE id = ?
  `;
  db.run(sql, [
    cpf, titulo_eleitor, nome, endereco, numero, bairro,
    cidade, uf, cep, renda_mensal, partido_id, id
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Deletar candidato
router.delete('/:id', verificarLogin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM candidatos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;

