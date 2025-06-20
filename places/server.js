import express from 'express';
import 'dotenv/config';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// A lista de municípios esta sendo nossa "fonte da verdade"
const MUNICIPIOS_MA = [
    "São Luís", , "São José de Ribamar", "Paço do Lumiar", 
];

app.use(express.static('public'));

// ROTA PARA ENVIAR A LISTA DE MUNICÍPIOS PARA O FRONTEND
app.get('/api/municipios', (req, res) => {
    res.json(MUNICIPIOS_MA);
});

// Rota de API para buscar unidades de saúde
app.get('/api/health-units', async (req, res) => {
    const { category, municipio } = req.query;

    if (!category) {
        return res.status(400).json({ message: 'A categoria é obrigatória.' });
    }

    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: 'Chave de API não configurada no servidor.' });
    }

    
    let municipiosToSearch;
    if (municipio && municipio !== 'todos') {
        // Se um município específico foi enviado, buscamos apenas nele
        municipiosToSearch = [municipio];
    } else {
        // Caso contrário, usamos a lista completa
        municipiosToSearch = MUNICIPIOS_MA;
    }

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const resultsByMunicipality = {};

    // A lógica  funciona para um ou vários municípios
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
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber'
                },
                body: JSON.stringify(requestBody),
            });
            
            if (!googleResponse.ok) {
                console.error(`Erro na busca em ${muni}: ${googleResponse.statusText}`);
                return;
            }

            const data = await googleResponse.json();
            if (data.places && data.places.length > 0) {
                resultsByMunicipality[muni] = data.places;
            }
        } catch (error) {
            console.error(`Erro na requisição para o município ${muni}:`, error);
        }
    });

    try {
        await Promise.all(searchPromises);
        res.json(resultsByMunicipality);
    } catch (error) {
        console.error("Erro geral ao processar as buscas:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});