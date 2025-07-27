import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const { Pool } = pg; //multiplas conexões 
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

pool.on('connect', () => {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
});

// Exportamos um método query que utiliza o pool de conexões.
export default {
    query: (text, params) => pool.query(text, params),
};