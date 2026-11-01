// The content animates its height between 0 and its measured height (the expand and collapse keyframes
// in @repo/tokens/theme.css). Each library maps its primitive's height variable onto
// --t-collapsible-height; TAccordion's content reuses this string. Padding belongs on an inner element:
// on this one it would show while the height is 0.
export const tCollapsibleContentClasses =
  'overflow-hidden data-[state=open]:animate-expand data-[state=closed]:animate-collapse motion-reduce:animate-none'
