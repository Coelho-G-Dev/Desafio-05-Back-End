const whitelist = [
  'https://buscasusma-7pgtj8a5d-pytwers-projects.vercel.app',       //testes locais ,       
  'https://hackathon-front-aal9.vercel.app',
  'https://desafio-05-api.onrender.com',
  'http://localhost:3000',
  'https://hackathon-front-aal9.vercel.app/',
  'https://buscasusma-eight.vercel.app',
  'https://buscasaudema.vercel.app'
];
const corsOptions = {
  origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Acesso não permitido pelo CORS'));
      }
  },
  credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
export default corsOptions;
