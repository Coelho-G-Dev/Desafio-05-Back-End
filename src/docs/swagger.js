import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Saúde-MA', 
    version: '1.0.0',
    description: 'API para o projeto Saúde-MA, permitindo que usuários encontrem unidades de saúde no estado do Maranhão e gerenciem suas contas.', 
  },
  servers: [
    {
      url: process.env.SERVER_URL || 'http://localhost:3001', 
      description: 'Servidor Principal',
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
    schemas: {
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'joaosilva' },
          email: { type: 'string', example: 'joao@example.com' },
          password: { type: 'string', example: 'senhaForte123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'jwt-token-aqui' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '60d...e1' },
              username: { type: 'string', example: 'joaosilva' },
              email: { type: 'string', example: 'joao@example.com' },
            },
          },
        },
      },
      Place: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'O ID único do local, fornecido pelo Google Places.',
            example: 'ChIJ...a5A',
          },
          displayName: {
            type: 'object',
            properties: {
                text: { type: 'string', example: 'Hospital Municipal Djalma Marques (Socorrão I)' },
                languageCode: { type: 'string', example: 'pt-BR' }
            }
          },
          formattedAddress: {
            type: 'string',
            description: 'O endereço completo e formatado do local.',
            example: 'R. do Passeio, 890 - Centro, São Luís - MA, 65025-450, Brasil',
          },
          nationalPhoneNumber: {
            type: 'string',
            description: 'O número de telefone do local em formato nacional.',
            example: '(98) 3212-2700',
          },
          location: {
            type: 'object',
            description: 'As coordenadas geográficas do local.',
            properties: {
              lat: { type: 'number', example: -2.5332851 },
              lng: { type: 'number', example: -44.3057102 },
            }
          }
        },
      },
      ErrorResponse: {
          type: 'object',
          properties: {
              message: {
                  type: 'string',
                  description: 'Uma mensagem descritiva do erro.',
              }
          },
          required: ['message']
      }
    },
  },
  tags: [
    {
      name: 'Autenticação',
      description: 'Endpoints para registro, login e gerenciamento de contas de usuário.',
    },
    {
      name: 'Locais',
      description: 'Endpoints para consulta de municípios e busca por unidades de saúde.',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;