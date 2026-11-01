// The combobox's filtering, identical in @repo/ui and @repo/ui-vue: change it in both.

export interface TComboboxOption {
  value: string
  /** Shown in the list, in the input (single) or in a chip (multiple), and matched by the typed text. */
  label: string
  disabled?: boolean
}

// Case- and accent-insensitive, as Reka's own filter (Intl.Collator, sensitivity 'base'): "zur" finds "Zürich".
function fold(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/** The options whose label contains the query; all of them while it is blank. */
export function filterOptions<T extends TComboboxOption>(
  options: readonly T[],
  query: string,
): T[] {
  const needle = fold(query.trim())
  if (!needle) return [...options]
  return options.filter((option) => fold(option.label).includes(needle))
}
