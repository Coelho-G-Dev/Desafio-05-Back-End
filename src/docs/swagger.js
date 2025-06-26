// src/docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Rotas e Locais – Desafio 05',
    version: '1.0.0',
    description:
      'API RESTful para autenticação (interna e social), recuperação de senha e busca de unidades de saúde no Maranhão.',
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
        description: 'Use o cabeçalho `Authorization: Bearer <token>` para acessar rotas protegidas.',
      },
    },
    schemas: {
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'usuario@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SenhaForte#123',
          },
        },
      },
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'novoUsuario',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'novo.usuario@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'MinhaSenha#456!',
          },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60d5ec49f8c7d60015f8e1a1',
          },
          username: {
            type: 'string',
            example: 'usuario.teste',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'usuario@example.com',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '60d5ec49f8c7d60015f8e1a1',
          },
          username: {
            type: 'string',
            example: 'usuario.teste',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'usuario@example.com',
          },
          role: {
            type: 'string',
            example: 'user',
          },
          token: {
            type: 'string',
            description: 'JWT de autenticação',
            example: 'eyJhbGc...token_jwt...',
          },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Operação realizada com sucesso.',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Credenciais inválidas.',
          },
        },
      },
      HealthUnit: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'UBS Centro de Saúde Bairro 1' },
          address: { type: 'string', example: 'Rua das Flores, 123 - São Luís' },
          category: { type: 'string', example: 'Clínica Geral' },
          latitude: { type: 'number', example: -2.5299 },
          longitude: { type: 'number', example: -44.3028 },
        },
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
      name: 'Locais',
      description:
        'Busca de municípios e unidades de saúde via Google Places.',
    },
  ],
};

const swaggerSpec = swaggerJSDoc({
  definition,
  apis: ['./src/routes/**/*.js'], // Inclui todas as rotas aninhadas
});

export default swaggerSpec;
