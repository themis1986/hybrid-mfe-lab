// The actions wrap below the text when the row runs out of room, and stay right-aligned there.
// min(100%, …) keeps the text column from overflowing a container narrower than its basis.
export const tPageHeaderClasses = 'box-border flex flex-wrap items-start justify-between gap-x-6 gap-y-3'
export const tPageHeaderTextClasses = 'flex min-w-0 flex-[1_1_min(100%,20rem)] flex-col gap-1'
export const tPageHeaderTitleClasses = 'm-0 text-2xl leading-tight font-semibold text-fg'
export const tPageHeaderDescriptionClasses = 'm-0 text-base text-fg-muted'
export const tPageHeaderActionsClasses = 'ms-auto flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2'
