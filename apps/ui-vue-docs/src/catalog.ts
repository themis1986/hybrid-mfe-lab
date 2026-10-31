import type { Component } from 'vue'
import AppShellDemo from './demos/AppShellDemo.vue'
import AspectRatioDemo from './demos/AspectRatioDemo.vue'
import ButtonDemo from './demos/ButtonDemo.vue'
import CardDemo from './demos/CardDemo.vue'
import ClusterDemo from './demos/ClusterDemo.vue'
import ContainerDemo from './demos/ContainerDemo.vue'
import DividerDemo from './demos/DividerDemo.vue'
import FieldDemo from './demos/FieldDemo.vue'
import GridDemo from './demos/GridDemo.vue'
import IconDemo from './demos/IconDemo.vue'
import InlineDemo from './demos/InlineDemo.vue'
import InputDemo from './demos/InputDemo.vue'
import PageHeaderDemo from './demos/PageHeaderDemo.vue'
import PanelDemo from './demos/PanelDemo.vue'
import ScrollAreaDemo from './demos/ScrollAreaDemo.vue'
import SectionDemo from './demos/SectionDemo.vue'
import SidebarLayoutDemo from './demos/SidebarLayoutDemo.vue'
import SpacerDemo from './demos/SpacerDemo.vue'
import SplitDemo from './demos/SplitDemo.vue'
import StackDemo from './demos/StackDemo.vue'
import SwitchDemo from './demos/SwitchDemo.vue'

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
  slots?: { name: string; description: string }[]
  events?: { name: string; payload: string; description: string }[]
  demo: Component
  code: string
}

export const DOC_GROUPS: { id: DocGroupId; label: string; description: string }[] = [
  { id: 'actions', label: 'Actions & inputs', description: 'Buttons and form controls.' },
  {
    id: 'icons',
    label: 'Icons',
    description: "The design system's icon set (Lucide), imported from '@repo/ui-vue/icons'.",
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

// Props shared by many components. In templates, write them in kebab-case (min-child-width).
const SPACE = '0 – 8'
const asProps = (fallback: string): DocProp[] => [
  { name: 'as', type: 'string | Component', default: `'${fallback}'`, description: 'The element or component to render.' },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Render the single slotted child instead (Reka Primitive), merging the classes and attributes onto it.',
  },
]
const asOnly = (fallback: string, note: string): DocProp => ({
  name: 'as',
  type: 'string | Component',
  default: `'${fallback}'`,
  description: note,
})
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
const defaultSlot = (description: string) => ({ name: 'default', description })

export const DOC_ENTRIES: DocEntry[] = [
  // Actions & inputs
  {
    id: 'button',
    name: 'TButton',
    group: 'actions',
    summary: 'A native <button> in five variants and three sizes. With as-child it styles a link instead.',
    props: [
      { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'danger'", default: "'solid'", description: 'Visual emphasis.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
      { name: 'label', type: 'string', description: 'Text content when the default slot is empty.' },
      ...asProps('button'),
    ],
    slots: [defaultSlot('The button content.')],
    events: [{ name: 'click', payload: 'MouseEvent', description: 'Native; not fired while disabled.' }],
    demo: ButtonDemo,
    code: `<TButton label="Save" />
<TButton variant="soft" size="sm" @click="edit">Edit</TButton>
<TButton as-child variant="outline">
  <RouterLink to="/somewhere">Go</RouterLink>
</TButton>`,
  },
  {
    id: 'input',
    name: 'TInput',
    group: 'actions',
    summary: 'A styled native <input> with v-model. Pair it with your own <label>, or use TField.',
    props: [
      { name: 'v-model', type: 'string', description: 'The value (modelValue / update:modelValue).' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and padding.' },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'Sets aria-invalid and the error border.' },
      { name: '…attributes', type: 'input attributes', description: 'placeholder, type, disabled, native listeners, …' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string', description: 'On every input (v-model).' }],
    demo: InputDemo,
    code: `<TInput v-model="query" placeholder="Search…" />
<TInput invalid aria-label="Email" />`,
  },
  {
    id: 'field',
    name: 'TField',
    group: 'actions',
    summary: 'An input with its label and a hint: the description, or the error when there is one (announced).',
    props: [
      { name: 'label', type: 'string', description: 'Visible label, linked to the input. Required.' },
      { name: 'v-model', type: 'string', description: 'Passed through to the input.' },
      { name: 'description', type: 'string', description: 'Helper text under the input.' },
      { name: 'error', type: 'string', description: 'Error text; replaces the description and marks the input invalid.' },
      { name: 'id', type: 'string', description: "The input's id; generated with useId() when omitted." },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size.' },
      { name: '…attributes', type: 'input attributes', description: 'Go on the input; class and style go on the root.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string', description: 'On every input (v-model).' }],
    demo: FieldDemo,
    code: `<TField v-model="email" label="Email" description="We never share it." />
<TField v-model="username" label="Username" :error="error" />`,
  },
  {
    id: 'switch',
    name: 'TSwitch',
    group: 'actions',
    summary: 'An on/off toggle (Reka Switch): a <button role="switch">. Name it with a wrapping <label> or aria-label.',
    props: [
      { name: 'v-model', type: 'boolean', description: 'The state (modelValue / update:modelValue).' },
      { name: 'defaultValue', type: 'boolean', default: 'false', description: 'Initial state when no v-model is bound.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track and thumb size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable or togglable.' },
      { name: 'name / value / required', type: 'string / string / boolean', description: 'Form submission, as a checkbox would.' },
      ...asProps('button'),
    ],
    events: [{ name: 'update:modelValue', payload: 'boolean', description: 'When the user toggles it (v-model).' }],
    demo: SwitchDemo,
    code: `<TSwitch v-model="enabled" aria-label="Notifications" />
<label>
  <TSwitch :default-value="true" size="sm" /> Remember me
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
      { name: 'icon', type: 'Component', description: "The icon, imported from '@repo/ui-vue/icons'. Required." },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '16, 20 or 24px.' },
      { name: 'label', type: 'string', description: 'Accessible name (role="img"). Without it the icon is aria-hidden.' },
      { name: '…attributes', type: 'SVG attributes', description: 'stroke-width, class (text-* tints it), …' },
    ],
    demo: IconDemo,
    code: `import { TIcon } from '@repo/ui-vue'
import { Search, TriangleAlert } from '@repo/ui-vue/icons'

<TIcon :icon="Search" size="sm" />
<TIcon :icon="TriangleAlert" label="Warning" class="text-danger" />`,
  },

  // Layout primitives
  {
    id: 'stack',
    name: 'TStack',
    group: 'primitives',
    summary: 'A vertical flex column with a gap: the default way to space things top to bottom.',
    props: [gapProp('3'), alignProp("'stretch'"), justifyProp(), ...asProps('div')],
    slots: [defaultSlot('The items.')],
    demo: StackDemo,
    code: `<TStack :gap="4">
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
      ...asProps('div'),
    ],
    slots: [defaultSlot('The items.')],
    demo: InlineDemo,
    code: `<TInline :gap="2">
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
      { name: 'minChildWidth', type: 'CSS length', description: 'Auto-fit columns at least this wide; wins over cols.' },
      gapProp('3'),
      ...asProps('div'),
    ],
    slots: [defaultSlot('The grid items.')],
    demo: GridDemo,
    code: `<TGrid :cols="3">…</TGrid>
<TGrid min-child-width="16rem" :gap="4">
  <TCard v-for="item in items" :key="item.id">…</TCard>
</TGrid>`,
  },
  {
    id: 'container',
    name: 'TContainer',
    group: 'primitives',
    summary: 'Centres content with a max width and horizontal padding.',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'lg'", description: '640, 960 or 1200px, or no max width.' },
      ...asProps('div'),
    ],
    slots: [defaultSlot('The page content.')],
    demo: ContainerDemo,
    code: `<TContainer size="md" class="py-8">
  <RouterView />
</TContainer>`,
  },
  {
    id: 'spacer',
    name: 'TSpacer',
    group: 'primitives',
    summary: 'Takes the free space in a flex row or column, pushing what follows to the end.',
    props: asProps('div'),
    demo: SpacerDemo,
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
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Vertical also sets aria-orientation.' },
      ...asProps('hr'),
    ],
    demo: DividerDemo,
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
      ...asProps('div'),
    ],
    slots: [defaultSlot('The parts, or any content.')],
    demo: CardDemo,
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
      { name: 'title', type: 'string', description: 'Heading text; without it (or its slot) no heading renders.' },
      { name: 'description', type: 'string', description: 'Muted text under the heading.' },
      { name: 'headingLevel', type: '2 – 6', default: '2', description: 'The heading element (h2–h6), for the document outline.' },
      { name: 'gap', type: SPACE, default: '3', description: 'Space between the body items.' },
      { name: 'spacing', type: SPACE, description: 'Vertical padding of the section.' },
      asOnly('section', 'The root element, e.g. article. The heading and body render inside it.'),
    ],
    slots: [
      defaultSlot('The body.'),
      { name: 'title', description: 'Rich heading content, instead of the title prop.' },
      { name: 'description', description: 'Rich description, instead of the prop.' },
    ],
    demo: SectionDemo,
    code: `<TSection title="Members" description="People with access." :gap="4">
  <MemberList />
</TSection>`,
  },
  {
    id: 'page-header',
    name: 'TPageHeader',
    group: 'surfaces',
    summary: 'The top of a page: the largest title, a description and actions that wrap below the text when space runs out.',
    props: [
      { name: 'title', type: 'string', description: 'The page title.' },
      { name: 'description', type: 'string', description: 'Muted text under the title.' },
      { name: 'headingLevel', type: '1 – 6', default: '1', description: "The title element; it doesn't change the size." },
      asOnly('header', 'The root element, e.g. div.'),
    ],
    slots: [
      { name: 'actions', description: 'Rendered at the end of the row.' },
      defaultSlot('Extra content under the description.'),
      { name: 'title', description: 'Rich title content, instead of the prop.' },
      { name: 'description', description: 'Rich description, instead of the prop.' },
    ],
    demo: PageHeaderDemo,
    code: `<TPageHeader title="Projects" description="All projects in your workspace.">
  <template #actions>
    <TButton label="New project" />
  </template>
</TPageHeader>`,
  },
  {
    id: 'panel',
    name: 'TPanel',
    group: 'surfaces',
    summary: 'An inset area for filters, settings blocks and similar: lighter than a card, never a shadow.',
    props: [
      { name: 'tone', type: "'neutral' | 'accent'", default: "'neutral'", description: 'Surface or accent-subtle background.' },
      { name: 'padding', type: SPACE, default: '4', description: 'Inner padding.' },
      { name: 'title', type: 'string', description: 'A small title above the content.' },
      asOnly('div', 'The root element.'),
    ],
    slots: [defaultSlot('The content.'), { name: 'title', description: 'Rich title content, instead of the prop.' }],
    demo: PanelDemo,
    code: `<TPanel title="Filters">
  <TInline wrap :gap="2">…</TInline>
</TPanel>
<TPanel tone="accent" :padding="3">…</TPanel>`,
  },

  // App-level layout
  {
    id: 'app-shell',
    name: 'TAppShell',
    parts: ['TAppShellHeader', 'TAppShellSidebar', 'TAppShellMain', 'TAppShellFooter'],
    group: 'app',
    summary:
      'The page frame for a host app: sticky header, independently scrolling sidebar, main and footer. Below 48rem of viewport it stacks into one column. Not for use inside a microfrontend.',
    props: [
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Narrow sidebar; you decide what it shows.' },
      { name: 'hasSidebar', type: 'boolean', default: 'true', description: 'Set false when there is no sidebar region.' },
      { name: 'viewport', type: 'boolean', default: 'false', description: 'At least the viewport height.' },
      ...asProps('div'),
    ],
    slots: [defaultSlot('The parts: header, sidebar, main, footer (any may be left out).')],
    demo: AppShellDemo,
    code: `<TAppShell viewport :collapsed="collapsed">
  <TAppShellHeader><Logo /></TAppShellHeader>
  <TAppShellSidebar><Menu /></TAppShellSidebar>
  <TAppShellMain><RouterView /></TAppShellMain>
  <TAppShellFooter>…</TAppShellFooter>
</TAppShell>`,
  },
  {
    id: 'sidebar-layout',
    name: 'TSidebarLayout',
    parts: ['TSidebarLayoutSidebar', 'TSidebarLayoutContent'],
    group: 'app',
    summary:
      "Two columns inside any container (safe in a microfrontend): the sidebar drops above the content when the container gets too narrow. This page's table of contents uses it.",
    props: [
      { name: 'side', type: "'start' | 'end'", default: "'start'", description: 'Sidebar side, whatever the DOM order.' },
      { name: 'sidebarWidth', type: 'CSS length', default: '16rem', description: 'Sidebar width beside the content.' },
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Narrow sidebar (4rem); wins over sidebarWidth.' },
      gapProp('3'),
      ...asProps('div'),
    ],
    slots: [defaultSlot('The sidebar and content parts.')],
    demo: SidebarLayoutDemo,
    code: `<TSidebarLayout sidebar-width="14rem" :gap="6" :collapsed="collapsed">
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
      ...asProps('div'),
    ],
    slots: [defaultSlot('The two panes.')],
    demo: SplitDemo,
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
    props: [gapProp('2'), alignProp("'center'"), justifyProp("'start'"), ...asProps('div')],
    slots: [defaultSlot('The items.')],
    demo: ClusterDemo,
    code: `<TCluster>
  <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
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
      { name: 'tabindex', type: 'number', default: '0', description: 'Your own value wins.' },
      ...asProps('div'),
    ],
    slots: [defaultSlot('The scrolling content.')],
    demo: ScrollAreaDemo,
    code: `<TScrollArea max-height="20rem" role="region" aria-label="Activity log">
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
      ...asProps('div'),
    ],
    slots: [defaultSlot('The media or content.')],
    demo: AspectRatioDemo,
    code: `<TAspectRatio ratio="16-9">
  <img :src="cover" alt="" />
</TAspectRatio>`,
  },
]
