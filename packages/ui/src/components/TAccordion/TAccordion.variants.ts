export const tAccordionItemClasses = 'border-b border-line'
// The header is an <h3> (Radix and Reka): reset its UA margin and type, the trigger sets its own.
export const tAccordionHeaderClasses = 'm-0 flex text-base font-normal'
// No Preflight: the base classes reset the browser's button look. Radix and Reka set data-state="open".
export const tAccordionTriggerClasses = [
  'group/accordion-trigger m-0 flex flex-1 cursor-pointer items-center justify-between gap-4 border-0 bg-transparent',
  'px-0 py-4 text-start font-sans text-sm font-medium text-fg not-disabled:hover:underline',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')
export const tAccordionChevronClasses =
  'size-4 shrink-0 text-fg-muted transition-transform duration-200 ease-out group-data-[state=open]/accordion-trigger:rotate-180'
// The content reuses tCollapsibleContentClasses; this pads an inner wrapper.
export const tAccordionContentInnerClasses = 'pb-4 text-sm'
