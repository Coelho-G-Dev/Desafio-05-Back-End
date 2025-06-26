API de Rotas e Locais com Google Cloud e Autenticação
Este é o backend para uma aplicação que integra as APIs do Google Maps, Routes e Places, além de implementar um sistema de autenticação robusto com login interno, Google Auth e GitHub Auth, e um banco de dados MongoDB para persistência de dados e fallback.

Estrutura do Repositório
.
├── .env                  # Variáveis de ambiente (NÃO FAÇA COMMIT!)
├── package.json          # Dependências do projeto
├── README.md             # Este arquivo
└── src/
    ├── app.js            # Ponto de entrada principal da aplicação Express
    ├── config/
    │   ├── db.js         # Configuração de conexão com o MongoDB
    │   └── passport-setup.js # Configuração das estratégias do Passport (Google, GitHub)
    ├── controllers/
    │   ├── authController.js   # Lógica para autenticação (registro, login interno, profile, logout)
    │   └── placesController.js # Lógica para busca e gerenciamento de locais com a API Places
    ├── middlewares/
    │   └── authMiddleware.js   # Middlewares de proteção de rotas (JWT) e autorização por papel
    ├── models/
    │   ├── User.js       # Modelo Mongoose para o usuário (suporta login interno e social)
    │   └── Place.js      # Modelo Mongoose para armazenar dados de locais (para fallback)
    └── routes/
        ├── authRoutes.js   # Definição das rotas de autenticação
        └── placesRoutes.js # Definição das rotas para a API Places

🚀 Como Começar
1. Pré-requisitos
Node.js (versão 18 ou superior recomendada)

MongoDB (instância local ou um cluster MongoDB Atlas)

Conta Google Cloud com as APIs Maps JavaScript API, Places API e Directions API habilitadas.

Credenciais OAuth 2.0 para Google e GitHub.

2. Instalação
Clone o repositório:

git clone <URL_DO_SEU_REPOSITORIO>

Navegue até o diretório do projeto:

cd google-apis-backend

Instale as dependências:

npm install

3. Configuração do Ambiente (.env)
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

PORT=3001
MONGO_URI="mongodb+srv://<seu_usuario>:<sua_senha>@<seu_cluster>.mongodb.net/<nome_do_seu_banco_de_dados>?retryWrites=true&w=majority"
JWT_SECRET="UM_SEGREDO_BEM_FORTE_E_ALEATORIO_PARA_JWT"
PLACES_API_KEY="SUA_CHAVE_API_DO_GOOGLE_PLACES"
GOOGLE_CLIENT_ID="SEU_ID_DE_CLIENTE_GOOGLE_OAUTH"
GOOGLE_CLIENT_SECRET="SEU_SEGREDO_DE_CLIENTE_GOOGLE_OAUTH"
GITHUB_CLIENT_ID="SEU_ID_DE_CLIENTE_GITHUB_OAUTH"
GITHUB_CLIENT_SECRET="SEU_SEGREDO_DE_CLIENTE_GITHUB_OAUTH"
BASE_URL="http://localhost:3001" # Para desenvolvimento local. Mude para a URL de deploy em produção.
SESSION_SECRET="OUTRO_SEGREDO_FORTE_PARA_SESSAO_DO_EXPRESS"

MONGO_URI: Obtenha sua string de conexão no MongoDB Atlas ou configure sua instância local.

JWT_SECRET: Use uma string complexa e aleatória.

PLACES_API_KEY: Sua chave de API do Google Cloud para o serviço Places.

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: Credenciais OAuth 2.0 obtidas no Google Cloud Console para o tipo de aplicação "Web". Certifique-se de configurar a callbackURL (ex: http://localhost:3001/api/auth/google/callback).

GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET: Credenciais OAuth para GitHub, configuradas nas "Developer settings" do seu perfil GitHub. Configure a callbackURL (ex: http://localhost:3001/api/auth/github/callback).

BASE_URL: É crucial que esta URL corresponda à URL base da sua aplicação, especialmente para os callbacks de OAuth.

4. Execução Local
Para iniciar o servidor de desenvolvimento (com nodemon para recarregamento automático):

npm run dev

Para iniciar o servidor em modo de produção:

npm start

O servidor estará rodando em http://localhost:3001 (ou na porta que você configurou em PORT).

📝 Documentação da API
Endpoints de Autenticação (/api/auth)
Método

Endpoint

Descrição

Autenticação Necessária

Parâmetros (Exemplos)

POST

/api/auth/register

Cadastra um novo usuário interno.

Nenhuma

body: { "username": "seu_usuario", "email": "email@example.com", "password": "sua_senha" }

POST

/api/auth/login

Autentica um usuário interno e retorna um token JWT.

Nenhuma

body: { "email": "email@example.com", "password": "sua_senha" }

GET

/api/auth/google

Inicia o fluxo de login com Google.

Nenhuma

N/A (redirecionamento OAuth)

GET

/api/auth/google/callback

Callback para o Google OAuth após autenticação.

Nenhuma

N/A (redirecionamento OAuth)

GET

/api/auth/github

Inicia o fluxo de login com GitHub.

Nenhuma

N/A (redirecionamento OAuth)

GET

/api/auth/github/callback

Callback para o GitHub OAuth após autenticação.

Nenhuma

N/A (redirecionamento OAuth)

GET

/api/auth/profile

Retorna o perfil do usuário logado.

JWT Token (Header Authorization: Bearer <token>)

N/A

GET

/api/auth/admin

Exemplo de rota protegida para administradores.

JWT Token (Header Authorization: Bearer <token>) e Role admin

N/A

GET

/api/auth/logout

Realiza o logout do usuário (para sessões Passport).

Nenhuma (limpa a sessão)

N/A

Exemplo de Resposta (Login Interno bem-sucedido):

{
  "_id": "60d5ec49f8c7d60015f8e1a1",
  "username": "seu_usuario",
  "email": "email@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Endpoints de Locais (/api)
Método

Endpoint

Descrição

Autenticação Necessária

Parâmetros (Exemplos)

GET

/api/municipios

Retorna uma lista de municípios suportados no Maranhão.

Nenhuma

N/A

GET

/api/health-units

Busca unidades de saúde por categoria e município usando a API do Google Places. Implementa fallback com dados do MongoDB.

Nenhuma

query: category=Clínica General&municipio=São Luís ou category=Clínica General&municipio=todos

Exemplo de Resposta (/api/municipios):

[
  "Paço do Lumiar",
  "São José de Ribamar",
  "São Luís"
]

Exemplo de Resposta (/api/health-units):

{
  "São Luís": [
    {
      "displayName": { "text": "Unidade de Saúde da Família - X", "languageCode": "pt-BR" },
      "formattedAddress": "Rua Principal, 123, São Luís - MA",
      "nationalPhoneNumber": "+5598999999999"
    },
    // ... mais lugares
  ],
  "São José de Ribamar": [
    {
      "displayName": { "text": "Hospital Municipal de São José", "languageCode": "pt-BR" },
      "formattedAddress": "Av. Central, 456, São José de Ribamar - MA",
      "nationalPhoneNumber": "+5598888888888"
    }
  ]
}
