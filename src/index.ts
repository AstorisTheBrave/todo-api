import { createServer }           from 'http'
import type { IncomingMessage, ServerResponse } from 'http'
import { dispatch, on }           from './router.js'
import * as store                 from './store.js'

const PORT = Number(process.env.PORT ?? 3000)

function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data',  chunk => { data += chunk })
    req.on('end',   () => resolve(data))
    req.on('error', reject)
  })
}

// GET /todos
on('GET', '/todos', (_req, res) => {
  json(res, 200, store.list())
})

// GET /todos/:id
on('GET', '/todos/:id', (_req, res, { id }) => {
  const todo = store.get(id)
  todo ? json(res, 200, todo) : json(res, 404, { error: 'not found' })
})

// POST /todos  { text: string }
on('POST', '/todos', async (req, res) => {
  try {
    const { text } = JSON.parse(await readBody(req))
    if (!text || typeof text !== 'string') {
      return json(res, 400, { error: 'text is required' })
    }
    json(res, 201, store.create(text.trim()))
  } catch {
    json(res, 400, { error: 'invalid json' })
  }
})

// PATCH /todos/:id  { text?: string, done?: boolean }
on('PATCH', '/todos/:id', async (req, res, { id }) => {
  try {
    const patch = JSON.parse(await readBody(req))
    const todo  = store.update(id, patch)
    todo ? json(res, 200, todo) : json(res, 404, { error: 'not found' })
  } catch {
    json(res, 400, { error: 'invalid json' })
  }
})

// DELETE /todos/:id
on('DELETE', '/todos/:id', (_req, res, { id }) => {
  store.remove(id)
    ? res.writeHead(204).end()
    : json(res, 404, { error: 'not found' })
})

createServer((req, res) => {
  dispatch(req, res).catch(err => {
    console.error(err)
    json(res, 500, { error: 'internal server error' })
  })
}).listen(PORT, () => {
  console.log(`todo-api listening on :${PORT}`)
})
