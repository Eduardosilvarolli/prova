# Events CRUD

Projeto inicial para gerenciamento de eventos, organizado em três aplicações/áreas:

- `api/`: API REST em NestJS para o CRUD da tabela `events`.
- `front/`: interface web em React/Vite para consumo da API.
- `deploy/`: arquivos de Docker Compose e configurações de execução.

## Sumário

- [Requisitos](#requisitos)
- [Como executar via Docker Compose](#como-executar-via-docker-compose)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Endpoints CRUD](#endpoints-crud)
- [Exemplos de resposta](#exemplos-de-resposta)
- [Como derrubar os recursos](#como-derrubar-os-recursos)
- [Execução local](#execução-local)

## Requisitos

- Git 2.40+
- Docker Engine 24+
- Docker Compose v2 (`docker compose`)
- Node.js 20+ e npm 10+ (apenas para execução local sem Docker)

## Como executar via Docker Compose

Na raiz do repositório, execute:

```bash
git clone https://github.com/Eduardosilvarolli/events-crud.git
cd events-crud
docker compose -f deploy/docker-compose.yml up --build
```

Após a inicialização:

- API: http://localhost:3000
- Frontend: http://localhost:5173
- Health check: http://localhost:3000/health

Para executar em segundo plano:

```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

## Estrutura do projeto

```text
.
├── api/       # NestJS: API REST e regras do CRUD
├── front/     # React/Vite: interface web
├── deploy/    # Docker Compose e arquivos de implantação
└── README.md
```

## Modelo de dados

Tabela lógica `events`:

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | integer | sim | Identificador único |
| `title` | string | sim | Título do evento |
| `starts_at` | ISO 8601 datetime | sim | Data/hora de início |
| `ends_at` | ISO 8601 datetime | não | Data/hora de término |
| `location` | string | não | Local do evento |

Registro inicial de exemplo:

```json
{
  "id": 1,
  "title": "Preparação do repositório e README",
  "starts_at": "2026-10-05T19:34:16-03:00",
  "ends_at": "2026-10-05T21:00:00-03:00",
  "location": " remoto"
}
```

## Endpoints CRUD

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está disponível |
| `GET` | `/events` | Lista todos os eventos |
| `GET` | `/events/:id` | Busca um evento pelo ID |
| `POST` | `/events` | Cria um evento |
| `PATCH` | `/events/:id` | Atualiza parcialmente um evento |
| `DELETE` | `/events/:id` | Remove um evento |

### Payload para criação

```json
{
  "title": "Reunião de planejamento",
  "starts_at": "2026-10-10T14:00:00Z",
  "ends_at": "2026-10-10T15:00:00Z",
  "location": "Sala 2"
}
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/events \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Reunião de planejamento","starts_at":"2026-10-10T14:00:00Z","ends_at":"2026-10-10T15:00:00Z","location":"Sala 2"}'
```

## Exemplos de resposta

### `GET /events`

```json
[
  {
    "id": 1,
    "title": "Preparação do repositório e README",
    "starts_at": "2026-10-05T22:34:16.000Z",
    "ends_at": "2026-10-06T00:00:00.000Z",
    "location": "Remoto"
  }
]
```

### `POST /events` — `201 Created`

```json
{
  "id": 2,
  "title": "Reunião de planejamento",
  "starts_at": "2026-10-10T14:00:00.000Z",
  "ends_at": "2026-10-10T15:00:00.000Z",
  "location": "Sala 2"
}
```

### Erro — `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Evento 99 não encontrado",
  "error": "Not Found"
}
```

## Como derrubar os recursos

Para parar e remover os containers e a rede criada pelo Compose:

```bash
docker compose -f deploy/docker-compose.yml down
```

Para também remover volumes associados:

```bash
docker compose -f deploy/docker-compose.yml down -v
```

Para remover imagens construídas pelo projeto:

```bash
docker compose -f deploy/docker-compose.yml down --rmi local
```

## Execução local

API:

```bash
cd api
npm install
npm run start:dev
```

Frontend, em outro terminal:

```bash
cd front
npm install
npm run dev -- --host 0.0.0.0
```
