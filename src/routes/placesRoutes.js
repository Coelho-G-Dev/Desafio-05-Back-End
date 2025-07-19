import express from 'express';
import { getMunicipios, searchHealthUnits } from '../controllers/placesController.js';

const router = express.Router();


/**
 * @swagger
 * /api/municipios:
 * get:
 * summary: Retorna a lista completa de todos os 217 municípios do Maranhão
 * tags: [Places]
 * description: Lista obtida dinamicamente da API oficial do IBGE e cacheada no servidor por 24 horas para otimizar a performance.
 * responses:
 * '200':
 * description: Um array de strings com os nomes dos municípios em ordem alfabética.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: string
 * example: ["Açailândia", "Afonso Cunha", "Água Doce do Maranhão", "Alcântara", "..."]
 * '500':
 * description: Erro interno no servidor ao tentar buscar os dados do IBGE.
 */
router.get('/municipios', getMunicipios);

/**
 * @swagger
 * /api/health-units:
 * get:
 * summary: Busca unidades de saúde por categoria em um ou em todos os municípios
 * tags: [Places]
 * description: Realiza uma busca por unidades de saúde utilizando a API do Google Places. Os resultados são salvos em um banco de dados local para fallback e cache.
 * parameters:
 * - in: query
 * name: category
 * required: true
 * description: Categoria da unidade de saúde a ser buscada (ex: Hospital, Posto de Saúde, Clínica). **Parâmetro obrigatório.**
 * example: Hospital
 * schema:
 * type: string
 * - in: query
 * name: municipio
 * required: false
 * description: O nome exato de um município para filtrar a busca. **Se omitido ou com valor "todos", a busca será feita em todos os municípios do estado.**
 * example: São Luís
 * schema:
 * type: string
 * responses:
 * '200':
 * description: Operação bem-sucedida. Retorna um objeto onde cada chave é o nome de um município e o valor é um array com as unidades de saúde encontradas.
 * '400':
 * description: Requisição inválida. O parâmetro 'category' é obrigatório.
 * '500':
 * description: Erro interno no servidor.
 */
router.get('/health-units', searchHealthUnits);

export default router;