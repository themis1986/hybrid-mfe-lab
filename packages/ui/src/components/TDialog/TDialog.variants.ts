import { cva } from 'class-variance-authority'

// The overlay and the content are portalled to the end of <body>, outside the app's own container: they
// inherit nothing from it, so the content sets its font and colour itself. z-50 keeps both above the app
// frame's sticky header. The transitions only run on entry (@starting-style): Radix (React) and Reka
// (Vue) unmount at once when no CSS animation is running, so closing is instant.
export const tDialogOverlayClasses = [
  'fixed inset-0 z-50 bg-overlay',
  'transition-opacity duration-150 ease-out starting:opacity-0 motion-reduce:transition-none',
].join(' ')

// Centred in the viewport, at most its size minus a 1rem margin on each side; a TDialogBody scrolls when
// the content is taller than that. `full` fills the viewport instead: the class string goes through `cn`
// (tailwind-merge), so its inset, translate, width and max-height replace the centring ones above.
export const tDialogContentVariants = cva(
  [
    'fixed top-1/2 left-1/2 z-50 m-0 box-border flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
    'max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] rounded-lg border border-line bg-canvas p-6',
    'font-sans text-fg shadow-lg outline-none',
    'transition-[opacity,scale] duration-150 ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        full: 'inset-0 max-h-none w-full translate-x-0 translate-y-0 rounded-none border-0',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// The header's end padding keeps its text clear of the close button.
export const tDialogHeaderClasses = 'flex flex-col gap-1.5 pe-8'
export const tDialogTitleClasses = 'm-0 font-sans text-lg leading-tight font-semibold'
export const tDialogDescriptionClasses = 'm-0 text-sm text-fg-muted'
export const tDialogBodyClasses = 'min-h-0 flex-1 overflow-y-auto overscroll-contain'
export const tDialogFooterClasses = 'flex flex-wrap items-center justify-end gap-2'
// Merged onto a ghost TButton.
export const tDialogCloseClasses = 'absolute end-4 top-4 w-8 px-0 text-fg-muted'
