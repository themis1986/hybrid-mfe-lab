// Pulls the stylesheet into the build: Vite emits it as dist/styles.css (`build.lib.cssFileName`)
// and strips this import from the JavaScript. React hosts import '@repo/ui/styles.css' themselves.
import './styles/index.css'

export { TButton } from './TButton'
export type { TButtonProps } from './TButton'
