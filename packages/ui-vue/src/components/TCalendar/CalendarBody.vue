<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
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
  tCalendarSelectedClasses,
} from './TCalendar.variants'

// The header and the month grids of a single-date calendar, inside a Reka CalendarRoot (TCalendar's own, or
// the one DatePickerCalendar renders). `grid` and `weekDays` are the root's slot props.
defineProps<{
  grid: { value: DateValue; rows: DateValue[][] }[]
  weekDays: string[]
  prevLabel: string
  nextLabel: string
}>()
</script>

<template>
  <div data-slot="calendar-body" :class="tCalendarBodyClasses">
    <CalendarHeader data-slot="calendar-header" :class="tCalendarHeaderClasses">
      <CalendarPrev as-child :aria-label="prevLabel">
        <TButton variant="ghost" size="sm" :class="tCalendarNavClasses">
          <TIcon :icon="ChevronLeft" size="sm" class="rtl:-scale-x-100" />
        </TButton>
      </CalendarPrev>
      <CalendarHeading :class="tCalendarHeadingClasses" />
      <CalendarNext as-child :aria-label="nextLabel">
        <TButton variant="ghost" size="sm" :class="tCalendarNavClasses">
          <TIcon :icon="ChevronRight" size="sm" class="rtl:-scale-x-100" />
        </TButton>
      </CalendarNext>
    </CalendarHeader>
    <div data-slot="calendar-months" :class="tCalendarMonthsClasses">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="tCalendarGridClasses"
      >
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="tCalendarHeadCellClasses"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="week in month.rows" :key="week[0].toString()">
            <CalendarCell
              v-for="day in week"
              :key="day.toString()"
              :date="day"
              :class="tCalendarCellClasses"
            >
              <CalendarCellTrigger
                :day="day"
                :month="month.value"
                :class="
                  cn(tCalendarCellTriggerClasses, tCalendarSelectedClasses)
                "
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </div>
</template>
