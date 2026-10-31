import { TButton, TCard, TCardBody, TCardFooter, TCardHeader, TContainer, TGrid, TPageHeader, TStack } from '@repo/ui'
import { Link } from 'react-router'
import { NAV_ITEMS } from './navigation'
import { TechTag } from './TechTag'

export function HomePage() {
  return (
    <TContainer className="py-8">
      <TStack gap={6}>
        <TPageHeader
          title="Welcome to The L@b"
          description="A microfrontends playground: a React shell hosting sub-applications built in Vue or React, on one design system."
        />
        <TGrid minChildWidth="16rem" gap={4}>
          {NAV_ITEMS.map((item) => (
            <TCard key={item.to} variant="elevated">
              <TCardHeader>
                <h2>{item.label}</h2>
                <TechTag tech={item.tech} />
              </TCardHeader>
              <TCardBody className="text-sm text-fg-muted">{item.description}</TCardBody>
              <TCardFooter>
                <TButton asChild size="sm" variant="soft">
                  <Link to={item.to}>Open</Link>
                </TButton>
              </TCardFooter>
            </TCard>
          ))}
        </TGrid>
      </TStack>
    </TContainer>
  )
}
