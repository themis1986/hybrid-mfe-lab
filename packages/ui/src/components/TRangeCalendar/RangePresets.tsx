import type { TDatePreset, TDateRange } from '../../lib/date'
import { TButton } from '../TButton'
import {
  tCalendarPresetClasses,
  tCalendarPresetsClasses,
} from '../TCalendar/TCalendar.variants'

interface RangePresetsProps {
  presets: TDatePreset[]
  label: string
  value: TDateRange | undefined
  disabled?: boolean
  onSelect: (range: TDateRange) => void
}

// The presets column of a range calendar or range picker. The current range's preset is pressed.
export function RangePresets({
  presets,
  label,
  value,
  disabled,
  onSelect,
}: RangePresetsProps) {
  return (
    <ul
      data-slot="calendar-presets"
      aria-label={label}
      className={tCalendarPresetsClasses}
    >
      {presets.map((preset) => (
        <li key={preset.label}>
          <TButton
            variant="ghost"
            size="sm"
            aria-pressed={
              value?.start === preset.value.start &&
              value?.end === preset.value.end
            }
            disabled={disabled}
            className={tCalendarPresetClasses}
            onClick={() => onSelect(preset.value)}
          >
            {preset.label}
          </TButton>
        </li>
      ))}
    </ul>
  )
}
