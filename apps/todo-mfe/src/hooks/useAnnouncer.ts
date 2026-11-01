import { type InjectionKey, inject, nextTick, provide, readonly, ref } from 'vue'

type Announce = (text: string) => void

const ANNOUNCE: InjectionKey<Announce> = Symbol('announce')

/**
 * Creates a page's live-region message and lets its descendants announce into it (useAnnouncer). The
 * page renders `message` in one polite live region, so announcements never talk over each other.
 */
export function provideAnnouncer() {
  const message = ref('')

  function announce(text: string) {
    // Emptied first, so a repeated message is a change and gets read again.
    message.value = ''
    void nextTick(() => {
      message.value = text
    })
  }

  provide(ANNOUNCE, announce)
  return { message: readonly(message), announce }
}

/** The nearest page's announce function; a no-op outside one. */
export function useAnnouncer(): Announce {
  return inject(ANNOUNCE, () => {})
}
