import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

// Rota para iniciar o login com o Google
// Redireciona para a página de consentimento do Google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Rota de callback, para onde o Google redireciona após o login
authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/', // Se falhar, volta para a home
  }),
  (req, res) => {
    // Se tiver sucesso, redireciona para o dashboard
    res.redirect('/dashboard');
  }
);

// Rota de Logout
authRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default authRouter;