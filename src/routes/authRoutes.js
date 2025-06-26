import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Autenticação Interna
router.post('/register', registerUser);
router.post('/login', loginUser);

//Callback  para Autenticação Social
const socialAuthCallback = (strategyName) => (req, res, next) => {
  passport.authenticate(strategyName, { session: true }, (err, user, info) => {
    if (err) {
      console.error(`Erro na autenticação ${strategyName}:`, err);
      return res.redirect(`/?authError=server_error`); // Erro do servidor(interno)
    }
    if (!user) {
      // Autenticação falhou- credenciais inválidas
      const errorMessage = info && info.message ? info.message : 'authentication_failed';
      return res.redirect(`/?authError=${errorMessage}`);
    }
    // Autenticação bem-sucedida, logar o usuário
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error(`Erro ao logar usuário ${strategyName}:`, loginErr);
        return res.redirect(`/?authError=login_failed`);
      }
      res.redirect('/'); // Redireciona para a raiz do frontend após sucesso
    });
  })(req, res, next);
};

//Autenticação Social (Google e GitHub)

// Inicia o fluxo do Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback do Google após a autenticação
router.get('/google/callback', socialAuthCallback('google'));

// Inicia o fluxo do GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback do GitHub após a autenticação
router.get('/github/callback', socialAuthCallback('github'));

//Rotas de Redefinição de Senha 
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//Rotas Protegidas 
router.get('/profile', protect, getUserProfile);
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}! Você é um administrador.` });
});

//Rota de Logout 
router.get('/logout', logoutUser);

export default router; 
