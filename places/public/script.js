document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    const municipioSelect = document.getElementById('municipio-select'); 
    const resultsContainer = document.getElementById('results-container');

    // Função que popula o seletor de municípios
    async function populateMunicipios() {
        try {
            const response = await fetch('/api/municipios');
            const municipios = await response.json();
            municipios.sort(); // Ordena alfabeticamente
            municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio;
                option.textContent = municipio;
                municipioSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar municípios:", error);
        }
    }

    // Função central para buscar dados
    async function fetchHealthUnits() {
        const selectedCategory = categorySelect.value;
        const selectedMunicipio = municipioSelect.value; 

        // Só faz a busca se PELO MENOS  uma categoria for selecionada
        if (!selectedCategory) {
            resultsContainer.innerHTML = '<p class="initial-message">Selecione uma categoria para começar a busca.</p>';
            return;
        }

        resultsContainer.innerHTML = '<p class="loading-message">Buscando unidades de saúde...</p>';

        try {
            // Constrói a URL com  os parâmetros
            const url = `/api/health-units?category=${encodeURIComponent(selectedCategory)}&municipio=${encodeURIComponent(selectedMunicipio)}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro do servidor: ${response.statusText}`);
            }
            const dataByMunicipality = await response.json();

            if (Object.keys(dataByMunicipality).length === 0) {
                resultsContainer.innerHTML = '<p class="no-results-message">Nenhuma unidade de saúde encontrada com os filtros selecionados.</p>';
                return;
            }

            let htmlContent = '';
            for (const municipio in dataByMunicipality) {
                const places = dataByMunicipality[municipio];
                htmlContent += `<h2 class="municipio-title">${municipio}</h2>`;
                htmlContent += places.map(place => `
                    <div class="result-item">
                        <h3>${place.displayName?.text || 'Nome não disponível'}</h3>
                        <p><strong>Endereço:</strong> ${place.formattedAddress || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> ${place.nationalPhoneNumber || 'Não informado'}</p>
                    </div>
                `).join('');
            }
            resultsContainer.innerHTML = htmlContent;

        } catch (error) {
            console.error("Erro ao buscar unidades de saúde:", error);
            resultsContainer.innerHTML = '<p class="error-message">Ocorreu um erro ao buscar. Tente novamente mais tarde.</p>';
        }
    }

    // Adiciona os event listeners para  os seletores
    categorySelect.addEventListener('change', fetchHealthUnits);
    municipioSelect.addEventListener('change', fetchHealthUnits);

    // Popula o seletor de municípios ao carregar a página
    populateMunicipios();
});