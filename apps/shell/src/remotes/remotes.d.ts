// Types for modules loaded at runtime via Module Federation. Each must match its remote's src/mount.ts.
declare module 'todo/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'uiReactDocs/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'uiVueDocs/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'weather/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'kanban/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'crypto/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}

declare module 'budget/mount' {
  export function mount(
    el: HTMLElement,
    props: { basePath: string },
  ): () => void
}
