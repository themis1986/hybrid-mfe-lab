import { Link, Route, Routes } from 'react-router'
import { HomePage } from './HomePage'
import { TODO_BASE_PATH, TodoMfeHost } from './TodoMfeHost'

export function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to={TODO_BASE_PATH}>Todo App</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={`${TODO_BASE_PATH}/*`} element={<TodoMfeHost />} />
        </Routes>
      </main>
    </>
  )
}
