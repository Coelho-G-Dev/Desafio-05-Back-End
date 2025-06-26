import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import 'dotenv/config';
import connectDB from './config/db.js';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import passport from 'passport';
import './config/passport-setup.js'; 
import './config/emailTransporter.js';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';



import placesRoutes from './routes/placesRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Conecta ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json()); // Body parser para JSON
app.use(mongoSanitize()); // Proteção contra injeção de NoSQL
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Middleware de Sessão (passaport e OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production' },
  })
);

// Middleware do Passport
app.use(passport.initialize());
app.use(passport.session());

// arquivos estáticos do diretório 'public' front de teste
//app.use(express.static('public')); - (Para esntrar em modo de teste precisamos descomentar essa parte )

// Rotas da API
app.use('/api', placesRoutes);
app.use('/api/auth', authRoutes); // Rotas de autenticação (interna, social e redefinição de senha)

// Rota de teste
app.get('/', (req, res) => {
    res.send('API está rodando...');
});

// Rota para verificar o status de autenticação no front end
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(401).json({ message: 'Usuário não autenticado via sessão' });
  }
});


// Tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).send('Rota não encontrada.');
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Variáveis de ambiente carregadas. Verifique seu .env`);
});
