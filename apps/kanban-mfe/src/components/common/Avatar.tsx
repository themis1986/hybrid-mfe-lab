import { initials } from '../../lib/presentation'

export function Avatar({ name }: { name: string }) {
  return (
    <span
      title={name}
      className="box-border inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-[0.625rem] font-semibold text-accent-fg"
    >
      {initials(name)}
    </span>
  )
}
