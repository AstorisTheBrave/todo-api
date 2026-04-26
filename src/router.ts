import type { IncomingMessage, ServerResponse } from 'http'

type Handler = (
  req:    IncomingMessage,
  res:    ServerResponse,
  params: Record<string, string>
) => void | Promise<void>

interface Route {
  method:  string
  pattern: RegExp
  keys:    string[]
  handler: Handler
}

const routes: Route[] = []

function compile(path: string): { pattern: RegExp; keys: string[] } {
  const keys: string[] = []
  const src = path.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)' })
  return { pattern: new RegExp(`^${src}$`), keys }
}

export function on(method: string, path: string, handler: Handler) {
  const { pattern, keys } = compile(path)
  routes.push({ method: method.toUpperCase(), pattern, keys, handler })
}

export async function dispatch(req: IncomingMessage, res: ServerResponse) {
  const url    = (req.url ?? '/').split('?')[0]
  const method = req.method ?? 'GET'

  for (const route of routes) {
    if (route.method !== method) continue
    const m = url.match(route.pattern)
    if (!m) continue
    const params: Record<string, string> = {}
    route.keys.forEach((k, i) => { params[k] = m[i + 1] })
    await route.handler(req, res, params)
    return
  }

  res.writeHead(404).end(JSON.stringify({ error: 'not found' }))
}
