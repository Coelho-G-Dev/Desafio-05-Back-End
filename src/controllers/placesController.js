import fetch from 'node-fetch';
import UnidadeSaude from '../models/UnidadeSaude.js';
import { getMaranhaoMunicipios } from '../Services/ibgeService.js';

/**
 * Obtém a lista de municípios do Maranhão.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
export const getMunicipios = async (req, res) => {
    try {
        const municipios = await getMaranhaoMunicipios();
        res.json(municipios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar a lista de municípios.' });
    }
};

/**
 * Busca unidades de saúde na API do Google e salva/atualiza em nosso banco de dados
 * coordenadas geográficas necessárias para a funcionalidade de sugestão.
 * @param {Object} req
 * @param {Object} res 
 */
export const searchHealthUnits = async (req, res) => {
    const { category, municipio } = req.query;

    if (!category) {
        return res.status(400).json({ message: 'A categoria é obrigatória.' });
    }

    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
        console.error('Chave de API do Places não configurada no servidor.');
        return res.status(500).json({ message: 'Chave de API não configurada no servidor.' });
    }

    let municipiosToSearch;
    try {
        if (municipio && municipio !== 'todos') {
            municipiosToSearch = [municipio];
        } else {
            municipiosToSearch = await getMaranhaoMunicipios();
        }
    } catch (error) {
        return res.status(500).json({ message: 'Falha ao obter a lista de municípios para a busca.' });
    }

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const resultsByMunicipality = {};

    const searchPromises = municipiosToSearch.map(async (muni) => {
        const requestBody = {
            textQuery: `${category} em ${muni}, Maranhão`,
            languageCode: 'pt-BR',
        };

        try {
            const googleResponse = await fetch(searchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location'
                },
                body: JSON.stringify(requestBody),
            });

            if (!googleResponse.ok) {
                throw new Error(`Falha na API do Google: ${googleResponse.statusText}`);
            }

            const data = await googleResponse.json();
            if (data.places && data.places.length > 0) {
                resultsByMunicipality[muni] = data.places;

                for (const unidadeData of data.places) {

                    
                    if (unidadeData.location && unidadeData.location.latitude && unidadeData.location.longitude) {
                        const locationGeoJSON = {
                            type: 'Point',
                            coordinates: [unidadeData.location.longitude, unidadeData.location.latitude]
                        };

                        await UnidadeSaude.findOneAndUpdate(
                            { placeId: unidadeData.id },
                            {
                                placeId: unidadeData.id,
                                nomeUnidade: unidadeData.displayName.text,
                                enderecoCompleto: unidadeData.formattedAddress,
                                location: locationGeoJSON, 
                                municipio: muni,
                                categoria: category,
                            },
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                    } else {
                        console.warn(`Local ${unidadeData.id} recebido sem dados de localização. Pulando salvamento.`);
                    }
                }
            }
        } catch (error) {
            console.error(`Erro ao buscar para ${muni}, usando fallback do DB :`, error.message);
            const fallbackData = await UnidadeSaude.find({ municipio: muni, category: category });
            if (fallbackData.length > 0) {
                console.warn(`Usando dados de fallback do DB para ${muni} (${category}).`);
                resultsByMunicipality[muni] = fallbackData;
            }
        }
    });

    try {
        await Promise.all(searchPromises);
        res.json(resultsByMunicipality);
    } catch (error) {
        console.error("Erro geral ao processar as buscas:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao processar buscas.' });
    }
};