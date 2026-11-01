import {
  TButton,
  TCard,
  TCardBody,
  TCardFooter,
  TCardHeader,
  TContainer,
  TGrid,
  TPageHeader,
  TStack,
} from '@repo/ui'
import { Link } from 'react-router'
import { TechTag } from '../components/TechTag'
import { useSession } from '../lib/auth'
import { getAccessibleItems } from '../lib/navigation'

export function HomePage() {
  const navItems = getAccessibleItems(useSession())

  return (
    <TContainer className="py-8">
      <TStack gap={6}>
        <TPageHeader
          title="Welcome to The L@b"
          description="A microfrontends playground: a React shell hosting sub-applications built in Vue or React, on one design system."
        />
        {navItems.length === 0 && (
          <p className="m-0 text-sm text-fg-muted">
            Your account doesn't include any application yet.
          </p>
        )}
        <TGrid minChildWidth="16rem" gap={4}>
          {navItems.map((item) => (
            <TCard key={item.to} variant="elevated">
              <TCardHeader>
                <h2>{item.label}</h2>
                <TechTag tech={item.tech} />
              </TCardHeader>
              <TCardBody className="text-sm text-fg-muted">
                {item.description}
              </TCardBody>
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
