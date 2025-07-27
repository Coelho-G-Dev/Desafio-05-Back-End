import express from 'express';
import { iniciarSimulacao, pararSimulacao, getStatus } from '../Services/simuladorService.js';
import UnidadeSaude from '../models/UnidadeSaude.js';


const router = express.Router();

const dadosUnidades = [
    { nomeUnidade: "UPA Araçagy", categoria: "UPA", municipio: "São José de Ribamar", location: { type: 'Point', coordinates: [-44.2435, -2.4856] } },
    { nomeUnidade: "Socorrão I", categoria: "Hospital", municipio: "São Luís", location: { type: 'Point', coordinates: [-44.3025, -2.5333] } },
    { nomeUnidade: "Posto de Saúde do Vinhais", categoria: "Posto de Saúde", municipio: "São Luís", location: { type: 'Point', coordinates: [-44.2647, -2.5089] } },
    { nomeUnidade: "UPA da Cidade Operária", categoria: "UPA", municipio: "São Luís", location: { type: 'Point', coordinates: [-44.2201, -2.5890] } },
    { nomeUnidade: "Clínica Pediátrica do Renascença", categoria: "Clínica Especializada", municipio: "São Luís", location: { type: 'Point', coordinates: [-44.2933, -2.4967] } }
];

router.post('/seed', async (req, res) => {
    try {
        await UnidadeSaude.deleteMany({});
        await UnidadeSaude.insertMany(dadosUnidades);
        res.status(201).send({ message: 'Banco de dados populado com unidades de saúde com sucesso!' });
    } catch (error) {
        res.status(500).send({ message: 'Falha ao popular o banco de dados.', error: error.message });
    }
});

router.post('/iniciar', (req, res) => {
    iniciarSimulacao();
    res.status(200).send({ message: 'Simulador iniciado.' });
});

router.post('/parar', (req, res) => {
    pararSimulacao(); 
    res.status(200).send({ message: 'Simulador parado.' });
});

router.get('/status', (req, res) => {
    const status = getStatus(); 
    res.status(200).json(status);
});
export default router;