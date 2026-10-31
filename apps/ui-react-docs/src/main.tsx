// Standalone entry: runs the docs on their own, outside the shell.
import { mount } from './mount'

mount(document.querySelector<HTMLElement>('#root')!, { basePath: '/' })
