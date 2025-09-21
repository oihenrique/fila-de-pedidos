# Fila de Pedidos

Este é um projeto simples desenvolvido em **Node.js + TypeScript**, utilizando **MongoDB** e **Kafka**, com o objetivo de **praticar a emissão e o consumo de eventos** em um fluxo assíncrono.

A aplicação simula uma **fila de pedidos de e-commerce**:

- A **API** recebe pedidos via HTTP e publica eventos `orders.created` no Kafka.
- Um **worker** consome esses eventos, processa os pedidos (calculando o total) e atualiza o status no MongoDB.

## Tecnologias

- Node.js + TypeScript
- Express
- Kafka (via [kafkajs](https://github.com/tulios/kafkajs))
- MongoDB (via Mongoose)
- Docker

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/oihenrique/fila-de-pedidos.git
cd fila-de-pedidos
```

### 2. Suba os serviços

```bash
docker compose up -d
```

### 3. Configure o `.env`

- Aplicação faz fallback para valores padrões caso você não defina um .env

### 4. Rode a API

```bash
npm run dev
```

### 5. Rode o Worker

```bash
npm run dev:worker
```

## Testando

### Criar um pedido

```bash
curl -X POST http://localhost:3333/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "u_123",
    "items": [
      {"sku":"ABC","qty":2,"price":49.9},
      {"sku":"DEF","qty":1,"price":10}
    ],
    "currency": "BRL"
  }'
```

### Listar pedidos

```bash
curl http://localhost:3333/orders
```

### Acompanhar eventos

- Acesse o **Kafdrop** em: [http://localhost:9000](http://localhost:9000)
- Veja os eventos publicados no tópico `orders.created`.

## Objetivo

Este projeto não é voltado para produção.  
O propósito foi apenas **praticar conceitos de event-driven architecture com Kafka**.
