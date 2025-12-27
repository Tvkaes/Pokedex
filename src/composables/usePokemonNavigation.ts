import { computed, nextTick, ref, watch, type ComputedRef, type ComponentPublicInstance } from 'vue'
import { MAX_POKEMON_ID } from '@/utils/constants'

type NavElement = HTMLElement | null
const WINDOW_SIZE = MAX_POKEMON_ID

/**
 * Tracks navigation focus, button refs, and viewport windows for the Pokémon selector lists.
 */
export function usePokemonNavigation(currentId: ComputedRef<number>) {
  const baseNavigation = computed(() => {
    const start = 1
    const end = MAX_POKEMON_ID
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  })

  const navContainer = ref<HTMLElement | null>(null)
  const verticalNavContainer = ref<HTMLElement | null>(null)
  const navButtonRefs = new Map<number, NavElement>()
  const verticalButtonRefs = new Map<number, NavElement>()
  const windowStart = ref(0)

  /**
   * Stores a reference to each horizontal nav button so we can scroll it into view later.
   */
  function setHorizontalButtonRef(el: Element | ComponentPublicInstance | null, number: number) {
    if (el instanceof HTMLElement) {
      navButtonRefs.set(number, el)
      return
    }
    navButtonRefs.delete(number)
  }

  /**
   * Stores a reference to each vertical nav button for the same reason as above.
   */
  function setVerticalButtonRef(el: Element | ComponentPublicInstance | null, number: number) {
    if (el instanceof HTMLElement) {
      verticalButtonRefs.set(number, el)
      return
    }
    verticalButtonRefs.delete(number)
  }

  /**
   * Tracks the horizontal container element to control scroll position.
   */
  function setNavContainerRef(el: Element | ComponentPublicInstance | null) {
    navContainer.value = el instanceof HTMLElement ? el : null
  }

  /**
   * Tracks the vertical container element to control scroll position.
   */
  function setVerticalNavContainerRef(el: Element | ComponentPublicInstance | null) {
    verticalNavContainer.value = el instanceof HTMLElement ? el : null
  }

  const visibleNavigation = computed(() => {
    const start = windowStart.value
    const end = Math.min(start + WINDOW_SIZE, baseNavigation.value.length)
    return baseNavigation.value.slice(start, end)
  })

  const canPagePrev = computed(() => windowStart.value > 0)
  const canPageNext = computed(() => windowStart.value + WINDOW_SIZE < baseNavigation.value.length)

  /**
   * Keeps the windowed navigation chunk centered around the currently selected Pokémon.
   */
  function ensureWindowContains(id: number) {
    const index = id - 1
    const currentStart = windowStart.value
    const currentEnd = currentStart + WINDOW_SIZE
    if (index < currentStart || index >= currentEnd) {
      windowStart.value = Math.max(0, Math.floor(index / WINDOW_SIZE) * WINDOW_SIZE)
    }
  }

  /**
   * Moves the window backward by one chunk.
   */
  function pagePrev() {
    if (!canPagePrev.value) return
    windowStart.value = Math.max(0, windowStart.value - WINDOW_SIZE)
  }

  /**
   * Moves the window forward by one chunk.
   */
  function pageNext() {
    if (!canPageNext.value) return
    const maxStart = Math.max(0, baseNavigation.value.length - WINDOW_SIZE)
    windowStart.value = Math.min(maxStart, windowStart.value + WINDOW_SIZE)
  }

  /**
   * Smoothly scrolls the horizontal list so the selected button is visible.
   */
  async function scrollSelectedIntoView(id: number) {
    await nextTick()
    const container = navContainer.value
    const button = navButtonRefs.get(id) ?? null

    if (!container || !button || typeof window === 'undefined') return

    const paddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft || '0')
    const targetScroll = Math.max(0, button.offsetLeft - paddingLeft)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  /**
   * Smoothly scrolls the vertical list in the same way.
   */
  async function scrollVerticalSelectedIntoView(id: number) {
    await nextTick()
    const container = verticalNavContainer.value
    const button = verticalButtonRefs.get(id) ?? null

    if (!container || !button || typeof window === 'undefined') return

    const paddingTop = parseFloat(window.getComputedStyle(container).paddingTop || '0')
    const targetScroll = Math.max(0, button.offsetTop - paddingTop)

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  watch(
    currentId,
    (id) => {
      ensureWindowContains(id)
      scrollSelectedIntoView(id)
      scrollVerticalSelectedIntoView(id)
    },
    { immediate: true }
  )

  return {
    baseNavigation,
    visibleNavigation,
    navContainer,
    setNavContainerRef,
    setHorizontalButtonRef,
    setVerticalButtonRef,
    setVerticalNavContainerRef,
    verticalNavContainer,
    canPageNext,
    canPagePrev,
    pageNext,
    pagePrev,
  }
}
