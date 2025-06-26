// src/docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Rotas e Locais – Desafio 05',
    version: '1.0.0',
    description:
      'Autenticação interna/social, busca de unidades de saúde (Google Places) e rotas (Google Directions) para municípios do Maranhão.',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Desenvolvimento local' },
    { url: 'https://desafio-05-api.onrender.com', description: 'Produção (Render)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Envie `Authorization: Bearer <token>` para acessar rotas protegidas.',
      },
    },
    schemas: {
      /* ---- ESQUEMAS ---- */
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email:    { type: 'string', format: 'email', example: 'usuario@example.com' },
          password: { type: 'string', format: 'password', example: 'SenhaForte#123' },
        },
      },
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'novoUsuario' },
          email:    { type: 'string', format: 'email', example: 'novo.usuario@example.com' },
          password: { type: 'string', format: 'password', example: 'MinhaSenha#456!' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          _id:     { type: 'string', example: '60d5ec49f8c7d60015f8e1a1' },
          username:{ type: 'string', example: 'usuario.teste' },
          email:   { type: 'string', format: 'email', example: 'usuario@example.com' },
          role:    { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          _id:     { type: 'string', example: '60d5ec49f8c7d60015f8e1a1' },
          username:{ type: 'string', example: 'usuario.teste' },
          email:   { type: 'string', format: 'email', example: 'usuario@example.com' },
          role:    { type: 'string', example: 'user' },
          token:   { type: 'string', description: 'JWT', example: 'eyJhbGc...' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Operação realizada com sucesso.' } },
      },
      ErrorResponse: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Credenciais inválidas.' } },
      },
    },
  },
  tags: [
    {
      name: 'Autenticação',
      description:
        'Registro, login (interno/social), perfil, redefinição de senha e rotas admin.',
    },
    {
      name: 'Locais de Saúde',
      description:
        'Busca de unidades de saúde via Google Places (a ser implementada).',
    },
  ],
};

const swaggerSpec = swaggerJSDoc({
  definition,                       // <-- nome recomendado
  apis: ['./src/routes/**/*.js'],   // inclui sub-diretórios
});

export default swaggerSpec;
