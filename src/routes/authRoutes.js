import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
  socialAuthCallback, 
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * openapi: 3.0.3
 * info:
 *   title: API de Autenticação
 *   version: 1.0.0
 *   description: |
 *     Sistema de gerenciamento de autenticação de usuários
 *     com login, registro e OAuth2
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * tags:
 *   - name: Autenticação
 *     description: Endpoints de gerenciamento de autenticação
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica usuário interno e devolve JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sucesso – retorna token
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginUser);

/*  Autenticação Social  */

/* Google OAuth */
/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Inicia login via Google OAuth
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redireciona para o Google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback do Google OAuth
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redireciona para o frontend após login
 */
router.get('/google/callback', socialAuthCallback('google'));

/* GitHub OAuth */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', socialAuthCallback('github'));

/*  Recuperação de senha  */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Envia e-mail de redefinição de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail enviado
 */
router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

/*  Rotas protegidas  */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Retorna perfil do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Exemplo de rota apenas para administradores
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso concedido
 *       403:
 *         description: Sem permissão
 */
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

/*  Logout  */
router.get('/logout', logoutUser);

export default router;