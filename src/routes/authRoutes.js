// src/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Autenticação
 * description: Operações relacionadas a registro, login e gestão de usuários (incluindo login social e redefinição de senha).
 */

/* ---------- Autenticação interna ---------- */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Cria um novo usuário interno com email e senha.
 * description: Este endpoint permite que novos usuários se registrem na aplicação. A senha é validada quanto à sua força (mín. 8 caracteres, maiúscula, minúscula, número, caractere especial). Após o registro bem-sucedido, um JWT é retornado para autenticação futura.
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserRegister'
 * responses:
 * 201:
 * description: Usuário registrado com sucesso. Retorna os dados do usuário e um token JWT.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * 400:
 * description: Requisição inválida (e.g., dados ausentes, senha fraca, email já existe).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * examples:
 * MissingData:
 * value: { message: "Por favor, preencha todos os campos obrigatórios." }
 * WeakPassword:
 * value: { message: "A senha não atende a todos os requisitos de segurança." }
 * EmailExists:
 * value: { message: "Usuário com este e-mail já existe." }
 * 500:
 * description: Erro interno do servidor.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Autentica um usuário interno e devolve um JWT.
 * description: Permite que um usuário existente faça login utilizando seu email e senha. Em caso de sucesso, um JWT (JSON Web Token) é gerado e retornado, que deve ser usado para autenticar requisições a rotas protegidas.
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * 200:
 * description: Login bem-sucedido. Retorna os dados do usuário e o token JWT.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * 401:
 * description: Credenciais inválidas (email ou senha incorretos).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * examples:
 * InvalidCredentials:
 * value: { message: "E-mail ou senha inválidos." }
 * 400:
 * description: Requisição inválida (e.g., email/senha ausentes).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno do servidor.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginUser);

/* ---------- Autenticação Social ---------- */

// Função auxiliar genérica para Google e GitHub
const socialAuthCallback = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: true }, (err, user, info) => {
    if (err) {
      console.error(`Erro na autenticação ${strategyName}:`, err);
      return res.redirect(`/?authError=server_error`);
    }
    if (!user) {
      const errorMessage = info && info.message ? info.message : 'authentication_failed';
      return res.redirect(`/?authError=${errorMessage}`);
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error(`Erro ao logar usuário ${strategyName}:`, loginErr);
        return res.redirect(`/?authError=login_failed`);
      }
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * @swagger
 * /api/auth/google:
 * get:
 * summary: Inicia o fluxo de autenticação com o Google.
 * description: Redireciona o usuário para a página de consentimento do Google para autorização.
 * tags: [Autenticação]
 * responses:
 * 302:
 * description: Redireciona o navegador do usuário para o Google para autenticação.
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 * get:
 * summary: Callback do Google OAuth após autenticação bem-sucedida ou falha.
 * description: Este é o endpoint para o qual o Google redireciona após o usuário interagir com a tela de consentimento. O backend processa a resposta, autentica/vincula o usuário e redireciona para o frontend. Em caso de falha de autenticação (e.g., email já vinculado a outra conta), o frontend recebe um parâmetro 'authError' na URL.
 * tags: [Autenticação]
 * responses:
 * 302:
 * description: Redireciona para a raiz do frontend ('/') após sucesso, ou com um parâmetro de erro em caso de falha.
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/google/callback', socialAuthCallback('google'));

/**
 * @swagger
 * /api/auth/github:
 * get:
 * summary: Inicia o fluxo de autenticação com o GitHub.
 * description: Redireciona o usuário para a página de autorização do GitHub.
 * tags: [Autenticação]
 * responses:
 * 302:
 * description: Redireciona para o GitHub.
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /api/auth/github/callback:
 * get:
 * summary: Callback do GitHub OAuth após autenticação bem-sucedida ou falha.
 * description: Este é o endpoint para o qual o GitHub redireciona após o usuário autorizar a aplicação. O backend processa a resposta, autentica/vincula o usuário e redireciona para o frontend. Em caso de falha de autenticação (e.g., email já vinculado a outra conta), o frontend recebe um parâmetro 'authError' na URL.
 * tags: [Autenticação]
 * responses:
 * 302:
 * description: Redireciona para a raiz do frontend ('/') após sucesso, ou com um parâmetro de erro em caso de falha.
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/github/callback', socialAuthCallback('github'));

/* ---------- Recuperação de senha ---------- */

/**
 * @swagger
 * /api/auth/forgot-password:
 * post:
 * summary: Solicita um link de redefinição de senha por email.
 * description: Envia um email contendo um link único e temporário para a página de redefinição de senha. Por segurança, a mensagem de sucesso é genérica, independentemente se o email está cadastrado ou não, para evitar enumeração de usuários.
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email]
 * properties:
 * email:
 * type: string
 * format: email
 * example: usuario_cadastrado@example.com
 * responses:
 * 200:
 * description: Se o email estiver cadastrado, um link de recuperação será enviado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MessageResponse'
 * examples:
 * SuccessMessage:
 * value: { message: "Se o e-mail estiver cadastrado, um link de recuperação será enviado." }
 * 500:
 * description: Erro interno do servidor ao processar a solicitação ou enviar o email.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 * post:
 * summary: Redefine a senha do usuário usando um token de recuperação.
 * description: Permite que um usuário defina uma nova senha fornecendo um token válido (recebido por email) e a nova senha desejada. A nova senha é validada quanto aos critérios de força (mín. 8 caracteres, maiúscula, minúscula, número, caractere especial). O token é invalidado após o uso.
 * tags: [Autenticação]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [token, newPassword]
 * properties:
 * token:
 * type: string
 * description: O token de redefinição de senha recebido por email.
 * example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
 * newPassword:
 * type: string
 * format: password
 * description: A nova senha para a conta do usuário. Deve atender aos critérios de senha forte.
 * example: "NovaSenhaForte!2024"
 * responses:
 * 200:
 * description: Senha redefinida com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MessageResponse'
 * examples:
 * SuccessMessage:
 * value: { message: "Senha redefinida com sucesso!" }
 * 400:
 * description: Requisição inválida (e.g., token ausente, nova senha fraca/incompatível, token inválido/expirado).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * examples:
 * InvalidToken:
 * value: { message: "Token inválido ou expirado." }
 * WeakPassword:
 * value: { message: "A senha deve ter pelo menos 8 caracteres." }
 * 404:
 * description: Usuário não encontrado para o token fornecido.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno do servidor.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset-password', resetPassword);

/* ---------- Rotas protegidas ---------- */

/**
 * @swagger
 * /api/auth/profile:
 * get:
 * summary: Retorna os detalhes do perfil do usuário autenticado.
 * description: Acesso a este endpoint requer um token JWT válido. O token deve ser enviado no cabeçalho 'Authorization' como 'Bearer <token>'.
 * tags: [Autenticação]
 * security:
 * - bearerAuth: [] # Indica que esta rota requer o esquema de segurança bearerAuth (JWT)
 * responses:
 * 200:
 * description: Dados do perfil do usuário.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserProfile' # Referencia o schema UserProfile
 * 401:
 * description: Não autorizado (token JWT ausente, inválido ou expirado).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * examples:
 * Unauthorized:
 * value: { message: "Não autorizado, token falhou" }
 * 404:
 * description: Usuário não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/profile', protect, getUserProfile);

/**
 * @swagger
 * /api/auth/admin:
 * get:
 * summary: Exemplo de rota protegida apenas para usuários administradores.
 * description: Acesso a este endpoint requer um token JWT válido e que o usuário possua o papel 'admin'. O token deve ser enviado no cabeçalho 'Authorization' como 'Bearer <token>'.
 * tags: [Autenticação]
 * security:
 * - bearerAuth: [] # Indica que esta rota requer autenticação JWT
 * responses:
 * 200:
 * description: Acesso concedido.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MessageResponse'
 * examples:
 * AccessGranted:
 * value: { message: "Bem-vindo, [username]! Você é um administrador." }
 * 401:
 * description: Não autenticado (token JWT ausente, inválido ou expirado).
 * 403:
 * description: Proibido (usuário autenticado, mas sem papel de administrador).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * examples:
 * Forbidden:
 * value: { message: "Usuário com papel 'user' não tem permissão para acessar esta rota" }
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

/* ---------- Logout ---------- */

/**
 * @swagger
 * /api/auth/logout:
 * get:
 * summary: Realiza o logout do usuário.
 * description: Para logins sociais baseados em sessão, este endpoint encerra a sessão do usuário. Para logins JWT, ele apenas limpa o cookie da sessão, mas o token JWT no frontend ainda precisará ser removido manualmente pelo cliente.
 * tags: [Autenticação]
 * responses:
 * 200:
 * description: Logout bem-sucedido.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MessageResponse'
 * examples:
 * LogoutSuccess:
 * value: { message: "Logout bem-sucedido." }
 * 500:
 * description: Erro interno do servidor ao tentar fazer logout.
 */
router.get('/logout', logoutUser);

export default router;