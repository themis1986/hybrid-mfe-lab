import {
  alarm,
  TAlarm,
  type TAlarmPosition,
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
  TCheckbox,
  TCluster,
  TContainer,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TDialogTrigger,
  TDivider,
  TField,
  TGrid,
  TIcon,
  TInline,
  TInput,
  TPageHeader,
  TPanel,
  TRadioGroup,
  TRadioGroupItem,
  TScrollArea,
  TSection,
  TSelect,
  TSidebarLayout,
  TSidebarLayoutContent,
  TSidebarLayoutSidebar,
  TSpacer,
  TSpinner,
  TSplit,
  TStack,
  TSwitch,
  type TTreeNode,
  TTooltip,
  TTreeSelector,
  TWidget,
} from '@repo/ui'
import { Bell, Check, Heart, Info, Search, Settings, Star, TriangleAlert } from '@repo/ui/icons'
import { type ReactNode, useState } from 'react'

export type DocGroupId = 'actions' | 'feedback' | 'icons' | 'primitives' | 'surfaces' | 'overlays' | 'app'

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
  { id: 'feedback', label: 'Feedback', description: 'Loading and status indicators.' },
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
    id: 'overlays',
    label: 'Overlays',
    description: 'Content layered above the page, portalled to the end of <body>.',
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

function CheckboxDemo() {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(true)

  return (
    <TCluster gap={6}>
      <label className="inline-flex items-center gap-2 text-sm">
        <TCheckbox checked={checked} onCheckedChange={setChecked} />
        Controlled: {String(checked)}
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <TCheckbox defaultChecked="indeterminate" />
        Indeterminate
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <TCheckbox size="sm" />
        Small, uncontrolled
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-fg-muted">
        <TCheckbox disabled defaultChecked />
        Disabled
      </label>
    </TCluster>
  )
}

const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime' },
]

function RadioGroupDemo() {
  const [plan, setPlan] = useState('monthly')

  return (
    <TCluster gap={8} align="start">
      <div className="flex flex-col gap-3">
        <TRadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
          {plans.map((item) => (
            <label key={item.value} className="inline-flex items-center gap-2 text-sm">
              <TRadioGroupItem value={item.value} />
              {item.label}
            </label>
          ))}
        </TRadioGroup>
        <span className="text-sm text-fg-muted">Controlled: {plan}</span>
      </div>
      <TRadioGroup orientation="horizontal" defaultValue="b" aria-label="Size">
        <label className="inline-flex items-center gap-2 text-sm">
          <TRadioGroupItem value="a" size="sm" />
          Small
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <TRadioGroupItem value="b" size="sm" />
          Medium
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-fg-muted">
          <TRadioGroupItem value="c" size="sm" disabled />
          Large (disabled)
        </label>
      </TRadioGroup>
    </TCluster>
  )
}

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]

function SelectDemo() {
  const [fruit, setFruit] = useState<string>()
  const [basket, setBasket] = useState(['apple', 'cherry'])

  return (
    <TGrid minChildWidth="14rem" gap={4}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="select-demo-single" className="text-sm font-medium">
          Single
        </label>
        <TSelect id="select-demo-single" value={fruit} onValueChange={setFruit} options={fruits} placeholder="Pick a fruit" />
        <span className="text-sm text-fg-muted">Controlled: {fruit ?? '—'}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="select-demo-multiple" className="text-sm font-medium">
          Multiple
        </label>
        <TSelect
          id="select-demo-multiple"
          multiple
          value={basket}
          onValueChange={setBasket}
          options={fruits}
          placeholder="Pick fruits"
        />
        <span className="text-sm text-fg-muted">Controlled: {basket.join(', ') || '—'}</span>
      </div>
      <TSelect options={fruits} size="sm" invalid placeholder="Invalid, small" aria-label="Invalid" />
      <TSelect options={fruits} disabled defaultValue="banana" aria-label="Disabled" />
    </TGrid>
  )
}

const regions: TTreeNode[] = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'western-europe',
        label: 'Western Europe',
        children: [
          { value: 'fr', label: 'France' },
          { value: 'es', label: 'Spain' },
          { value: 'pt', label: 'Portugal' },
        ],
      },
      { value: 'it', label: 'Italy' },
      { value: 'gr', label: 'Greece' },
      { value: 'ch', label: 'Switzerland', disabled: true },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      { value: 'jp', label: 'Japan' },
      { value: 'kr', label: 'South Korea' },
      { value: 'in', label: 'India' },
    ],
  },
  { value: 'aq', label: 'Antarctica' },
]

function TreeSelectorDemo() {
  const [country, setCountry] = useState<string>()
  const [leaves, setLeaves] = useState(['fr', 'es'])
  const [parents, setParents] = useState(['asia'])

  return (
    <TGrid minChildWidth="14rem" gap={4}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tree-demo-single" className="text-sm font-medium">
          Single
        </label>
        <TTreeSelector id="tree-demo-single" value={country} onValueChange={setCountry} options={regions} placeholder="Pick a country" />
        <span className="text-sm text-fg-muted">Controlled: {country ?? '—'}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tree-demo-leaves" className="text-sm font-medium">
          Multiple, value mode leaves
        </label>
        <TTreeSelector
          id="tree-demo-leaves"
          multiple
          value={leaves}
          onValueChange={setLeaves}
          options={regions}
          placeholder="Pick countries"
        />
        <span className="text-sm text-fg-muted">Controlled: {leaves.join(', ') || '—'}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tree-demo-parents" className="text-sm font-medium">
          Multiple, value mode parents
        </label>
        <TTreeSelector
          id="tree-demo-parents"
          multiple
          valueMode="parents"
          value={parents}
          onValueChange={setParents}
          options={regions}
          placeholder="Pick regions"
        />
        <span className="text-sm text-fg-muted">Controlled: {parents.join(', ') || '—'}</span>
      </div>
    </TGrid>
  )
}

const alarmPositions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const
const alarmPositionOptions = [
  { value: 'host', label: "Host's (bottom-right)" },
  ...alarmPositions.map((p) => ({ value: p, label: p })),
]

function AlarmDemo() {
  const [choice, setChoice] = useState('host')
  const position = choice === 'host' ? undefined : (choice as TAlarmPosition)
  const [offline, setOffline] = useState(false)

  return (
    <TStack gap={4}>
      <TCluster gap={3}>
        <TSelect value={choice} onValueChange={setChoice} options={alarmPositionOptions} size="sm" aria-label="Position" className="w-52" />
        <TButton variant="soft" label="Success" onClick={() => alarm.success('Profile saved', { position })} />
        <TButton
          variant="soft"
          label="Error"
          onClick={() => alarm.error('Upload failed', { description: 'The file is larger than 10 MB.', position })}
        />
        <TButton variant="soft" label="Info" onClick={() => alarm.info('A new version is available', { position })} />
        <TButton
          variant="soft"
          label="Warning"
          onClick={() => alarm.warning('Your session expires in 5 minutes', { position, duration: 10000 })}
        />
      </TCluster>
      <label className="inline-flex items-center gap-2 text-sm">
        <TSwitch checked={offline} onCheckedChange={setOffline} />
        Declarative {'<TAlarm open>'}: {offline ? 'open' : 'closed'}
      </label>
      <TAlarm
        open={offline}
        onOpenChange={setOffline}
        variant="warning"
        title="You are offline"
        description="Changes are saved locally until the connection is back."
        duration={Infinity}
        position={position}
      />
    </TStack>
  )
}

function DialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <TCluster>
      <TDialog open={open} onOpenChange={setOpen}>
        <TDialogTrigger asChild>
          <TButton label="Edit profile" />
        </TDialogTrigger>
        <TDialogContent>
          <TDialogHeader>
            <TDialogTitle>Edit profile</TDialogTitle>
            <TDialogDescription>Controlled: Save closes it by setting open to false.</TDialogDescription>
          </TDialogHeader>
          <TDialogBody>
            <TStack gap={3}>
              <TField label="Name" defaultValue="Ada Lovelace" />
              <TField label="Email" type="email" defaultValue="ada@example.com" />
            </TStack>
          </TDialogBody>
          <TDialogFooter>
            <TDialogClose asChild>
              <TButton variant="ghost" label="Cancel" />
            </TDialogClose>
            <TButton label="Save" onClick={() => setOpen(false)} />
          </TDialogFooter>
        </TDialogContent>
      </TDialog>
      <TDialog>
        <TDialogTrigger asChild>
          <TButton variant="outline" label="Delete…" />
        </TDialogTrigger>
        <TDialogContent size="sm">
          <TDialogHeader>
            <TDialogTitle>Delete this item?</TDialogTitle>
            <TDialogDescription>Small and uncontrolled. This can't be undone.</TDialogDescription>
          </TDialogHeader>
          <TDialogFooter>
            <TDialogClose asChild>
              <TButton variant="ghost" label="Cancel" />
            </TDialogClose>
            <TDialogClose asChild>
              <TButton variant="danger" label="Delete" />
            </TDialogClose>
          </TDialogFooter>
        </TDialogContent>
      </TDialog>
      <TDialog>
        <TDialogTrigger asChild>
          <TButton variant="soft" label="Full screen" />
        </TDialogTrigger>
        <TDialogContent size="full">
          <TDialogHeader>
            <TDialogTitle>Full screen</TDialogTitle>
            <TDialogDescription>size="full" fills the viewport; the body takes the free height and scrolls.</TDialogDescription>
          </TDialogHeader>
          <TDialogBody>
            <TStack gap={2}>
              {Array.from({ length: 40 }, (_, i) => (
                <Block key={i}>Row {i + 1}</Block>
              ))}
            </TStack>
          </TDialogBody>
          <TDialogFooter>
            <TDialogClose asChild>
              <TButton label="Done" />
            </TDialogClose>
          </TDialogFooter>
        </TDialogContent>
      </TDialog>
    </TCluster>
  )
}

function WidgetDemo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <TGrid minChildWidth="16rem" gap={3}>
      <TWidget title="Visitors">
        <span className="text-sm text-fg-muted">Expanded, the same content renders again in the dialog.</span>
      </TWidget>
      <TWidget
        title="Sales"
        variant="elevated"
        expanded={expanded}
        onExpandedChange={setExpanded}
        header={
          <>
            <h3>Sales</h3>
            <Tag>+12%</Tag>
          </>
        }
        expandedContent={
          <TStack gap={2}>
            {Array.from({ length: 30 }, (_, i) => (
              <Block key={i}>Order {i + 1}</Block>
            ))}
          </TStack>
        }
      >
        <TStack gap={2}>
          <Block>Order 1</Block>
          <Block>Order 2</Block>
          <span className="text-sm text-fg-muted">Controlled: {expanded ? 'expanded' : 'collapsed'}</span>
        </TStack>
      </TWidget>
    </TGrid>
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
  {
    id: 'checkbox',
    name: 'TCheckbox',
    group: 'actions',
    summary:
      'A checkbox (Radix Checkbox): a <button role="checkbox">, also indeterminate. Name it with a wrapping <label> or aria-label.',
    props: [
      { name: 'checked', type: "boolean | 'indeterminate'", description: 'Controlled state; pair it with onCheckedChange.' },
      { name: 'defaultChecked', type: "boolean | 'indeterminate'", default: 'false', description: 'Initial state when uncontrolled.' },
      { name: 'onCheckedChange', type: "(checked: boolean | 'indeterminate') => void", description: 'Called when the user toggles it.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Box size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable or togglable.' },
      { name: 'name / value / required', type: 'string / string / boolean', description: 'Form submission, as a native checkbox.' },
      asChildProp,
    ],
    demo: <CheckboxDemo />,
    code: `<label>
  <TCheckbox checked={accepted} onCheckedChange={setAccepted} /> I accept the terms
</label>
<TCheckbox defaultChecked="indeterminate" aria-label="Select all" />`,
  },
  {
    id: 'radio-group',
    name: 'TRadioGroup',
    parts: ['TRadioGroupItem'],
    group: 'actions',
    summary:
      'A set of radio buttons (Radix RadioGroup): one value, arrow keys move it. Name the group with aria-label, each item with a <label>.',
    props: [
      { name: 'value', type: 'string', description: "The checked item's value; pair it with onValueChange." },
      { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user checks an item.' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout (horizontal wraps) and arrow keys.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'For every item; form submission.' },
      { name: 'TRadioGroupItem value', type: 'string', description: 'The group value while this item is checked. Required.' },
      { name: 'TRadioGroupItem size', type: "'sm' | 'md'", default: "'md'", description: 'Circle size.' },
      { name: 'TRadioGroupItem disabled', type: 'boolean', default: 'false', description: 'Disables this item only.' },
      asChildProp,
    ],
    demo: <RadioGroupDemo />,
    code: `<TRadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
  <label><TRadioGroupItem value="monthly" /> Monthly</label>
  <label><TRadioGroupItem value="yearly" /> Yearly</label>
</TRadioGroup>`,
  },
  {
    id: 'select',
    name: 'TSelect',
    group: 'actions',
    summary:
      'A select over a list of options, single (Radix Select) or multiple (a listbox in a Radix Popover). Options show a radio (single) or a checkbox (multiple).',
    props: [
      { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]', description: 'The choices. Required.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Several values; the list stays open while toggling.' },
      { name: 'value', type: 'string | string[]', description: 'Controlled value (an array with multiple); pair it with onValueChange.' },
      { name: 'defaultValue', type: 'string | string[]', description: 'Initial value when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the selection changes.' },
      { name: 'placeholder', type: 'string', description: 'Shown while nothing is selected.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Trigger size, as TInput's." },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'aria-invalid and the error border.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'Native disabled; form submission.' },
      { name: 'id / aria-label / className', type: 'string', description: 'Go on the trigger; id is for a <label htmlFor>.' },
    ],
    demo: <SelectDemo />,
    code: `<TSelect value={fruit} onValueChange={setFruit} options={fruits} placeholder="Pick a fruit" aria-label="Fruit" />
<TSelect multiple value={basket} onValueChange={setBasket} options={fruits} aria-label="Basket" />`,
  },
  {
    id: 'tree-selector',
    name: 'TTreeSelector',
    group: 'actions',
    summary:
      'A select whose options are a tree (a tree in a Radix Popover). Single picks one leaf; with multiple, a parent selects or clears its whole subtree and shows a partial state.',
    props: [
      {
        name: 'options',
        type: 'TTreeNode[]',
        description: '{ value, label, disabled?, children? }; values unique across the tree. A disabled parent disables its subtree. Required.',
      },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Several leaves, with a checkbox per row; the list stays open.' },
      {
        name: 'valueMode',
        type: "'leaves' | 'parents'",
        default: "'leaves'",
        description: 'With multiple: a fully selected parent appears as its leaves, or as the parent itself.',
      },
      { name: 'value', type: 'string | string[]', description: 'Controlled value (an array with multiple); pair it with onValueChange.' },
      { name: 'defaultValue', type: 'string | string[]', description: 'Initial value when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the selection changes.' },
      { name: 'placeholder', type: 'string', description: 'Shown while nothing is selected.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Trigger size, as TInput's." },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'aria-invalid and the error border.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'Native disabled; form submission.' },
      { name: 'id / aria-label / className', type: 'string', description: 'Go on the trigger; id is for a <label htmlFor>.' },
    ],
    demo: <TreeSelectorDemo />,
    code: `<TTreeSelector value={country} onValueChange={setCountry} options={regions} aria-label="Country" />
<TTreeSelector multiple valueMode="parents" value={picked} onValueChange={setPicked} options={regions} aria-label="Regions" />`,
  },

  // Feedback
  {
    id: 'alarm',
    name: 'TAlarm',
    parts: ['TAlarmHost', 'alarm()'],
    group: 'feedback',
    summary:
      'A short message in a corner of the screen (Radix Toast), tinted success, error, info or warning. Mount one TAlarmHost per app; raise alarms with alarm.success(…) and the like, or a declarative TAlarm. Inside the shell, its host shows every app’s alarms.',
    props: [
      { name: 'alarm.<variant>(title, options?)', type: '(string, TAlarmOptions) => id', description: 'success | error | info | warning. Returns the id for alarm.dismiss(id).' },
      { name: 'options.description', type: 'string', description: 'A second, quieter line.' },
      {
        name: 'options.position',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        description: "The host's position when omitted.",
      },
      { name: 'options.duration', type: 'number', description: "ms before it closes; Infinity keeps it. The host's when omitted." },
      { name: 'options.onClose', type: '() => void', description: 'Called once it closes (timeout, dismiss, swipe).' },
      { name: 'TAlarmHost position', type: 'TAlarmPosition', default: "'bottom-right'", description: 'The default position.' },
      { name: 'TAlarmHost duration', type: 'number', default: '5000', description: 'The default duration.' },
      { name: 'TAlarmHost label', type: 'string', default: "'Notifications'", description: 'Names the region; F8 focuses it.' },
      { name: 'TAlarm open / onOpenChange', type: 'boolean / (open) => void', description: 'Shown while open; onOpenChange(false) when it closes on its own.' },
      { name: 'TAlarm variant / title / description / position / duration', type: '…', description: 'As alarm.*() and its options; variant defaults to info.' },
    ],
    demo: <AlarmDemo />,
    code: `// once, at the app root
<TAlarmHost position="bottom-right" />

alarm.success('Profile saved')
alarm.error('Upload failed', { description: 'The file is larger than 10 MB.', position: 'top-center' })

<TAlarm open={offline} onOpenChange={setOffline} variant="warning" title="You are offline" duration={Infinity} />`,
  },
  {
    id: 'spinner',
    name: 'TSpinner',
    group: 'feedback',
    summary:
      'A loading indicator: a turning ring in the current text colour (accent by default), announced through role="status".',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '16, 20, 24 or 32px.' },
      { name: 'label', type: 'string', default: "'Loading'", description: 'Visually hidden text in the status region, announced to screen readers.' },
      { name: '…span props', type: "ComponentProps<'span'>", description: 'className (text-* tints it), aria-hidden when visible text says it is loading.' },
    ],
    demo: (
      <TCluster gap={6}>
        <TSpinner size="sm" />
        <TSpinner />
        <TSpinner size="lg" />
        <TSpinner size="xl" label="Loading the report" />
        <TSpinner size="lg" className="text-fg-muted" />
        <TButton variant="soft" disabled>
          <TSpinner size="sm" aria-hidden className="text-current" />
          Saving…
        </TButton>
      </TCluster>
    ),
    code: `<TSpinner />
<TSpinner size="xl" label="Loading the report" />
<TButton disabled>
  <TSpinner size="sm" aria-hidden className="text-current" /> Saving…
</TButton>`,
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
      'A bordered surface. Its padding is also the gap between the optional header, body and footer, whose dividers span the content width, inset from the edges (or are left out).',
    props: [
      { name: 'variant', type: "'outline' | 'filled' | 'elevated'", default: "'outline'", description: 'Transparent, surface fill, or canvas with a shadow.' },
      { name: 'padding', type: SPACE, default: '4', description: 'Padding and the space between parts. Use this, not a p-* class.' },
      { name: 'dividers', type: 'boolean', default: 'true', description: 'Lines under the header and above the footer; without them the parts are separated by space only.' },
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
        <TCard dividers={false}>
          <TCardHeader>
            <h4>no dividers</h4>
          </TCardHeader>
          <TCardBody className="text-sm">Body content.</TCardBody>
          <TCardFooter>
            <TButton size="sm" variant="soft" label="Action" />
          </TCardFooter>
        </TCard>
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
</TCard>
<TCard dividers={false}>…</TCard>`,
  },
  {
    id: 'widget',
    name: 'TWidget',
    group: 'surfaces',
    summary:
      'A card with a header, content and an expand button that opens an expanded view in a TDialog (full screen by default). The expanded header and content fall back to the normal ones; a fallback renders the content a second time, as a separate instance.',
    props: [
      { name: 'title', type: 'string', description: 'Required. Shown in the header by default; names the expand button and the dialog.' },
      { name: 'header', type: 'ReactNode', description: 'Header content instead of the title; the expand button stays at the end.' },
      { name: 'children', type: 'ReactNode', description: 'The content.' },
      { name: 'expandedHeader', type: 'ReactNode', description: 'Header of the expanded view. Defaults to header, then the title.' },
      { name: 'expandedContent', type: 'ReactNode', description: 'Content of the expanded view. Defaults to children.' },
      { name: 'expanded', type: 'boolean', description: 'Controlled state; pair it with onExpandedChange.' },
      { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
      { name: 'onExpandedChange', type: '(expanded: boolean) => void', description: 'Called when the expanded view opens or closes.' },
      { name: 'expandedSize', type: "'sm' | 'md' | 'lg' | 'full'", default: "'full'", description: 'Size of the expanded view.' },
      { name: 'expandLabel', type: 'string', default: "'Expand'", description: "Start of the expand button's name, followed by the title." },
      { name: 'headingLevel', type: '2 – 6', default: '3', description: "The default title's element; it doesn't change the size." },
      { name: 'variant / padding / dividers', type: 'TCard props', default: "'outline' / 4 / true", description: 'The card look.' },
    ],
    demo: <WidgetDemo />,
    code: `<TWidget title="Sales" header={<><h3>Sales</h3><Tag>+12%</Tag></>} expandedContent={<OrderTable />}>
  <OrderSummary />
</TWidget>
<TWidget title="Visitors" expanded={expanded} onExpandedChange={setExpanded}>
  <VisitorsChart />
</TWidget>`,
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

  // Overlays
  {
    id: 'dialog',
    name: 'TDialog',
    parts: [
      'TDialogTrigger',
      'TDialogContent',
      'TDialogHeader',
      'TDialogTitle',
      'TDialogDescription',
      'TDialogBody',
      'TDialogFooter',
      'TDialogClose',
    ],
    group: 'overlays',
    summary:
      'A modal dialog (Radix Dialog): focus is trapped inside, Escape or a click on the overlay closes it, and focus returns to the trigger. The content has a close button; the body scrolls when it is too tall. Always give it a TDialogTitle.',
    props: [
      { name: 'open', type: 'boolean', description: 'TDialog: controlled state; pair it with onOpenChange.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'TDialog: initial state when uncontrolled.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'TDialog: called when it opens or closes.' },
      { name: 'modal', type: 'boolean', default: 'true', description: 'TDialog: make the rest of the page inert while open.' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: 'TDialogContent: maximum width, or full to fill the viewport (no margin, border or radius).',
      },
      { name: 'hideClose', type: 'boolean', default: 'false', description: 'TDialogContent: leave out the close button.' },
      { name: 'closeLabel', type: 'string', default: "'Close'", description: "TDialogContent: the close button's accessible name." },
      {
        name: 'on…',
        type: 'Radix Content handlers',
        description: 'TDialogContent: onEscapeKeyDown, onInteractOutside, … (call preventDefault() to keep it open).',
      },
      { ...asChildProp, description: 'Trigger, Close, Header, Title, Description, Body, Footer: ' + asChildProp.description },
    ],
    demo: <DialogDemo />,
    code: `<TDialog open={open} onOpenChange={setOpen}>
  <TDialogTrigger asChild>
    <TButton label="Edit profile" />
  </TDialogTrigger>
  <TDialogContent>
    <TDialogHeader>
      <TDialogTitle>Edit profile</TDialogTitle>
      <TDialogDescription>…</TDialogDescription>
    </TDialogHeader>
    <TDialogBody>…</TDialogBody>
    <TDialogFooter>
      <TDialogClose asChild>
        <TButton variant="ghost" label="Cancel" />
      </TDialogClose>
      <TButton label="Save" onClick={save} />
    </TDialogFooter>
  </TDialogContent>
</TDialog>`,
  },

  {
    id: 'tooltip',
    name: 'TTooltip',
    group: 'overlays',
    summary:
      'A hint on hover (after a delay) and on keyboard focus (Radix Tooltip). The child is the trigger; side and align place it, and it flips when there is no room.',
    props: [
      { name: 'content', type: 'ReactNode', description: 'The tooltip content. Required.' },
      { name: 'children', type: 'ReactElement', description: 'The trigger: one focusable element. Wrap a disabled button in a <span tabIndex={0}>.' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Preferred side; flips when there is no room.' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment along that side.' },
      { name: 'sideOffset', type: 'number', default: '6', description: 'Gap to the trigger, in px.' },
      { name: 'delayDuration', type: 'number', default: '300', description: 'Hover delay in ms; focus opens it at once.' },
      { name: 'arrow', type: 'boolean', default: 'true', description: 'The pointer towards the trigger.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders only the trigger.' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: 'Controlled or uncontrolled open state.' },
      { name: '…content props', type: 'Tooltip.Content props', description: 'Go on the tooltip content (className, …).' },
    ],
    demo: (
      <TStack gap={4}>
        <TCluster gap={3}>
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <TTooltip key={side} content={`Shown on the ${side}`} side={side}>
              <TButton variant="outline" label={side} />
            </TTooltip>
          ))}
        </TCluster>
        <TCluster gap={3}>
          <TTooltip content="Aligned to the start" side="bottom" align="start">
            <TButton variant="soft" label="Align start" />
          </TTooltip>
          <TTooltip content="Aligned to the end" side="bottom" align="end">
            <TButton variant="soft" label="Align end" />
          </TTooltip>
          <TTooltip content="Settings">
            <TButton variant="ghost" size="sm" aria-label="Settings">
              <TIcon icon={Settings} size="sm" />
            </TButton>
          </TTooltip>
          <TTooltip
            side="right"
            content={
              <>
                <strong>Save</strong> · ⌘S
              </>
            }
          >
            <TButton variant="outline" label="Rich content" />
          </TTooltip>
          {/* A disabled button fires no pointer events: a focusable wrapper is the trigger instead. */}
          <TTooltip content="Saving is disabled while offline">
            <span tabIndex={0} className="inline-flex rounded-md">
              <TButton label="Save" disabled className="pointer-events-none" />
            </span>
          </TTooltip>
        </TCluster>
      </TStack>
    ),
    code: `<TTooltip content="Settings" side="right">
  <TButton variant="ghost" aria-label="Settings"><TIcon icon={Settings} /></TButton>
</TTooltip>`,
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
