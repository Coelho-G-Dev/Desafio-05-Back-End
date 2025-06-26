import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0', // Especificação OpenAPI 3.0.0
  info: {
    title: 'API de Rotas e Locais - Desafio 05', // Título da sua API
    version: '1.0.0', // Versão da API
    description: 'Documentação da API com funcionalidades de autenticação (interna e social), busca de unidades de saúde (Google Places API), e cálculo de rotas (Google Maps/Directions API) para os principais municípios do Maranhão.',
  },
  servers: [
    {
      url: 'http://localhost:3001', // Servidor de desenvolvimento local
      description: 'Servidor de Desenvolvimento Local',
    },
    {
      url: 'https://desafio-05-api.onrender.com', // URL pública do seu deploy no Render
      description: 'Servidor de Produção (Deploy no Render)',
    },
  ],
  components: {
    securitySchemes: {
      // DEFINIÇÃO DO ESQUEMA DE SEGURANÇA PARA JWT (Bearer Token)
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Indica que é um JSON Web Token
        description: 'Autenticação JWT usando um token Bearer no cabeçalho Authorization. Ex: `Bearer <seu_token_jwt>`',
      },
    },
    // Você pode adicionar esquemas (modelos de dados) aqui, se desejar documentá-los
    schemas: {
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'usuario@example.com' },
          password: { type: 'string', format: 'password', example: 'SenhaForte#123' },
        },
      },
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'novoUsuario' },
          email: { type: 'string', format: 'email', example: 'novo.usuario@example.com' },
          password: { type: 'string', format: 'password', example: 'MinhaSenha#456!' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: "60d5ec49f8c7d60015f8e1a1" },
          username: { type: 'string', example: "usuario.teste" },
          email: { type: 'string', format: 'email', example: "usuario@example.com" },
          role: { type: 'string', enum: ['user', 'admin'], example: "user" },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: "60d5ec49f8c7d60015f8e1a1" },
          username: { type: 'string', example: "usuario.teste" },
          email: { type: 'string', format: 'email', example: "usuario@example.com" },
          role: { type: 'string', example: "user" },
          token: { type: 'string', description: 'JWT Bearer token para autenticação', example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDU1YjQyNzE5N2M3MjVlODQ5YzAwOCIsImlhdCI6MTY3ODg4NjQwMCwiZXhwIjoxNjc4OTcyODAwfQ.SignatureHere" },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Operação realizada com sucesso.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Erro: Credenciais inválidas.' },
        },
      },
    },
  },
  // Tags para organizar seus endpoints no Swagger UI
  tags: [
    {
      name: 'Autenticação',
      description: 'Operações de registro, login, perfil e gestão de usuários (incluindo login social e redefinição de senha).',
    },
    {
      name: 'Locais de Saúde',
      description: 'Operações para buscar informações sobre unidades de saúde utilizando a Google Places API (New).',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Caminhos para os ficheiros que contêm as anotações JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;