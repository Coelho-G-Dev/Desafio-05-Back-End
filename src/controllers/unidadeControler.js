import fetch from 'node-fetch';
import UnidadeSaude from '../models/UnidadeSaude.js';
import RequisicaoAtendimento from '../models/RequisicaoAtendimento.js';
import pg_db from '../config/db_postgres.js';

async function encontrarESugerirUnidades(latitude, longitude, categoria) {
    const maxDistanceInMeters = 20000; 
    const HORAS_JANELA = 4; // Considerar requisições das últimas 4 horas

    return UnidadeSaude.aggregate([
    {
        $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distanciaCalculada',
        maxDistance: maxDistanceInMeters,
        query: { categoria: categoria },
        spherical: true
        }
    },
    {
        $lookup: {
        from: 'requisicaoatendimentos',
        let: { unidadeId: '$_id' },
        pipeline: [
            {
            $match: {
                $expr: {
                $and: [
                    { $eq: ['$unidadeSaude', '$$unidadeId'] },
                    { $gte: ['$createdAt', new Date(Date.now() - HORAS_JANELA * 60 * 60 * 1000)] }
                ]
                }
            }
            }
        ],
                as: 'requisicoesRecentes'
        }
    },
    { $addFields: { contagemRequisicoes: { $size: '$requisicoesRecentes' } } },
    {
        $addFields: {
            score: {
            $add: [
                { $multiply: [{ $divide: ['$distanciaCalculada', maxDistanceInMeters] }, 0.6] },
              { $multiply: [{ $divide: ['$contagemRequisicoes', 100] }, 0.4] } // Normaliza a contagem por um teto de 100
            ]
        }
        }
    },
        { $sort: { score: 1 } },
    {
        $project: {
            _id: 1,
            nomeUnidade: 1,
            enderecoCompleto: 1,
            distanciaAproximada: { $round: ['$distanciaCalculada', 0] },
            contagemRequisicoesRecentes: '$contagemRequisicoes',
            score: 1
        }
      }
    ]);
}

export const sugerirPorLocal = async (req, res) => {
    const { placeId, categoria } = req.body;
    if (!placeId || !categoria) return res.status(400).json({ message: 'placeId e categoria são obrigatórios.' });

    const apiKey = process.env.PLACES_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}&language=pt-BR`;

    try {
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        console.log('Resposta do Google:', geocodeData); 


        if (geocodeData.status !== 'OK') throw new Error('Geocodificação falhou');

        const { lat, lng } = geocodeData.results[0].geometry.location;
        const unidadesSugeridas = await encontrarESugerirUnidades(lat, lng, categoria);
        res.status(200).json(unidadesSugeridas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar sugestão.', error: error.message });
    }
    
};

export const registrarRequisicao = async (req, res) => {
    const { idUnidadeSaude } = req.body;
    if (!idUnidadeSaude) return res.status(400).json({ message: 'ID da Unidade de Saúde é obrigatório.' });

    try {
        // Salva no MongoDB
        const novaRequisicaoMongo = new RequisicaoAtendimento({ unidadeSaude: idUnidadeSaude });
        await novaRequisicaoMongo.save();

        // agrupa os  daddos do  Postgres
        const unidade = await UnidadeSaude.findById(idUnidadeSaude).lean();
        if (!unidade) throw new Error('Unidade não encontrada para sincronização');

        // Salva no PostgreSQL
        const insertQuery = `INSERT INTO requisicoes_power_bi(id_requisicao_mongo, id_unidade_mongo, nome_unidade, municipio, categoria, data_hora_requisicao) VALUES($1, $2, $3, $4, $5, $6)`;
        const values = [novaRequisicaoMongo._id.toString(), unidade._id.toString(), unidade.nomeUnidade, unidade.municipio, unidade.categoria, novaRequisicaoMongo.createdAt];
        await pg_db.query(insertQuery, values);

        res.status(201).json({ message: 'Requisição registrada e sincronizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar requisição.', error: error.message });
    }
};