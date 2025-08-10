const whitelist = [
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
