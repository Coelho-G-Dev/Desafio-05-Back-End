const whitelist = [
  'https://buscasusma-e9idvek5v-pytwers-projects.vercel.app/', //front-end
  'https://buscasusma-e9idvek5v-pytwers-projects.vercel.app', 
  'https://buscasusma-b711ua4mc-pytwers-projects.vercel.app/',              // Para testes locais 
  'https://buscasusma-bt1fubdt2-pytwers-projects.vercel.app/',
  'https://buscasusma-5ccgwauyy-pytwers-projects.vercel.app/',              // Para testes locais 
  'http://localhost:3000',              // Para testes locais 
  'https://desafio-05-api.onrender.com' // URL do deploy no Render
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
