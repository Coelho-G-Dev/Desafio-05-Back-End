import express from 'express';
import { getMunicipios, searchHealthUnits } from '../controllers/placesController.js';
import { sugerirPorLocal, registrarRequisicao } from '../controllers/unidadeControler.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * - name: Locais
 * description: Endpoints para buscar informações sobre locais (unidades, municípios).
 * - name: Unidades de Saúde
 * description: Endpoints para a lógica de negócio do usuário (sugestões, registros).
 */

/**
 * @swagger
 * /api/places/municipios:
 * get:
 * summary: Lista de todos os 217 municípios suportados (MA)
 * tags: [Locais]
 * responses:
 * '200':
 * description: Array de municípios em formato JSON.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: string
 * example: "São Luís"
 */
router.get('/municipios', getMunicipios);

/**
 * @swagger
 * /api/places/health-units:
 * get:
 * summary: Busca unidades de saúde por município e categoria (popula o DB)
 * tags: [Locais]
 * parameters:
 * - in: query
 * name: municipio
 * schema:
 * type: string
 * description: O nome do município para a busca.
 * example: "São Luís"
 * - in: query
 * name: category
 * schema:
 * type: string
 * description: A categoria da unidade de saúde.
 * example: "UPA"
 * responses:
 * '200':
 * description: Objetos das unidades encontradas, agrupados por município.
 */
router.get('/health-units', searchHealthUnits);

/**
 * @swagger
 * /api/places/sugerir-por-local:
 * post:
 * summary: Retorna a melhor sugestão de unidade com base na localização e lotação.
 * tags: [Unidades de Saúde]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - placeId
 * - categoria
 * properties:
 * placeId:
 * type: string
 * description: O place_id do Google para o endereço do usuário.
 * example: "ChIJN1t_tDeuEmsRUsoyG83frY4"
 * categoria:
 * type: string
 * description: A categoria de unidade desejada.
 * example: "UPA"
 * responses:
 * '200':
 * description: Uma lista ordenada de unidades de saúde sugeridas.
 * '400':
 * description: placeId ou categoria não fornecidos.
 */
router.post('/sugerir-por-local', sugerirPorLocal);

/**
 * @swagger
 * /api/places/registrar:
 * post:
 * summary: Registra a seleção de uma unidade pelo usuário (para contagem de lotação).
 * tags: [Unidades de Saúde]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - idUnidadeSaude
 * properties:
 * idUnidadeSaude:
 * type: string
 * description: O ID (do MongoDB) da unidade de saúde selecionada.
 * example: "60c72b2f9b1d8c001f8e4a3c"
 * responses:
 * '201':
 * description: Requisição registrada com sucesso.
 * '400':
 * description: ID da unidade não fornecido.
 */
router.post('/registrar', registrarRequisicao);

export default router;