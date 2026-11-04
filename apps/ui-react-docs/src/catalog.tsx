import {
  alarm,
  defaultRangePresets,
  TAccordion,
  TAccordionContent,
  TAccordionItem,
  TAccordionTrigger,
  TAlarm,
  type TAlarmPosition,
  TAppShell,
  TAppShellFooter,
  TAppShellHeader,
  TAppShellMain,
  TAppShellSidebar,
  TAspectRatio,
  TAudio,
  TButton,
  TCalendar,
  TCard,
  TCardBody,
  TCardFooter,
  TCardHeader,
  TCheckbox,
  TCombobox,
  TCluster,
  TCollapsible,
  TCollapsibleContent,
  TCollapsibleTrigger,
  TContainer,
  TDateField,
  TDatePicker,
  type TDateRange,
  TDateRangeField,
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
  TFrame,
  TGrid,
  TIcon,
  TImage,
  TInline,
  TInput,
  toast,
  TPageHeader,
  TPagination,
  TPanel,
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuLabel,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
  TPopover,
  TPopoverClose,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
  TProgress,
  TRadioGroup,
  TRadioGroupItem,
  TRangeCalendar,
  TRangeDatePicker,
  TScrollArea,
  TSection,
  TSelect,
  TSidebarLayout,
  TSidebarLayoutContent,
  TSidebarLayoutSidebar,
  TSlider,
  TSpacer,
  TSpinner,
  TSplit,
  TStack,
  TSwitch,
  TTabs,
  TTabsContent,
  TTabsList,
  TTabsTrigger,
  TText,
  TTimeField,
  TToast,
  TTooltip,
  type TTreeNode,
  TTreeSelector,
  TUpload,
  TVideo,
  TWidget,
} from '@repo/ui'
import {
  Bell,
  Check,
  Heart,
  Info,
  Plus,
  Search,
  Settings,
  Star,
  TriangleAlert,
} from '@repo/ui/icons'
import { type FormEvent, type ReactNode, useState } from 'react'
import {
  brokenAudio,
  brokenImage,
  brokenVideo,
  growingFrameDoc,
  mockUpload,
  sampleAudio,
  sampleFrameDoc,
  sampleImage,
  sampleVideoSources,
} from './samples'
import { CHART_ENTRIES } from './charts'
import { MAP_ENTRIES } from './maps'

export type DocGroupId =
  | 'actions'
  | 'dates'
  | 'feedback'
  | 'icons'
  | 'primitives'
  | 'surfaces'
  | 'disclosure'
  | 'overlays'
  | 'media'
  | 'maps'
  | 'charts'
  | 'app'

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
  /** A live example; left out where one per group is enough. */
  demo?: ReactNode
  code: string
}

export const DOC_GROUPS: {
  id: DocGroupId
  label: string
  description: string
}[] = [
  {
    id: 'actions',
    label: 'Actions & inputs',
    description: 'Buttons and form controls.',
  },
  {
    id: 'dates',
    label: 'Dates & time',
    description:
      "Calendars, date and time fields, and date pickers. Values are ISO strings ('2026-11-01', '14:30').",
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Loading and status indicators.',
  },
  {
    id: 'icons',
    label: 'Icons',
    description:
      "The design system's icon set (Lucide), imported from '@repo/ui/icons'.",
  },
  {
    id: 'primitives',
    label: 'Layout primitives',
    description:
      'Flex, grid and spacing building blocks. They adapt to their container, not to the viewport.',
  },
  {
    id: 'surfaces',
    label: 'Surfaces & structure',
    description:
      'Group and title content: cards, sections, page headers and panels.',
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    description: 'Content shown on demand: tabs, accordions and collapsibles.',
  },
  {
    id: 'overlays',
    label: 'Overlays',
    description:
      'Content layered above the page, portalled to the end of <body>.',
  },
  {
    id: 'media',
    label: 'Media',
    description:
      'Images, video, audio and embedded pages, with loading and error states.',
  },
  {
    id: 'maps',
    label: 'Maps',
    description:
      "Mapbox GL JS maps, markers and layers, imported from '@repo/ui/map'. Each map needs a public Mapbox token.",
  },
  {
    id: 'charts',
    label: 'Charts',
    description:
      "Highcharts charts, imported from '@repo/ui/charts'. Highcharts is free for personal and educational use only; other use needs a Highcharts license.",
  },
  {
    id: 'app',
    label: 'App-level layout',
    description:
      'Page frames, two-pane layouts, wrapping groups, scrolling and media boxes.',
  },
]

// Props shared by many components.
const SPACE = '0 – 8'
const asChildProp: DocProp = {
  name: 'asChild',
  type: 'boolean',
  default: 'false',
  description:
    'Render the single child element instead (Radix Slot), merging the classes and props onto it.',
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

// The media components' shared props. `className` and `style` go on the root; every other prop, ref
// included, on the native element.
const RATIO = "'square' | '4-3' | '3-2' | '16-9' | '21-9' | number"
const FIT = "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'"
const radiusProp: DocProp = {
  name: 'radius',
  type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
  default: "'none'",
  description: 'Corner rounding of the box.',
}
const borderedProp = (fallback: string): DocProp => ({
  name: 'bordered',
  type: 'boolean',
  default: fallback,
  description: 'A line around the box.',
})
const captionProp: DocProp = {
  name: 'caption',
  type: 'ReactNode',
  description: 'Shown under the media; the root becomes a <figure>.',
}
const playbackProps: DocProp[] = [
  {
    name: 'src',
    type: 'string',
    description: 'One file. Ignored when sources is given.',
  },
  {
    name: 'sources',
    type: 'TMediaSource[]',
    description:
      '{ src, type?, media? }: alternative files; the browser plays the first it supports.',
  },
  {
    name: 'controls',
    type: 'boolean',
    default: 'true',
    description: 'Native controls.',
  },
  {
    name: 'preload',
    type: "'none' | 'metadata' | 'auto'",
    default: "'metadata'",
    description: 'How much to fetch before playing.',
  },
  { name: 'volume', type: 'number', description: '0 to 1.' },
  { name: 'playbackRate', type: 'number', description: '1 is normal speed.' },
  {
    name: 'startTime',
    type: 'number',
    description: 'Where playback starts, in seconds.',
  },
]
const refProp = (element: string): DocProp => ({
  name: 'ref',
  type: `Ref<${element}>`,
  description: 'The native element, e.g. to call play() or pause().',
})

// Placeholder content for the demos.
function Block({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`box-border rounded-md bg-accent-subtle px-3 py-2 text-sm text-accent-fg ${className}`}
    >
      {children}
    </div>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-accent-line px-2.5 py-0.5 text-xs text-accent-fg">
      {children}
    </span>
  )
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
            <label
              key={item.value}
              className="inline-flex items-center gap-2 text-sm"
            >
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
        <TSelect
          id="select-demo-single"
          value={fruit}
          onValueChange={setFruit}
          options={fruits}
          placeholder="Pick a fruit"
        />
        <span className="text-sm text-fg-muted">
          Controlled: {fruit ?? '—'}
        </span>
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
        <span className="text-sm text-fg-muted">
          Controlled: {basket.join(', ') || '—'}
        </span>
      </div>
      <TSelect
        options={fruits}
        size="sm"
        invalid
        placeholder="Invalid, small"
        aria-label="Invalid"
      />
      <TSelect
        options={fruits}
        disabled
        defaultValue="banana"
        aria-label="Disabled"
      />
    </TGrid>
  )
}

const timeZones = [
  ['UTC', 'UTC'],
  ['Europe/London', 'Europe/London'],
  ['Europe/Lisbon', 'Europe/Lisbon'],
  ['Europe/Paris', 'Europe/Paris'],
  ['Europe/Berlin', 'Europe/Berlin'],
  ['Europe/Zurich', 'Europe/Zürich'],
  ['Europe/Athens', 'Europe/Athens'],
  ['Europe/Istanbul', 'Europe/Istanbul'],
  ['Africa/Cairo', 'Africa/Cairo'],
  ['Asia/Dubai', 'Asia/Dubai'],
  ['Asia/Kolkata', 'Asia/Kolkata'],
  ['Asia/Singapore', 'Asia/Singapore'],
  ['Asia/Tokyo', 'Asia/Tokyo'],
  ['Australia/Sydney', 'Australia/Sydney'],
  ['America/Sao_Paulo', 'America/São Paulo'],
  ['America/New_York', 'America/New York'],
  ['America/Chicago', 'America/Chicago'],
  ['America/Los_Angeles', 'America/Los Angeles'],
].map(([value, label]) => ({ value, label }))

const watchableServices = [
  'api-gateway',
  'auth',
  'billing',
  'catalog',
  'checkout',
  'email-worker',
  'inventory',
  'notifications',
  'payments',
  'search',
  'search-indexer',
]
  .map((s) => ({ value: s, label: s, disabled: false }))
  .concat({
    value: 'legacy-ftp',
    label: 'legacy-ftp (retired)',
    disabled: true,
  })

function ComboboxDemo() {
  const [zone, setZone] = useState<string>()
  const [watched, setWatched] = useState(['auth', 'billing'])

  return (
    <TGrid minChildWidth="16rem" gap={4}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="combobox-demo-zone" className="text-sm font-medium">
          Time zone
        </label>
        <TCombobox
          id="combobox-demo-zone"
          name="timeZone"
          value={zone}
          onValueChange={setZone}
          options={timeZones}
          placeholder="Search time zones…"
        />
        <span className="text-sm text-fg-muted">
          Selected: {timeZones.find((z) => z.value === zone)?.label ?? '—'}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="combobox-demo-services" className="text-sm font-medium">
          Services to watch
        </label>
        <TCombobox
          id="combobox-demo-services"
          name="services"
          multiple
          value={watched}
          onValueChange={setWatched}
          options={watchableServices}
          placeholder="Search services…"
        />
        <span className="text-sm text-fg-muted">
          Watching: {watched.join(', ') || '—'}
        </span>
      </div>
      <TCombobox
        options={timeZones}
        size="sm"
        invalid
        placeholder="Invalid, small"
        aria-label="Invalid"
      />
      <TCombobox
        options={timeZones}
        disabled
        defaultValue="UTC"
        aria-label="Disabled"
      />
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
        <TTreeSelector
          id="tree-demo-single"
          value={country}
          onValueChange={setCountry}
          options={regions}
          placeholder="Pick a country"
        />
        <span className="text-sm text-fg-muted">
          Controlled: {country ?? '—'}
        </span>
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
        <span className="text-sm text-fg-muted">
          Controlled: {leaves.join(', ') || '—'}
        </span>
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
        <span className="text-sm text-fg-muted">
          Controlled: {parents.join(', ') || '—'}
        </span>
      </div>
    </TGrid>
  )
}

const alarmPositions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
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
        <TSelect
          value={choice}
          onValueChange={setChoice}
          options={alarmPositionOptions}
          size="sm"
          aria-label="Position"
          className="w-52"
        />
        <TButton
          variant="soft"
          label="Success"
          onClick={() => alarm.success('Profile saved', { position })}
        />
        <TButton
          variant="soft"
          label="Error"
          onClick={() =>
            alarm.error('Upload failed', {
              description: 'The file is larger than 10 MB.',
              position,
            })
          }
        />
        <TButton
          variant="soft"
          label="Info"
          onClick={() => alarm.info('A new version is available', { position })}
        />
        <TButton
          variant="soft"
          label="Warning"
          onClick={() =>
            alarm.warning('Your session expires in 5 minutes', {
              position,
              duration: 10000,
            })
          }
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

function TextDemo() {
  const [bio, setBio] = useState('')
  const [feedback, setFeedback] = useState('Too short')

  return (
    <TGrid minChildWidth="16rem" gap={4}>
      <TText
        label="Bio"
        description="A few words about you."
        maxLength={160}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <TText
        label="Auto-resizing"
        autoResize
        rows={2}
        maxRows={6}
        defaultValue={'Grows as you type.\nTry adding lines.'}
      />
      <TText
        label="Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        error={
          feedback.length < 20 ? 'Write at least 20 characters.' : undefined
        }
      />
      <TText label="Disabled" disabled defaultValue="Read-only text" />
    </TGrid>
  )
}

function PaginationDemo() {
  const [page, setPage] = useState(5)
  const [total, setTotal] = useState(240)

  return (
    <TStack gap={5}>
      <div className="flex flex-col gap-2 text-sm">
        <span>
          Page {page} of {total} items
        </span>
        <TPagination
          page={page}
          onPageChange={setPage}
          total={total}
          itemsPerPage={20}
          aria-label="Results"
        />
        <TCluster>
          <TButton
            variant="outline"
            size="sm"
            label="Keep 40 items"
            onClick={() => setTotal(40)}
          />
          <TButton
            variant="outline"
            size="sm"
            label="Restore 240 items"
            onClick={() => setTotal(240)}
          />
        </TCluster>
      </div>
      <TPagination
        defaultPage={12}
        total={480}
        itemsPerPage={20}
        showFirstLast
        aria-label="With first and last buttons"
      />
      <TPagination
        defaultPage={6}
        total={240}
        itemsPerPage={20}
        showEdges={false}
        siblingCount={2}
        aria-label="Without edges"
      />
      <TPagination total={100} itemsPerPage={20} size="sm" aria-label="Small" />
      <TPagination total={100} itemsPerPage={20} size="lg" aria-label="Large" />
      <TPagination
        defaultPage={2}
        total={100}
        itemsPerPage={20}
        disabled
        aria-label="Disabled"
      />
    </TStack>
  )
}

function SliderDemo() {
  const [volume, setVolume] = useState([40])
  const [price, setPrice] = useState([20, 80])

  return (
    <TStack gap={6} className="max-w-md">
      <div className="flex flex-col gap-2 text-sm">
        <span>Volume: {volume[0]}</span>
        <TSlider value={volume} onValueChange={setVolume} thumbLabel="Volume" />
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span>
          Price range: {price[0]}–{price[1]} €
        </span>
        <TSlider
          value={price}
          onValueChange={setPrice}
          step={5}
          minStepsBetweenThumbs={2}
          thumbLabel={['Minimum price', 'Maximum price']}
        />
      </div>
      <TSlider defaultValue={[30]} size="sm" thumbLabel="Small" />
      <TSlider defaultValue={[60]} disabled thumbLabel="Disabled" />
    </TStack>
  )
}

function ProgressDemo() {
  const [upload, setUpload] = useState(35)

  return (
    <TStack gap={4} className="max-w-md">
      <div className="flex items-center gap-3 text-sm">
        <TProgress value={upload} aria-label="Upload" />
        <span className="w-10 tabular-nums">{upload}%</span>
        <TButton
          size="sm"
          variant="soft"
          label="+15"
          onClick={() => setUpload((u) => Math.min(100, u + 15))}
        />
      </div>
      <TProgress value={100} tone="success" aria-label="Complete" />
      <TProgress value={70} tone="warning" size="sm" aria-label="Storage" />
      <TProgress value={90} tone="danger" size="sm" aria-label="Quota" />
      <TProgress aria-label="Loading" />
    </TStack>
  )
}

function ToastDemo() {
  const [messages, setMessages] = useState([
    'Welcome aboard',
    'Your invoice',
    'Weekly digest',
  ])
  const [reminder, setReminder] = useState(false)

  // Deletes the first message; the toast's Undo puts it back.
  function remove() {
    const [message, ...rest] = messages
    if (!message) return
    setMessages(rest)
    toast(`Deleted “${message}”`, {
      action: {
        label: 'Undo',
        onClick: () => setMessages((current) => [message, ...current]),
      },
    })
  }

  return (
    <TStack gap={4}>
      <TCluster gap={3}>
        <TButton
          variant="soft"
          label="Delete a message"
          disabled={!messages.length}
          onClick={remove}
        />
        <TButton
          variant="soft"
          label="Plain toast"
          onClick={() => toast('Link copied')}
        />
        <TButton
          variant="outline"
          label="Declarative toast"
          onClick={() => setReminder(true)}
        />
      </TCluster>
      <p className="m-0 text-sm text-fg-muted">
        Messages: {messages.join(', ') || 'none'}
      </p>
      <TToast
        open={reminder}
        onOpenChange={setReminder}
        title="Reminder set for 9:00"
        description="We'll notify you tomorrow."
        actionLabel="Change"
        onAction={() => setReminder(false)}
      />
    </TStack>
  )
}

function TabsDemo() {
  const [tab, setTab] = useState('account')

  return (
    <TStack gap={8}>
      <TTabs value={tab} onValueChange={setTab}>
        <TTabsList>
          <TTabsTrigger value="account">Account</TTabsTrigger>
          <TTabsTrigger value="password">Password</TTabsTrigger>
          <TTabsTrigger value="billing" disabled>
            Billing
          </TTabsTrigger>
        </TTabsList>
        <TTabsContent value="account" className="text-sm">
          Make changes to your account here.
        </TTabsContent>
        <TTabsContent value="password" className="text-sm">
          Change your password here.
        </TTabsContent>
        <TTabsContent value="billing" className="text-sm">
          Billing is unavailable.
        </TTabsContent>
      </TTabs>
      <TTabs defaultValue="week">
        <TTabsList variant="pills">
          <TTabsTrigger value="day">Day</TTabsTrigger>
          <TTabsTrigger value="week">Week</TTabsTrigger>
          <TTabsTrigger value="month">Month</TTabsTrigger>
        </TTabsList>
        <TTabsContent value="day" className="text-sm">
          Today's schedule.
        </TTabsContent>
        <TTabsContent value="week" className="text-sm">
          This week's schedule.
        </TTabsContent>
        <TTabsContent value="month" className="text-sm">
          This month's schedule.
        </TTabsContent>
      </TTabs>
    </TStack>
  )
}

const faqs = [
  {
    value: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Orders ship within two working days.',
  },
  {
    value: 'returns',
    question: 'Can I return an item?',
    answer: 'Yes, within 30 days, unused and in its box.',
  },
  {
    value: 'support',
    question: 'How do I reach support?',
    answer: 'Write to us any time; we answer within a day.',
  },
]

function AccordionDemo() {
  const items = faqs.map((faq) => (
    <TAccordionItem key={faq.value} value={faq.value}>
      <TAccordionTrigger>{faq.question}</TAccordionTrigger>
      <TAccordionContent>{faq.answer}</TAccordionContent>
    </TAccordionItem>
  ))

  return (
    <TGrid minChildWidth="18rem" gap={8}>
      <TAccordion
        type="single"
        collapsible
        defaultValue="shipping"
        aria-label="Single"
      >
        {items}
      </TAccordion>
      <TAccordion
        type="multiple"
        defaultValue={['returns', 'support']}
        aria-label="Multiple"
      >
        {items}
      </TAccordion>
    </TGrid>
  )
}

function CollapsibleDemo() {
  const [open, setOpen] = useState(false)

  return (
    <TCollapsible
      open={open}
      onOpenChange={setOpen}
      className="flex max-w-md flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">3 people starred this repository</span>
        <TCollapsibleTrigger asChild>
          <TButton
            variant="ghost"
            size="sm"
            label={open ? 'Hide' : 'Show all'}
          />
        </TCollapsibleTrigger>
      </div>
      <div className="rounded-md border border-line px-3 py-2 text-sm">
        @ada
      </div>
      <TCollapsibleContent>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-line px-3 py-2 text-sm">
            @grace
          </div>
          <div className="rounded-md border border-line px-3 py-2 text-sm">
            @linus
          </div>
        </div>
      </TCollapsibleContent>
    </TCollapsible>
  )
}

const ruleServices = ['api-gateway', 'auth', 'billing', 'search'].map((s) => ({
  value: s,
  label: s,
}))
const ruleEvents = [
  { value: 'deploy-failed', label: 'Deployment failed' },
  { value: 'error-rate', label: 'Error rate above threshold' },
  { value: 'latency', label: 'Latency above threshold' },
  { value: 'restarted', label: 'Service restarted' },
]
const ruleChannels = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack' },
  { value: 'pagerduty', label: 'PagerDuty' },
]
const blankRule = () => ({
  service: 'api-gateway',
  events: ['deploy-failed'],
  severity: 'critical',
  threshold: [5],
  channels: [] as string[],
  quietHours: false,
  note: '',
})

function DropdownMenuDemo() {
  const [action, setAction] = useState('none yet')

  return (
    <TCluster>
      <TDropdownMenu>
        <TDropdownMenuTrigger asChild>
          <TButton variant="outline" label="Actions" />
        </TDropdownMenuTrigger>
        <TDropdownMenuContent>
          <TDropdownMenuLabel>Deployment</TDropdownMenuLabel>
          <TDropdownMenuItem onSelect={() => setAction('Restart')}>
            Restart
          </TDropdownMenuItem>
          <TDropdownMenuItem onSelect={() => setAction('Roll back')}>
            Roll back
          </TDropdownMenuItem>
          <TDropdownMenuItem disabled>Promote</TDropdownMenuItem>
          <TDropdownMenuSeparator />
          <TDropdownMenuItem tone="danger" onSelect={() => setAction('Delete')}>
            Delete
          </TDropdownMenuItem>
        </TDropdownMenuContent>
      </TDropdownMenu>
      <span className="text-sm text-fg-muted">Last action: {action}</span>
    </TCluster>
  )
}

function PopoverDemo() {
  const [open, setOpen] = useState(false)
  const [rule, setRule] = useState(blankRule)
  // Errors show once the user has tried to save.
  const [submitted, setSubmitted] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>()
  const errors = {
    events: rule.events.length ? undefined : 'Pick at least one event.',
    channels: rule.channels.length ? undefined : 'Pick at least one channel.',
  }
  const update = (patch: Partial<ReturnType<typeof blankRule>>) =>
    setRule((current) => ({ ...current, ...patch }))

  function save(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (errors.events || errors.channels) return
    const names = ruleChannels
      .filter((c) => rule.channels.includes(c.value))
      .map((c) => c.label)
    const summary = `${rule.service} · ${rule.events.length} event${rule.events.length > 1 ? 's' : ''} → ${names.join(', ')}`
    setLastSaved(summary)
    alarm.success('Rule saved', { description: summary })
    setOpen(false)
    setRule(blankRule())
    setSubmitted(false)
  }

  return (
    <TCluster gap={6} align="start">
      <TStack gap={2}>
        <TPopover open={open} onOpenChange={setOpen}>
          <TPopoverTrigger asChild>
            <TButton>
              <TIcon icon={Plus} size="sm" />
              New notification rule
            </TButton>
          </TPopoverTrigger>
          <TPopoverContent
            size="lg"
            title="New notification rule"
            description="Get notified when a backend service needs attention."
          >
            <form className="flex flex-col gap-4" noValidate onSubmit={save}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rule-service" className="text-sm font-medium">
                  Service
                </label>
                <TSelect
                  id="rule-service"
                  value={rule.service}
                  onValueChange={(service) => update({ service })}
                  options={ruleServices}
                  size="sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rule-events" className="text-sm font-medium">
                  Events
                </label>
                <TSelect
                  id="rule-events"
                  multiple
                  value={rule.events}
                  onValueChange={(events) => update({ events })}
                  options={ruleEvents}
                  size="sm"
                  placeholder="Pick events"
                  invalid={submitted && !!errors.events}
                />
                {submitted && errors.events && (
                  <p role="alert" className="m-0 text-sm text-danger">
                    {errors.events}
                  </p>
                )}
              </div>
              <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-sm font-medium">
                  Severity
                </legend>
                <TRadioGroup
                  value={rule.severity}
                  onValueChange={(severity) => update({ severity })}
                  orientation="horizontal"
                  aria-label="Severity"
                >
                  {['Critical', 'Warning', 'Any'].map((label) => (
                    <label
                      key={label}
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <TRadioGroupItem value={label.toLowerCase()} size="sm" />{' '}
                      {label}
                    </label>
                  ))}
                </TRadioGroup>
              </fieldset>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  Errors per minute: {rule.threshold[0]}
                </span>
                <TSlider
                  value={rule.threshold}
                  onValueChange={(threshold) => update({ threshold })}
                  min={1}
                  max={50}
                  size="sm"
                  thumbLabel="Errors per minute"
                />
              </div>
              <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-sm font-medium">
                  Channels
                </legend>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {ruleChannels.map((channel) => (
                    <label
                      key={channel.value}
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <TCheckbox
                        size="sm"
                        checked={rule.channels.includes(channel.value)}
                        onCheckedChange={(on) =>
                          update({
                            channels:
                              on === true
                                ? [...rule.channels, channel.value]
                                : rule.channels.filter(
                                    (c) => c !== channel.value,
                                  ),
                          })
                        }
                      />
                      {channel.label}
                    </label>
                  ))}
                </div>
                {submitted && errors.channels && (
                  <p role="alert" className="m-0 text-sm text-danger">
                    {errors.channels}
                  </p>
                )}
              </fieldset>
              <label className="inline-flex items-center justify-between gap-3 text-sm">
                Mute from 22:00 to 07:00
                <TSwitch
                  size="sm"
                  checked={rule.quietHours}
                  onCheckedChange={(quietHours) => update({ quietHours })}
                />
              </label>
              <TText
                label="Note (optional)"
                rows={2}
                size="sm"
                value={rule.note}
                onChange={(e) => update({ note: e.target.value })}
              />
              <TPopoverFooter>
                <TPopoverClose asChild>
                  <TButton type="button" variant="ghost" label="Cancel" />
                </TPopoverClose>
                <TButton type="submit" label="Save rule" />
              </TPopoverFooter>
            </form>
          </TPopoverContent>
        </TPopover>
        <p className="m-0 text-sm text-fg-muted">
          Last saved: {lastSaved ?? 'none yet'}
        </p>
      </TStack>

      <TPopover>
        <TPopoverTrigger asChild>
          <TButton variant="ghost" aria-label="About this service">
            <TIcon icon={Info} size="sm" />
          </TButton>
        </TPopoverTrigger>
        <TPopoverContent side="right" size="sm" aria-label="About api-gateway">
          <p className="m-0 pe-8 text-sm">
            <strong>api-gateway</strong> routes every public request to the
            backend services. Rules on it see all traffic.
          </p>
        </TPopoverContent>
      </TPopover>
    </TCluster>
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
            <TDialogDescription>
              Controlled: Save closes it by setting open to false.
            </TDialogDescription>
          </TDialogHeader>
          <TDialogBody>
            <TStack gap={3}>
              <TField label="Name" defaultValue="Ada Lovelace" />
              <TField
                label="Email"
                type="email"
                defaultValue="ada@example.com"
              />
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
            <TDialogDescription>
              Small and uncontrolled. This can't be undone.
            </TDialogDescription>
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
            <TDialogDescription>
              size="full" fills the viewport; the body takes the free height and
              scrolls.
            </TDialogDescription>
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
        <span className="text-sm text-fg-muted">
          Expanded, the same content renders again in the dialog.
        </span>
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
          <span className="text-sm text-fg-muted">
            Controlled: {expanded ? 'expanded' : 'collapsed'}
          </span>
        </TStack>
      </TWidget>
    </TGrid>
  )
}

// Today as an ISO date, in the viewer's time zone.
const now = new Date()
const todayIso = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n) => String(n).padStart(2, '0'))
  .join('-')
const isWeekend = (iso: string) =>
  [0, 6].includes(new Date(`${iso}T00:00`).getDay())
const showRange = (range?: TDateRange) =>
  range ? `${range.start} → ${range.end}` : '—'

// Shows a form's submitted values.
function useSubmitted() {
  const [submitted, setSubmitted] = useState('')
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(
      JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    )
  }
  return [submitted, onSubmit] as const
}

function CalendarDemo() {
  const [date, setDate] = useState<string>()
  const [booking, setBooking] = useState<string>()

  return (
    <TGrid minChildWidth="18rem" gap={6}>
      <div className="flex flex-col gap-2 text-sm">
        <TCalendar value={date} onValueChange={setDate} label="Date" />
        <span className="text-fg-muted">Selected: {date ?? '—'}</span>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <TCalendar
          value={booking}
          onValueChange={setBooking}
          min={todayIso}
          isDateUnavailable={isWeekend}
          weekStartsOn={1}
          locale="en-GB"
          label="Delivery day"
        />
        <span className="text-fg-muted">
          From today, weekdays only (en-GB, Monday first): {booking ?? '—'}
        </span>
      </div>
    </TGrid>
  )
}

function RangeCalendarDemo() {
  const [presets] = useState(defaultRangePresets)
  const [range, setRange] = useState<TDateRange | undefined>(presets[1].value)

  return (
    <TStack gap={2} className="text-sm">
      <TRangeCalendar
        value={range}
        onValueChange={setRange}
        presets={presets}
        numberOfMonths={2}
        label="Report period"
      />
      <span className="text-fg-muted">Range: {showRange(range)}</span>
    </TStack>
  )
}

function DateFieldDemo() {
  const [birthday, setBirthday] = useState<string>()

  return (
    <TGrid minChildWidth="14rem" gap={4}>
      <div className="flex flex-col gap-1.5 text-sm">
        <span id="date-field-demo-birthday" className="font-medium">
          Date of birth
        </span>
        <TDateField
          value={birthday}
          onValueChange={setBirthday}
          max="2026-12-31"
          aria-labelledby="date-field-demo-birthday"
        />
        <span className="text-fg-muted">Value: {birthday ?? '—'}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <span id="date-field-demo-gb" className="font-medium">
          en-GB order
        </span>
        <TDateField
          locale="en-GB"
          defaultValue="2026-11-01"
          aria-labelledby="date-field-demo-gb"
        />
      </div>
      <TDateField size="sm" invalid aria-label="Invalid, small" />
      <TDateField disabled defaultValue="2026-11-01" aria-label="Disabled" />
    </TGrid>
  )
}

function DateRangeFieldDemo() {
  const [stay, setStay] = useState<TDateRange>()

  return (
    <TGrid minChildWidth="18rem" gap={4}>
      <div className="flex flex-col gap-1.5 text-sm">
        <span id="date-range-field-demo" className="font-medium">
          Stay
        </span>
        <TDateRangeField
          value={stay}
          onValueChange={setStay}
          aria-labelledby="date-range-field-demo"
        />
        <span className="text-fg-muted">Value: {showRange(stay)}</span>
      </div>
      <TDateRangeField
        size="lg"
        defaultValue={{ start: '2026-11-01', end: '2026-11-07' }}
        aria-label="Large"
      />
    </TGrid>
  )
}

function TimeFieldDemo() {
  const [opens, setOpens] = useState<string | undefined>('09:00')
  const [alarmTime, setAlarmTime] = useState<string>()

  return (
    <TGrid minChildWidth="12rem" gap={4}>
      <div className="flex flex-col gap-1.5 text-sm">
        <span id="time-field-demo-opens" className="font-medium">
          Opens at (24h)
        </span>
        <TTimeField
          value={opens}
          onValueChange={setOpens}
          hourCycle={24}
          aria-labelledby="time-field-demo-opens"
        />
        <span className="text-fg-muted">Value: {opens ?? '—'}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <span id="time-field-demo-alarm" className="font-medium">
          Alarm (12h, seconds)
        </span>
        <TTimeField
          value={alarmTime}
          onValueChange={setAlarmTime}
          hourCycle={12}
          granularity="second"
          aria-labelledby="time-field-demo-alarm"
        />
        <span className="text-fg-muted">Value: {alarmTime ?? '—'}</span>
      </div>
      <TTimeField
        min="08:00"
        max="18:00"
        defaultValue="19:30"
        aria-label="Out of range"
      />
      <TTimeField disabled defaultValue="12:00" aria-label="Disabled" />
    </TGrid>
  )
}

function DatePickerDemo() {
  const [due, setDue] = useState<string>()
  const [submitted, onSubmit] = useSubmitted()

  return (
    <TGrid minChildWidth="16rem" gap={4}>
      <form className="flex flex-col gap-1.5 text-sm" onSubmit={onSubmit}>
        <span id="date-picker-demo-due" className="font-medium">
          Due date (required)
        </span>
        <TDatePicker
          value={due}
          onValueChange={setDue}
          name="due"
          required
          aria-labelledby="date-picker-demo-due"
        />
        <span className="text-fg-muted">Value: {due ?? '—'}</span>
        <TButton
          type="submit"
          variant="outline"
          size="sm"
          className="self-start"
        >
          Submit
        </TButton>
        {submitted && (
          <span className="text-fg-muted">Submitted: {submitted}</span>
        )}
      </form>
      <TDatePicker
        numberOfMonths={2}
        size="sm"
        aria-label="Two months, small"
      />
      <TDatePicker invalid aria-label="Invalid" />
      <TDatePicker disabled defaultValue="2026-11-01" aria-label="Disabled" />
    </TGrid>
  )
}

function RangeDatePickerDemo() {
  const [presets] = useState(defaultRangePresets)
  const [period, setPeriod] = useState<TDateRange>()
  const [submitted, onSubmit] = useSubmitted()

  return (
    <TGrid minChildWidth="20rem" gap={4}>
      <form className="flex flex-col gap-1.5 text-sm" onSubmit={onSubmit}>
        <span id="range-picker-demo" className="font-medium">
          Report period (required)
        </span>
        <TRangeDatePicker
          value={period}
          onValueChange={setPeriod}
          name="period"
          required
          presets={presets}
          numberOfMonths={2}
          aria-labelledby="range-picker-demo"
        />
        <span className="text-fg-muted">Value: {showRange(period)}</span>
        <TButton
          type="submit"
          variant="outline"
          size="sm"
          className="self-start"
        >
          Submit
        </TButton>
        {submitted && (
          <span className="text-fg-muted">Submitted: {submitted}</span>
        )}
      </form>
      <TRangeDatePicker
        size="sm"
        defaultValue={{ start: '2026-11-01', end: '2026-11-07' }}
        aria-label="Small"
      />
    </TGrid>
  )
}

// The date and time components' shared props. Dates are ISO strings ('2026-11-01').
const dateLimitProps: DocProp[] = [
  {
    name: 'min / max',
    type: 'string',
    description: 'The first and last date allowed.',
  },
  {
    name: 'isDateUnavailable',
    type: '(date: string) => boolean',
    description:
      'Dates that can’t be picked (struck through in a calendar, invalid in a field).',
  },
]
const calendarProps: DocProp[] = [
  ...dateLimitProps,
  {
    name: 'isDateDisabled',
    type: '(date: string) => boolean',
    description: 'Dates that can’t be picked or focused (faded).',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description:
      'Formats the heading, weekdays and each day’s accessible name.',
  },
  {
    name: 'weekStartsOn',
    type: '0 – 6',
    description: 'First day of the week, 0 = Sunday; the locale’s by default.',
  },
  {
    name: 'numberOfMonths',
    type: 'number',
    default: '1',
    description: 'Months side by side; they wrap when narrow.',
  },
  {
    name: 'pagedNavigation',
    type: 'boolean',
    default: 'false',
    description: 'Previous/next move by all the months shown.',
  },
  {
    name: 'fixedWeeks',
    type: 'boolean',
    default: 'false',
    description: 'Always six weeks, so the height never changes.',
  },
  {
    name: 'label',
    type: 'string',
    description:
      'Accessible name of the calendar; the visible month is added to it.',
  },
  {
    name: 'prevLabel / nextLabel',
    type: 'string',
    default: "'Previous month' / 'Next month'",
    description: 'Accessible names of the navigation buttons.',
  },
  {
    name: 'disabled / readonly',
    type: 'boolean',
    description: 'Prevents interaction / shows the value without changing it.',
  },
]
const fieldProps: DocProp[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: "Field height and text size, as TInput's.",
  },
  {
    name: 'invalid',
    type: 'boolean',
    default: 'false',
    description:
      'aria-invalid and the error border. An out-of-range value is marked anyway.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'The order of the segments and their separators.',
  },
  {
    name: 'disabled / readonly',
    type: 'boolean',
    description: 'Prevents interaction / shows the value without changing it.',
  },
  {
    name: 'name / required',
    type: 'string / boolean',
    description:
      'Form submission; required blocks it until the value is complete.',
  },
  {
    name: 'id / aria-label / className',
    type: 'string',
    description:
      'aria-* and className go on the field (role group); id on its hidden input, for a <label htmlFor>.',
  },
]
// A picker takes the calendar's props and the field's; these are the field's that the calendar's don't repeat.
const pickerFieldProps = fieldProps.filter(
  (prop) => !['locale', 'disabled / readonly'].includes(prop.name),
)
const pickerProps: DocProp[] = [
  {
    name: 'open / defaultOpen / onOpenChange',
    type: 'boolean / (open) => void',
    description: 'Whether the calendar is open, controlled or not.',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    default: 'true',
    description: 'Close the calendar once a date (a range’s end) is picked.',
  },
  {
    name: 'triggerLabel',
    type: 'string',
    default: "'Open calendar'",
    description: 'Accessible name of the calendar button.',
  },
]

function AudioDemo() {
  const [playing, setPlaying] = useState(false)

  return (
    <TStack gap={5} className="max-w-md">
      <TAudio
        src={sampleAudio}
        aria-label="T-rex roar"
        caption={playing ? 'T-rex roar · playing' : 'T-rex roar'}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <TAudio
        src={sampleAudio}
        playbackRate={0.5}
        volume={0.5}
        aria-label="T-rex roar, slowed"
        caption="Half speed, half volume"
      />
      <TAudio src={brokenAudio} aria-label="Missing recording" />
    </TStack>
  )
}

export const DOC_ENTRIES: DocEntry[] = [
  // Actions & inputs
  {
    id: 'button',
    name: 'TButton',
    group: 'actions',
    summary:
      'A native <button> in five variants and three sizes. With asChild it styles a link instead.',
    props: [
      {
        name: 'variant',
        type: "'solid' | 'soft' | 'outline' | 'ghost' | 'danger'",
        default: "'solid'",
        description: 'Visual emphasis.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and padding.',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Text content; children take precedence.',
      },
      asChildProp,
      {
        name: '…button props',
        type: 'ComponentProps<"button">',
        description:
          'type defaults to "button"; disabled uses the native attribute.',
      },
    ],
    demo: (
      <TStack gap={3}>
        <TCluster>
          {(['solid', 'soft', 'outline', 'ghost', 'danger'] as const).map(
            (variant) => (
              <TButton key={variant} variant={variant} label={variant} />
            ),
          )}
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
    summary:
      'A styled native <input>. Pair it with your own <label>, or use TField.',
    props: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and padding.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Sets aria-invalid and the error border.',
      },
      {
        name: '…input props',
        type: 'ComponentProps<"input">',
        description: 'value, onChange, placeholder, type, disabled, …',
      },
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
    summary:
      'An input with its label and a hint: the description, or the error when there is one (announced).',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Visible label, linked to the input. Required.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Helper text under the input.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'Error text; replaces the description and marks the input invalid.',
      },
      {
        name: 'revealLabel',
        type: 'string',
        default: "'Show password'",
        description:
          'Name of the show/hide toggle a type="password" field gets.',
      },
      {
        name: '…input props',
        type: 'TInputProps',
        description: 'Passed to the input; id is generated when omitted.',
      },
    ],
    demo: (
      <TGrid minChildWidth="14rem" gap={4}>
        <TField
          label="Email"
          placeholder="you@example.com"
          description="We never share it."
        />
        <TField
          label="Username"
          defaultValue="taken"
          error="That username is taken."
        />
        <TField label="Password" type="password" defaultValue="secret" />
      </TGrid>
    ),
    code: `<TField label="Email" description="We never share it." value={email} onChange={onChange} />
<TField label="Username" error={error} />
<TField label="Password" type="password" />`,
  },
  {
    id: 'switch',
    name: 'TSwitch',
    group: 'actions',
    summary:
      'An on/off toggle (Radix Switch): a <button role="switch">. Name it with a wrapping <label> or aria-label.',
    props: [
      {
        name: 'checked',
        type: 'boolean',
        description: 'Controlled state; pair it with onCheckedChange.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        default: 'false',
        description: 'Initial state when uncontrolled.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called when the user toggles it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Track and thumb size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Native disabled; not focusable or togglable.',
      },
      {
        name: 'name / value / required',
        type: 'string / string / boolean',
        description: 'Form submission, as a checkbox would.',
      },
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
      {
        name: 'checked',
        type: "boolean | 'indeterminate'",
        description: 'Controlled state; pair it with onCheckedChange.',
      },
      {
        name: 'defaultChecked',
        type: "boolean | 'indeterminate'",
        default: 'false',
        description: 'Initial state when uncontrolled.',
      },
      {
        name: 'onCheckedChange',
        type: "(checked: boolean | 'indeterminate') => void",
        description: 'Called when the user toggles it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Box size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Native disabled; not focusable or togglable.',
      },
      {
        name: 'name / value / required',
        type: 'string / string / boolean',
        description: 'Form submission, as a native checkbox.',
      },
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
      {
        name: 'value',
        type: 'string',
        description: "The checked item's value; pair it with onValueChange.",
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial value when uncontrolled.',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Called when the user checks an item.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Layout (horizontal wraps) and arrow keys.',
      },
      {
        name: 'disabled / name / required',
        type: 'boolean / string / boolean',
        description: 'For every item; form submission.',
      },
      {
        name: 'TRadioGroupItem value',
        type: 'string',
        description: 'The group value while this item is checked. Required.',
      },
      {
        name: 'TRadioGroupItem size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Circle size.',
      },
      {
        name: 'TRadioGroupItem disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables this item only.',
      },
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
      {
        name: 'options',
        type: '{ value: string; label: string; disabled?: boolean }[]',
        description: 'The choices. Required.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: 'Several values; the list stays open while toggling.',
      },
      {
        name: 'value',
        type: 'string | string[]',
        description:
          'Controlled value (an array with multiple); pair it with onValueChange.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Initial value when uncontrolled.',
      },
      {
        name: 'onValueChange',
        type: '(value: string | string[]) => void',
        description: 'Called when the selection changes.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Shown while nothing is selected.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "Trigger size, as TInput's.",
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'aria-invalid and the error border.',
      },
      {
        name: 'disabled / name / required',
        type: 'boolean / string / boolean',
        description: 'Native disabled; form submission.',
      },
      {
        name: 'id / aria-label / className',
        type: 'string',
        description: 'Go on the trigger; id is for a <label htmlFor>.',
      },
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
        description:
          '{ value, label, disabled?, children? }; values unique across the tree. A disabled parent disables its subtree. Required.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description:
          'Several leaves, with a checkbox per row; the list stays open.',
      },
      {
        name: 'valueMode',
        type: "'leaves' | 'parents'",
        default: "'leaves'",
        description:
          'With multiple: a fully selected parent appears as its leaves, or as the parent itself.',
      },
      {
        name: 'value',
        type: 'string | string[]',
        description:
          'Controlled value (an array with multiple); pair it with onValueChange.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Initial value when uncontrolled.',
      },
      {
        name: 'onValueChange',
        type: '(value: string | string[]) => void',
        description: 'Called when the selection changes.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Shown while nothing is selected.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "Trigger size, as TInput's.",
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'aria-invalid and the error border.',
      },
      {
        name: 'disabled / name / required',
        type: 'boolean / string / boolean',
        description: 'Native disabled; form submission.',
      },
      {
        name: 'id / aria-label / className',
        type: 'string',
        description: 'Go on the trigger; id is for a <label htmlFor>.',
      },
    ],
    demo: <TreeSelectorDemo />,
    code: `<TTreeSelector value={country} onValueChange={setCountry} options={regions} aria-label="Country" />
<TTreeSelector multiple valueMode="parents" value={picked} onValueChange={setPicked} options={regions} aria-label="Regions" />`,
  },

  {
    id: 'combobox',
    name: 'TCombobox',
    group: 'actions',
    summary:
      "A text field that filters a list of options as you type, single or multiple. Radix has no combobox, so it is an input anchoring a Radix Popover that behaves as Reka's. Matching ignores case and accents; with multiple, the selected options are chips in the field.",
    props: [
      {
        name: 'options',
        type: '{ value: string; label: string; disabled?: boolean }[]',
        description: 'The choices; the label is what typing matches. Required.',
      },
      {
        name: 'value / defaultValue',
        type: 'string | string[]',
        description: 'Controlled / initial value; an array with multiple.',
      },
      {
        name: 'onValueChange',
        type: '(value) => void',
        description: 'Called with the new value.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description:
          'Several values, shown as chips; the list stays open while toggling.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Shown in the empty field.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "Field height and text size, as TInput's.",
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'aria-invalid and the error border.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No results'",
        description: 'Shown when nothing matches.',
      },
      {
        name: 'removeLabel',
        type: 'string',
        default: "'Remove'",
        description: 'Names each chip\'s remove button: "Remove billing".',
      },
      {
        name: 'disabled / name / required',
        type: 'boolean / string / boolean',
        description: 'Native disabled; form submission.',
      },
      {
        name: 'id / aria-label / className',
        type: 'string',
        description:
          'id and aria-* go on the input (id is for a <label htmlFor>); className on the field.',
      },
    ],
    demo: <ComboboxDemo />,
    code: `<TCombobox value={zone} onValueChange={setZone} options={timeZones} placeholder="Search time zones…" aria-label="Time zone" />
<TCombobox multiple value={watched} onValueChange={setWatched} options={services} aria-label="Services to watch" />`,
  },

  {
    id: 'text',
    name: 'TText',
    group: 'actions',
    summary:
      'A labelled multi-line text field: a textarea with the input look, a hint or error under it, and a character count with maxLength.',
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Visible label, linked to the textarea. Required.',
      },
      {
        name: 'value / defaultValue / onChange',
        type: 'string',
        description: 'The text, controlled or uncontrolled.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Helper text under the textarea.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'Error text; replaces the description, marks it invalid and is announced.',
      },
      {
        name: 'rows',
        type: 'number',
        default: '3',
        description: 'Visible lines (the minimum with autoResize).',
      },
      {
        name: 'autoResize',
        type: 'boolean',
        default: 'false',
        description: 'Grows with its content; maxRows caps it.',
      },
      {
        name: 'maxRows',
        type: 'number',
        description: 'With autoResize: the height it stops at, in rows.',
      },
      {
        name: 'maxLength',
        type: 'number',
        description: 'Limits the length and shows a count under the textarea.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: "Padding and type size, as TInput's.",
      },
      {
        name: '…textarea props',
        type: 'textarea attributes',
        description: 'Go on the textarea; className and style go on the root.',
      },
    ],
    demo: <TextDemo />,
    code: `<TText label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} />
<TText label="Notes" autoResize maxRows={8} />`,
  },
  {
    id: 'slider',
    name: 'TSlider',
    group: 'actions',
    summary:
      'A slider (Radix Slider). The value is an array with one entry per thumb: [50] picks one value, [20, 80] a range.',
    props: [
      {
        name: 'value / defaultValue / onValueChange',
        type: 'number[]',
        description: 'One value per thumb, controlled or uncontrolled.',
      },
      {
        name: 'min / max / step',
        type: 'number',
        default: '0 / 100 / 1',
        description: 'The range and its step.',
      },
      {
        name: 'minStepsBetweenThumbs',
        type: 'number',
        default: '0',
        description: 'How many steps apart a range’s thumbs stay.',
      },
      {
        name: 'thumbLabel',
        type: 'string | string[]',
        description: 'Names each thumb for assistive technology. Needed.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Vertical fills its container’s height.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Thumb and track size.',
      },
      {
        name: 'disabled / name',
        type: 'boolean / string',
        description: 'Prevents interaction; form submission.',
      },
    ],
    demo: <SliderDemo />,
    code: `<TSlider value={volume} onValueChange={setVolume} thumbLabel="Volume" />
<TSlider defaultValue={[20, 80]} step={5} thumbLabel={['Minimum', 'Maximum']} />`,
  },
  {
    id: 'pagination',
    name: 'TPagination',
    group: 'actions',
    summary:
      "Page navigation with numbered buttons, previous and next, and ellipses for long ranges. Radix has no pagination primitive, so it reproduces the structure of the Vue library's Reka version.",
    props: [
      {
        name: 'page / defaultPage / onPageChange',
        type: 'number / number / (page) => void',
        description:
          'The current page, from 1, controlled or uncontrolled. A page past the end shows as the last one and nothing is reported, so clamp your own data when the total shrinks.',
      },
      {
        name: 'total',
        type: 'number',
        description: 'Number of items in the whole list, not of pages.',
      },
      {
        name: 'itemsPerPage',
        type: 'number',
        description: 'Items on one page.',
      },
      {
        name: 'siblingCount',
        type: 'number',
        default: '1',
        description: 'Pages shown on each side of the current one.',
      },
      {
        name: 'showEdges',
        type: 'boolean',
        default: 'true',
        description:
          'Always show the first and last page, with an ellipsis for any gap.',
      },
      {
        name: 'showFirstLast',
        type: 'boolean',
        default: 'false',
        description: 'Adds buttons that jump to the first and last page.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height of the buttons.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Disables every button.',
      },
      {
        name: 'labels',
        type: '{ first, previous, next, last, page }',
        description:
          'Accessible names of the buttons, for translating them; page is a function of the page number.',
      },
      {
        name: 'aria-label',
        type: 'string',
        default: "'Pagination'",
        description:
          'Name of the navigation landmark. Give each one its own when a page has several.',
      },
    ],
    demo: <PaginationDemo />,
    code: `<TPagination page={page} onPageChange={setPage} total={240} itemsPerPage={20} />
<TPagination defaultPage={12} total={480} itemsPerPage={20} showFirstLast />`,
  },

  // Dates & time
  {
    id: 'calendar',
    name: 'TCalendar',
    group: 'dates',
    summary:
      'A month grid that picks one date. Radix has no calendar, so it is written to behave like Reka’s: arrow keys move by day and week, Page Up/Down by month (with Shift, by year), Home/End to the week’s ends.',
    props: [
      {
        name: 'value / defaultValue',
        type: 'string',
        description:
          "The picked date, an ISO date ('2026-11-01'), controlled or not.",
      },
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description:
          'Called when a date is picked, or cleared by picking it again.',
      },
      ...calendarProps,
    ],
    demo: <CalendarDemo />,
    code: `<TCalendar value={date} onValueChange={setDate} label="Date" />
<TCalendar min={today} isDateUnavailable={isWeekend} weekStartsOn={1} />`,
  },
  {
    id: 'range-calendar',
    name: 'TRangeCalendar',
    group: 'dates',
    summary:
      'A month grid that picks a range, as Reka’s RangeCalendar: the first pick sets the start, the days up to the pointer are previewed, the second sets the end. The value changes only once both ends are picked; Escape while picking returns to the last range.',
    props: [
      {
        name: 'value / defaultValue',
        type: '{ start: string; end: string }',
        description: 'The range, in ISO dates, controlled or not.',
      },
      {
        name: 'onValueChange',
        type: '(value) => void',
        description: 'Called when both ends are picked.',
      },
      {
        name: 'presets',
        type: '{ label: string; value: { start; end } }[]',
        description:
          'Ranges listed beside the grid. defaultRangePresets() gives Today, Last 7 days, Last 30 days, This month and Last month.',
      },
      {
        name: 'presetsLabel',
        type: 'string',
        default: "'Presets'",
        description: 'Accessible name of the presets list.',
      },
      ...calendarProps,
    ],
    demo: <RangeCalendarDemo />,
    code: `<TRangeCalendar value={range} onValueChange={setRange} presets={defaultRangePresets()} numberOfMonths={2} />`,
  },
  {
    id: 'date-field',
    name: 'TDateField',
    group: 'dates',
    summary:
      'A date typed into segments in the locale’s order, as Reka’s DateField. Digits move on by themselves; Arrow Up/Down step a segment, Arrow Left/Right move between them, Backspace clears one.',
    props: [
      {
        name: 'value / defaultValue',
        type: 'string',
        description: 'An ISO date; undefined until every segment is filled.',
      },
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Called when the date is complete or cleared.',
      },
      ...dateLimitProps,
      ...fieldProps,
    ],
    demo: <DateFieldDemo />,
    code: `<TDateField value={birthday} onValueChange={setBirthday} aria-labelledby="birthday-label" />`,
  },
  {
    id: 'date-range-field',
    name: 'TDateRangeField',
    group: 'dates',
    summary:
      'A range typed as two dates in one field, as Reka’s DateRangeField, with TDateField’s keys. It submits an ISO interval (2026-11-01/2026-11-07), empty while incomplete.',
    props: [
      {
        name: 'value / defaultValue',
        type: '{ start: string; end: string }',
        description: 'The range; it changes once both dates are complete.',
      },
      {
        name: 'onValueChange',
        type: '(value) => void',
        description: 'Called when both dates are complete, or both cleared.',
      },
      ...dateLimitProps,
      ...fieldProps,
    ],
    demo: <DateRangeFieldDemo />,
    code: `<TDateRangeField value={stay} onValueChange={setStay} aria-label="Stay" />`,
  },
  {
    id: 'time-field',
    name: 'TTimeField',
    group: 'dates',
    summary:
      'A time of day typed into segments, as Reka’s TimeField, with TDateField’s keys; A or P sets the AM/PM segment.',
    props: [
      {
        name: 'value / defaultValue',
        type: 'string',
        description: "An ISO time: '14:30', or '14:30:15' with seconds.",
      },
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Called when the time is complete or cleared.',
      },
      {
        name: 'granularity',
        type: "'hour' | 'minute' | 'second'",
        default: "'minute'",
        description: 'The smallest segment shown.',
      },
      {
        name: 'hourCycle',
        type: '12 | 24',
        description: '12 adds an AM/PM segment; the locale’s by default.',
      },
      {
        name: 'min / max',
        type: 'string',
        description:
          'The allowed times; outside them the field is marked invalid.',
      },
      ...fieldProps,
    ],
    demo: <TimeFieldDemo />,
    code: `<TTimeField value={opens} onValueChange={setOpens} hourCycle={24} aria-label="Opens at" />`,
  },
  {
    id: 'date-picker',
    name: 'TDatePicker',
    group: 'dates',
    summary:
      'A date field with a calendar button, as Reka’s DatePicker: type the date, or open the calendar (a Radix Popover) and pick it there. The calendar closes once a date is picked.',
    props: [
      {
        name: 'value / defaultValue',
        type: 'string',
        description: 'An ISO date, controlled or not.',
      },
      {
        name: 'onValueChange',
        type: '(value: string | undefined) => void',
        description: 'Called when the date changes.',
      },
      ...pickerProps,
      ...calendarProps,
      ...pickerFieldProps,
    ],
    demo: <DatePickerDemo />,
    code: `<TDatePicker value={due} onValueChange={setDue} name="due" required aria-label="Due date" />`,
  },
  {
    id: 'range-date-picker',
    name: 'TRangeDatePicker',
    group: 'dates',
    summary:
      'A range field with a calendar button, as Reka’s DateRangePicker: type both dates, pick the start and end in the calendar, or pick a preset. It submits an ISO interval.',
    props: [
      {
        name: 'value / defaultValue',
        type: '{ start: string; end: string }',
        description: 'The range; it changes once both ends are set.',
      },
      {
        name: 'onValueChange',
        type: '(value) => void',
        description: 'Called when both ends are set.',
      },
      {
        name: 'presets / presetsLabel',
        type: 'TDatePreset[] / string',
        description: 'Ranges listed beside the calendar, as TRangeCalendar’s.',
      },
      ...pickerProps,
      ...calendarProps,
      ...pickerFieldProps,
    ],
    demo: <RangeDatePickerDemo />,
    code: `<TRangeDatePicker value={period} onValueChange={setPeriod} presets={defaultRangePresets()} numberOfMonths={2} aria-label="Period" />`,
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
      {
        name: 'alarm.<variant>(title, options?)',
        type: '(string, TAlarmOptions) => id',
        description:
          'success | error | info | warning. Returns the id for alarm.dismiss(id).',
      },
      {
        name: 'options.description',
        type: 'string',
        description: 'A second, quieter line.',
      },
      {
        name: 'options.position',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        description: "The host's position when omitted.",
      },
      {
        name: 'options.duration',
        type: 'number',
        description:
          "ms before it closes; Infinity keeps it. The host's when omitted.",
      },
      {
        name: 'options.onClose',
        type: '() => void',
        description: 'Called once it closes (timeout, dismiss, swipe).',
      },
      {
        name: 'options.action',
        type: '{ label: string; onClick: () => void }',
        description:
          'A button next to the message, e.g. Retry; clicking it runs onClick and closes the alarm.',
      },
      {
        name: 'TAlarmHost position',
        type: 'TAlarmPosition',
        default: "'bottom-right'",
        description: 'The default position.',
      },
      {
        name: 'TAlarmHost duration',
        type: 'number',
        default: '5000',
        description: 'The default duration.',
      },
      {
        name: 'TAlarmHost label',
        type: 'string',
        default: "'Notifications'",
        description: 'Names the region; F8 focuses it.',
      },
      {
        name: 'TAlarm open / onOpenChange',
        type: 'boolean / (open) => void',
        description:
          'Shown while open; onOpenChange(false) when it closes on its own.',
      },
      {
        name: 'TAlarm variant / title / description / position / duration',
        type: '…',
        description: 'As alarm.*() and its options; variant defaults to info.',
      },
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
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'xl'",
        default: "'md'",
        description: '16, 20, 24 or 32px.',
      },
      {
        name: 'label',
        type: 'string',
        default: "'Loading'",
        description:
          'Visually hidden text in the status region, announced to screen readers.',
      },
      {
        name: '…span props',
        type: "ComponentProps<'span'>",
        description:
          'className (text-* tints it), aria-hidden when visible text says it is loading.',
      },
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

  {
    id: 'progress',
    name: 'TProgress',
    group: 'feedback',
    summary:
      'A progress bar (Radix Progress), tinted by tone. Without a value it is indeterminate: a bar sliding across.',
    props: [
      {
        name: 'value',
        type: 'number | null',
        description:
          'The amount done, out of max. null or omitted: indeterminate.',
      },
      {
        name: 'max',
        type: 'number',
        default: '100',
        description: 'The total.',
      },
      {
        name: 'tone',
        type: "'accent' | 'success' | 'info' | 'warning' | 'danger'",
        default: "'accent'",
        description: 'The bar colour.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: '4 or 8px high.',
      },
      {
        name: 'getValueLabel',
        type: '(value, max) => string',
        description: 'The spoken value; the percentage by default.',
      },
      {
        name: 'aria-label',
        type: 'string',
        description: 'Names the bar. Needed.',
      },
    ],
    demo: <ProgressDemo />,
    code: `<TProgress value={35} aria-label="Upload" />
<TProgress aria-label="Loading" />`,
  },
  {
    id: 'toast',
    name: 'TToast',
    parts: ['toast()'],
    group: 'feedback',
    summary:
      'An untinted message, typically with an action (Deleted · Undo), shown by TAlarmHost in the same stack as the alarms: toast(title, options) or a declarative TToast.',
    props: [
      {
        name: 'toast(title, options?)',
        type: '(string, TAlarmOptions) => id',
        description:
          'The options of alarm.*(): description, position, duration, onClose, action.',
      },
      {
        name: 'options.action',
        type: '{ label: string; onClick: () => void }',
        description:
          'A button next to the message; clicking it runs onClick and closes the toast.',
      },
      {
        name: 'TToast open / onOpenChange',
        type: 'boolean / (open) => void',
        description: 'Shown while open; onOpenChange(false) once it closes.',
      },
      {
        name: 'TToast title / description / position / duration',
        type: '…',
        description: 'As toast() and its options.',
      },
      {
        name: 'TToast actionLabel',
        type: 'string',
        description:
          'Shows the action button; onAction runs when it is clicked.',
      },
    ],
    demo: <ToastDemo />,
    code: `toast('Deleted “Welcome aboard”', { action: { label: 'Undo', onClick: restore } })

<TToast open={reminder} onOpenChange={setReminder} title="Reminder set" actionLabel="Change" onAction={edit} />`,
  },

  // Icons
  {
    id: 'icon',
    name: 'TIcon',
    group: 'icons',
    summary:
      'Renders one Lucide icon at a design-system size, in the current text colour. Decorative unless it has a label.',
    props: [
      {
        name: 'icon',
        type: 'LucideIcon',
        description: "The icon, imported from '@repo/ui/icons'. Required.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '16, 20 or 24px.',
      },
      {
        name: 'label',
        type: 'string',
        description:
          'Accessible name (role="img"). Without it the icon is aria-hidden.',
      },
      {
        name: '…svg props',
        type: 'LucideProps',
        description: 'strokeWidth, className (text-* tints it), …',
      },
    ],
    demo: (
      <TStack gap={4}>
        <TCluster gap={4} className="text-fg">
          {Object.entries({
            Search,
            Bell,
            Settings,
            Star,
            Heart,
            Check,
            Info,
          }).map(([name, icon]) => (
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
    summary:
      'A vertical flex column with a gap: the default way to space things top to bottom.',
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
    summary:
      'A horizontal flex row, vertically centred. Add wrap to let it break onto more lines.',
    props: [
      gapProp('3'),
      alignProp("'center'"),
      justifyProp(),
      {
        name: 'wrap',
        type: 'boolean',
        default: 'false',
        description: 'Allow items to wrap.',
      },
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
    summary:
      'A CSS grid with a fixed column count, or auto-fit columns that collapse to one in a narrow container.',
    props: [
      {
        name: 'cols',
        type: '1 – 6',
        default: '1',
        description: 'Fixed number of equal columns.',
      },
      {
        name: 'minChildWidth',
        type: 'CSS length',
        description:
          'Auto-fit columns at least this wide. Use instead of cols.',
      },
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
    props: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'lg'",
        description: '640, 960 or 1200px, or no max width.',
      },
      asChildProp,
    ],
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
    summary:
      'Takes the free space in a flex row or column, pushing what follows to the end.',
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
    props: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Vertical also sets aria-orientation.',
      },
      asChildProp,
    ],
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
      {
        name: 'variant',
        type: "'outline' | 'filled' | 'elevated'",
        default: "'outline'",
        description: 'Transparent, surface fill, or canvas with a shadow.',
      },
      {
        name: 'padding',
        type: SPACE,
        default: '4',
        description:
          'Padding and the space between parts. Use this, not a p-* class.',
      },
      {
        name: 'dividers',
        type: 'boolean',
        default: 'true',
        description:
          'Lines under the header and above the footer; without them the parts are separated by space only.',
      },
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
      {
        name: 'title',
        type: 'string',
        description:
          'Required. Shown in the header by default; names the expand button and the dialog.',
      },
      {
        name: 'header',
        type: 'ReactNode',
        description:
          'Header content instead of the title; the expand button stays at the end.',
      },
      { name: 'children', type: 'ReactNode', description: 'The content.' },
      {
        name: 'expandedHeader',
        type: 'ReactNode',
        description:
          'Header of the expanded view. Defaults to header, then the title.',
      },
      {
        name: 'expandedContent',
        type: 'ReactNode',
        description: 'Content of the expanded view. Defaults to children.',
      },
      {
        name: 'expanded',
        type: 'boolean',
        description: 'Controlled state; pair it with onExpandedChange.',
      },
      {
        name: 'defaultExpanded',
        type: 'boolean',
        default: 'false',
        description: 'Initial state when uncontrolled.',
      },
      {
        name: 'onExpandedChange',
        type: '(expanded: boolean) => void',
        description: 'Called when the expanded view opens or closes.',
      },
      {
        name: 'expandedSize',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'full'",
        description: 'Size of the expanded view.',
      },
      {
        name: 'expandLabel',
        type: 'string',
        default: "'Expand'",
        description:
          "Start of the expand button's name, followed by the title.",
      },
      {
        name: 'headingLevel',
        type: '2 – 6',
        default: '3',
        description: "The default title's element; it doesn't change the size.",
      },
      {
        name: 'variant / padding / dividers',
        type: 'TCard props',
        default: "'outline' / 4 / true",
        description: 'The card look.',
      },
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
    summary:
      'A <section> with an optional heading and description above a body column. The heading level never changes its size.',
    props: [
      {
        name: 'title',
        type: 'ReactNode',
        description: 'Heading content; without it no heading renders.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Muted text under the heading.',
      },
      {
        name: 'headingLevel',
        type: '2 – 6',
        default: '2',
        description: 'The heading element (h2–h6), for the document outline.',
      },
      {
        name: 'gap',
        type: SPACE,
        default: '3',
        description: 'Space between the body items.',
      },
      {
        name: 'spacing',
        type: SPACE,
        description: 'Vertical padding of the section.',
      },
      {
        ...asChildProp,
        description: 'Render e.g. an <article>; its children land in the body.',
      },
    ],
    demo: (
      <TSection
        title="Section title"
        description="A short description of the section."
        headingLevel={4}
      >
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
    summary:
      'The top of a page: the largest title, a description and actions that wrap below the text when space runs out.',
    props: [
      { name: 'title', type: 'ReactNode', description: 'The page title.' },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Muted text under the title.',
      },
      {
        name: 'actions',
        type: 'ReactNode',
        description: 'Rendered at the end of the row.',
      },
      {
        name: 'headingLevel',
        type: '1 – 6',
        default: '1',
        description: "The title element; it doesn't change the size.",
      },
      {
        ...asChildProp,
        description:
          'Render e.g. a <div> instead of a <header>; its children go under the description.',
      },
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
    summary:
      'An inset area for filters, settings blocks and similar: lighter than a card, never a shadow.',
    props: [
      {
        name: 'tone',
        type: "'neutral' | 'accent'",
        default: "'neutral'",
        description: 'Surface or accent-subtle background.',
      },
      {
        name: 'padding',
        type: SPACE,
        default: '4',
        description: 'Inner padding.',
      },
      {
        name: 'title',
        type: 'ReactNode',
        description: 'A small title above the content.',
      },
      asChildProp,
    ],
    demo: (
      <TStack gap={3}>
        <TPanel title="Filters">
          <TInline wrap gap={2}>
            <TInput
              size="sm"
              placeholder="Search…"
              aria-label="Search"
              className="w-48"
            />
            <TButton size="sm" variant="soft" label="Apply" />
            <TSpacer />
            <TButton size="sm" variant="ghost" label="Reset" />
          </TInline>
        </TPanel>
        <TPanel tone="accent" padding={3}>
          <span className="text-sm">
            An accent panel for a highlighted note.
          </span>
        </TPanel>
      </TStack>
    ),
    code: `<TPanel title="Filters">
  <TInline wrap gap={2}>…</TInline>
</TPanel>
<TPanel tone="accent" padding={3}>…</TPanel>`,
  },

  // Disclosure
  {
    id: 'tabs',
    name: 'TTabs',
    parts: ['TTabsList', 'TTabsTrigger', 'TTabsContent'],
    group: 'disclosure',
    summary:
      'Tabbed panels (Radix Tabs): each trigger and content pair shares a value. Arrow keys move between tabs. The list has a line or pills look.',
    props: [
      {
        name: 'value / defaultValue / onValueChange',
        type: 'string',
        description: 'The selected tab, controlled or uncontrolled.',
      },
      {
        name: 'activationMode',
        type: "'automatic' | 'manual'",
        default: "'automatic'",
        description: 'Manual: Enter or Space selects a focused tab.',
      },
      {
        name: 'TTabsList variant',
        type: "'line' | 'pills'",
        default: "'line'",
        description: 'An underline, or raised chips on a track.',
      },
      {
        name: 'TTabsTrigger value / disabled',
        type: 'string / boolean',
        description: 'Pairs it with the content of the same value.',
      },
      {
        name: 'TTabsContent value',
        type: 'string',
        description: 'Shown while its tab is selected.',
      },
    ],
    demo: <TabsDemo />,
    code: `<TTabs defaultValue="account">
  <TTabsList variant="pills">
    <TTabsTrigger value="account">Account</TTabsTrigger>
    <TTabsTrigger value="password">Password</TTabsTrigger>
  </TTabsList>
  <TTabsContent value="account">…</TTabsContent>
  <TTabsContent value="password">…</TTabsContent>
</TTabs>`,
  },
  {
    id: 'accordion',
    name: 'TAccordion',
    parts: ['TAccordionItem', 'TAccordionTrigger', 'TAccordionContent'],
    group: 'disclosure',
    summary:
      'Stacked sections that open one at a time or several at once (Radix Accordion). The content animates its height.',
    props: [
      {
        name: 'type',
        type: "'single' | 'multiple'",
        description: 'One section open at a time, or several. Required.',
      },
      {
        name: 'collapsible',
        type: 'boolean',
        default: 'false',
        description: 'With single: clicking the open section closes it.',
      },
      {
        name: 'value / defaultValue / onValueChange',
        type: 'string | string[]',
        description:
          'The open section(s): a string for single, an array for multiple.',
      },
      {
        name: 'TAccordionItem value / disabled',
        type: 'string / boolean',
        description: 'Identifies the section.',
      },
      {
        name: 'TAccordionTrigger',
        type: 'children',
        description: 'The heading text; a chevron follows it.',
      },
      {
        name: 'TAccordionContent',
        type: 'children',
        description:
          'The section body; className goes on its padded inner wrapper.',
      },
    ],
    demo: <AccordionDemo />,
    code: `<TAccordion type="single" collapsible>
  <TAccordionItem value="shipping">
    <TAccordionTrigger>How long does shipping take?</TAccordionTrigger>
    <TAccordionContent>Orders ship within two working days.</TAccordionContent>
  </TAccordionItem>
</TAccordion>`,
  },
  {
    id: 'collapsible',
    name: 'TCollapsible',
    parts: ['TCollapsibleTrigger', 'TCollapsibleContent'],
    group: 'disclosure',
    summary:
      'One section that shows and hides its content (Radix Collapsible). The root and trigger carry no styles; the content animates its height.',
    props: [
      {
        name: 'open / defaultOpen / onOpenChange',
        type: 'boolean / boolean / (open) => void',
        description: 'Open or closed, controlled or uncontrolled.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents toggling.',
      },
      {
        name: 'TCollapsibleTrigger',
        type: 'asChild',
        description: 'Wrap a TButton (or any button) to toggle it.',
      },
      {
        name: 'TCollapsibleContent',
        type: 'children',
        description: 'Shown while open; put padding on an inner element.',
      },
    ],
    demo: <CollapsibleDemo />,
    code: `<TCollapsible open={open} onOpenChange={setOpen}>
  <TCollapsibleTrigger asChild><TButton label="Show all" /></TCollapsibleTrigger>
  <TCollapsibleContent>…</TCollapsibleContent>
</TCollapsible>`,
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
      {
        name: 'open',
        type: 'boolean',
        description: 'TDialog: controlled state; pair it with onOpenChange.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        description: 'TDialog: initial state when uncontrolled.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'TDialog: called when it opens or closes.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'true',
        description: 'TDialog: make the rest of the page inert while open.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description:
          'TDialogContent: maximum width, or full to fill the viewport (no margin, border or radius).',
      },
      {
        name: 'hideClose',
        type: 'boolean',
        default: 'false',
        description: 'TDialogContent: leave out the close button.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Close'",
        description: "TDialogContent: the close button's accessible name.",
      },
      {
        name: 'on…',
        type: 'Radix Content handlers',
        description:
          'TDialogContent: onEscapeKeyDown, onInteractOutside, … (call preventDefault() to keep it open).',
      },
      {
        ...asChildProp,
        description:
          'Trigger, Close, Header, Title, Description, Body, Footer: ' +
          asChildProp.description,
      },
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
    id: 'dropdown-menu',
    name: 'TDropdownMenu',
    parts: [
      'TDropdownMenuTrigger',
      'TDropdownMenuContent',
      'TDropdownMenuItem',
      'TDropdownMenuGroup',
      'TDropdownMenuLabel',
      'TDropdownMenuSeparator',
    ],
    group: 'overlays',
    summary:
      'A list of actions that opens from a button, with menu roles and arrow-key navigation (Radix Dropdown Menu). For a panel of fields, use TPopover.',
    props: [
      {
        name: 'open / defaultOpen / onOpenChange',
        type: 'boolean / boolean / (open) => void',
        description: 'Open or closed, controlled or uncontrolled.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'false',
        description: 'Traps focus and blocks the page behind it.',
      },
      {
        name: 'TDropdownMenuTrigger',
        type: 'asChild',
        description: 'Wrap the button that opens it.',
      },
      {
        name: 'TDropdownMenuContent side / align / sideOffset',
        type: "'bottom' / 'start' / 4",
        description:
          'Placement next to the trigger; it flips when there is no room.',
      },
      {
        name: 'TDropdownMenuItem onSelect',
        type: '(event) => void',
        description:
          'Runs the action, then closes the menu. event.preventDefault() keeps it open.',
      },
      {
        name: 'TDropdownMenuItem tone',
        type: "'neutral' | 'danger'",
        default: "'neutral'",
        description: 'danger for a destructive action.',
      },
      {
        name: 'TDropdownMenuItem disabled',
        type: 'boolean',
        description: 'Skipped by the arrow keys and not selectable.',
      },
      {
        name: 'TDropdownMenuLabel / TDropdownMenuSeparator',
        type: 'children / none',
        description: 'A muted heading, and a line between groups of items.',
      },
    ],
    demo: <DropdownMenuDemo />,
    code: `<TDropdownMenu>
  <TDropdownMenuTrigger asChild><TButton variant="outline" label="Actions" /></TDropdownMenuTrigger>
  <TDropdownMenuContent>
    <TDropdownMenuLabel>Deployment</TDropdownMenuLabel>
    <TDropdownMenuItem onSelect={restart}>Restart</TDropdownMenuItem>
    <TDropdownMenuItem disabled>Promote</TDropdownMenuItem>
    <TDropdownMenuSeparator />
    <TDropdownMenuItem tone="danger" onSelect={remove}>Delete</TDropdownMenuItem>
  </TDropdownMenuContent>
</TDropdownMenu>`,
  },
  {
    id: 'popover',
    name: 'TPopover',
    parts: [
      'TPopoverTrigger',
      'TPopoverContent',
      'TPopoverFooter',
      'TPopoverClose',
    ],
    group: 'overlays',
    summary:
      'A panel that opens from a trigger and holds any components, such as related filters or a short form (Radix Popover). The example adds a notification rule for a backend service; the fields’ own lists open inside it without closing it.',
    props: [
      {
        name: 'open / defaultOpen / onOpenChange',
        type: 'boolean / boolean / (open) => void',
        description: 'Open or closed, controlled or uncontrolled.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'false',
        description: 'Traps focus and blocks the page behind it.',
      },
      {
        name: 'TPopoverTrigger',
        type: 'asChild',
        description: 'Wrap the button that opens it.',
      },
      {
        name: 'TPopoverContent title / description',
        type: 'ReactNode',
        description:
          'A heading and a muted line; they name and describe the popover.',
      },
      {
        name: 'TPopoverContent side / align / sideOffset',
        type: "'bottom' / 'start' / 8",
        description:
          'Placement next to the trigger; it flips when there is no room.',
      },
      {
        name: 'TPopoverContent size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Width: 16, 20 or 26rem.',
      },
      {
        name: 'TPopoverContent hideClose / closeLabel',
        type: "boolean / 'Close'",
        description: 'The close button in the top end corner.',
      },
      {
        name: 'TPopoverContent',
        type: 'children',
        description:
          'Any content: fields, filters, a short form. Without a title, pass aria-label.',
      },
      {
        name: 'TPopoverFooter',
        type: 'children',
        description: 'Right-aligned actions.',
      },
      {
        name: 'TPopoverClose',
        type: 'asChild',
        description: 'Wrap a button that closes it, e.g. Cancel.',
      },
    ],
    demo: <PopoverDemo />,
    code: `<TPopover open={open} onOpenChange={setOpen}>
  <TPopoverTrigger asChild><TButton label="New notification rule" /></TPopoverTrigger>
  <TPopoverContent size="lg" title="New notification rule" description="…">
    {/* TSelect, TRadioGroup, TSlider, TCheckbox, TSwitch, … */}
    <TPopoverFooter>
      <TPopoverClose asChild><TButton variant="ghost" label="Cancel" /></TPopoverClose>
      <TButton label="Save rule" onClick={save} />
    </TPopoverFooter>
  </TPopoverContent>
</TPopover>`,
  },
  {
    id: 'tooltip',
    name: 'TTooltip',
    group: 'overlays',
    summary:
      'A hint on hover (after a delay) and on keyboard focus (Radix Tooltip). The child is the trigger; side and align place it, and it flips when there is no room.',
    props: [
      {
        name: 'content',
        type: 'ReactNode',
        description: 'The tooltip content. Required.',
      },
      {
        name: 'children',
        type: 'ReactElement',
        description:
          'The trigger: one focusable element. Wrap a disabled button in a <span tabIndex={0}>.',
      },
      {
        name: 'side',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'top'",
        description: 'Preferred side; flips when there is no room.',
      },
      {
        name: 'align',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
        description: 'Alignment along that side.',
      },
      {
        name: 'sideOffset',
        type: 'number',
        default: '6',
        description: 'Gap to the trigger, in px.',
      },
      {
        name: 'delayDuration',
        type: 'number',
        default: '300',
        description: 'Hover delay in ms; focus opens it at once.',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        description: 'The pointer towards the trigger.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Renders only the trigger.',
      },
      {
        name: 'open / defaultOpen / onOpenChange',
        type: 'boolean / boolean / (open) => void',
        description: 'Controlled or uncontrolled open state.',
      },
      {
        name: '…content props',
        type: 'Tooltip.Content props',
        description: 'Go on the tooltip content (className, …).',
      },
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
    parts: [
      'TAppShellHeader',
      'TAppShellSidebar',
      'TAppShellMain',
      'TAppShellFooter',
    ],
    group: 'app',
    summary:
      'The page frame for a host app (this shell uses it): sticky header, independently scrolling sidebar, main and footer. Below 48rem of viewport it stacks into one column. Not for use inside a microfrontend.',
    props: [
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        description: 'Narrow sidebar; you decide what it shows.',
      },
      {
        name: 'hasSidebar',
        type: 'boolean',
        default: 'true',
        description: 'Set false when there is no sidebar region.',
      },
      {
        name: 'viewport',
        type: 'boolean',
        default: 'false',
        description: 'At least the viewport height.',
      },
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
          <TAppShellFooter className="text-sm text-fg-muted">
            Footer
          </TAppShellFooter>
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
      "Two columns inside any container (safe in a microfrontend): the sidebar drops above the content when the container gets too narrow. This page's table of contents uses it.",
    props: [
      {
        name: 'side',
        type: "'start' | 'end'",
        default: "'start'",
        description: 'Sidebar side, whatever the DOM order.',
      },
      {
        name: 'sidebarWidth',
        type: 'CSS length',
        default: '16rem',
        description: 'Sidebar width beside the content.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        description: 'Narrow sidebar (4rem); wins over sidebarWidth.',
      },
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
    summary:
      'Two panes side by side in a fixed ratio; they stack when a pane would get narrower than its minimum.',
    props: [
      {
        name: 'ratio',
        type: "'1-1' | '1-2' | '2-1'",
        default: "'1-1'",
        description: 'Width ratio of the panes.',
      },
      {
        name: 'minPaneWidth',
        type: 'CSS length',
        default: '20rem',
        description: 'Narrowest pane before they stack.',
      },
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
    summary:
      'A wrapping group of content-sized items (tags, chips, button groups), with a tighter gap than TInline.',
    props: [
      gapProp('2'),
      alignProp("'center'"),
      justifyProp("'start'"),
      asChildProp,
    ],
    demo: (
      <TCluster>
        {[
          'design',
          'layout',
          'tokens',
          'react',
          'vue',
          'tailwind',
          'radix',
          'federation',
          'a11y',
        ].map((tag) => (
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
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal' | 'both'",
        default: "'vertical'",
        description: 'Which axis scrolls.',
      },
      {
        name: 'maxHeight',
        type: 'CSS length',
        description: 'Height past which the content scrolls.',
      },
      {
        name: 'tabIndex',
        type: 'number',
        default: '0',
        description: 'Your own value wins.',
      },
      asChildProp,
    ],
    demo: (
      <TScrollArea
        maxHeight="9rem"
        role="region"
        aria-label="Example log"
        className="rounded-md border border-line"
      >
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
    summary:
      'A box with a fixed ratio. An img, video, iframe or canvas placed directly inside fills it (cropped to cover).',
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
            <Block className="flex h-full items-center justify-center">
              {ratio}
            </Block>
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
  {
    id: 'image',
    name: 'TImage',
    group: 'media',
    summary:
      'An <img> in a box: an optional ratio, a skeleton while it loads, a fallback image and then fallback content when it fails, and an optional caption. Lazy-loaded and decoded off the main thread by default.',
    props: [
      { name: 'src', type: 'string', description: 'The image.' },
      {
        name: 'alt',
        type: 'string',
        description: "Text alternative. Required: '' for a decorative image.",
      },
      {
        name: 'ratio',
        type: RATIO,
        description:
          'The box’s ratio; the image then fills its width. Without one, the box hugs the image.',
      },
      {
        name: 'fit',
        type: FIT,
        default: "'cover'",
        description: 'How the image fills its box (object-fit).',
      },
      {
        name: 'position',
        type: 'string',
        description:
          "The part kept visible when cropped (object-position), e.g. 'top'.",
      },
      radiusProp,
      borderedProp('false'),
      {
        name: 'placeholder',
        type: "'skeleton' | 'none'",
        default: "'skeleton'",
        description: 'Shown while loading: a pulsing surface, or nothing.',
      },
      {
        name: 'fallbackSrc',
        type: 'string',
        description: 'Tried once when src fails.',
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        description:
          'Shown when the image can’t load. Default: an icon named by alt.',
      },
      captionProp,
      {
        name: 'loading',
        type: "'lazy' | 'eager'",
        default: "'lazy'",
        description: 'Native lazy loading.',
      },
      {
        name: 'decoding',
        type: "'async' | 'sync' | 'auto'",
        default: "'async'",
        description: 'Native decoding hint.',
      },
      {
        name: '…props',
        type: 'img props',
        description:
          'srcSet, sizes, width, height, onLoad, onError… go on the <img>.',
      },
      refProp('HTMLImageElement'),
    ],
    demo: (
      <TGrid minChildWidth="12rem" gap={4}>
        <TImage
          src={sampleImage}
          alt="Mountains under a violet sky"
          ratio="4-3"
          radius="md"
          caption="ratio 4-3, cover"
        />
        <TImage
          src={sampleImage}
          alt="Mountains under a violet sky"
          ratio="square"
          fit="contain"
          radius="md"
          bordered
          caption="square, contain, bordered"
        />
        <TImage
          src={sampleImage}
          alt=""
          ratio="square"
          position="right"
          radius="full"
          caption="radius full, position right"
        />
        <TImage
          src={brokenImage}
          fallbackSrc={sampleImage}
          alt="Mountains under a violet sky"
          ratio="4-3"
          radius="md"
          caption="broken src, fallbackSrc"
        />
        <TImage
          src={brokenImage}
          alt="Mountains under a violet sky"
          ratio="4-3"
          radius="md"
          caption="broken, default fallback"
        />
      </TGrid>
    ),
    code: `<TImage src={cover} alt="Team at the offsite" ratio="16-9" radius="md" fallbackSrc={placeholder} caption="Lisbon, 2026" />`,
  },
  {
    id: 'video',
    name: 'TVideo',
    group: 'media',
    summary:
      'A <video> in a box with a fixed ratio, native controls, sources, caption tracks and a fallback over the box when nothing can be played. Autoplay starts muted and is skipped for users who prefer reduced motion.',
    props: [
      ...playbackProps,
      {
        name: 'tracks',
        type: 'TMediaTrack[]',
        description:
          '{ src, kind?, srcLang?, label?, default? }: captions, subtitles, chapters (WebVTT).',
      },
      {
        name: 'ratio',
        type: RATIO,
        default: "'16-9'",
        description: 'The box’s ratio.',
      },
      {
        name: 'fit',
        type: FIT,
        default: "'contain'",
        description: 'How the video fills its box (object-fit).',
      },
      radiusProp,
      borderedProp('false'),
      captionProp,
      {
        name: 'autoPlay',
        type: 'boolean',
        default: 'false',
        description: 'Starts muted; skipped with prefers-reduced-motion.',
      },
      {
        name: 'muted',
        type: 'boolean',
        default: 'false',
        description: 'Starts without sound.',
      },
      {
        name: 'playsInline',
        type: 'boolean',
        default: 'true',
        description: 'Plays inline on iOS instead of full screen.',
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        description: 'Shown over the box when no source plays.',
      },
      {
        name: 'errorLabel',
        type: 'string',
        default: '"This video can\'t be played"',
        description: 'The default fallback’s text.',
      },
      {
        name: '…props',
        type: 'video props',
        description: 'poster, loop, onPlay, onTimeUpdate… go on the <video>.',
      },
      refProp('HTMLVideoElement'),
    ],
    demo: (
      <TGrid minChildWidth="16rem" gap={4}>
        <TVideo
          sources={sampleVideoSources}
          radius="md"
          caption="Two sources (WebM, MP4), native controls"
        />
        <TVideo
          sources={sampleVideoSources}
          autoPlay
          loop
          controls={false}
          ratio="square"
          fit="cover"
          radius="md"
          caption="Muted autoplay loop, cover (paused with reduced motion)"
        />
        <TVideo
          src={brokenVideo}
          radius="md"
          bordered
          caption="No playable source"
        />
      </TGrid>
    ),
    code: `<TVideo
  sources={[{ src: '/intro.webm', type: 'video/webm' }, { src: '/intro.mp4', type: 'video/mp4' }]}
  tracks={[{ src: '/intro.en.vtt', kind: 'captions', srcLang: 'en', label: 'English', default: true }]}
  poster="/intro.jpg"
  radius="md"
/>`,
  },
  {
    id: 'audio',
    name: 'TAudio',
    group: 'media',
    summary:
      'An <audio> player with native controls, the width of its container, and a fallback in its place when nothing can be played. Name it with aria-label when no visible text says what it plays.',
    props: [
      ...playbackProps,
      {
        name: 'autoPlay',
        type: 'boolean',
        default: 'false',
        description:
          'Often blocked unless muted; skipped with prefers-reduced-motion.',
      },
      captionProp,
      {
        name: 'fallback',
        type: 'ReactNode',
        description: 'Shown in place of the player when no source plays.',
      },
      {
        name: 'errorLabel',
        type: 'string',
        default: '"This audio can\'t be played"',
        description: 'The default fallback’s text.',
      },
      {
        name: '…props',
        type: 'audio props',
        description:
          'loop, muted, aria-label, onPlay, onEnded… go on the <audio>.',
      },
      refProp('HTMLAudioElement'),
    ],
    demo: <AudioDemo />,
    code: `<TAudio src="/episode-12.mp3" aria-label="Episode 12" caption="Episode 12 · 42 min" onEnded={next} />`,
  },
  {
    id: 'frame',
    name: 'TFrame',
    group: 'media',
    summary:
      'An <iframe> in a box sized by a ratio, a fixed height or its own content, with a spinner until it loads. Lazy-loaded, and sends only the origin as referrer by default.',
    props: [
      { name: 'src', type: 'string', description: 'The page to embed.' },
      {
        name: 'srcDoc',
        type: 'string',
        description: 'Inline HTML to embed instead.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'The frame’s accessible name. Required.',
      },
      {
        name: 'ratio',
        type: RATIO,
        default: "'16-9'",
        description: 'The box’s ratio, unless height or autoHeight applies.',
      },
      {
        name: 'height',
        type: 'string | number',
        description: 'A fixed height instead (a number is pixels).',
      },
      {
        name: 'autoHeight',
        type: 'boolean',
        default: 'false',
        description:
          'Follows the document’s height. Same-origin only (srcDoc, or a same-origin URL); otherwise the ratio applies.',
      },
      {
        name: 'sandbox',
        type: 'boolean | string | string[]',
        description:
          "true: every restriction; or what to allow back, e.g. ['allow-scripts'].",
      },
      {
        name: 'allow',
        type: 'string | string[]',
        description:
          "Permissions policy, e.g. ['fullscreen', 'clipboard-write'].",
      },
      radiusProp,
      borderedProp('true'),
      captionProp,
      {
        name: 'showLoader',
        type: 'boolean',
        default: 'true',
        description: 'A spinner over the box until the frame loads.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        default: "'Loading'",
        description: 'The spinner’s announced label.',
      },
      {
        name: 'loading',
        type: "'lazy' | 'eager'",
        default: "'lazy'",
        description: 'Native lazy loading.',
      },
      {
        name: 'referrerPolicy',
        type: 'ReferrerPolicy',
        default: "'strict-origin-when-cross-origin'",
        description: 'What the embedded page learns about this one.',
      },
      {
        name: '…props',
        type: 'iframe props',
        description: 'name, allowFullScreen, onLoad… go on the <iframe>.',
      },
      refProp('HTMLIFrameElement'),
    ],
    demo: (
      <TGrid minChildWidth="16rem" gap={4}>
        <TFrame
          srcDoc={sampleFrameDoc}
          title="Sandboxed example"
          sandbox
          ratio="4-3"
          radius="md"
          caption="Sandboxed srcDoc, ratio 4-3"
        />
        <TFrame
          srcDoc={growingFrameDoc}
          title="Growing example"
          autoHeight
          radius="md"
          caption="autoHeight: follows its content"
        />
      </TGrid>
    ),
    code: `<TFrame
  src="https://example.com/embed/report"
  title="Quarterly report"
  sandbox={['allow-scripts', 'allow-popups']}
  allow={['fullscreen']}
  ratio="4-3"
  radius="md"
/>`,
  },
  {
    id: 'upload',
    name: 'TUpload',
    group: 'actions',
    summary:
      'A file picker: a drop zone (click, keyboard or drag and drop), checks on type, size and count, a list with thumbnails, and optional uploads with progress, retry and abort. The native input holds the list, so a form submits every file.',
    props: [
      {
        name: 'value / defaultValue',
        type: 'File[]',
        description: 'The listed files.',
      },
      {
        name: 'onValueChange',
        type: '(files: File[]) => void',
        description: 'Called when files are added or removed.',
      },
      {
        name: 'label',
        type: 'string',
        description:
          'Visible label; names the file input. Without one, pass aria-label.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Helper text; replaced by error while one is set.',
      },
      {
        name: 'error',
        type: 'string',
        description: 'Error text: marks the input invalid and is announced.',
      },
      {
        name: 'accept',
        type: 'string | string[]',
        description:
          "MIME types, wildcards or extensions ('image/*', '.pdf'). Dropped files are checked too.",
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description:
          'Several files; otherwise a new file replaces the current one.',
      },
      {
        name: 'maxFiles',
        type: 'number',
        description: 'The most files the list may hold.',
      },
      {
        name: 'maxSize / minSize',
        type: 'number',
        description: 'File size limits, in bytes.',
      },
      {
        name: 'validate',
        type: '(file: File) => string | undefined',
        description: 'Extra check: return a message to reject the file.',
      },
      {
        name: 'formatRejection',
        type: '(rejection: TUploadRejection) => string',
        description: 'The text shown for a rejected file; English by default.',
      },
      {
        name: 'onReject',
        type: '(rejections: TUploadRejection[]) => void',
        description:
          'The files that weren’t added: { file, reason, message? }.',
      },
      {
        name: 'upload',
        type: '(file, { signal, onProgress }) => Promise',
        description:
          'Sends one file. Without it, files are only listed (and submitted with the form).',
      },
      {
        name: 'autoUpload',
        type: 'boolean',
        default: 'true',
        description:
          'Upload when added; otherwise an upload button sends the files.',
      },
      {
        name: 'maxConcurrent',
        type: 'number',
        default: '3',
        description: 'How many files upload at once.',
      },
      {
        name: 'onUploadComplete / onUploadError',
        type: '(file, result | error) => void',
        description: 'Per-file upload outcome.',
      },
      {
        name: 'variant',
        type: "'dropzone' | 'compact'",
        default: "'dropzone'",
        description: 'A large drop zone, or a one-line one for forms.',
      },
      {
        name: 'showList',
        type: 'boolean',
        default: 'true',
        description:
          'The list of files: thumbnail, size, progress, retry, remove.',
      },
      {
        name: 'previews',
        type: 'boolean',
        default: 'true',
        description: 'Thumbnails for images (object URLs, revoked on removal).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'No picking, dropping or removing.',
      },
      {
        name: 'dropLabel / browseLabel',
        type: 'string',
        default: "'Drag and drop files here, or' / 'Browse'",
        description: 'The drop zone’s text.',
      },
      {
        name: 'removeLabel / retryLabel / uploadLabel / uploadedLabel',
        type: 'string',
        default: "'Remove' / 'Retry' / 'Upload' / 'Uploaded'",
        description:
          'Button names (followed by the file name) and the done mark’s name.',
      },
      {
        name: '…props',
        type: 'input props',
        description:
          'name, required, form, capture… go on the native <input type="file">.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLInputElement>',
        description: 'The native input.',
      },
    ],
    demo: (
      <TStack gap={6} className="max-w-lg">
        <TUpload
          label="Photos"
          description="Images or PDF, up to 10 MB each, 5 files at most. A file named …fail… is refused, to show a retry."
          accept="image/*,.pdf"
          multiple
          maxFiles={5}
          maxSize={10_000_000}
          upload={mockUpload}
        />
        <TUpload
          label="Avatar"
          variant="compact"
          accept="image/*"
          name="avatar"
          description="One image; a new one replaces it."
        />
        <TUpload
          label="Attachments"
          multiple
          upload={mockUpload}
          autoUpload={false}
          uploadLabel="Send files"
          description="Uploads when you press the button."
        />
        <TUpload label="Disabled" variant="compact" disabled />
      </TStack>
    ),
    code: `const upload: TUploadFn = (file, { signal, onProgress }) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/files')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100)
    xhr.onload = () => (xhr.status < 300 ? resolve(xhr.response) : reject(new Error(xhr.statusText)))
    xhr.onerror = () => reject(new Error('Network error'))
    signal.addEventListener('abort', () => xhr.abort())
    const body = new FormData()
    body.append('file', file)
    xhr.send(body)
  })

<TUpload value={files} onValueChange={setFiles} label="Photos" accept="image/*" multiple maxSize={10_000_000} upload={upload} />`,
  },
  ...MAP_ENTRIES,
  ...CHART_ENTRIES,
]
