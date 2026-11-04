import { useState } from 'react'
import { avatarInitials } from '../../lib/avatar'
import { cn } from '../../lib/cn'
import { tAvatarImageClasses, tAvatarVariants } from './TAvatar.variants'
import type { TAvatarProps } from './types'

// A picture of a person or thing, falling back to initials without an image or when it fails to load.
export function TAvatar({
  name,
  src,
  size,
  className,
  ...props
}: TAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && src !== failedSrc

  return (
    <span
      role="img"
      aria-label={name}
      data-slot="avatar"
      className={cn(tAvatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className={tAvatarImageClasses}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        avatarInitials(name)
      )}
    </span>
  )
}
