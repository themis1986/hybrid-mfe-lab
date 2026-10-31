import { cva } from 'class-variance-authority'

// Media placed directly inside fills the box and is cropped to it; other children keep their own size.
export const tAspectRatioVariants = cva(
  [
    'box-border',
    '[&>:is(img,video,iframe,canvas)]:block [&>:is(img,video,iframe,canvas)]:size-full',
    '[&>:is(img,video,iframe,canvas)]:object-cover',
  ],
  {
    variants: {
      ratio: {
        square: 'aspect-square',
        '4-3': 'aspect-[4/3]',
        '3-2': 'aspect-[3/2]',
        '16-9': 'aspect-video',
        '21-9': 'aspect-[21/9]',
      },
    },
    defaultVariants: { ratio: 'square' },
  },
)
