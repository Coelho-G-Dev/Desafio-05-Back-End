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
import MongoStore from 'connect-mongo'; 
import placesRoutes from './routes/placesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { getMaranhaoMunicipios } from './Services/ibgeService.js';
import pg_db from './config/db_postgres.js';



connectDB();

const app = express();


app.use(cors(corsOptions));
app.use(express.json());
app.use(mongoSanitize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, 
      collectionName: 'sessions', 
      ttl: 24 * 60 * 60, 
    }),
    cookie: { 
      maxAge: 24 * 60 * 60 * 1000, 
      secure: process.env.NODE_ENV === 'production' 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
    res.json({ message: 'API Saúde-MA está no ar!', docs: '/api-docs' });
});

/**
 * @swagger
 * /api/user:
 * get:
 * summary: Verifica autenticação do utilizador via sessão
 * tags: [Autenticação] 
 * responses:
 * 200:
 * description: Utilizador autenticado com sucesso
 * content:
 * application/json:
 * schema: 
 * type: object
 * properties:
 * _id:
 * type: string
 * example: "64a3219cf2a1e90017c3b7e2"
 * username:
 * type: string
 * example: "joaosilva"
 * email:
 * type: string
 * example: "joao@example.com"
 * role:
 * type: string
 * example: "admin"
 * 401:
 * description: Utilizador não autenticado
 * content:
 * application/json:
 * schema: 
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Utilizador não autenticado via sessão"
 */
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(401).json({ message: 'Utilizador não autenticado via sessão' });
  }
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint não encontrado.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

const startServer = async () => {
  try {
    console.log('Iniciando conexão com o MongoDB...');
    await connectDB();
    console.log('✅ Conexão com o MongoDB estabelecida.');

    console.log('Verificando conexão com o PostgreSQL...');
    await pg_db.query('SELECT NOW()'); 
    console.log('✅ Conexão com o PostgreSQL estabelecida.');

    console.log('Verificando/aquecendo o cache de municípios...');
    await getMaranhaoMunicipios();
    console.log('✅ Cache de municípios pronto.');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor pronto e rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('🔴 FALHA CRÍTICA AO INICIAR O SERVIDOR:', error);
    process.exit(1); 
  }
};




startServer();