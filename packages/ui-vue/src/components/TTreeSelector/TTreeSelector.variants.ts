// TTreeSelector is TSelect's trigger and list (TSelect.variants) with tree rows. These classes are only what
// the rows add. Reka (Vue) and the React tree both set data-expanded and data-disabled on each row.

// Each row sets --t-tree-level (1 for a root). A level indents by the chevron plus the gap (1.5rem), so a
// child's chevron lines up with its parent's indicator; a root starts at TSelect's item padding (0.5rem).
export const tTreeItemClasses = [
  'group/tree-item relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pe-2 text-sm outline-none select-none',
  'ps-[calc(var(--t-tree-level)*1.5rem-1rem)]',
  'not-data-disabled:hover:bg-accent-subtle focus-visible:bg-accent-subtle',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
].join(' ')
// Clicking the chevron expands or collapses its row without selecting it.
export const tTreeChevronClasses =
  'size-4 shrink-0 text-fg-muted transition-transform duration-150 ease-out group-data-expanded/tree-item:rotate-90'
// Takes the chevron's place on a leaf, so leaves and parents line up.
export const tTreeChevronSpacerClasses = 'size-4 shrink-0'
export const tTreeLabelClasses = 'min-w-0 truncate'
// A parent in single mode can't be chosen: it reads as a heading.
export const tTreeParentLabelClasses = 'font-medium'
