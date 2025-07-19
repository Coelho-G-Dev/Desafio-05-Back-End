import fetch from 'node-fetch';

const IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/21/municipios';

let cachedMunicipios = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

/**
 * @returns {Promise<string[]>} 
 */
export const getMaranhaoMunicipios = async () => {
    const now = Date.now();
    if (cachedMunicipios && (now - lastFetchTime < CACHE_DURATION)) {
        console.log('Servindo lista de municípios do cache.');
        return cachedMunicipios;
    }

    try {
        console.log('Buscando nova lista de municípios da API do IBGE...');
        const response = await fetch(IBGE_API_URL);
        if (!response.ok) {
            throw new Error(`Falha ao buscar dados da API do IBGE: ${response.statusText}`);
        }
        const data = await response.json();
        
        const municipios = data.map(municipio => municipio.nome).sort();

        cachedMunicipios = municipios;
        lastFetchTime = now;
        console.log(`Cache de municípios atualizado com ${municipios.length} itens.`);
        
        return municipios;
    } catch (error) {
        console.error("Erro crítico ao buscar municípios do IBGE:", error);
        if (cachedMunicipios) {
            console.warn("Retornando lista de municípios do cache antigo devido a um erro na API.");
            return cachedMunicipios;
        }
        throw new Error('Não foi possível obter a lista de municípios do IBGE.');
    }
};