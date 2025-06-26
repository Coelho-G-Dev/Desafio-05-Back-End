// src/docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Rotas e Locais',
    version: '1.0.0',
    description: 'Documentação da API com autenticação e integração Google Places',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Caminho das rotas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
