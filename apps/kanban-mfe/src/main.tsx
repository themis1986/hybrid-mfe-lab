// Standalone entry: runs the board on its own, outside the shell.
import { mount } from './mount'

mount(document.querySelector<HTMLElement>('#root')!, { basePath: '/' })
