import { TButton, type TButtonProps } from '@repo/ui'
import { useState } from 'react'

const variants: NonNullable<TButtonProps['variant']>[] = ['solid', 'soft', 'outline', 'ghost', 'danger']

export function HomePage() {
  const [clicks, setClicks] = useState(0)
  const increment = () => setClicks((n) => n + 1)

  return (
    <>
      <h1>Home</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {variants.map((variant) => (
          <TButton key={variant} label={`React ${variant}`} variant={variant} onClick={increment} />
        ))}
        <TButton label="React disabled" disabled onClick={increment} />
      </div>
      <p>Clicked {clicks} times</p>
    </>
  )
}
