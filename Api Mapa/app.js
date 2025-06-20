/**
 * @license
 * Copyright 2024 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
*/

// Variáveis globais para acessar os serviços e objetos do mapa em diferentes funções.
let map;
let autocomplete;
let directionsService;
let directionsRenderer;
let originLocation; // Armazena a localização de origem (do usuário ou padrão).
let destinationPlace; // Armazena o local de destino selecionado no Autocomplete.

/**
 * Função principal de callback da API do Google Maps.
 */
function initMap() {
    // Instancia os serviços de Rotas que serão usados para calcular e desenhar os trajetos.
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // 1. Tenta obter a localização do usuário via Geolocation da HTML5.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Sucesso: define a localização de origem com as coordenadas obtidas.
                originLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // Prossegue para configurar o mapa com a localização do usuário.
                setupMap(originLocation);
            },
            () => {
                // Falha ou permissão negada: chama a função de erro.
                handleLocationError(true);
            }
        );
    } else {
        // Navegador não suporta Geolocation: chama a função de erro.
        handleLocationError(false);
    }
}

/**
 * Lida com erros de geolocalização, definindo uma localização padrão.
 * @param {boolean} browserHasGeolocation - Se o navegador suporta a API.
 */
function handleLocationError(browserHasGeolocation) {
    // Define uma localização padrão (São Luís, MA) como fallback.
    const defaultLocation = { lat: -2.53073, lng: -44.3068 };
    originLocation = defaultLocation;
    // Configura o mapa com a localização padrão.
    setupMap(originLocation);
    console.warn(browserHasGeolocation ?
        "Erro: O serviço de geolocalização falhou." :
        "Erro: Seu navegador não suporta geolocalização.");
}

/**
 * Configura o mapa, marcadores e o serviço de Autocomplete.
 * @param {google.maps.LatLngLiteral} center - As coordenadas para centralizar o mapa.
 */
function setupMap(center) {
    // 2. Cria a instância do mapa dentro da div#map.
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Associa o renderizador de rotas ao mapa e ao painel de direções no HTML.
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));

    // Adiciona um marcador na localização de origem.
    new google.maps.Marker({
        position: center,
        map: map,
        title: "Sua Localização",
    });

    // 3. Configura o Autocomplete no campo de texto do modal.
    const input = document.getElementById("destination-address-input");
    autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ["place_id", "geometry", "name", "formatted_address"],
    });

    // Vincula os resultados do Autocomplete à área visível do mapa para dar preferência a locais próximos.
    autocomplete.bindTo("bounds", map);

    // Adiciona um ouvinte para quando um local é selecionado na lista do Autocomplete.
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        // Armazena os detalhes do local se a geometria for válida.
        if (place.geometry) {
            destinationPlace = place;
        }
    });

    // Configura os eventos de clique da interface do usuário.
    setupUI();
}

/**
 * Configura todos os ouvintes de eventos para os elementos da interface (botões, etc.).
 */
function setupUI() {
    const modalContainer = document.getElementById('modal-container');
    const openModalButton = document.getElementById('open-modal-button');
    const cancelButton = document.getElementById('cancel-button');
    const calculateButton = document.getElementById('add-destination-button');
    const newSearchButton = document.getElementById('new-search-button');

    // Abre o modal para adicionar um destino.
    openModalButton.addEventListener('click', () => {
        modalContainer.classList.remove('hide');
        document.getElementById("destination-address-input").focus();
    });

    // Fecha o modal.
    cancelButton.addEventListener('click', () => {
        modalContainer.classList.add('hide');
    });

    // Inicia o cálculo da rota.
    calculateButton.addEventListener('click', () => {
        if (!destinationPlace || !destinationPlace.geometry) {
            alert("Por favor, selecione um destino válido da lista.");
            return;
        }
        modalContainer.classList.add('hide');
        calculateAndDisplayRoute();
    });

    // Limpa a busca atual e retorna ao estado inicial.
    newSearchButton.addEventListener('click', () => {
        document.getElementById('initial-state').classList.remove('hide');
        document.getElementById('results-panel').classList.add('hide');
        directionsRenderer.set('directions', null); // Limpa a rota do mapa e do painel.
        map.setCenter(originLocation);
        map.setZoom(15);

        // Limpa a seleção anterior
        destinationPlace = null;
        document.getElementById("destination-address-input").value = "";
    });
}

/**
 * Chama o DirectionsService para calcular a rota e a exibe no mapa.
 */
function calculateAndDisplayRoute() {
    const selectedMode = document.querySelector('input[name="travel-mode"]:checked').value;

    if (!originLocation || !destinationPlace) {
        alert("Não foi possível determinar a origem ou o destino.");
        return;
    }

    // 4. Cria a requisição para o serviço de rotas.
    const request = {
        origin: originLocation,
        destination: { 'placeId': destinationPlace.place_id },
        travelMode: google.maps.TravelMode[selectedMode],
    };
    
    // Envia a requisição e processa a resposta.
    directionsService.route(request)
        .then((response) => {
            // Sucesso: desenha a rota no mapa e preenche o painel de direções.
            directionsRenderer.setDirections(response);

            // Alterna a visibilidade dos painéis.
            document.getElementById('initial-state').classList.add('hide');
            document.getElementById('results-panel').classList.remove('hide');
        })
        .catch((e) => window.alert("Solicitação de rota falhou: " + e.status));
}

// Atribui a função `initMap` à variável global `window` para que a API do Google
// possa chamá-la após o carregamento. Isso não é estritamente necessário
// com o `&callback=initMap` na URL, mas é uma boa prática.
window.initMap = initMap;