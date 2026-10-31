import {
  TCard,
  TCardBody,
  TCardHeader,
  TCluster,
  TContainer,
  TPageHeader,
  TPanel,
  TScrollArea,
  TSection,
  TSidebarLayout,
  TSidebarLayoutContent,
  TSidebarLayoutSidebar,
  TStack,
} from '@repo/ui'
import { DOC_ENTRIES, DOC_GROUPS, type DocEntry, type DocProp } from './catalog'

function Code({ children, label }: { children: string; label: string }) {
  return (
    <TScrollArea orientation="horizontal" role="region" aria-label={label} className="rounded-md bg-surface">
      <pre className="m-0 p-4 font-mono text-xs leading-relaxed text-fg">
        <code>{children}</code>
      </pre>
    </TScrollArea>
  )
}

function PropsTable({ name, props }: { name: string; props: DocProp[] }) {
  return (
    <TScrollArea orientation="horizontal" role="region" aria-label={`${name} props`}>
      {/* A minimum width so a narrow screen scrolls the table instead of squeezing its columns. */}
      <table className="w-full min-w-xl border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs tracking-wide text-fg-muted uppercase">
            <th className="border-b border-line py-2 pr-4 font-semibold">Prop</th>
            <th className="border-b border-line py-2 pr-4 font-semibold">Type</th>
            <th className="border-b border-line py-2 pr-4 font-semibold">Default</th>
            <th className="border-b border-line py-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="align-top">
              <td className="border-b border-line py-2 pr-4 font-mono text-xs whitespace-nowrap text-accent-fg">
                {prop.name}
              </td>
              <td className="border-b border-line py-2 pr-4 font-mono text-xs">{prop.type}</td>
              <td className="border-b border-line py-2 pr-4 font-mono text-xs whitespace-nowrap">{prop.default ?? '–'}</td>
              <td className="border-b border-line py-2 text-fg-muted">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TScrollArea>
  )
}

function Entry({ entry }: { entry: DocEntry }) {
  return (
    // scroll-mt keeps the card clear of the sticky app header when its anchor is followed.
    <TCard id={entry.id} className="scroll-mt-[calc(var(--t-layout-header-height)+1rem)]">
      <TCardHeader>
        <h3>
          <code className="font-mono">{entry.name}</code>
        </h3>
        {entry.parts && <span className="font-mono text-xs font-normal text-fg-muted">+ {entry.parts.join(', ')}</span>}
      </TCardHeader>
      <TCardBody>
        <TStack gap={4}>
          <p className="m-0 text-sm text-fg-muted">{entry.summary}</p>
          <div className="rounded-md border border-dashed border-line p-4">{entry.demo}</div>
          <Code label={`${entry.name} usage`}>{entry.code}</Code>
          <PropsTable name={entry.name} props={entry.props} />
        </TStack>
      </TCardBody>
    </TCard>
  )
}

export function DocsPage() {
  return (
    <TContainer className="py-8">
      <TStack gap={6}>
        <TPageHeader
          title="React UI docs"
          description="Every component of @repo/ui: a live example, how to use it and its props. The same components exist for Vue in @repo/ui-vue (see Vue UI docs)."
        />

        <TPanel tone="accent" title="Getting started">
          <TStack gap={2} className="text-sm">
            <span>
              Import the stylesheet once in the app's entry, then the components from the package. They are React
              components, built on design tokens, Tailwind and Radix.
            </span>
            <Code label="Setup">{`import '@repo/ui/styles.css'
import { TButton, TIcon, TStack } from '@repo/ui'
import { Search } from '@repo/ui/icons'`}</Code>
            <TCluster gap={4} className="text-fg-muted">
              <span>Spacing props take steps 0–8: 0, 4, 8, 12, 16, 24, 32, 48, 64px.</span>
              <span>A className you pass wins over the component's own classes.</span>
            </TCluster>
          </TStack>
        </TPanel>

        <TSidebarLayout sidebarWidth="13rem" gap={6}>
          {/* Sticky only where the table of contents sits beside the content. */}
          <TSidebarLayoutSidebar
            aria-label="Components"
            className="self-start lg:sticky lg:top-[calc(var(--t-layout-header-height)+1.5rem)]"
          >
            <TStack gap={4}>
              {DOC_GROUPS.map((group) => (
                <TStack key={group.id} gap={1}>
                  <p className="m-0 text-xs font-semibold tracking-wider text-fg-muted uppercase">{group.label}</p>
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {DOC_ENTRIES.filter((entry) => entry.group === group.id).map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={`#${entry.id}`}
                          className="font-mono text-sm text-fg no-underline hover:text-accent-fg hover:underline"
                        >
                          {entry.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </TStack>
              ))}
            </TStack>
          </TSidebarLayoutSidebar>

          <TSidebarLayoutContent>
            <TStack gap={8}>
              {DOC_GROUPS.map((group) => (
                <TSection key={group.id} title={group.label} description={group.description} gap={5}>
                  {DOC_ENTRIES.filter((entry) => entry.group === group.id).map((entry) => (
                    <Entry key={entry.id} entry={entry} />
                  ))}
                </TSection>
              ))}
            </TStack>
          </TSidebarLayoutContent>
        </TSidebarLayout>
      </TStack>
    </TContainer>
  )
}
