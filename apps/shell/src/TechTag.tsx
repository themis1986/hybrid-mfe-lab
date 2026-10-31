import type { Tech } from './navigation'

const labels: Record<Tech, string> = { vue: 'Vue', react: 'React' }

export function TechTag({ tech }: { tech: Tech }) {
  return (
    <span className="shrink-0 rounded-full border border-line px-1.5 text-[0.625rem] leading-4 font-medium tracking-wide text-fg-muted uppercase">
      {labels[tech]}
    </span>
  )
}
