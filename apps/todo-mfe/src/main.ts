// Standalone entry: runs the MFE on its own, outside the shell.
import { mount } from './mount'

mount(document.querySelector<HTMLElement>('#app')!, { basePath: '/' })
