const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão com 30 minutos de duração
app.use(session({
  secret: 'segredo-eleicoes-2026',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutos
}));

// Criação das tabelas com base no SQL
const initSQL = fs.readFileSync(path.join(__dirname, 'models/init.sql'), 'utf-8');
db.exec(initSQL, (err) => {
  if (err) console.error("Erro ao criar tabelas:", err);
});

// Rotas
const authRoutes = require('./routes/auth');
const partidoRoutes = require('./routes/partidos');
const candidatoRoutes = require('./routes/candidatos');

app.use('/api/auth', authRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/candidatos', candidatoRoutes);

// Servir o frontend (mais pra frente)
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
