import express from 'express';
import session from 'express-session';
import passport from 'passport';
import 'dotenv/config';

// CORREÇÃO APLICADA: Usando './' para caminhos relativos a partir da raiz do projeto.
import './config/passport-setup.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware de Sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Middleware do Passport
app.use(passport.initialize());
app.use(passport.session());

// --- ROTAS DE API ---

// Rota de API para o frontend verificar quem está logado
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Se o usuário está logado, envia seus dados em formato JSON
    res.json(req.user);
  } else {
    // Se não está logado, envia um status de "Não Autorizado"
    res.status(401).json({ message: 'Usuário não autenticado' });
  }
});

// Usa as rotas de autenticação
app.use('/auth', authRouter);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});