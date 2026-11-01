// The picker's popover: TPopover's content (tPopoverContentVariants) sized by the calendar instead of a
// fixed width, with less padding. It holds the calendar (and a range picker's presets), unframed: the
// popover is the frame. Each library maps its primitive's available-height and transform-origin variables
// onto --t-popover-*, as TPopover does. The field reuses TDateField's classes.
export const tDatePickerContentClasses = [
  'z-50 m-0 box-border flex max-h-(--t-popover-available-height) max-w-[calc(100vw-2rem)] flex-col overflow-y-auto',
  'rounded-lg border border-line bg-canvas p-3 font-sans text-sm text-fg shadow-lg outline-none',
  'origin-(--t-popover-transform-origin) transition-[opacity,scale] duration-150 ease-out',
  'starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
].join(' ')
