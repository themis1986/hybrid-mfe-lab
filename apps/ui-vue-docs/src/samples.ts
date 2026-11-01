import type { TUploadContext } from '@repo/ui-vue'

// Sample media for the demos. The picture is an inline SVG: no network, and it resolves the same when the
// docs are hosted in the shell. The video and audio are MDN's public CC0 sample files.
const picture = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e63dd"/><stop offset="1" stop-color="#8e4ec6"/></linearGradient></defs>
  <rect width="640" height="400" fill="url(#sky)"/>
  <circle cx="480" cy="120" r="56" fill="#ffe629"/>
  <path d="M0 400 L200 180 L340 320 L440 230 L640 400 Z" fill="#1b1b1f" fill-opacity="0.55"/>
</svg>`

export const sampleImage = `data:image/svg+xml,${encodeURIComponent(picture)}`
export const brokenImage = '/missing-picture.jpg'

export const sampleVideoSources = [
  { src: 'https://mdn.github.io/shared-assets/videos/flower.webm', type: 'video/webm' },
  { src: 'https://mdn.github.io/shared-assets/videos/flower.mp4', type: 'video/mp4' },
]
export const brokenVideo = '/missing-video.mp4'

export const sampleAudio = 'https://mdn.github.io/shared-assets/audio/t-rex-roar.mp3'
export const brokenAudio = '/missing-audio.mp3'

// Documents for the frame demos. `color-scheme` matches the page's, so the frame stays transparent and
// follows the theme.
const frameStyle = '<style>body{margin:16px;font:14px/1.5 system-ui,sans-serif;color-scheme:light dark}h1{margin:0 0 8px;font-size:16px}p{margin:0 0 8px}</style>'

export const sampleFrameDoc = `${frameStyle}<h1>Embedded document</h1><p>An inline HTML document (srcdoc), sandboxed: no scripts, no forms, no same-origin access.</p>`

export const growingFrameDoc = `${frameStyle}<h1>Growing document</h1><p>The frame measures this document and follows its height.</p><button type="button">Add a line</button><script>
document.querySelector('button').addEventListener('click', () => {
  const line = document.createElement('p')
  line.textContent = 'Another line: the frame grows with its content.'
  document.body.append(line)
})
</script>`

/**
 * A fake upload for the demos: progress in steps over about 2 seconds. A file whose name contains "fail"
 * is refused halfway, to show the error and retry states.
 */
export function mockUpload(file: File, { signal, onProgress }: TUploadContext) {
  return new Promise<void>((resolve, reject) => {
    let percent = 0
    const timer = setInterval(() => {
      percent += 10
      onProgress(percent)
      if (percent >= 50 && /fail/i.test(file.name)) {
        clearInterval(timer)
        reject(new Error('The server refused the file.'))
      } else if (percent >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, 200)
    signal.addEventListener('abort', () => {
      clearInterval(timer)
      reject(signal.reason)
    })
  })
}
