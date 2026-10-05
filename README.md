# Events CRUD

Aplicação para gerenciamento de eventos com **NestJS**, **React**, **PostgreSQL** e **Docker Compose**.

## Sumário

- [Requisitos](#requisitos)
- [Estrutura](#estrutura)
- [Como executar via Compose](#como-executar-via-compose)
- [Serviços, redes e volume](#serviços-redes-e-volume)
- [Modelo de dados](#modelo-de-dados)
- [Endpoints CRUD](#endpoints-crud)
- [Exemplos de requisição e resposta](#exemplos-de-requisição-e-resposta)
- [Swagger](#swagger)
- [Como verificar persistência](#como-verificar-persistência)
- [Como derrubar os recursos](#como-derrubar-os-recursos)

## Requisitos

- Git 2.40+
- Docker Engine 24+
- Docker Compose v2 (`docker compose`)
- Node.js 20+ e npm 10+ apenas para execução local sem Docker

## Estrutura

```text
.
├── api/       # API NestJS, TypeORM, DTOs, validação e Swagger
├── front/     # Frontend React/Vite com tabela de eventos
├── deploy/    # Docker Compose, redes isoladas e volume PostgreSQL
└── README.md
```

## Como executar via Compose

Clone o repositório e entre na raiz:

```bash
git clone https://github.com/Eduardosilvarolli/events-crud.git
cd events-crud
```

Suba os três serviços com um único comando:

```bash
docker compose -f deploy/docker-compose.yml up --build
```

Para executar em segundo plano:

```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

Endereços:

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- PostgreSQL: `localhost:5432`

## Serviços, redes e volume

| Serviço | Imagem/porta | Função |
|---|---|---|
| `postgres` | `postgres:16-alpine`, `5432` | Banco de dados persistente |
| `api` | NestJS, `3000` | API REST do CRUD |
| `front` | React/Vite, `5173` | Tabela de eventos |

O Compose define duas redes isoladas:

- `events_api_db`: comunicação entre API e PostgreSQL;
- `events_api_front`: comunicação entre API e Front.

O PostgreSQL usa o volume nomeado `events_postgres_data`. A API acessa o banco pelo DNS interno `postgres`, e o Front acessa a API pelo proxy `/api` usando o DNS interno `api`.

## Modelo de dados

Tabela: `events`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | integer | sim | Identificador único |
| `title` | string | sim | Título do evento |
| `starts_at` | timestamptz | sim | Data e hora de início |
| `ends_at` | timestamptz | não | Data e hora de término |
| `location` | string | não | Local do evento |

## Endpoints CRUD

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/events` | Lista todos os eventos |
| `GET` | `/events/:id` | Busca um evento pelo ID |
| `POST` | `/events` | Cria um evento |
| `PATCH` | `/events/:id` | Atualiza parcialmente um evento |
| `DELETE` | `/events/:id` | Remove um evento |

A API utiliza DTOs com validação de título, datas ISO 8601 e campos opcionais.

## Exemplos de requisição e resposta

### Criar evento

```bash
curl -X POST http://localhost:3000/events \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Reunião de planejamento","starts_at":"2026-10-10T14:00:00Z","ends_at":"2026-10-10T15:00:00Z","location":"Sala 2"}'
```

Resposta `201 Created`:

```json
{
  "id": 1,
  "title": "Reunião de planejamento",
  "starts_at": "2026-10-10T14:00:00.000Z",
  "ends_at": "2026-10-10T15:00:00.000Z",
  "location": "Sala 2"
}
```

### Listar eventos

```bash
curl http://localhost:3000/events
```

Resposta:

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

### Atualizar evento

```bash
curl -X PATCH http://localhost:3000/events/1 \\
  -H 'Content-Type: application/json' \\
  -d '{"location":"Sala 3"}'
```

### Excluir evento

```bash
curl -X DELETE http://localhost:3000/events/1
```

Resposta:

```json
{
  "message": "Evento removido com sucesso",
  "id": 1
}
```

### Erro de validação ou evento inexistente

```json
{
  "statusCode": 404,
  "message": "Evento 99 não encontrado",
  "error": "Not Found"
}
```

## Swagger

Com os serviços em execução, abra:

```text
http://localhost:3000/docs
```

A documentação permite testar os endpoints `GET`, `POST`, `PATCH` e `DELETE` diretamente no navegador.

## Como verificar persistência

Crie um evento, desligue apenas os containers e suba novamente:

```bash
curl -X POST http://localhost:3000/events \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Evento persistente","starts_at":"2026-10-10T14:00:00Z"}'

docker compose -f deploy/docker-compose.yml down
docker compose -f deploy/docker-compose.yml up -d
curl http://localhost:3000/events
```

O registro deve continuar existindo porque está armazenado no volume `events_postgres_data`.

## Como derrubar os recursos

Parar e remover containers e redes:

```bash
docker compose -f deploy/docker-compose.yml down
```

Parar, remover containers, redes e o volume do PostgreSQL:

```bash
docker compose -f deploy/docker-compose.yml down -v
```

Remover também as imagens construídas localmente:

```bash
docker compose -f deploy/docker-compose.yml down --rmi local
```

## Execução local sem Docker

API:

```bash
cd api
cp .env.example .env
npm install
npm run start:dev
```

Frontend, em outro terminal:

```bash
cd front
npm install
npm run dev -- --host 0.0.0.0
```
