// src/routes/placesRoutes.js
import express from 'express';
import { getMunicipios, searchHealthUnits } from '../controllers/placesController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * - name: Locais
 * description: Endpoints referentes a municípios e unidades de saúde
 */

/**
 * @swagger
 * /api/municipios:
 * get:
 * summary: Lista de municípios suportados (MA)
 * tags: [Locais]
 * responses:
 * 200:
 * description: Array de municípios
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: string
 * example: ["São Luís", "Imperatriz", "São José de Ribamar"]
 */
router.get('/municipios', getMunicipios);

/**
 * @swagger
 * /api/health-units:
 * get:
 * summary: Busca unidades de saúde por município e categoria
 * tags: [Locais]
 * parameters:
 * - in: query
 * name: municipio
 * schema:
 * type: string
 * example: São Luís
 * required: true
 * - in: query
 * name: category
 * schema:
 * type: string
 * example: Clínica General
 * required: false
 * responses:
 * 200:
 * description: Um objeto contendo um array de unidades de saúde
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * healthUnits:
 * type: array
 * items:
 * $ref: '#/components/schemas/HealthUnit'
 * 400:
 * description: Parâmetro 'municipio' é obrigatório.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/health-units', searchHealthUnits);

export default router;