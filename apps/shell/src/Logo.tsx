import { Link } from 'react-router'

// A flask in an accent tile, then the wordmark; the "@" tilts on hover. Token colours, so it follows
// the colour scheme. index.html carries the same mark as the favicon.
export function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5 text-fg no-underline">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <path
          d="M10 20.5h12l1.5 2.4a2 2 0 0 1-1.7 3.1H10.2a2 2 0 0 1-1.7-3.1z"
          className="fill-accent-contrast opacity-45"
        />
        <circle cx="14.5" cy="17.5" r="1.1" className="fill-accent-contrast opacity-80" />
        <circle cx="17.6" cy="15" r="0.8" className="fill-accent-contrast opacity-80" />
        <path
          d="M12.5 6h7M14 6.5v6.2L8.6 22.4A2.4 2.4 0 0 0 10.7 26h10.6a2.4 2.4 0 0 0 2.1-3.6L18 12.7V6.5"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-accent-contrast"
        />
      </svg>
      <span className="text-lg leading-none font-semibold tracking-tight">
        The L
        <span className="inline-block font-mono text-accent-fg transition-transform duration-200 ease-out group-hover:-rotate-12">
          @
        </span>
        b
      </span>
    </Link>
  )
}
