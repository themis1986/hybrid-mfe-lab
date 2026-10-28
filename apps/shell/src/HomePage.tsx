import { Button } from '@repo/ui'
import { useState } from 'react'

export function HomePage() {
  const [clicks, setClicks] = useState(0)

  return (
    <>
      <h1>Home</h1>
      <Button label="React click" onClick={() => setClicks((n) => n + 1)} />
      <p>Clicked {clicks} times</p>
    </>
  )
}
