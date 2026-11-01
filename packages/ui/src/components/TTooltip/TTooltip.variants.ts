// The content is portalled to the end of <body>, outside the app's own container: it sets its font and
// colour itself, and z-50 keeps it above the app frame's sticky header. The bubble is inverted (fg on
// canvas swapped), so it stands out in both schemes. It grows out of the trigger's side: each library
// maps its primitive's transform-origin variable onto --t-tooltip-transform-origin. The transition only
// runs on entry (@starting-style), as TDialog's: closing is instant.
export const tTooltipContentClasses = [
  'z-50 m-0 box-border max-w-xs rounded-md bg-fg px-2.5 py-1.5 font-sans text-xs leading-snug text-canvas shadow-lg',
  'origin-(--t-tooltip-transform-origin) transition-[opacity,scale] duration-150 ease-out',
  'starting:scale-95 starting:opacity-0 motion-reduce:transition-none',
].join(' ')
export const tTooltipArrowClasses = 'fill-fg'
