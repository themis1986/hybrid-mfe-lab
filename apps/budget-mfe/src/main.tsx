// Standalone entry: runs the app on its own, outside the shell.
import { mount } from './mount'

mount(document.querySelector<HTMLElement>('#root')!, { basePath: '/' })
