# 🗺️ API de Rotas e Locais com Google Cloud e Autenticação

Este projeto é o **back‑end** de uma aplicação web que integra **Google Maps Platform** (Maps, Places e Directions) com um sistema de **autenticação completo** (login interno via JWT, Google OAuth e GitHub OAuth). Os dados são persistidos em **MongoDB**, com fallback local para manter as informações disponíveis mesmo se as APIs estiverem indisponíveis.

---

## 📁 Estrutura do Projeto

```text
.
├── .env                        # Variáveis de ambiente (NÃO FAÇA COMMIT!)
├── package.json                # Dependências e scripts
├── README.md                   # Este arquivo
└── src/
    ├── app.js                  # Ponto de entrada (Express)
    ├── config/
    │   ├── db.js               # Conexão MongoDB
    │   └── passport-setup.js   # Estratégias OAuth (Google, GitHub)
    ├── controllers/
    │   ├── authController.js   # Autenticação (interno + social)
    │   └── placesController.js # Integração Google Places + fallback
    ├── middlewares/
    │   └── authMiddleware.js   # JWT + autorização por papel (role)
    ├── models/
    │   ├── User.js             # Modelo de usuário
    │   └── Place.js            # Modelo de locais para fallback
    └── routes/
        ├── authRoutes.js       # Rotas de autenticação
        └── placesRoutes.js     # Rotas de locais
```

---

## 🚀 Como Começar

### ✅ Pré‑requisitos

* **Node.js** v18 ou superior  
* **MongoDB** (local ou Atlas)  
* Conta na **Google Cloud** com as APIs:
  * Maps JavaScript API
  * Places API
  * Directions API  
* Credenciais **OAuth 2.0** para Google e GitHub

### 🔧 Instalação

```bash
git clone https://github.com/Coehlo-Gab-Dev/Desafio-05-Back-End
cd NOME_REPOSITORIO
npm install
```

### ⚙️ Configuração (`.env`)

Crie um arquivo `.env` na raiz:

```env
PORT=3001
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority

JWT_SECRET=sua_chave_jwt_super_secreta
SESSION_SECRET=sua_chave_para_sessao

PLACES_API_KEY=sua_chave_google_places

GOOGLE_CLIENT_ID=client_id_google
GOOGLE_CLIENT_SECRET=client_secret_google

GITHUB_CLIENT_ID=client_id_github
GITHUB_CLIENT_SECRET=client_secret_github

BASE_URL=http://localhost:3001
```

> ⚠️ **Importante:** cadastre as URLs de callback exatamente como acima
> nos painéis do Google e do GitHub, caso tenha alguma URL errada ele não irá funcionar de maneira alguma.

---

## ▶️ Execução

### Ambiente de Desenvolvimento

```bash
npm run dev   # nodemon
```

### Ambiente de Produção

```bash
npm start
```

Servidor disponível em **http://localhost:3001** (Após o deploy alteraremos).

---

## 📚 Documentação da API

> A documentação interativa via Swagger será disponibilizada em breve.
> Abaixo, os principais endpoints.

### 🔐 Autenticação (`/api/auth`)

| Método | Rota                | Descrição                               | Proteção |
| ------ | ------------------- | --------------------------------------- | -------- |
| POST   | `/register`         | Cria usuário interno                    | — |
| POST   | `/login`            | Autentica usuário interno (JWT)         | — |
| GET    | `/google`           | Login Google OAuth                      | — |
| GET    | `/google/callback`  | Callback Google                         | — |
| GET    | `/github`           | Login GitHub OAuth                      | — |
| GET    | `/github/callback`  | Callback GitHub                         | — |
| GET    | `/profile`          | Perfil do usuário autenticado           | JWT |
| GET    | `/admin`            | Endpoint restrito a administradores     | JWT + Role |
| GET    | `/logout`           | Logout (somente sessões OAuth)          | — |

#### Exemplo — Login Interno

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "minhaSenha123"
}
```

Resposta:

```json
{
  "_id": "60d5ec49f8c7d60015f8e1a1",
  "username": "user",
  "email": "user@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🗺️ Locais e Municípios (`/api`)

| Método | Rota             | Descrição                                                     | Proteção |
| ------ | ---------------- | ------------------------------------------------------------- | -------- |
| GET    | `/municipios`    | Lista municípios (MA)                                         | — |
| GET    | `/health-units`  | Unidades de saúde por `municipio` e `category`                | — |

**Exemplo de requisição**

```http
GET /api/health-units?category=Clínica+General&municipio=São+Luís
```

---

## 🧰 Tecnologias

* **Node.js** + **Express**  
* **MongoDB** + **Mongoose**  
* **Passport.js** (OAuth)  
* **JWT**  
* **Google Maps Platform**  
* **Swagger** (em breve)  

---

## 🛡️ Segurança

* Hash de senhas com *bcrypt*
* JWT assinado (HS256)
* Middleware de roles
* Cookies `httpOnly`, `secure` (em produção)

---

## 📌 Roadmap

- [ ] Deploy (Render / Railway)
- [ ] Cache com Redis
- [ ] Cobertura de testes (Jest + Supertest)

---

## 🤝 Como Contribuir

1. Fork este repositório  
2. Crie sua feature branch: `git checkout -b minha-feature`  
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`  
4. Push para a branch: `git push origin minha-feature`  
5. Abra um Pull Request 😀

---

## 📝 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais detalhes.
