import { cn } from '../../lib/cn'
import { tInputVariants } from './TInput.variants'
import type { TInputProps } from './types'

export function TInput({ size, invalid, className, ...props }: TInputProps) {
  return <input aria-invalid={invalid || undefined} className={cn(tInputVariants({ size }), className)} {...props} />
}
