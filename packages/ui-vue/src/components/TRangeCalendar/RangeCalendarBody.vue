<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
} from 'reka-ui'
import { cn } from '../../lib/cn'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tCalendarBodyClasses,
  tCalendarCellClasses,
  tCalendarCellTriggerClasses,
  tCalendarGridClasses,
  tCalendarHeadCellClasses,
  tCalendarHeaderClasses,
  tCalendarHeadingClasses,
  tCalendarMonthsClasses,
  tCalendarNavClasses,
} from '../TCalendar/TCalendar.variants'
import { tRangeCalendarCellClasses, tRangeCalendarCellTriggerClasses } from './TRangeCalendar.variants'

// The header and the month grids of a range calendar, inside a Reka RangeCalendarRoot (TRangeCalendar's own,
// or the one DateRangePickerCalendar renders). `grid` and `weekDays` are the root's slot props.
defineProps<{
  grid: { value: DateValue; rows: DateValue[][] }[]
  weekDays: string[]
  prevLabel: string
  nextLabel: string
}>()
</script>

<template>
  <div data-slot="calendar-body" :class="tCalendarBodyClasses">
    <RangeCalendarHeader data-slot="calendar-header" :class="tCalendarHeaderClasses">
      <RangeCalendarPrev as-child :aria-label="prevLabel">
        <TButton variant="ghost" size="sm" :class="tCalendarNavClasses">
          <TIcon :icon="ChevronLeft" size="sm" class="rtl:-scale-x-100" />
        </TButton>
      </RangeCalendarPrev>
      <RangeCalendarHeading :class="tCalendarHeadingClasses" />
      <RangeCalendarNext as-child :aria-label="nextLabel">
        <TButton variant="ghost" size="sm" :class="tCalendarNavClasses">
          <TIcon :icon="ChevronRight" size="sm" class="rtl:-scale-x-100" />
        </TButton>
      </RangeCalendarNext>
    </RangeCalendarHeader>
    <div data-slot="calendar-months" :class="tCalendarMonthsClasses">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" :class="tCalendarGridClasses">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell v-for="day in weekDays" :key="day" :class="tCalendarHeadCellClasses">
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow v-for="week in month.rows" :key="week[0].toString()">
            <RangeCalendarCell
              v-for="day in week"
              :key="day.toString()"
              :date="day"
              :class="cn(tCalendarCellClasses, tRangeCalendarCellClasses)"
            >
              <RangeCalendarCellTrigger
                :day="day"
                :month="month.value"
                :class="cn(tCalendarCellTriggerClasses, tRangeCalendarCellTriggerClasses)"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </div>
</template>
