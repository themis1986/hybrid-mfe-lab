import { Maximize2 } from 'lucide-react'
import { TButton } from '../TButton'
import { TCard, TCardBody, TCardHeader } from '../TCard'
import { TDialog, TDialogBody, TDialogContent, TDialogHeader, TDialogTitle, TDialogTrigger } from '../TDialog'
import { TIcon } from '../TIcon'
import { tWidgetExpandClasses, tWidgetExpandedHeaderClasses, tWidgetHeaderClasses } from './TWidget.variants'
import type { TWidgetProps } from './types'

// A card whose expand button opens an expanded view in a dialog (full screen by default). The dialog is
// always named by the title: with a custom header, the title stays there for assistive technology only.
export function TWidget({
  title,
  header,
  children,
  expandedHeader,
  expandedContent,
  expanded,
  defaultExpanded,
  onExpandedChange,
  expandedSize = 'full',
  expandLabel = 'Expand',
  headingLevel = 3,
  variant,
  padding,
  ...props
}: TWidgetProps) {
  const Heading = `h${headingLevel}` as const
  const dialogHeader = expandedHeader ?? header

  return (
    <TDialog open={expanded} defaultOpen={defaultExpanded} onOpenChange={onExpandedChange}>
      <TCard data-slot="widget" variant={variant} padding={padding} {...props}>
        <TCardHeader>
          <div className={tWidgetHeaderClasses}>{header ?? <Heading>{title}</Heading>}</div>
          <TDialogTrigger asChild>
            <TButton variant="ghost" size="sm" aria-label={`${expandLabel} ${title}`} className={tWidgetExpandClasses}>
              <TIcon icon={Maximize2} size="sm" />
            </TButton>
          </TDialogTrigger>
        </TCardHeader>
        <TCardBody>{children}</TCardBody>
      </TCard>
      <TDialogContent size={expandedSize}>
        <TDialogHeader>
          {dialogHeader != null ? (
            <>
              <TDialogTitle className="sr-only">{title}</TDialogTitle>
              <div className={tWidgetExpandedHeaderClasses}>{dialogHeader}</div>
            </>
          ) : (
            <TDialogTitle>{title}</TDialogTitle>
          )}
        </TDialogHeader>
        <TDialogBody>{expandedContent ?? children}</TDialogBody>
      </TDialogContent>
    </TDialog>
  )
}
