const whitelist = [
  'https://buscasusma-7pgtj8a5d-pytwers-projects.vercel.app',       // Para testes locais ,       
  'https://hackathon-front-aal9.vercel.app',
  'https://desafio-05-api.onrender.com',
  'http://localhost:3000'
];
const corsOptions = {
  origin: function (origin, callback) {
      // Permite requisições sem 'origin' (Postman)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          // Se a origem não estiver na whitelist, retorna um erro CORS.
          callback(new Error('Acesso não permitido pelo CORS'));
      }
  },
  credentials: true, // Permite o envio de cookies e cabeçalhos de autorização
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};
export default corsOptions;
