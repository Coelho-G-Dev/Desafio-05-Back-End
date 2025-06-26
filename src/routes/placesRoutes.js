import express from 'express';
import { getMunicipios, searchHealthUnits } from '../controllers/placesController.js';

const router = express.Router();

// Rota para obter a lista de municípios
router.get('/municipios', getMunicipios);

// Rota para buscar unidades de saúde
router.get('/health-units', searchHealthUnits);

export default router;
