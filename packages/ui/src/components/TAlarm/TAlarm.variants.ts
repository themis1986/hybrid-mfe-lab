import { cva } from 'class-variance-authority'

// The viewport is the fixed stack at one edge of the screen (Radix/Reka render it as an <ol>). It takes
// pointer events: the primitives pause the timers while the pointer is over it and resume on pointerleave,
// which a pointer-events-none viewport never gets once the alarm under the pointer is gone. Without alarms it
// has no padding (empty:p-0), so it is zero-height and covers nothing. z-60 keeps alarms above the z-50
// overlays (dialogs, popovers). The newest alarm sits nearest the edge (flex-col-reverse at the top).
export const tAlarmViewportVariants = cva(
  'fixed z-60 m-0 box-border flex max-h-dvh w-full max-w-sm list-none gap-2 p-4 outline-none empty:p-0',
  {
    variants: {
      position: {
        'top-left': 'top-0 left-0 flex-col-reverse',
        'top-center': 'top-0 left-1/2 -translate-x-1/2 flex-col-reverse',
        'top-right': 'top-0 right-0 flex-col-reverse',
        'bottom-left': 'bottom-0 left-0 flex-col',
        'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 flex-col',
        'bottom-right': 'bottom-0 right-0 flex-col',
      },
    },
    defaultVariants: { position: 'bottom-right' },
  },
)

// Each alarm is tinted by its status. It sets its font and colour itself: the viewport inherits nothing
// from the app. It appears with a short entry transition (closing is instant), and follows the pointer
// while swiped: each library maps its primitive's swipe variables onto --t-alarm-swipe-x/y. Its padding
// is longhands only (py, ps, pe): an app stylesheet that also has p-3 loads after this one, and its p-3
// would beat a pe-10 override and put the action under the close button.
export const tAlarmVariants = cva(
  [
    'relative m-0 box-border flex w-full items-start gap-3 rounded-lg border py-3 ps-3 pe-10',
    'font-sans text-sm text-fg shadow-lg',
    'transition-[opacity,scale] duration-200 ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
    'data-[swipe=move]:translate-x-(--t-alarm-swipe-x) data-[swipe=move]:translate-y-(--t-alarm-swipe-y)',
    'data-[swipe=move]:transition-none data-[swipe=cancel]:translate-0',
  ],
  {
    variants: {
      variant: {
        success: 'border-success-line bg-success-subtle',
        error: 'border-danger-line bg-danger-subtle',
        info: 'border-info-line bg-info-subtle',
        warning: 'border-warning-line bg-warning-subtle',
        // An untinted toast: no icon either.
        neutral: 'border-line bg-canvas',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

export const tAlarmIconVariants = cva('mt-px', {
  variants: {
    variant: {
      success: 'text-success-fg',
      error: 'text-danger-fg',
      info: 'text-info-fg',
      warning: 'text-warning-fg',
      neutral: '',
    },
  },
  defaultVariants: { variant: 'info' },
})

export const tAlarmBodyClasses = 'flex min-w-0 flex-1 flex-col gap-0.5'
export const tAlarmTitleClasses = 'm-0 font-medium leading-snug'
export const tAlarmDescriptionClasses = 'm-0 leading-snug text-fg-muted'
// Merged onto an outline TButton, between the text and the close button.
export const tAlarmActionClasses = 'shrink-0 self-center'
// Merged onto a ghost TButton.
export const tAlarmCloseClasses =
  'absolute end-2 top-2 h-7 w-7 px-0 text-fg-muted'
