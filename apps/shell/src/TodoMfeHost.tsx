import { createRemoteHost } from './RemoteMfeHost'

export const TODO_BASE_PATH = '/todo-app'

export const TodoMfeHost = createRemoteHost(() => import('todo/mount'), TODO_BASE_PATH, 'Todo app')
