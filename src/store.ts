import { randomUUID } from 'crypto'
import type { Todo } from './types.js'

const todos = new Map<string, Todo>()

export function list(): Todo[] {
  return [...todos.values()]
}

export function get(id: string): Todo | undefined {
  return todos.get(id)
}

export function create(text: string): Todo {
  const todo: Todo = {
    id:        randomUUID(),
    text,
    done:      false,
    createdAt: new Date().toISOString(),
  }
  todos.set(todo.id, todo)
  return todo
}

export function update(id: string, patch: Partial<Pick<Todo, 'text' | 'done'>>): Todo | undefined {
  const todo = todos.get(id)
  if (!todo) return undefined
  const updated = { ...todo, ...patch }
  todos.set(id, updated)
  return updated
}

export function remove(id: string): boolean {
  return todos.delete(id)
}
