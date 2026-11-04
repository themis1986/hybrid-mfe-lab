import type { Component } from 'vue'
import AccordionDemo from './demos/AccordionDemo.vue'
import AlarmDemo from './demos/AlarmDemo.vue'
import AppShellDemo from './demos/AppShellDemo.vue'
import AspectRatioDemo from './demos/AspectRatioDemo.vue'
import AudioDemo from './demos/AudioDemo.vue'
import ButtonDemo from './demos/ButtonDemo.vue'
import CalendarDemo from './demos/CalendarDemo.vue'
import CardDemo from './demos/CardDemo.vue'
import CheckboxDemo from './demos/CheckboxDemo.vue'
import ClusterDemo from './demos/ClusterDemo.vue'
import CollapsibleDemo from './demos/CollapsibleDemo.vue'
import ComboboxDemo from './demos/ComboboxDemo.vue'
import ContainerDemo from './demos/ContainerDemo.vue'
import DateFieldDemo from './demos/DateFieldDemo.vue'
import DatePickerDemo from './demos/DatePickerDemo.vue'
import DateRangeFieldDemo from './demos/DateRangeFieldDemo.vue'
import DialogDemo from './demos/DialogDemo.vue'
import DividerDemo from './demos/DividerDemo.vue'
import DropdownMenuDemo from './demos/DropdownMenuDemo.vue'
import FieldDemo from './demos/FieldDemo.vue'
import FrameDemo from './demos/FrameDemo.vue'
import GridDemo from './demos/GridDemo.vue'
import IconDemo from './demos/IconDemo.vue'
import ImageDemo from './demos/ImageDemo.vue'
import InlineDemo from './demos/InlineDemo.vue'
import InputDemo from './demos/InputDemo.vue'
import PageHeaderDemo from './demos/PageHeaderDemo.vue'
import PanelDemo from './demos/PanelDemo.vue'
import PaginationDemo from './demos/PaginationDemo.vue'
import PopoverDemo from './demos/PopoverDemo.vue'
import ProgressDemo from './demos/ProgressDemo.vue'
import RadioGroupDemo from './demos/RadioGroupDemo.vue'
import RangeCalendarDemo from './demos/RangeCalendarDemo.vue'
import RangeDatePickerDemo from './demos/RangeDatePickerDemo.vue'
import ScrollAreaDemo from './demos/ScrollAreaDemo.vue'
import SectionDemo from './demos/SectionDemo.vue'
import SelectDemo from './demos/SelectDemo.vue'
import SidebarLayoutDemo from './demos/SidebarLayoutDemo.vue'
import SliderDemo from './demos/SliderDemo.vue'
import SpacerDemo from './demos/SpacerDemo.vue'
import AvatarDemo from './demos/AvatarDemo.vue'
import BadgeDemo from './demos/BadgeDemo.vue'
import SkeletonDemo from './demos/SkeletonDemo.vue'
import SpinnerDemo from './demos/SpinnerDemo.vue'
import SplitDemo from './demos/SplitDemo.vue'
import StackDemo from './demos/StackDemo.vue'
import SwitchDemo from './demos/SwitchDemo.vue'
import TabsDemo from './demos/TabsDemo.vue'
import TextDemo from './demos/TextDemo.vue'
import TimeFieldDemo from './demos/TimeFieldDemo.vue'
import ToastDemo from './demos/ToastDemo.vue'
import TooltipDemo from './demos/TooltipDemo.vue'
import TreeSelectorDemo from './demos/TreeSelectorDemo.vue'
import UploadDemo from './demos/UploadDemo.vue'
import VideoDemo from './demos/VideoDemo.vue'
import WidgetDemo from './demos/WidgetDemo.vue'
import { CHART_ENTRIES } from './charts'
import { TABLE_ENTRIES } from './tables'
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
  | 'tables'
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
  slots?: { name: string; description: string }[]
  events?: { name: string; payload: string; description: string }[]
  /** A live example; left out where one per group is enough. */
  demo?: Component
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
      "The design system's icon set (Lucide), imported from '@repo/ui-vue/icons'.",
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
      "Mapbox GL JS maps, markers and layers, imported from '@repo/ui-vue/map'. Each map needs a public Mapbox token.",
  },
  {
    id: 'charts',
    label: 'Charts',
    description:
      "Highcharts charts, imported from '@repo/ui-vue/charts'. Highcharts is free for personal and educational use only; other use needs a Highcharts license.",
  },
  {
    id: 'tables',
    label: 'Tables',
    description:
      "A data table on TanStack Table and TanStack Virtual, imported from '@repo/ui-vue/table'.",
  },
  {
    id: 'app',
    label: 'App-level layout',
    description:
      'Page frames, two-pane layouts, wrapping groups, scrolling and media boxes.',
  },
]

// Props shared by many components. In templates, write them in kebab-case (min-child-width).
const SPACE = '0 – 8'
const asProps = (fallback: string): DocProp[] => [
  {
    name: 'as',
    type: 'string | Component',
    default: `'${fallback}'`,
    description: 'The element or component to render.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description:
      'Render the single slotted child instead (Reka Primitive), merging the classes and attributes onto it.',
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

// The media components' shared props and slots. `class` and `style` go on the root; every other attribute
// and listener on the native element.
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
  type: 'string',
  description:
    'Shown under the media (or the caption slot); the root becomes a <figure>.',
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
const captionSlot = {
  name: 'caption',
  description: 'Caption content instead of the caption prop.',
}
const mediaEvents = [
  {
    name: 'play, pause, ended, timeupdate…',
    payload: 'Event',
    description: 'Native media events, bound on the element.',
  },
]
const exposeNote = (element: string): DocProp => ({
  name: 'ref → element',
  type: element,
  description: 'Exposed: the native element, e.g. to call play() or pause().',
})

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
    name: '…attributes',
    type: 'attributes',
    description:
      'Go on the field (role group): aria-label or aria-labelledby names it.',
  },
]
// A picker takes the calendar's props and the field's; these are the field's that the calendar's don't repeat.
const pickerFieldProps = fieldProps.filter(
  (prop) => !['locale', 'disabled / readonly'].includes(prop.name),
)
const pickerProps: DocProp[] = [
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

export const DOC_ENTRIES: DocEntry[] = [
  // Actions & inputs
  {
    id: 'button',
    name: 'TButton',
    group: 'actions',
    summary:
      'A native <button> in five variants and three sizes. With as-child it styles a link instead.',
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
        description: 'Text content when the default slot is empty.',
      },
      ...asProps('button'),
    ],
    slots: [defaultSlot('The button content.')],
    events: [
      {
        name: 'click',
        payload: 'MouseEvent',
        description: 'Native; not fired while disabled.',
      },
    ],
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
    summary:
      'A styled native <input> with v-model. Pair it with your own <label>, or use TField.',
    props: [
      {
        name: 'v-model',
        type: 'string',
        description: 'The value (modelValue / update:modelValue).',
      },
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
        name: '…attributes',
        type: 'input attributes',
        description: 'placeholder, type, disabled, native listeners, …',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string',
        description: 'On every input (v-model).',
      },
    ],
    demo: InputDemo,
    code: `<TInput v-model="query" placeholder="Search…" />
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
        name: 'v-model',
        type: 'string',
        description: 'Passed through to the input.',
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
        name: 'id',
        type: 'string',
        description: "The input's id; generated with useId() when omitted.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Input size.',
      },
      {
        name: '…attributes',
        type: 'input attributes',
        description: 'Go on the input; class and style go on the root.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string',
        description: 'On every input (v-model).',
      },
    ],
    demo: FieldDemo,
    code: `<TField v-model="email" label="Email" description="We never share it." />
<TField v-model="username" label="Username" :error="error" />
<TField v-model="password" label="Password" type="password" />`,
  },
  {
    id: 'switch',
    name: 'TSwitch',
    group: 'actions',
    summary:
      'An on/off toggle (Reka Switch): a <button role="switch">. Name it with a wrapping <label> or aria-label.',
    props: [
      {
        name: 'v-model',
        type: 'boolean',
        description: 'The state (modelValue / update:modelValue).',
      },
      {
        name: 'defaultValue',
        type: 'boolean',
        default: 'false',
        description: 'Initial state when no v-model is bound.',
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
      ...asProps('button'),
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'boolean',
        description: 'When the user toggles it (v-model).',
      },
    ],
    demo: SwitchDemo,
    code: `<TSwitch v-model="enabled" aria-label="Notifications" />
<label>
  <TSwitch :default-value="true" size="sm" /> Remember me
</label>`,
  },
  {
    id: 'checkbox',
    name: 'TCheckbox',
    group: 'actions',
    summary:
      'A checkbox (Reka Checkbox): a <button role="checkbox">, also indeterminate. Name it with a wrapping <label> or aria-label.',
    props: [
      {
        name: 'v-model',
        type: "boolean | 'indeterminate'",
        description: 'The state (modelValue / update:modelValue).',
      },
      {
        name: 'defaultValue',
        type: "boolean | 'indeterminate'",
        default: 'false',
        description: 'Initial state when no v-model is bound.',
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
      ...asProps('button'),
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: "boolean | 'indeterminate'",
        description: 'When the user toggles it (v-model).',
      },
    ],
    demo: CheckboxDemo,
    code: `<label>
  <TCheckbox v-model="accepted" /> I accept the terms
</label>
<TCheckbox :default-value="'indeterminate'" aria-label="Select all" />`,
  },
  {
    id: 'radio-group',
    name: 'TRadioGroup',
    parts: ['TRadioGroupItem'],
    group: 'actions',
    summary:
      'A set of radio buttons (Reka RadioGroup): one value, arrow keys move it. Name the group with aria-label, each item with a <label>.',
    props: [
      {
        name: 'v-model',
        type: 'string',
        description: "The checked item's value.",
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial value when no v-model is bound.',
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
      ...asProps('div'),
    ],
    slots: [
      {
        name: 'default',
        description: 'The TRadioGroupItems, usually each in a <label>.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string',
        description: 'When the user checks an item (v-model).',
      },
    ],
    demo: RadioGroupDemo,
    code: `<TRadioGroup v-model="plan" aria-label="Plan">
  <label><TRadioGroupItem value="monthly" /> Monthly</label>
  <label><TRadioGroupItem value="yearly" /> Yearly</label>
</TRadioGroup>`,
  },
  {
    id: 'select',
    name: 'TSelect',
    group: 'actions',
    summary:
      'A select over a list of options (Reka Select), single or multiple. Options show a radio (single) or a checkbox (multiple).',
    props: [
      {
        name: 'options',
        type: '{ value: string; label: string; disabled?: boolean }[]',
        description: 'The choices. Required.',
      },
      {
        name: 'v-model',
        type: 'string | string[]',
        description: 'The selected value; an array with multiple.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: 'Several values; the list stays open while toggling.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Initial value when no v-model is bound.',
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
        name: '…attributes',
        type: 'button attributes',
        description:
          'Go on the trigger: id (for a <label for>), aria-label, class.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | string[]',
        description: 'When the selection changes (v-model).',
      },
    ],
    demo: SelectDemo,
    code: `<TSelect v-model="fruit" :options="fruits" placeholder="Pick a fruit" aria-label="Fruit" />
<TSelect v-model="basket" multiple :options="fruits" aria-label="Basket" />`,
  },
  {
    id: 'tree-selector',
    name: 'TTreeSelector',
    group: 'actions',
    summary:
      'A select whose options are a tree (Reka Popover + Tree). Single picks one leaf; with multiple, a parent selects or clears its whole subtree and shows a partial state.',
    props: [
      {
        name: 'options',
        type: 'TTreeNode[]',
        description:
          '{ value, label, disabled?, children? }; values unique across the tree. A disabled parent disables its subtree. Required.',
      },
      {
        name: 'v-model',
        type: 'string | string[]',
        description: 'The selected leaf; an array with multiple.',
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
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Initial value when no v-model is bound.',
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
        name: '…attributes',
        type: 'button attributes',
        description:
          'Go on the trigger: id (for a <label for>), aria-label, class.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | string[]',
        description: 'When the selection changes (v-model).',
      },
    ],
    demo: TreeSelectorDemo,
    code: `<TTreeSelector v-model="country" :options="regions" aria-label="Country" />
<TTreeSelector v-model="picked" multiple value-mode="parents" :options="regions" aria-label="Regions" />`,
  },

  {
    id: 'combobox',
    name: 'TCombobox',
    group: 'actions',
    summary:
      'A text field that filters a list of options as you type (Reka Combobox), single or multiple. Matching ignores case and accents; with multiple, the selected options are chips in the field.',
    props: [
      {
        name: 'options',
        type: '{ value: string; label: string; disabled?: boolean }[]',
        description: 'The choices; the label is what typing matches. Required.',
      },
      {
        name: 'v-model',
        type: 'string | string[]',
        description: 'The selected value; an array with multiple.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description:
          'Several values, shown as chips; the list stays open while toggling.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Initial value when no v-model is bound.',
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
        name: '…attributes',
        type: 'input attributes',
        description:
          'Go on the input (id for a <label for>, aria-label); class and style go on the field.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | string[]',
        description: 'When the selection changes (v-model).',
      },
    ],
    demo: ComboboxDemo,
    code: `<TCombobox v-model="zone" :options="timeZones" placeholder="Search time zones…" aria-label="Time zone" />
<TCombobox v-model="watched" multiple :options="services" aria-label="Services to watch" />`,
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
      { name: 'v-model', type: 'string', description: 'The text.' },
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
        name: '…attributes',
        type: 'textarea attributes',
        description: 'Go on the textarea; class and style go on the root.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string',
        description: 'On every input (v-model).',
      },
    ],
    demo: TextDemo,
    code: `<TText v-model="bio" label="Bio" :max-length="160" />
<TText v-model="note" label="Notes" auto-resize :max-rows="8" />`,
  },
  {
    id: 'slider',
    name: 'TSlider',
    group: 'actions',
    summary:
      'A slider (Reka Slider). The value is an array with one entry per thumb: [50] picks one value, [20, 80] a range.',
    props: [
      {
        name: 'v-model',
        type: 'number[]',
        description: 'One value per thumb.',
      },
      {
        name: 'defaultValue',
        type: 'number[]',
        description: 'Initial values when no v-model is bound.',
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
    events: [
      {
        name: 'update:modelValue',
        payload: 'number[]',
        description: 'While dragging or on a key (v-model).',
      },
    ],
    demo: SliderDemo,
    code: `<TSlider v-model="volume" thumb-label="Volume" />
<TSlider v-model="price" :step="5" :thumb-label="['Minimum', 'Maximum']" />`,
  },
  {
    id: 'pagination',
    name: 'TPagination',
    group: 'actions',
    summary:
      'Page navigation with numbered buttons, previous and next, and ellipses for long ranges (Reka Pagination).',
    props: [
      {
        name: 'v-model:page',
        type: 'number',
        description:
          'The current page, from 1; defaultPage when uncontrolled. A page past the end shows as the last one and nothing is reported, so clamp your own data when the total shrinks.',
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
          'Always show the first and last page, with an ellipsis for any gap. Turn it off with :show-edges="false".',
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
      {
        name: 'as',
        type: 'AsTag | Component',
        default: "'nav'",
        description: 'The element or component to render.',
      },
    ],
    events: [
      {
        name: 'update:page',
        payload: 'number',
        description: 'When the user picks another page (v-model:page).',
      },
    ],
    demo: PaginationDemo,
    code: `<TPagination v-model:page="page" :total="240" :items-per-page="20" />
<TPagination :default-page="12" :total="480" :items-per-page="20" show-first-last />`,
  },

  // Dates & time
  {
    id: 'calendar',
    name: 'TCalendar',
    group: 'dates',
    summary:
      'A month grid that picks one date (Reka Calendar). Arrow keys move by day and week, Page Up/Down by month (with Shift, by year), Home/End to the week’s ends.',
    props: [
      {
        name: 'v-model',
        type: 'string',
        description: "The picked date, an ISO date ('2026-11-01').",
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial date when no v-model is bound.',
      },
      ...calendarProps,
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | undefined',
        description: 'When a date is picked (v-model).',
      },
    ],
    demo: CalendarDemo,
    code: `<TCalendar v-model="date" label="Date" />
<TCalendar v-model="day" :min="today" :is-date-unavailable="isWeekend" :week-starts-on="1" />`,
  },
  {
    id: 'range-calendar',
    name: 'TRangeCalendar',
    group: 'dates',
    summary:
      'A month grid that picks a range (Reka RangeCalendar): the first pick sets the start, the days up to the pointer are previewed, the second sets the end. The value changes only once both ends are picked; Escape while picking returns to the last range.',
    props: [
      {
        name: 'v-model',
        type: '{ start: string; end: string }',
        description: 'The range, in ISO dates.',
      },
      {
        name: 'defaultValue',
        type: '{ start: string; end: string }',
        description: 'Initial range when no v-model is bound.',
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
    events: [
      {
        name: 'update:modelValue',
        payload: '{ start: string; end: string }',
        description: 'When both ends are picked (v-model).',
      },
    ],
    demo: RangeCalendarDemo,
    code: `<TRangeCalendar v-model="range" :presets="defaultRangePresets()" :number-of-months="2" />`,
  },
  {
    id: 'date-field',
    name: 'TDateField',
    group: 'dates',
    summary:
      'A date typed into segments in the locale’s order (Reka DateField). Digits move on by themselves; Arrow Up/Down step a segment, Arrow Left/Right move between them, Backspace clears one.',
    props: [
      {
        name: 'v-model',
        type: 'string',
        description: 'An ISO date; undefined until every segment is filled.',
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial date when no v-model is bound.',
      },
      ...dateLimitProps,
      ...fieldProps,
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | undefined',
        description: 'When the date is complete or cleared (v-model).',
      },
    ],
    demo: DateFieldDemo,
    code: `<TDateField v-model="birthday" aria-labelledby="birthday-label" />`,
  },
  {
    id: 'date-range-field',
    name: 'TDateRangeField',
    group: 'dates',
    summary:
      'A range typed as two dates in one field (Reka DateRangeField), with TDateField’s keys. It submits an ISO interval (2026-11-01/2026-11-07), empty while incomplete.',
    props: [
      {
        name: 'v-model',
        type: '{ start: string; end: string }',
        description: 'The range; it changes once both dates are complete.',
      },
      {
        name: 'defaultValue',
        type: '{ start: string; end: string }',
        description: 'Initial range when no v-model is bound.',
      },
      ...dateLimitProps,
      ...fieldProps,
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: '{ start: string; end: string }',
        description: 'When both dates are complete (v-model).',
      },
    ],
    demo: DateRangeFieldDemo,
    code: `<TDateRangeField v-model="stay" aria-label="Stay" />`,
  },
  {
    id: 'time-field',
    name: 'TTimeField',
    group: 'dates',
    summary:
      'A time of day typed into segments (Reka TimeField), with TDateField’s keys; A or P sets the AM/PM segment.',
    props: [
      {
        name: 'v-model',
        type: 'string',
        description: "An ISO time: '14:30', or '14:30:15' with seconds.",
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial time when no v-model is bound.',
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
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | undefined',
        description: 'When the time is complete or cleared (v-model).',
      },
    ],
    demo: TimeFieldDemo,
    code: `<TTimeField v-model="opens" :hour-cycle="24" aria-label="Opens at" />`,
  },
  {
    id: 'date-picker',
    name: 'TDatePicker',
    group: 'dates',
    summary:
      'A date field with a calendar button (Reka DatePicker): type the date, or open the calendar and pick it there. The calendar closes once a date is picked.',
    props: [
      { name: 'v-model', type: 'string', description: 'An ISO date.' },
      {
        name: 'v-model:open',
        type: 'boolean',
        description: 'Whether the calendar is open.',
      },
      {
        name: 'defaultValue / defaultOpen',
        type: 'string / boolean',
        description: 'Initial values when no v-model is bound.',
      },
      ...pickerProps,
      ...calendarProps,
      ...pickerFieldProps,
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | undefined',
        description: 'When the date changes (v-model).',
      },
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When the calendar opens or closes.',
      },
    ],
    demo: DatePickerDemo,
    code: `<TDatePicker v-model="due" name="due" required aria-label="Due date" />`,
  },
  {
    id: 'range-date-picker',
    name: 'TRangeDatePicker',
    group: 'dates',
    summary:
      'A range field with a calendar button (Reka DateRangePicker): type both dates, pick the start and end in the calendar, or pick a preset. It submits an ISO interval.',
    props: [
      {
        name: 'v-model',
        type: '{ start: string; end: string }',
        description: 'The range; it changes once both ends are set.',
      },
      {
        name: 'v-model:open',
        type: 'boolean',
        description: 'Whether the calendar is open.',
      },
      {
        name: 'defaultValue / defaultOpen',
        type: '{ start; end } / boolean',
        description: 'Initial values when no v-model is bound.',
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
    events: [
      {
        name: 'update:modelValue',
        payload: '{ start: string; end: string }',
        description: 'When both ends are set (v-model).',
      },
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When the calendar opens or closes.',
      },
    ],
    demo: RangeDatePickerDemo,
    code: `<TRangeDatePicker v-model="period" :presets="defaultRangePresets()" :number-of-months="2" aria-label="Period" />`,
  },

  // Feedback
  {
    id: 'alarm',
    name: 'TAlarm',
    parts: ['TAlarmHost', 'alarm()'],
    group: 'feedback',
    summary:
      'A short message in a corner of the screen (Reka Toast), tinted success, error, info or warning. Mount one TAlarmHost per app; raise alarms with alarm.success(…) and the like, or a declarative TAlarm. Inside the shell, its host shows every app’s alarms.',
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
        name: 'TAlarm v-model:open',
        type: 'boolean',
        description:
          'Shown while true; set to false when it closes on its own.',
      },
      {
        name: 'TAlarm variant / title / description / position / duration',
        type: '…',
        description: 'As alarm.*() and its options; variant defaults to info.',
      },
    ],
    events: [
      {
        name: 'TAlarm update:open',
        payload: 'boolean',
        description: 'false when it times out, is dismissed or swiped.',
      },
    ],
    demo: AlarmDemo,
    code: `<!-- once, at the app root -->
<TAlarmHost position="bottom-right" />

alarm.success('Profile saved')
alarm.error('Upload failed', { description: 'The file is larger than 10 MB.', position: 'top-center' })

<TAlarm v-model:open="offline" variant="warning" title="You are offline" :duration="Infinity" />`,
  },
  {
    id: 'skeleton',
    name: 'TSkeleton',
    group: 'feedback',
    summary:
      'A placeholder for content that is loading, sized through its class. Decorative: announce the loading state elsewhere.',
    props: [
      {
        name: 'shape',
        type: "'text' | 'block' | 'circle'",
        default: "'text'",
        description: 'A line of text, a block filling its parent, or a circle.',
      },
    ],
    demo: SkeletonDemo,
    code: `<TSkeleton class="w-2/3" />`,
  },
  {
    id: 'badge',
    name: 'TBadge',
    group: 'feedback',
    summary:
      'A short status or category label. The tone only reinforces the text, so the text must say it all.',
    props: [
      {
        name: 'tone',
        type: "'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'The colour.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'sm'",
        description: 'Height and text size.',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Text content, when there is no other content.',
      },
    ],
    demo: BadgeDemo,
    code: `<TBadge tone="success">Active</TBadge>`,
  },
  {
    id: 'avatar',
    name: 'TAvatar',
    group: 'feedback',
    summary:
      'A picture of a person or thing, falling back to initials without an image or when it fails to load.',
    props: [
      {
        name: 'name',
        type: 'string',
        description: 'The accessible name, and the initials without an image.',
      },
      { name: 'src', type: 'string', description: 'The image.' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 40px.',
      },
    ],
    demo: AvatarDemo,
    code: `<TAvatar name="Ada Lovelace" :src="photo" />`,
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
        name: '…attributes',
        type: 'span attributes',
        description:
          'class (text-* tints it), aria-hidden when visible text says it is loading.',
      },
    ],
    demo: SpinnerDemo,
    code: `<TSpinner />
<TSpinner size="xl" label="Loading the report" />
<TButton disabled>
  <TSpinner size="sm" aria-hidden="true" class="text-current" /> Saving…
</TButton>`,
  },

  {
    id: 'progress',
    name: 'TProgress',
    group: 'feedback',
    summary:
      'A progress bar (Reka Progress), tinted by tone. Without a value it is indeterminate: a bar sliding across.',
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
    demo: ProgressDemo,
    code: `<TProgress :value="35" aria-label="Upload" />
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
        name: 'TToast v-model:open',
        type: 'boolean',
        description: 'Shown while true; false once it closes.',
      },
      {
        name: 'TToast title / description / position / duration',
        type: '…',
        description: 'As toast() and its options.',
      },
      {
        name: 'TToast actionLabel',
        type: 'string',
        description: 'Shows the action button; it emits action when clicked.',
      },
    ],
    events: [
      {
        name: 'action',
        payload: '',
        description: 'The action button was clicked.',
      },
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'false once it closes.',
      },
    ],
    demo: ToastDemo,
    code: `toast('Deleted “Welcome aboard”', { action: { label: 'Undo', onClick: restore } })

<TToast v-model:open="reminder" title="Reminder set" action-label="Change" @action="edit" />`,
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
        type: 'Component',
        description: "The icon, imported from '@repo/ui-vue/icons'. Required.",
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
        name: '…attributes',
        type: 'SVG attributes',
        description: 'stroke-width, class (text-* tints it), …',
      },
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
    summary:
      'A vertical flex column with a gap: the default way to space things top to bottom.',
    props: [
      gapProp('3'),
      alignProp("'stretch'"),
      justifyProp(),
      ...asProps('div'),
    ],
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
        description: 'Auto-fit columns at least this wide; wins over cols.',
      },
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
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'lg'",
        description: '640, 960 or 1200px, or no max width.',
      },
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
    summary:
      'Takes the free space in a flex row or column, pushing what follows to the end.',
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
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Vertical also sets aria-orientation.',
      },
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
</TCard>
<TCard :dividers="false">…</TCard>`,
  },
  {
    id: 'widget',
    name: 'TWidget',
    group: 'surfaces',
    summary:
      'A card with a header, content and an expand button that opens an expanded view in a TDialog (full screen by default). The expanded slots fall back to the normal ones; a fallback renders the content a second time, as a separate instance.',
    props: [
      {
        name: 'title',
        type: 'string',
        description:
          'Required. Shown in the header by default; names the expand button and the dialog.',
      },
      {
        name: 'v-model:expanded',
        type: 'boolean',
        description: 'The expanded state (expanded / update:expanded).',
      },
      {
        name: 'defaultExpanded',
        type: 'boolean',
        default: 'false',
        description: 'Initial state when no v-model:expanded is bound.',
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
      asOnly(
        'div',
        "The card's root element; the header and body render inside it.",
      ),
    ],
    slots: [
      {
        name: 'header',
        description:
          'Header content instead of the title; the expand button stays at the end.',
      },
      defaultSlot('The content.'),
      {
        name: 'expanded-header',
        description:
          'Header of the expanded view. Defaults to the header slot, then the title.',
      },
      {
        name: 'expanded-content',
        description:
          'Content of the expanded view. Defaults to the default slot.',
      },
    ],
    events: [
      {
        name: 'update:expanded',
        payload: 'boolean',
        description:
          'When the expanded view opens or closes (v-model:expanded).',
      },
    ],
    demo: WidgetDemo,
    code: `<TWidget v-model:expanded="expanded" title="Sales">
  <template #header>
    <h3>Sales</h3>
    <Tag>+12%</Tag>
  </template>
  <OrderSummary />
  <template #expanded-content>
    <OrderTable />
  </template>
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
        type: 'string',
        description:
          'Heading text; without it (or its slot) no heading renders.',
      },
      {
        name: 'description',
        type: 'string',
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
      asOnly(
        'section',
        'The root element, e.g. article. The heading and body render inside it.',
      ),
    ],
    slots: [
      defaultSlot('The body.'),
      {
        name: 'title',
        description: 'Rich heading content, instead of the title prop.',
      },
      {
        name: 'description',
        description: 'Rich description, instead of the prop.',
      },
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
    summary:
      'The top of a page: the largest title, a description and actions that wrap below the text when space runs out.',
    props: [
      { name: 'title', type: 'string', description: 'The page title.' },
      {
        name: 'description',
        type: 'string',
        description: 'Muted text under the title.',
      },
      {
        name: 'headingLevel',
        type: '1 – 6',
        default: '1',
        description: "The title element; it doesn't change the size.",
      },
      asOnly('header', 'The root element, e.g. div.'),
    ],
    slots: [
      { name: 'actions', description: 'Rendered at the end of the row.' },
      defaultSlot('Extra content under the description.'),
      {
        name: 'title',
        description: 'Rich title content, instead of the prop.',
      },
      {
        name: 'description',
        description: 'Rich description, instead of the prop.',
      },
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
        type: 'string',
        description: 'A small title above the content.',
      },
      asOnly('div', 'The root element.'),
    ],
    slots: [
      defaultSlot('The content.'),
      {
        name: 'title',
        description: 'Rich title content, instead of the prop.',
      },
    ],
    demo: PanelDemo,
    code: `<TPanel title="Filters">
  <TInline wrap :gap="2">…</TInline>
</TPanel>
<TPanel tone="accent" :padding="3">…</TPanel>`,
  },

  // Disclosure
  {
    id: 'tabs',
    name: 'TTabs',
    parts: ['TTabsList', 'TTabsTrigger', 'TTabsContent'],
    group: 'disclosure',
    summary:
      'Tabbed panels (Reka Tabs): each trigger and content pair shares a value. Arrow keys move between tabs. The list has a line or pills look.',
    props: [
      { name: 'v-model', type: 'string', description: 'The selected tab.' },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'The tab selected when no v-model is bound.',
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
    events: [
      {
        name: 'update:modelValue',
        payload: 'string',
        description: 'When a tab is selected (v-model).',
      },
    ],
    demo: TabsDemo,
    code: `<TTabs v-model="tab">
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
      'Stacked sections that open one at a time or several at once (Reka Accordion). The content animates its height.',
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
        name: 'v-model',
        type: 'string | string[]',
        description:
          'The open section(s): a string for single, an array for multiple.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        description: 'Open when no v-model is bound.',
      },
      {
        name: 'TAccordionItem value / disabled',
        type: 'string / boolean',
        description: 'Identifies the section.',
      },
      {
        name: 'TAccordionTrigger',
        type: 'slot',
        description: 'The heading text; a chevron follows it.',
      },
      {
        name: 'TAccordionContent',
        type: 'slot',
        description:
          'The section body; class goes on its padded inner wrapper.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'string | string[]',
        description: 'When a section opens or closes (v-model).',
      },
    ],
    demo: AccordionDemo,
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
      'One section that shows and hides its content (Reka Collapsible). The root and trigger carry no styles; the content animates its height.',
    props: [
      { name: 'v-model:open', type: 'boolean', description: 'Open or closed.' },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        description: 'Open when first rendered, with no v-model:open.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents toggling.',
      },
      {
        name: 'TCollapsibleTrigger',
        type: 'as-child',
        description: 'Wrap a TButton (or any button) to toggle it.',
      },
      {
        name: 'TCollapsibleContent',
        type: 'slot',
        description: 'Shown while open; put padding on an inner element.',
      },
    ],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When it opens or closes (v-model:open).',
      },
    ],
    demo: CollapsibleDemo,
    code: `<TCollapsible v-model:open="open">
  <TCollapsibleTrigger as-child><TButton label="Show all" /></TCollapsibleTrigger>
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
      'A modal dialog (Reka Dialog): focus is trapped inside, Escape or a click on the overlay closes it, and focus returns to the trigger. The content has a close button; the body scrolls when it is too tall. Always give it a TDialogTitle.',
    props: [
      {
        name: 'v-model:open',
        type: 'boolean',
        description: 'TDialog: the state (open / update:open).',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        description: 'TDialog: initial state when no v-model:open is bound.',
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
      asOnly(
        'div',
        'TDialogContent: the content element; its close button stays inside.',
      ),
      {
        name: 'as / asChild',
        type: 'string | Component / boolean',
        description:
          'Trigger, Close, Header, Title, Description, Body, Footer (Reka Primitive).',
      },
    ],
    slots: [
      {
        name: 'TDialog default',
        description: 'The trigger and the content; receives { open, close }.',
      },
      {
        name: 'TDialogContent default',
        description: 'The header, body and footer parts, or any content.',
      },
    ],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'TDialog: when it opens or closes (v-model:open).',
      },
      {
        name: 'escapeKeyDown / interactOutside',
        payload: 'Event',
        description: 'TDialogContent: call preventDefault() to keep it open.',
      },
    ],
    demo: DialogDemo,
    code: `<TDialog v-model:open="open">
  <TDialogTrigger as-child>
    <TButton label="Edit profile" />
  </TDialogTrigger>
  <TDialogContent>
    <TDialogHeader>
      <TDialogTitle>Edit profile</TDialogTitle>
      <TDialogDescription>…</TDialogDescription>
    </TDialogHeader>
    <TDialogBody>…</TDialogBody>
    <TDialogFooter>
      <TDialogClose as-child>
        <TButton variant="ghost" label="Cancel" />
      </TDialogClose>
      <TButton label="Save" @click="save" />
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
      'A list of actions that opens from a button, with menu roles and arrow-key navigation (Reka Dropdown Menu). For a panel of fields, use TPopover.',
    props: [
      {
        name: 'v-model:open',
        type: 'boolean',
        description: 'Open or closed; defaultOpen when uncontrolled.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'false',
        description: 'Traps focus and blocks the page behind it.',
      },
      {
        name: 'TDropdownMenuTrigger',
        type: 'as-child',
        description: 'Wrap the button that opens it.',
      },
      {
        name: 'TDropdownMenuContent side / align / sideOffset',
        type: "'bottom' / 'start' / 4",
        description:
          'Placement next to the trigger; it flips when there is no room.',
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
        type: 'slot / none',
        description: 'A muted heading, and a line between groups of items.',
      },
    ],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When it opens or closes (v-model:open).',
      },
      {
        name: 'TDropdownMenuItem select',
        payload: 'Event',
        description:
          'Runs the action, then closes the menu. event.preventDefault() keeps it open.',
      },
    ],
    demo: DropdownMenuDemo,
    code: `<TDropdownMenu>
  <TDropdownMenuTrigger as-child><TButton variant="outline" label="Actions" /></TDropdownMenuTrigger>
  <TDropdownMenuContent>
    <TDropdownMenuLabel>Deployment</TDropdownMenuLabel>
    <TDropdownMenuItem @select="restart">Restart</TDropdownMenuItem>
    <TDropdownMenuItem disabled>Promote</TDropdownMenuItem>
    <TDropdownMenuSeparator />
    <TDropdownMenuItem tone="danger" @select="remove">Delete</TDropdownMenuItem>
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
      'A panel that opens from a trigger and holds any components, such as related filters or a short form (Reka Popover). The example adds a notification rule for a backend service; the fields’ own lists open inside it without closing it.',
    props: [
      {
        name: 'v-model:open',
        type: 'boolean',
        description: 'Open or closed; defaultOpen when uncontrolled.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'false',
        description: 'Traps focus and blocks the page behind it.',
      },
      {
        name: 'TPopoverTrigger',
        type: 'as-child',
        description: 'Wrap the button that opens it.',
      },
      {
        name: 'TPopoverContent title / description',
        type: 'string',
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
        type: 'slot',
        description:
          'Any content: fields, filters, a short form. Without a title, pass aria-label.',
      },
      {
        name: 'TPopoverFooter',
        type: 'slot',
        description: 'Right-aligned actions.',
      },
      {
        name: 'TPopoverClose',
        type: 'as-child',
        description: 'Wrap a button that closes it, e.g. Cancel.',
      },
    ],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When it opens or closes (v-model:open).',
      },
    ],
    demo: PopoverDemo,
    code: `<TPopover v-model:open="open">
  <TPopoverTrigger as-child><TButton label="New notification rule" /></TPopoverTrigger>
  <TPopoverContent size="lg" title="New notification rule" description="…">
    <!-- TSelect, TRadioGroup, TSlider, TCheckbox, TSwitch, … -->
    <TPopoverFooter>
      <TPopoverClose as-child><TButton variant="ghost" label="Cancel" /></TPopoverClose>
      <TButton label="Save rule" @click="save" />
    </TPopoverFooter>
  </TPopoverContent>
</TPopover>`,
  },
  {
    id: 'tooltip',
    name: 'TTooltip',
    group: 'overlays',
    summary:
      'A hint on hover (after a delay) and on keyboard focus (Reka Tooltip). The default slot is the trigger; side and align place it, and it flips when there is no room.',
    props: [
      {
        name: 'content',
        type: 'string',
        description: 'The text. The content slot replaces it for rich content.',
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
        name: 'v-model:open',
        type: 'boolean',
        description: 'Controlled open state; defaultOpen when uncontrolled.',
      },
      {
        name: '…attributes',
        type: 'div attributes',
        description: 'Go on the tooltip content (class, …).',
      },
    ],
    slots: [
      {
        name: 'default',
        description:
          'The trigger: one focusable element. Wrap a disabled button in a <span tabindex="0">.',
      },
      {
        name: 'content',
        description: 'Rich content, instead of the content prop.',
      },
    ],
    events: [
      {
        name: 'update:open',
        payload: 'boolean',
        description: 'When it opens or closes (v-model:open).',
      },
    ],
    demo: TooltipDemo,
    code: `<TTooltip content="Settings" side="right">
  <TButton variant="ghost" aria-label="Settings"><TIcon :icon="Settings" /></TButton>
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
      'The page frame for a host app: sticky header, independently scrolling sidebar, main and footer. Below 48rem of viewport it stacks into one column. Not for use inside a microfrontend.',
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
      ...asProps('div'),
    ],
    slots: [
      defaultSlot(
        'The parts: header, sidebar, main, footer (any may be left out).',
      ),
    ],
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
    summary:
      'A wrapping group of content-sized items (tags, chips, button groups), with a tighter gap than TInline.',
    props: [
      gapProp('2'),
      alignProp("'center'"),
      justifyProp("'start'"),
      ...asProps('div'),
    ],
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
        name: 'tabindex',
        type: 'number',
        default: '0',
        description: 'Your own value wins.',
      },
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
    summary:
      'A box with a fixed ratio. An img, video, iframe or canvas placed directly inside fills it (cropped to cover).',
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
        name: '…attributes',
        type: 'attributes',
        description: 'srcset, sizes, width, height… go on the <img>.',
      },
      exposeNote('HTMLImageElement'),
    ],
    slots: [
      {
        name: 'fallback',
        description:
          'Shown when the image can’t load. Default: an icon named by alt.',
      },
      captionSlot,
    ],
    events: [
      {
        name: 'load, error',
        payload: 'Event',
        description: 'Native, from the <img>.',
      },
    ],
    demo: ImageDemo,
    code: `<TImage :src="cover" alt="Team at the offsite" ratio="16-9" radius="md" :fallback-src="placeholder" caption="Lisbon, 2026" />`,
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
        name: 'autoplay',
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
        name: 'playsinline',
        type: 'boolean',
        default: 'true',
        description: 'Plays inline on iOS instead of full screen.',
      },
      {
        name: 'errorLabel',
        type: 'string',
        default: '"This video can\'t be played"',
        description: 'The default fallback’s text.',
      },
      {
        name: '…attributes',
        type: 'attributes',
        description: 'poster, loop, crossorigin… go on the <video>.',
      },
      exposeNote('HTMLVideoElement'),
    ],
    slots: [
      {
        name: 'fallback',
        description: 'Shown over the box when no source plays.',
      },
      captionSlot,
    ],
    events: mediaEvents,
    demo: VideoDemo,
    code: `<TVideo
  :sources="[{ src: '/intro.webm', type: 'video/webm' }, { src: '/intro.mp4', type: 'video/mp4' }]"
  :tracks="[{ src: '/intro.en.vtt', kind: 'captions', srcLang: 'en', label: 'English', default: true }]"
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
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        description:
          'Often blocked unless muted; skipped with prefers-reduced-motion.',
      },
      captionProp,
      {
        name: 'errorLabel',
        type: 'string',
        default: '"This audio can\'t be played"',
        description: 'The default fallback’s text.',
      },
      {
        name: '…attributes',
        type: 'attributes',
        description: 'loop, muted, aria-label… go on the <audio>.',
      },
      exposeNote('HTMLAudioElement'),
    ],
    slots: [
      {
        name: 'fallback',
        description: 'Shown in place of the player when no source plays.',
      },
      captionSlot,
    ],
    events: mediaEvents,
    demo: AudioDemo,
    code: `<TAudio src="/episode-12.mp3" aria-label="Episode 12" caption="Episode 12 · 42 min" @ended="next" />`,
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
        name: 'srcdoc',
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
          'Follows the document’s height. Same-origin only (srcdoc, or a same-origin URL); otherwise the ratio applies.',
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
        name: 'referrerpolicy',
        type: 'ReferrerPolicy',
        default: "'strict-origin-when-cross-origin'",
        description: 'What the embedded page learns about this one.',
      },
      {
        name: '…attributes',
        type: 'attributes',
        description: 'name, allowfullscreen… go on the <iframe>.',
      },
      exposeNote('HTMLIFrameElement'),
    ],
    slots: [captionSlot],
    events: [
      {
        name: 'load',
        payload: 'Event',
        description: 'Native: each time a document loads in the frame.',
      },
    ],
    demo: FrameDemo,
    code: `<TFrame
  src="https://example.com/embed/report"
  title="Quarterly report"
  :sandbox="['allow-scripts', 'allow-popups']"
  :allow="['fullscreen']"
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
      { name: 'v-model', type: 'File[]', description: 'The listed files.' },
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
        name: '…attributes',
        type: 'attributes',
        description:
          'name, required, form, capture… go on the native <input type="file">.',
      },
      {
        name: 'ref → element',
        type: 'HTMLInputElement',
        description: 'Exposed: the native input.',
      },
    ],
    events: [
      {
        name: 'update:modelValue',
        payload: 'File[]',
        description: 'Files added or removed (v-model).',
      },
      {
        name: 'reject',
        payload: 'TUploadRejection[]',
        description:
          'The files that weren’t added: { file, reason, message? }.',
      },
      {
        name: 'upload-complete',
        payload: '(file, result)',
        description: 'A file has uploaded.',
      },
      {
        name: 'upload-error',
        payload: '(file, error)',
        description: 'A file’s upload failed.',
      },
    ],
    demo: UploadDemo,
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

<TUpload v-model="files" label="Photos" accept="image/*" multiple :max-size="10_000_000" :upload="upload" @reject="log" />`,
  },
  ...MAP_ENTRIES,
  ...CHART_ENTRIES,
  ...TABLE_ENTRIES,
]
