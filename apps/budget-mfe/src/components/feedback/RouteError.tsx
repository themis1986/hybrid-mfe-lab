import { TButton } from '@repo/ui'
import { CircleAlert } from '@repo/ui/icons'
import { useRouteError } from 'react-router'
import { Message } from './Message'

/** Shown in place of a page that failed to render, instead of the router's default error screen. */
export function RouteError() {
  const error = useRouteError()
  return (
    <div className="p-4 font-sans text-fg">
      <Message
        icon={CircleAlert}
        tone="danger"
        title="Something went wrong on this page"
        action={
          <TButton variant="outline" label="Reload the page" onClick={() => location.reload()} />
        }
      >
        {error instanceof Error ? error.message : 'An unexpected error happened.'}
      </Message>
    </div>
  )
}
