export function networkServer(port: number): {
  port: number
  strictPort: boolean
  host: boolean
  cors: { origin: RegExp }
}

export function networkOrigin(port: number): string
