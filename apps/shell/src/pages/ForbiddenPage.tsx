import { TButton, TContainer, TPageHeader, TStack } from '@repo/ui'
import { Link } from 'react-router'

export function ForbiddenPage() {
  return (
    <TContainer className="py-8">
      <TStack gap={4}>
        <TPageHeader
          title="No access"
          description="Your account doesn't include this application."
        />
        <div>
          <TButton asChild size="sm" variant="soft">
            <Link to="/">Back to home</Link>
          </TButton>
        </div>
      </TStack>
    </TContainer>
  )
}
