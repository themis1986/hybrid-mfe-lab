// A composite of TCard and TDialog: their own classes do the layout, so these are only what the widget adds.

// The header content, beside the expand button. A heading or paragraph placed directly in it takes the
// header's type instead of its UA margins and size (the same reset as TCardHeader, one level down).
export const tWidgetHeaderClasses = [
  'flex min-w-0 flex-1 flex-wrap items-center gap-2',
  '[&>:is(h1,h2,h3,h4,h5,h6,p)]:m-0 [&>:is(h1,h2,h3,h4,h5,h6)]:[font:inherit]',
].join(' ')

// A custom header in the dialog gets the dialog title's type (the title itself is then visually hidden).
export const tWidgetExpandedHeaderClasses = `${tWidgetHeaderClasses} text-lg leading-tight font-semibold`

// Merged onto a ghost TButton: icon only.
export const tWidgetExpandClasses = 'w-8 px-0 text-fg-muted'
