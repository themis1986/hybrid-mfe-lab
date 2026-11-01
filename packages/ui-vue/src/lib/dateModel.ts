import type { DateRange } from 'reka-ui'
import { type Ref, type ShallowRef, shallowRef, watch } from 'vue'
import { parseIsoRange, type TDateRange, toIsoDate } from './date'

type IsoValue = string | TDateRange | undefined

function isSame(a: IsoValue, b: IsoValue) {
  if (typeof a === 'object' && typeof b === 'object')
    return a.start === b.start && a.end === b.end
  return a === b
}

/**
 * Keeps a Reka date component's value (a DateValue, a DateRange or a Time) in step with the component's
 * ISO-string v-model. Reka gets `draft`, and every value it emits goes back into `draft` unchanged, so
 * Reka works on its own objects (a half-typed field or a half-picked range stays as it is). `update` sets
 * the draft and passes its ISO form on to v-model when it differs; a range passes on only complete or
 * cleared values (`toIso` returns `skip` for the rest). A v-model change from outside replaces the draft.
 * Without a v-model, the value starts from `defaultValue` and lives here.
 */
export function useDateModel<Iso extends IsoValue, Reka>(
  model: Ref<Iso | undefined>,
  defaultValue: Iso | undefined,
  toReka: (iso: Iso | undefined) => Reka,
  toIso: (value: Reka) => Iso | undefined | 'skip',
): { draft: ShallowRef<Reka>; update: (value: Reka) => void } {
  let current = model.value ?? defaultValue
  const draft = shallowRef(toReka(current))

  watch(model, (iso) => {
    if (isSame(iso, current)) return
    current = iso
    draft.value = toReka(iso)
  })

  function update(value: Reka) {
    draft.value = value
    const iso = toIso(value)
    if (iso === 'skip' || isSame(iso, current)) return
    current = iso
    model.value = iso
  }

  return { draft, update }
}

/** A range's Reka form; both ends undefined while it is empty or invalid. */
export function rangeToReka(iso: TDateRange | undefined): DateRange {
  return parseIsoRange(iso) ?? { start: undefined, end: undefined }
}

/** A Reka range's ISO form: undefined once cleared, `skip` while only one end is picked. */
export function rangeToIso(
  range: DateRange | null | undefined,
): TDateRange | undefined | 'skip' {
  if (range?.start && range.end)
    return { start: toIsoDate(range.start), end: toIsoDate(range.end) }
  return range?.start || range?.end ? 'skip' : undefined
}
