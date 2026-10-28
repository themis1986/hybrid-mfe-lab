// Types for modules loaded at runtime via Module Federation. Must match apps/todo-mfe/src/mount.ts.
declare module 'todo/mount' {
  export function mount(el: HTMLElement, props: { basePath: string }): () => void
}
