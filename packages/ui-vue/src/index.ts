// Pulls the stylesheet into the build: Vite emits it as dist/styles.css (`build.lib.cssFileName`)
// and strips this import from the JavaScript. Apps import '@repo/ui-vue/styles.css' themselves.
import './styles/index.css'

// The same components as @repo/ui, natively in Vue. The class strings in each *.variants.ts are kept
// identical to @repo/ui's, so both libraries look the same: change them in both.
export { TButton } from './components/TButton'
export type { TButtonProps } from './components/TButton'
export { TField } from './components/TField'
export type { TFieldProps } from './components/TField'
export { TInput } from './components/TInput'
export type { TInputProps } from './components/TInput'
export { TSwitch } from './components/TSwitch'
export type { TSwitchProps } from './components/TSwitch'
export { TCheckbox } from './components/TCheckbox'
export type { TCheckboxProps } from './components/TCheckbox'
export { TRadioGroup, TRadioGroupItem } from './components/TRadioGroup'
export type { TRadioGroupItemProps, TRadioGroupProps } from './components/TRadioGroup'
export { TSelect } from './components/TSelect'
export type { TSelectOption, TSelectProps } from './components/TSelect'
export { TIcon } from './components/TIcon'
export type { TIconProps } from './components/TIcon'
export { TStack } from './components/TStack'
export type { TStackProps } from './components/TStack'
export { TInline } from './components/TInline'
export type { TInlineProps } from './components/TInline'
export { TGrid } from './components/TGrid'
export type { TGridProps } from './components/TGrid'
export { TContainer } from './components/TContainer'
export type { TContainerProps } from './components/TContainer'
export { TSpacer } from './components/TSpacer'
export type { TSpacerProps } from './components/TSpacer'
export { TDivider } from './components/TDivider'
export type { TDividerProps } from './components/TDivider'
export { TCard, TCardBody, TCardFooter, TCardHeader } from './components/TCard'
export type { TCardBodyProps, TCardFooterProps, TCardHeaderProps, TCardProps } from './components/TCard'
export { TSection } from './components/TSection'
export type { TSectionProps } from './components/TSection'
export { TPageHeader } from './components/TPageHeader'
export type { TPageHeaderProps } from './components/TPageHeader'
export { TPanel } from './components/TPanel'
export type { TPanelProps } from './components/TPanel'
export { TAppShell, TAppShellFooter, TAppShellHeader, TAppShellMain, TAppShellSidebar } from './components/TAppShell'
export type {
  TAppShellFooterProps,
  TAppShellHeaderProps,
  TAppShellMainProps,
  TAppShellProps,
  TAppShellSidebarProps,
} from './components/TAppShell'
export { TSidebarLayout, TSidebarLayoutContent, TSidebarLayoutSidebar } from './components/TSidebarLayout'
export type {
  TSidebarLayoutContentProps,
  TSidebarLayoutProps,
  TSidebarLayoutSidebarProps,
} from './components/TSidebarLayout'
export { TSplit } from './components/TSplit'
export type { TSplitProps } from './components/TSplit'
export { TCluster } from './components/TCluster'
export type { TClusterProps } from './components/TCluster'
export { TScrollArea } from './components/TScrollArea'
export type { TScrollAreaProps } from './components/TScrollArea'
export { TAspectRatio } from './components/TAspectRatio'
export type { TAspectRatioProps } from './components/TAspectRatio'
export {
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TDialogTrigger,
} from './components/TDialog'
export type {
  TDialogBodyProps,
  TDialogCloseProps,
  TDialogContentProps,
  TDialogDescriptionProps,
  TDialogFooterProps,
  TDialogHeaderProps,
  TDialogProps,
  TDialogTitleProps,
  TDialogTriggerProps,
} from './components/TDialog'
export { TWidget } from './components/TWidget'
export type { TWidgetProps } from './components/TWidget'
