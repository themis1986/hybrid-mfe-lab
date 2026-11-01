import type { Component } from 'vue'
import AccordionDemo from './demos/AccordionDemo.vue'
import AlarmDemo from './demos/AlarmDemo.vue'
import AppShellDemo from './demos/AppShellDemo.vue'
import AspectRatioDemo from './demos/AspectRatioDemo.vue'
import ButtonDemo from './demos/ButtonDemo.vue'
import CardDemo from './demos/CardDemo.vue'
import CheckboxDemo from './demos/CheckboxDemo.vue'
import ClusterDemo from './demos/ClusterDemo.vue'
import CollapsibleDemo from './demos/CollapsibleDemo.vue'
import ContainerDemo from './demos/ContainerDemo.vue'
import DialogDemo from './demos/DialogDemo.vue'
import DividerDemo from './demos/DividerDemo.vue'
import FieldDemo from './demos/FieldDemo.vue'
import GridDemo from './demos/GridDemo.vue'
import IconDemo from './demos/IconDemo.vue'
import InlineDemo from './demos/InlineDemo.vue'
import InputDemo from './demos/InputDemo.vue'
import PageHeaderDemo from './demos/PageHeaderDemo.vue'
import PanelDemo from './demos/PanelDemo.vue'
import ProgressDemo from './demos/ProgressDemo.vue'
import RadioGroupDemo from './demos/RadioGroupDemo.vue'
import ScrollAreaDemo from './demos/ScrollAreaDemo.vue'
import SectionDemo from './demos/SectionDemo.vue'
import SelectDemo from './demos/SelectDemo.vue'
import SidebarLayoutDemo from './demos/SidebarLayoutDemo.vue'
import SliderDemo from './demos/SliderDemo.vue'
import SpacerDemo from './demos/SpacerDemo.vue'
import SpinnerDemo from './demos/SpinnerDemo.vue'
import SplitDemo from './demos/SplitDemo.vue'
import StackDemo from './demos/StackDemo.vue'
import SwitchDemo from './demos/SwitchDemo.vue'
import TabsDemo from './demos/TabsDemo.vue'
import TextDemo from './demos/TextDemo.vue'
import ToastDemo from './demos/ToastDemo.vue'
import TooltipDemo from './demos/TooltipDemo.vue'
import TreeSelectorDemo from './demos/TreeSelectorDemo.vue'
import WidgetDemo from './demos/WidgetDemo.vue'

export type DocGroupId = 'actions' | 'feedback' | 'icons' | 'primitives' | 'surfaces' | 'disclosure' | 'overlays' | 'app'

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
  { id: 'feedback', label: 'Feedback', description: 'Loading and status indicators.' },
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
  { id: 'disclosure', label: 'Disclosure', description: 'Content shown on demand: tabs, accordions and collapsibles.' },
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
  {
    id: 'checkbox',
    name: 'TCheckbox',
    group: 'actions',
    summary:
      'A checkbox (Reka Checkbox): a <button role="checkbox">, also indeterminate. Name it with a wrapping <label> or aria-label.',
    props: [
      { name: 'v-model', type: "boolean | 'indeterminate'", description: 'The state (modelValue / update:modelValue).' },
      { name: 'defaultValue', type: "boolean | 'indeterminate'", default: 'false', description: 'Initial state when no v-model is bound.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Box size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable or togglable.' },
      { name: 'name / value / required', type: 'string / string / boolean', description: 'Form submission, as a native checkbox.' },
      ...asProps('button'),
    ],
    events: [
      { name: 'update:modelValue', payload: "boolean | 'indeterminate'", description: 'When the user toggles it (v-model).' },
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
      { name: 'v-model', type: 'string', description: "The checked item's value." },
      { name: 'defaultValue', type: 'string', description: 'Initial value when no v-model is bound.' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout (horizontal wraps) and arrow keys.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'For every item; form submission.' },
      { name: 'TRadioGroupItem value', type: 'string', description: 'The group value while this item is checked. Required.' },
      { name: 'TRadioGroupItem size', type: "'sm' | 'md'", default: "'md'", description: 'Circle size.' },
      { name: 'TRadioGroupItem disabled', type: 'boolean', default: 'false', description: 'Disables this item only.' },
      ...asProps('div'),
    ],
    slots: [{ name: 'default', description: 'The TRadioGroupItems, usually each in a <label>.' }],
    events: [{ name: 'update:modelValue', payload: 'string', description: 'When the user checks an item (v-model).' }],
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
      { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]', description: 'The choices. Required.' },
      { name: 'v-model', type: 'string | string[]', description: 'The selected value; an array with multiple.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Several values; the list stays open while toggling.' },
      { name: 'defaultValue', type: 'string | string[]', description: 'Initial value when no v-model is bound.' },
      { name: 'placeholder', type: 'string', description: 'Shown while nothing is selected.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Trigger size, as TInput's." },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'aria-invalid and the error border.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'Native disabled; form submission.' },
      { name: '…attributes', type: 'button attributes', description: 'Go on the trigger: id (for a <label for>), aria-label, class.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string | string[]', description: 'When the selection changes (v-model).' }],
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
        description: '{ value, label, disabled?, children? }; values unique across the tree. A disabled parent disables its subtree. Required.',
      },
      { name: 'v-model', type: 'string | string[]', description: 'The selected leaf; an array with multiple.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Several leaves, with a checkbox per row; the list stays open.' },
      {
        name: 'valueMode',
        type: "'leaves' | 'parents'",
        default: "'leaves'",
        description: 'With multiple: a fully selected parent appears as its leaves, or as the parent itself.',
      },
      { name: 'defaultValue', type: 'string | string[]', description: 'Initial value when no v-model is bound.' },
      { name: 'placeholder', type: 'string', description: 'Shown while nothing is selected.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Trigger size, as TInput's." },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'aria-invalid and the error border.' },
      { name: 'disabled / name / required', type: 'boolean / string / boolean', description: 'Native disabled; form submission.' },
      { name: '…attributes', type: 'button attributes', description: 'Go on the trigger: id (for a <label for>), aria-label, class.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string | string[]', description: 'When the selection changes (v-model).' }],
    demo: TreeSelectorDemo,
    code: `<TTreeSelector v-model="country" :options="regions" aria-label="Country" />
<TTreeSelector v-model="picked" multiple value-mode="parents" :options="regions" aria-label="Regions" />`,
  },

  {
    id: 'text',
    name: 'TText',
    group: 'actions',
    summary:
      'A labelled multi-line text field: a textarea with the input look, a hint or error under it, and a character count with maxLength.',
    props: [
      { name: 'label', type: 'string', description: 'Visible label, linked to the textarea. Required.' },
      { name: 'v-model', type: 'string', description: 'The text.' },
      { name: 'description', type: 'string', description: 'Helper text under the textarea.' },
      { name: 'error', type: 'string', description: 'Error text; replaces the description, marks it invalid and is announced.' },
      { name: 'rows', type: 'number', default: '3', description: 'Visible lines (the minimum with autoResize).' },
      { name: 'autoResize', type: 'boolean', default: 'false', description: 'Grows with its content; maxRows caps it.' },
      { name: 'maxRows', type: 'number', description: 'With autoResize: the height it stops at, in rows.' },
      { name: 'maxLength', type: 'number', description: 'Limits the length and shows a count under the textarea.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Padding and type size, as TInput's." },
      { name: '…attributes', type: 'textarea attributes', description: 'Go on the textarea; class and style go on the root.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string', description: 'On every input (v-model).' }],
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
      { name: 'v-model', type: 'number[]', description: 'One value per thumb.' },
      { name: 'defaultValue', type: 'number[]', description: 'Initial values when no v-model is bound.' },
      { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: 'The range and its step.' },
      { name: 'minStepsBetweenThumbs', type: 'number', default: '0', description: 'How many steps apart a range’s thumbs stay.' },
      { name: 'thumbLabel', type: 'string | string[]', description: 'Names each thumb for assistive technology. Needed.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Vertical fills its container’s height.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Thumb and track size.' },
      { name: 'disabled / name', type: 'boolean / string', description: 'Prevents interaction; form submission.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'number[]', description: 'While dragging or on a key (v-model).' }],
    demo: SliderDemo,
    code: `<TSlider v-model="volume" thumb-label="Volume" />
<TSlider v-model="price" :step="5" :thumb-label="['Minimum', 'Maximum']" />`,
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
      { name: 'alarm.<variant>(title, options?)', type: '(string, TAlarmOptions) => id', description: 'success | error | info | warning. Returns the id for alarm.dismiss(id).' },
      { name: 'options.description', type: 'string', description: 'A second, quieter line.' },
      {
        name: 'options.position',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        description: "The host's position when omitted.",
      },
      { name: 'options.duration', type: 'number', description: "ms before it closes; Infinity keeps it. The host's when omitted." },
      { name: 'options.onClose', type: '() => void', description: 'Called once it closes (timeout, dismiss, swipe).' },
      { name: 'options.action', type: '{ label: string; onClick: () => void }', description: 'A button next to the message, e.g. Retry; clicking it runs onClick and closes the alarm.' },
      { name: 'TAlarmHost position', type: 'TAlarmPosition', default: "'bottom-right'", description: 'The default position.' },
      { name: 'TAlarmHost duration', type: 'number', default: '5000', description: 'The default duration.' },
      { name: 'TAlarmHost label', type: 'string', default: "'Notifications'", description: 'Names the region; F8 focuses it.' },
      { name: 'TAlarm v-model:open', type: 'boolean', description: 'Shown while true; set to false when it closes on its own.' },
      { name: 'TAlarm variant / title / description / position / duration', type: '…', description: 'As alarm.*() and its options; variant defaults to info.' },
    ],
    events: [{ name: 'TAlarm update:open', payload: 'boolean', description: 'false when it times out, is dismissed or swiped.' }],
    demo: AlarmDemo,
    code: `<!-- once, at the app root -->
<TAlarmHost position="bottom-right" />

alarm.success('Profile saved')
alarm.error('Upload failed', { description: 'The file is larger than 10 MB.', position: 'top-center' })

<TAlarm v-model:open="offline" variant="warning" title="You are offline" :duration="Infinity" />`,
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
      { name: '…attributes', type: 'span attributes', description: 'class (text-* tints it), aria-hidden when visible text says it is loading.' },
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
      { name: 'value', type: 'number | null', description: 'The amount done, out of max. null or omitted: indeterminate.' },
      { name: 'max', type: 'number', default: '100', description: 'The total.' },
      { name: 'tone', type: "'accent' | 'success' | 'info' | 'warning' | 'danger'", default: "'accent'", description: 'The bar colour.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '4 or 8px high.' },
      { name: 'getValueLabel', type: '(value, max) => string', description: 'The spoken value; the percentage by default.' },
      { name: 'aria-label', type: 'string', description: 'Names the bar. Needed.' },
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
      { name: 'toast(title, options?)', type: '(string, TAlarmOptions) => id', description: 'The options of alarm.*(): description, position, duration, onClose, action.' },
      { name: 'options.action', type: '{ label: string; onClick: () => void }', description: 'A button next to the message; clicking it runs onClick and closes the toast.' },
      { name: 'TToast v-model:open', type: 'boolean', description: 'Shown while true; false once it closes.' },
      { name: 'TToast title / description / position / duration', type: '…', description: 'As toast() and its options.' },
      { name: 'TToast actionLabel', type: 'string', description: 'Shows the action button; it emits action when clicked.' },
    ],
    events: [{ name: 'action', payload: '', description: 'The action button was clicked.' }, { name: 'update:open', payload: 'boolean', description: 'false once it closes.' }],
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
      'A bordered surface. Its padding is also the gap between the optional header, body and footer, whose dividers span the content width, inset from the edges (or are left out).',
    props: [
      { name: 'variant', type: "'outline' | 'filled' | 'elevated'", default: "'outline'", description: 'Transparent, surface fill, or canvas with a shadow.' },
      { name: 'padding', type: SPACE, default: '4', description: 'Padding and the space between parts. Use this, not a p-* class.' },
      { name: 'dividers', type: 'boolean', default: 'true', description: 'Lines under the header and above the footer; without them the parts are separated by space only.' },
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
      { name: 'title', type: 'string', description: 'Required. Shown in the header by default; names the expand button and the dialog.' },
      { name: 'v-model:expanded', type: 'boolean', description: 'The expanded state (expanded / update:expanded).' },
      { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Initial state when no v-model:expanded is bound.' },
      { name: 'expandedSize', type: "'sm' | 'md' | 'lg' | 'full'", default: "'full'", description: 'Size of the expanded view.' },
      { name: 'expandLabel', type: 'string', default: "'Expand'", description: "Start of the expand button's name, followed by the title." },
      { name: 'headingLevel', type: '2 – 6', default: '3', description: "The default title's element; it doesn't change the size." },
      { name: 'variant / padding / dividers', type: 'TCard props', default: "'outline' / 4 / true", description: 'The card look.' },
      asOnly('div', "The card's root element; the header and body render inside it."),
    ],
    slots: [
      { name: 'header', description: 'Header content instead of the title; the expand button stays at the end.' },
      defaultSlot('The content.'),
      { name: 'expanded-header', description: 'Header of the expanded view. Defaults to the header slot, then the title.' },
      { name: 'expanded-content', description: 'Content of the expanded view. Defaults to the default slot.' },
    ],
    events: [{ name: 'update:expanded', payload: 'boolean', description: 'When the expanded view opens or closes (v-model:expanded).' }],
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
      { name: 'defaultValue', type: 'string', description: 'The tab selected when no v-model is bound.' },
      { name: 'activationMode', type: "'automatic' | 'manual'", default: "'automatic'", description: 'Manual: Enter or Space selects a focused tab.' },
      { name: 'TTabsList variant', type: "'line' | 'pills'", default: "'line'", description: 'An underline, or raised chips on a track.' },
      { name: 'TTabsTrigger value / disabled', type: 'string / boolean', description: 'Pairs it with the content of the same value.' },
      { name: 'TTabsContent value', type: 'string', description: 'Shown while its tab is selected.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string', description: 'When a tab is selected (v-model).' }],
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
      { name: 'type', type: "'single' | 'multiple'", description: 'One section open at a time, or several. Required.' },
      { name: 'collapsible', type: 'boolean', default: 'false', description: 'With single: clicking the open section closes it.' },
      { name: 'v-model', type: 'string | string[]', description: 'The open section(s): a string for single, an array for multiple.' },
      { name: 'defaultValue', type: 'string | string[]', description: 'Open when no v-model is bound.' },
      { name: 'TAccordionItem value / disabled', type: 'string / boolean', description: 'Identifies the section.' },
      { name: 'TAccordionTrigger', type: 'slot', description: 'The heading text; a chevron follows it.' },
      { name: 'TAccordionContent', type: 'slot', description: 'The section body; class goes on its padded inner wrapper.' },
    ],
    events: [{ name: 'update:modelValue', payload: 'string | string[]', description: 'When a section opens or closes (v-model).' }],
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
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Open when first rendered, with no v-model:open.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents toggling.' },
      { name: 'TCollapsibleTrigger', type: 'as-child', description: 'Wrap a TButton (or any button) to toggle it.' },
      { name: 'TCollapsibleContent', type: 'slot', description: 'Shown while open; put padding on an inner element.' },
    ],
    events: [{ name: 'update:open', payload: 'boolean', description: 'When it opens or closes (v-model:open).' }],
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
      { name: 'v-model:open', type: 'boolean', description: 'TDialog: the state (open / update:open).' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'TDialog: initial state when no v-model:open is bound.' },
      { name: 'modal', type: 'boolean', default: 'true', description: 'TDialog: make the rest of the page inert while open.' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: 'TDialogContent: maximum width, or full to fill the viewport (no margin, border or radius).',
      },
      { name: 'hideClose', type: 'boolean', default: 'false', description: 'TDialogContent: leave out the close button.' },
      { name: 'closeLabel', type: 'string', default: "'Close'", description: "TDialogContent: the close button's accessible name." },
      asOnly('div', 'TDialogContent: the content element; its close button stays inside.'),
      {
        name: 'as / asChild',
        type: 'string | Component / boolean',
        description: 'Trigger, Close, Header, Title, Description, Body, Footer (Reka Primitive).',
      },
    ],
    slots: [
      { name: 'TDialog default', description: 'The trigger and the content; receives { open, close }.' },
      { name: 'TDialogContent default', description: 'The header, body and footer parts, or any content.' },
    ],
    events: [
      { name: 'update:open', payload: 'boolean', description: 'TDialog: when it opens or closes (v-model:open).' },
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
    id: 'tooltip',
    name: 'TTooltip',
    group: 'overlays',
    summary:
      'A hint on hover (after a delay) and on keyboard focus (Reka Tooltip). The default slot is the trigger; side and align place it, and it flips when there is no room.',
    props: [
      { name: 'content', type: 'string', description: 'The text. The content slot replaces it for rich content.' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Preferred side; flips when there is no room.' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment along that side.' },
      { name: 'sideOffset', type: 'number', default: '6', description: 'Gap to the trigger, in px.' },
      { name: 'delayDuration', type: 'number', default: '300', description: 'Hover delay in ms; focus opens it at once.' },
      { name: 'arrow', type: 'boolean', default: 'true', description: 'The pointer towards the trigger.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders only the trigger.' },
      { name: 'v-model:open', type: 'boolean', description: 'Controlled open state; defaultOpen when uncontrolled.' },
      { name: '…attributes', type: 'div attributes', description: 'Go on the tooltip content (class, …).' },
    ],
    slots: [
      { name: 'default', description: 'The trigger: one focusable element. Wrap a disabled button in a <span tabindex="0">.' },
      { name: 'content', description: 'Rich content, instead of the content prop.' },
    ],
    events: [{ name: 'update:open', payload: 'boolean', description: 'When it opens or closes (v-model:open).' }],
    demo: TooltipDemo,
    code: `<TTooltip content="Settings" side="right">
  <TButton variant="ghost" aria-label="Settings"><TIcon :icon="Settings" /></TButton>
</TTooltip>`,
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
