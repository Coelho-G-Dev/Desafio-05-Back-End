import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';

// SIMULAÇÃO DE BANCO DE DADOS EM MEMÓRIA (PARA EXEMPLO)
const users = [];
let currentId = 1;

passport.use(
  new GoogleStrategy(
    {
      // Opções da estratégia do Google
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Verifica se o usuário já existe no nosso banco de dados simulado
      const existingUser = users.find((user) => user.googleId === profile.id);

      if (existingUser) {
        // Se sim, retorna o usuário encontrado
        console.log('Usuário já existe:', existingUser.displayName);
        return done(null, existingUser);
      } else {
        // Se não, cria um novo usuário
        const newUser = {
          id: currentId++,
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        };
        users.push(newUser);
        console.log('Novo usuário criado:', newUser.displayName);
        return done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Salva apenas o ID do nosso sistema na sessão
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Busca o usuário completo no nosso banco simulado usando o ID da sessão
  const user = users.find((u) => u.id === id);
  done(null, user);
});