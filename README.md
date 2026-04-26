# todo-api

A REST todo API built with nothing but Node's built-in `http` module. No Express,
no Fastify, no frameworks at all. Just routing, body parsing, and a Map.

In-memory store, so data resets on restart.

## install

```bash
npm install
```

## run

```bash
npm run dev    # ts-node, hot reload
npm run build  # compile to dist/
npm start      # run compiled output
```

## endpoints

```
GET    /todos          list all todos
GET    /todos/:id      get one
POST   /todos          create  { "text": "..." }
PATCH  /todos/:id      update  { "text": "...", "done": true }
DELETE /todos/:id      delete
```

## example

```bash
curl -s -X POST localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"text": "write more Go"}' | jq

curl -s -X PATCH localhost:3000/todos/<id> \
  -H 'Content-Type: application/json' \
  -d '{"done": true}' | jq
```

## what this shows

- manual routing with named params (`:id` -> `params.id`)
- streaming body reads without body-parser
- typed request/response with strict TypeScript
- clean module boundaries: `types` / `store` / `router` / `index`

The router is about 30 lines and handles everything in this project.
