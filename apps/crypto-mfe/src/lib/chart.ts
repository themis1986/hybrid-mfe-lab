/** The viewer's own time zone: the chart engine would otherwise label its time axes in UTC. */
export const chartTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
