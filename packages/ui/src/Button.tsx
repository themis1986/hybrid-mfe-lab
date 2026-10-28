import type { MouseEventHandler, ReactNode } from 'react'

export interface ButtonProps {
  label?: string
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button({ label, children, onClick }: ButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      {children ?? label}
    </button>
  )
}
