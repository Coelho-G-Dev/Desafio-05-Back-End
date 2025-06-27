import 'dotenv/config';
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GITHUB_CLIENT_ID ||
  !process.env.GITHUB_CLIENT_SECRET ||
  !process.env.BASE_URL
) {
  console.error(
    'Erro de configuração: faltam variáveis de ambiente para OAuth.\n' +
    'Verifique GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET e BASE_URL.'
  );
  process.exit(1);
}

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserialização do usuário
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Helper para criar ou vincular usuário social 
async function findOrCreateSocialUser({ provider, profile, idField, fallbackDomain }) {
  const providerId  = profile.id;
  // Tenta achar pelo providerId
  let user = await User.findOne({ [idField]: providerId });
  if (user) return user;

  // Tenta achar por email
  const email = profile.emails?.[0]?.value || null;
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      if (!user[idField]) {
        user[idField] = providerId;
        await user.save();
        console.log(`Conta existente vinculada ao ${provider}: ${email}`); // mantém console
      } else if (user[idField] !== providerId) {
        console.warn(`Conflito: Email ${email} já vinculado a outro ${provider} ID.`);
      }
      return user;
    }
  }

  // Cria novo usuário  
  console.log(`Criando novo usuário ${provider}: ${email || providerId}`);
  return User.create({
    [idField]: providerId,
    email: email || `${providerId}@${fallbackDomain}`,
    username: profile.username
      || profile.displayName
      || profile.name?.givenName
      || `${provider}User${providerId}`,
    emailVerified: !!email                         
  });
}

// Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BASE_URL}/api/auth/google/callback`,
      scope:        ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateSocialUser({
          provider:      'Google',
          profile,
          idField:       'googleId',
          fallbackDomain:'google.com'
        });
        return done(null, user); // [MUDANÇA] garante return
      } catch (error) {
        console.error('Erro na autenticação Google:', error);
        return done(error, null); // [MUDANÇA] garante return
      }
    }
  )
);

// GitHub OAuth 2.0
passport.use(
  new GitHubStrategy(
    {
      clientID:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  `${process.env.BASE_URL}/api/auth/github/callback`,
      scope:        ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateSocialUser({
          provider:      'GitHub',
          profile,
          idField:       'githubId',
          fallbackDomain:'github.com'
        });
        return done(null, user); // [MUDANÇA] garante return
      } catch (error) {
        console.error('Erro na autenticação GitHub:', error);
        return done(error, null); // [MUDANÇA] garante return
      }
    }
  )
);

export default passport;

