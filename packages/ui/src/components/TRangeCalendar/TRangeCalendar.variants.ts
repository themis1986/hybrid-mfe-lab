// What the range calendar adds to TCalendar's classes (TCalendar.variants.ts). Reka's RangeCalendar sets,
// on each day's trigger, data-selected for every day in the range, data-selection-start and -end on its
// ends, and data-highlighted on the days between the start and the hovered or focused day while the end
// is being picked (the React calendar sets the same ones).

// Merged onto each cell: the band behind the range and its preview, rounded at its ends and at the ends
// of each week. Hidden days outside the month never carry it.
export const tRangeCalendarCellClasses = [
  'has-[[data-selected]:not([data-outside-view])]:bg-accent-subtle',
  'has-[[data-highlighted]:not([data-outside-view])]:bg-accent-subtle',
  'first:rounded-s-md last:rounded-e-md',
  'has-[[data-selection-start]]:rounded-s-md has-[[data-selection-end]]:rounded-e-md',
  'has-[[data-highlighted-start]]:rounded-s-md has-[[data-highlighted-end]]:rounded-e-md',
].join(' ')

// Merged onto each day's trigger: the ends are solid, the days between take the band's colour. Each
// hover repeats the conditions of the base hover (or excludes the ends), so it is the more specific rule.
export const tRangeCalendarCellTriggerClasses = [
  'data-selection-start:bg-accent data-selection-start:font-medium data-selection-start:text-accent-contrast',
  'data-selection-end:bg-accent data-selection-end:font-medium data-selection-end:text-accent-contrast',
  'data-selection-start:not-data-disabled:not-data-unavailable:hover:bg-accent-hover',
  'data-selection-end:not-data-disabled:not-data-unavailable:hover:bg-accent-hover',
  'data-selected:not-data-selection-start:not-data-selection-end:text-accent-fg',
  'data-selected:not-data-selection-start:not-data-selection-end:hover:bg-accent-subtle-hover',
].join(' ')
