import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef } from 'vue'

export function useScrollTopButton(isGridView: ComputedRef<boolean>, threshold = 400) {
  const showScrollTop = ref(false)

  function scrollToTop() {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleScroll() {
    if (typeof window === 'undefined') return
    showScrollTop.value = window.scrollY > threshold && isGridView.value
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
  })

  watch(
    isGridView,
    (active) => {
      if (!active) {
        showScrollTop.value = false
        return
      }
      handleScroll()
    },
    { immediate: true }
  )

  return {
    showScrollTop: computed(() => showScrollTop.value),
    scrollToTop,
  }
}
