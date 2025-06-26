const whitelist = [
    'https://seu-frontend.netlify.app', // URL do seu site publicado
    'http://127.0.0.1:5500',            // Para testes locais
    'http://localhost:5500',            // Para testes locais
    'http://localhost:3001'             // Para testes locais
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: Postman, apps mobile) ou que estejam na whitelist
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido pelo CORS'));
    }
  }
};

export default corsOptions;