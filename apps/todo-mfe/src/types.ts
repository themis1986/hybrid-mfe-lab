export interface Todo {
  id: string
  title: string
  done: boolean
  createdAt: number
}

export type TodoFilter = 'all' | 'open' | 'done'
