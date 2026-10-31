import {
  TAppShell,
  TAppShellFooter,
  TAppShellHeader,
  TAppShellMain,
  TAppShellSidebar,
  TAspectRatio,
  TButton,
  TCard,
  TCardBody,
  TCardFooter,
  TCardHeader,
  TCluster,
  TContainer,
  TDivider,
  TField,
  TGrid,
  TIcon,
  TInline,
  TInput,
  TPageHeader,
  TPanel,
  TScrollArea,
  TSection,
  TSidebarLayout,
  TSidebarLayoutContent,
  TSidebarLayoutSidebar,
  TSpacer,
  TSplit,
  TStack,
  TSwitch,
} from '@repo/ui'
import { Bell, Check, Heart, Info, Search, Settings, Star, TriangleAlert } from '@repo/ui/icons'
import { type ReactNode, useState } from 'react'

export type DocGroupId = 'actions' | 'icons' | 'primitives' | 'surfaces' | 'app'

export interface DocProp {
  name: string
  type: string
  default?: string
  description: string
}

export interface DocEntry {
  id: string
  name: string
  /** Other exports that belong to this component (its parts). */
  parts?: string[]
  group: DocGroupId
  summary: string
  props: DocProp[]
  demo: ReactNode
  code: string
}

export const DOC_GROUPS: { id: DocGroupId; label: string; description: string }[] = [
  {
    id: 'actions',
    label: 'Actions & inputs',
    description: 'Buttons and form controls.',
  },
  {
    id: 'icons',
    label: 'Icons',
    description: "The design system's icon set (Lucide), imported from '@repo/ui/icons'.",
  },
  {
    id: 'primitives',
    label: 'Layout primitives',
    description: 'Flex, grid and spacing building blocks. They adapt to their container, not to the viewport.',
  },
  {
    id: 'surfaces',
    label: 'Surfaces & structure',
    description: 'Group and title content: cards, sections, page headers and panels.',
  },
  {
    id: 'app',
    label: 'App-level layout',
    description: 'Page frames, two-pane layouts, wrapping groups, scrolling and media boxes.',
  },
]

// Props shared by many components.
const SPACE = '0 – 8'
const asChildProp: DocProp = {
  name: 'asChild',
  type: 'boolean',
  default: 'false',
  description: 'Render the single child element instead (Radix Slot), merging the classes and props onto it.',
}
const gapProp = (fallback: string): DocProp => ({
  name: 'gap',
  type: SPACE,
  default: fallback,
  description: 'Space between items, on the spacing scale.',
})
const alignProp = (fallback?: string): DocProp => ({
  name: 'align',
  type: "'start' | 'center' | 'end' | 'stretch'",
  default: fallback,
  description: 'Cross-axis alignment (align-items).',
})
const justifyProp = (fallback?: string): DocProp => ({
  name: 'justify',
  type: "'start' | 'center' | 'end' | 'between'",
  default: fallback,
  description: 'Main-axis distribution (justify-content).',
})

// Placeholder content for the demos.
function Block({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`box-border rounded-md bg-accent-subtle px-3 py-2 text-sm text-accent-fg ${className}`}>{children}</div>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-accent-line px-2.5 py-0.5 text-xs text-accent-fg">{children}</span>
}

function SwitchDemo() {
  const [on, setOn] = useState(true)

  return (
    <TCluster gap={6}>
      <label className="inline-flex items-center gap-2 text-sm">
        <TSwitch checked={on} onCheckedChange={setOn} />
        Controlled: {on ? 'on' : 'off'}
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <TSwitch size="sm" />
        Small, uncontrolled
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-fg-muted">
        <TSwitch disabled defaultChecked />
        Disabled
      </label>
    </TCluster>
  )
}

export const DOC_ENTRIES: DocEntry[] = [
  // Actions & inputs
  {
    id: 'button',
    name: 'TButton',
    group: 'actions',
    summary: 'A native <button> in five variants and three sizes. With asChild it styles a link instead.',
    props: [
      { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'danger'", default: "'solid'", description: 'Visual emphasis.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
      { name: 'label', type: 'string', description: 'Text content; children take precedence.' },
      asChildProp,
      { name: '…button props', type: 'ComponentProps<"button">', description: 'type defaults to "button"; disabled uses the native attribute.' },
    ],
    demo: (
      <TStack gap={3}>
        <TCluster>
          {(['solid', 'soft', 'outline', 'ghost', 'danger'] as const).map((variant) => (
            <TButton key={variant} variant={variant} label={variant} />
          ))}
        </TCluster>
        <TCluster>
          <TButton size="sm" label="Small" />
          <TButton size="md" label="Medium" />
          <TButton size="lg" label="Large" />
          <TButton disabled label="Disabled" />
          <TButton asChild variant="outline">
            <a href="#button">A link</a>
          </TButton>
        </TCluster>
      </TStack>
    ),
    code: `<TButton label="Save" />
<TButton variant="soft" size="sm" onClick={handleClick}>Edit</TButton>
<TButton asChild variant="outline">
  <Link to="/somewhere">Go</Link>
</TButton>`,
  },
  {
    id: 'input',
    name: 'TInput',
    group: 'actions',
    summary: 'A styled native <input>. Pair it with your own <label>, or use TField.',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'Sets aria-invalid and the error border.' },
      { name: '…input props', type: 'ComponentProps<"input">', description: 'value, onChange, placeholder, type, disabled, …' },
    ],
    demo: (
      <TStack gap={2} className="max-w-sm">
        <TInput placeholder="Default" aria-label="Default" />
        <TInput size="sm" placeholder="Small" aria-label="Small" />
        <TInput invalid defaultValue="Invalid value" aria-label="Invalid" />
        <TInput disabled placeholder="Disabled" aria-label="Disabled" />
      </TStack>
    ),
    code: `<TInput value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search…" />
<TInput invalid aria-label="Email" />`,
  },
  {
    id: 'field',
    name: 'TField',
    group: 'actions',
    summary: 'An input with its label and a hint: the description, or the error when there is one (announced).',
    props: [
      { name: 'label', type: 'string', description: 'Visible label, linked to the input. Required.' },
      { name: 'description', type: 'string', description: 'Helper text under the input.' },
      { name: 'error', type: 'string', description: 'Error text; replaces the description and marks the input invalid.' },
      { name: '…input props', type: 'TInputProps', description: 'Passed to the input; id is generated when omitted.' },
    ],
    demo: (
      <TGrid minChildWidth="14rem" gap={4}>
        <TField label="Email" placeholder="you@example.com" description="We never share it." />
        <TField label="Username" defaultValue="taken" error="That username is taken." />
      </TGrid>
    ),
    code: `<TField label="Email" description="We never share it." value={email} onChange={onChange} />
<TField label="Username" error={error} />`,
  },
  {
    id: 'switch',
    name: 'TSwitch',
    group: 'actions',
    summary: 'An on/off toggle (Radix Switch): a <button role="switch">. Name it with a wrapping <label> or aria-label.',
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled state; pair it with onCheckedChange.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the user toggles it.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track and thumb size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable or togglable.' },
      { name: 'name / value / required', type: 'string / string / boolean', description: 'Form submission, as a checkbox would.' },
      asChildProp,
    ],
    demo: <SwitchDemo />,
    code: `<TSwitch checked={enabled} onCheckedChange={setEnabled} aria-label="Notifications" />
<label>
  <TSwitch defaultChecked size="sm" /> Remember me
</label>`,
  },

  // Icons
  {
    id: 'icon',
    name: 'TIcon',
    group: 'icons',
    summary:
      'Renders one Lucide icon at a design-system size, in the current text colour. Decorative unless it has a label.',
    props: [
      { name: 'icon', type: 'LucideIcon', description: "The icon, imported from '@repo/ui/icons'. Required." },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '16, 20 or 24px.' },
      { name: 'label', type: 'string', description: 'Accessible name (role="img"). Without it the icon is aria-hidden.' },
      { name: '…svg props', type: 'LucideProps', description: 'strokeWidth, className (text-* tints it), …' },
    ],
    demo: (
      <TStack gap={4}>
        <TCluster gap={4} className="text-fg">
          {Object.entries({ Search, Bell, Settings, Star, Heart, Check, Info }).map(([name, icon]) => (
            <TIcon key={name} icon={icon} label={name} />
          ))}
        </TCluster>
        <TCluster gap={4}>
          <TIcon icon={Star} size="sm" />
          <TIcon icon={Star} size="md" />
          <TIcon icon={Star} size="lg" />
          <TIcon icon={TriangleAlert} className="text-danger" label="Warning" />
          <TIcon icon={Heart} className="text-accent-fg" strokeWidth={2.5} />
          <TButton variant="soft">
            <TIcon icon={Settings} size="sm" />
            Settings
          </TButton>
        </TCluster>
      </TStack>
    ),
    code: `import { TIcon } from '@repo/ui'
import { Search, TriangleAlert } from '@repo/ui/icons'

<TIcon icon={Search} size="sm" />
<TIcon icon={TriangleAlert} label="Warning" className="text-danger" />`,
  },

  // Layout primitives
  {
    id: 'stack',
    name: 'TStack',
    group: 'primitives',
    summary: 'A vertical flex column with a gap: the default way to space things top to bottom.',
    props: [gapProp('3'), alignProp("'stretch'"), justifyProp(), asChildProp],
    demo: (
      <TStack gap={2}>
        <Block>One</Block>
        <Block>Two</Block>
        <Block>Three</Block>
      </TStack>
    ),
    code: `<TStack gap={4}>
  <Heading />
  <Content />
</TStack>`,
  },
  {
    id: 'inline',
    name: 'TInline',
    group: 'primitives',
    summary: 'A horizontal flex row, vertically centred. Add wrap to let it break onto more lines.',
    props: [
      gapProp('3'),
      alignProp("'center'"),
      justifyProp(),
      { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap.' },
      asChildProp,
    ],
    demo: (
      <TInline gap={2} wrap>
        <Block>Left</Block>
        <Block>Middle</Block>
        <TSpacer />
        <Block>Pushed right by a spacer</Block>
      </TInline>
    ),
    code: `<TInline gap={2}>
  <Avatar />
  <Name />
  <TSpacer />
  <TButton label="Follow" />
</TInline>`,
  },
  {
    id: 'grid',
    name: 'TGrid',
    group: 'primitives',
    summary: 'A CSS grid with a fixed column count, or auto-fit columns that collapse to one in a narrow container.',
    props: [
      { name: 'cols', type: '1 – 6', default: '1', description: 'Fixed number of equal columns.' },
      { name: 'minChildWidth', type: 'CSS length', description: 'Auto-fit columns at least this wide. Use instead of cols.' },
      gapProp('3'),
      asChildProp,
    ],
    demo: (
      <TStack gap={3}>
        <TGrid cols={3} gap={2}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Block key={n}>cols=3 · {n}</Block>
          ))}
        </TGrid>
        <TGrid minChildWidth="9rem" gap={2}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Block key={n}>min 9rem · {n}</Block>
          ))}
        </TGrid>
      </TStack>
    ),
    code: `<TGrid cols={3}>…</TGrid>
<TGrid minChildWidth="16rem" gap={4}>
  {items.map((item) => <TCard key={item.id}>…</TCard>)}
</TGrid>`,
  },
  {
    id: 'container',
    name: 'TContainer',
    group: 'primitives',
    summary: 'Centres content with a max width and horizontal padding.',
    props: [{ name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'lg'", description: '640, 960 or 1200px, or no max width.' }, asChildProp],
    demo: (
      <TStack gap={2}>
        {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
          <TContainer key={size} size={size} className="px-0">
            <Block>size="{size}"</Block>
          </TContainer>
        ))}
      </TStack>
    ),
    code: `<TContainer size="md" className="py-8">
  <Page />
</TContainer>`,
  },
  {
    id: 'spacer',
    name: 'TSpacer',
    group: 'primitives',
    summary: 'Takes the free space in a flex row or column, pushing what follows to the end.',
    props: [asChildProp],
    demo: (
      <TInline gap={2}>
        <Block>Start</Block>
        <TSpacer />
        <Block>End</Block>
      </TInline>
    ),
    code: `<TInline>
  <Title />
  <TSpacer />
  <Actions />
</TInline>`,
  },
  {
    id: 'divider',
    name: 'TDivider',
    group: 'primitives',
    summary: 'A 1px separator line: an <hr>, horizontal or vertical.',
    props: [{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Vertical also sets aria-orientation.' }, asChildProp],
    demo: (
      <TStack gap={3}>
        <Block>Above</Block>
        <TDivider />
        <TInline gap={3}>
          <Block>Left</Block>
          <TDivider orientation="vertical" />
          <Block>Right</Block>
        </TInline>
      </TStack>
    ),
    code: `<TDivider />
<TInline>
  <A />
  <TDivider orientation="vertical" />
  <B />
</TInline>`,
  },

  // Surfaces & structure
  {
    id: 'card',
    name: 'TCard',
    parts: ['TCardHeader', 'TCardBody', 'TCardFooter'],
    group: 'surfaces',
    summary:
      'A bordered surface. Its padding is also the gap between the optional header, body and footer, whose dividers run edge to edge.',
    props: [
      { name: 'variant', type: "'outline' | 'filled' | 'elevated'", default: "'outline'", description: 'Transparent, surface fill, or canvas with a shadow.' },
      { name: 'padding', type: SPACE, default: '4', description: 'Padding and the space between parts. Use this, not a p-* class.' },
      asChildProp,
    ],
    demo: (
      <TGrid minChildWidth="12rem" gap={3}>
        {(['outline', 'filled', 'elevated'] as const).map((variant) => (
          <TCard key={variant} variant={variant}>
            <TCardHeader>
              <h4>{variant}</h4>
            </TCardHeader>
            <TCardBody className="text-sm">Body content.</TCardBody>
            <TCardFooter>
              <TButton size="sm" variant="soft" label="Action" />
            </TCardFooter>
          </TCard>
        ))}
      </TGrid>
    ),
    code: `<TCard variant="elevated">
  <TCardHeader>
    <h3>Title</h3>
    <TButton size="sm" variant="ghost" label="Edit" />
  </TCardHeader>
  <TCardBody>…</TCardBody>
  <TCardFooter>
    <TButton size="sm" label="Open" />
  </TCardFooter>
</TCard>`,
  },
  {
    id: 'section',
    name: 'TSection',
    group: 'surfaces',
    summary: 'A <section> with an optional heading and description above a body column. The heading level never changes its size.',
    props: [
      { name: 'title', type: 'ReactNode', description: 'Heading content; without it no heading renders.' },
      { name: 'description', type: 'ReactNode', description: 'Muted text under the heading.' },
      { name: 'headingLevel', type: '2 – 6', default: '2', description: 'The heading element (h2–h6), for the document outline.' },
      { name: 'gap', type: SPACE, default: '3', description: 'Space between the body items.' },
      { name: 'spacing', type: SPACE, description: 'Vertical padding of the section.' },
      { ...asChildProp, description: 'Render e.g. an <article>; its children land in the body.' },
    ],
    demo: (
      <TSection title="Section title" description="A short description of the section." headingLevel={4}>
        <Block>Body item</Block>
        <Block>Body item</Block>
      </TSection>
    ),
    code: `<TSection title="Members" description="People with access." gap={4}>
  <MemberList />
</TSection>`,
  },
  {
    id: 'page-header',
    name: 'TPageHeader',
    group: 'surfaces',
    summary: 'The top of a page: the largest title, a description and actions that wrap below the text when space runs out.',
    props: [
      { name: 'title', type: 'ReactNode', description: 'The page title.' },
      { name: 'description', type: 'ReactNode', description: 'Muted text under the title.' },
      { name: 'actions', type: 'ReactNode', description: 'Rendered at the end of the row.' },
      { name: 'headingLevel', type: '1 – 6', default: '1', description: 'The title element; it doesn\'t change the size.' },
      { ...asChildProp, description: 'Render e.g. a <div> instead of a <header>; its children go under the description.' },
    ],
    demo: (
      <TPageHeader
        headingLevel={4}
        title="Projects"
        description="All projects in your workspace."
        actions={
          <>
            <TButton variant="outline" label="Import" />
            <TButton label="New project" />
          </>
        }
      />
    ),
    code: `<TPageHeader
  title="Projects"
  description="All projects in your workspace."
  actions={<TButton label="New project" />}
/>`,
  },
  {
    id: 'panel',
    name: 'TPanel',
    group: 'surfaces',
    summary: 'An inset area for filters, settings blocks and similar: lighter than a card, never a shadow.',
    props: [
      { name: 'tone', type: "'neutral' | 'accent'", default: "'neutral'", description: 'Surface or accent-subtle background.' },
      { name: 'padding', type: SPACE, default: '4', description: 'Inner padding.' },
      { name: 'title', type: 'ReactNode', description: 'A small title above the content.' },
      asChildProp,
    ],
    demo: (
      <TStack gap={3}>
        <TPanel title="Filters">
          <TInline wrap gap={2}>
            <TInput size="sm" placeholder="Search…" aria-label="Search" className="w-48" />
            <TButton size="sm" variant="soft" label="Apply" />
            <TSpacer />
            <TButton size="sm" variant="ghost" label="Reset" />
          </TInline>
        </TPanel>
        <TPanel tone="accent" padding={3}>
          <span className="text-sm">An accent panel for a highlighted note.</span>
        </TPanel>
      </TStack>
    ),
    code: `<TPanel title="Filters">
  <TInline wrap gap={2}>…</TInline>
</TPanel>
<TPanel tone="accent" padding={3}>…</TPanel>`,
  },

  // App-level layout
  {
    id: 'app-shell',
    name: 'TAppShell',
    parts: ['TAppShellHeader', 'TAppShellSidebar', 'TAppShellMain', 'TAppShellFooter'],
    group: 'app',
    summary:
      'The page frame for a host app (this shell uses it): sticky header, independently scrolling sidebar, main and footer. Below 48rem of viewport it stacks into one column. Not for use inside a microfrontend.',
    props: [
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Narrow sidebar; you decide what it shows.' },
      { name: 'hasSidebar', type: 'boolean', default: 'true', description: 'Set false when there is no sidebar region.' },
      { name: 'viewport', type: 'boolean', default: 'false', description: 'At least the viewport height.' },
      asChildProp,
    ],
    demo: (
      <div className="h-64 overflow-auto rounded-md border border-line">
        <TAppShell>
          <TAppShellHeader>
            <strong>App</strong>
            <TSpacer />
            <TButton size="sm" variant="ghost" label="Profile" />
          </TAppShellHeader>
          <TAppShellSidebar>
            <TStack gap={1} className="text-sm">
              <span>Nav item</span>
              <span>Nav item</span>
              <span>Nav item</span>
            </TStack>
          </TAppShellSidebar>
          <TAppShellMain>
            <TStack gap={2} className="p-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Block key={n}>Main content {n}</Block>
              ))}
            </TStack>
          </TAppShellMain>
          <TAppShellFooter className="text-sm text-fg-muted">Footer</TAppShellFooter>
        </TAppShell>
      </div>
    ),
    code: `<TAppShell viewport collapsed={collapsed}>
  <TAppShellHeader><Logo /></TAppShellHeader>
  <TAppShellSidebar><Menu /></TAppShellSidebar>
  <TAppShellMain><Routes>…</Routes></TAppShellMain>
  <TAppShellFooter>…</TAppShellFooter>
</TAppShell>`,
  },
  {
    id: 'sidebar-layout',
    name: 'TSidebarLayout',
    parts: ['TSidebarLayoutSidebar', 'TSidebarLayoutContent'],
    group: 'app',
    summary:
      'Two columns inside any container (safe in a microfrontend): the sidebar drops above the content when the container gets too narrow. This page\'s table of contents uses it.',
    props: [
      { name: 'side', type: "'start' | 'end'", default: "'start'", description: 'Sidebar side, whatever the DOM order.' },
      { name: 'sidebarWidth', type: 'CSS length', default: '16rem', description: 'Sidebar width beside the content.' },
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Narrow sidebar (4rem); wins over sidebarWidth.' },
      gapProp('3'),
      asChildProp,
    ],
    demo: (
      <TStack gap={3}>
        <TSidebarLayout sidebarWidth="10rem">
          <TSidebarLayoutSidebar>
            <Block className="h-full">Sidebar</Block>
          </TSidebarLayoutSidebar>
          <TSidebarLayoutContent>
            <Block>Content takes the rest</Block>
          </TSidebarLayoutContent>
        </TSidebarLayout>
        <TSidebarLayout side="end" collapsed>
          <TSidebarLayoutSidebar>
            <Block className="h-full">S</Block>
          </TSidebarLayoutSidebar>
          <TSidebarLayoutContent>
            <Block>side="end" collapsed</Block>
          </TSidebarLayoutContent>
        </TSidebarLayout>
      </TStack>
    ),
    code: `<TSidebarLayout sidebarWidth="14rem" gap={6}>
  <TSidebarLayoutSidebar><Filters /></TSidebarLayoutSidebar>
  <TSidebarLayoutContent><Results /></TSidebarLayoutContent>
</TSidebarLayout>`,
  },
  {
    id: 'split',
    name: 'TSplit',
    group: 'app',
    summary: 'Two panes side by side in a fixed ratio; they stack when a pane would get narrower than its minimum.',
    props: [
      { name: 'ratio', type: "'1-1' | '1-2' | '2-1'", default: "'1-1'", description: 'Width ratio of the panes.' },
      { name: 'minPaneWidth', type: 'CSS length', default: '20rem', description: 'Narrowest pane before they stack.' },
      gapProp('3'),
      asChildProp,
    ],
    demo: (
      <TStack gap={3}>
        <TSplit minPaneWidth="10rem">
          <Block>1</Block>
          <Block>1</Block>
        </TSplit>
        <TSplit ratio="1-2" minPaneWidth="8rem">
          <Block>1</Block>
          <Block>2</Block>
        </TSplit>
      </TStack>
    ),
    code: `<TSplit ratio="1-2">
  <List />
  <Detail />
</TSplit>`,
  },
  {
    id: 'cluster',
    name: 'TCluster',
    group: 'app',
    summary: 'A wrapping group of content-sized items (tags, chips, button groups), with a tighter gap than TInline.',
    props: [gapProp('2'), alignProp("'center'"), justifyProp("'start'"), asChildProp],
    demo: (
      <TCluster>
        {['design', 'layout', 'tokens', 'react', 'vue', 'tailwind', 'radix', 'federation', 'a11y'].map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TCluster>
    ),
    code: `<TCluster>
  {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
</TCluster>`,
  },
  {
    id: 'scroll-area',
    name: 'TScrollArea',
    group: 'app',
    summary:
      'A bounded native scroll container with a thin scrollbar. Focusable by default so keyboard users can scroll it; give it role="region" and an aria-label.',
    props: [
      { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Which axis scrolls.' },
      { name: 'maxHeight', type: 'CSS length', description: 'Height past which the content scrolls.' },
      { name: 'tabIndex', type: 'number', default: '0', description: 'Your own value wins.' },
      asChildProp,
    ],
    demo: (
      <TScrollArea maxHeight="9rem" role="region" aria-label="Example log" className="rounded-md border border-line">
        <TStack gap={1} className="p-3 font-mono text-xs">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i}>log line {i + 1}</span>
          ))}
        </TStack>
      </TScrollArea>
    ),
    code: `<TScrollArea maxHeight="20rem" role="region" aria-label="Activity log">
  <ActivityList />
</TScrollArea>`,
  },
  {
    id: 'aspect-ratio',
    name: 'TAspectRatio',
    group: 'app',
    summary: 'A box with a fixed ratio. An img, video, iframe or canvas placed directly inside fills it (cropped to cover).',
    props: [
      {
        name: 'ratio',
        type: "'square' | '4-3' | '3-2' | '16-9' | '21-9' | number",
        default: "'square'",
        description: 'A preset, or width ÷ height.',
      },
      asChildProp,
    ],
    demo: (
      <TGrid minChildWidth="7rem" gap={2}>
        {(['square', '4-3', '3-2', '16-9', '21-9'] as const).map((ratio) => (
          <TAspectRatio key={ratio} ratio={ratio}>
            <Block className="flex h-full items-center justify-center">{ratio}</Block>
          </TAspectRatio>
        ))}
        <TAspectRatio ratio={2.5}>
          <Block className="flex h-full items-center justify-center">2.5</Block>
        </TAspectRatio>
      </TGrid>
    ),
    code: `<TAspectRatio ratio="16-9">
  <img src={cover} alt="" />
</TAspectRatio>`,
  },
]
