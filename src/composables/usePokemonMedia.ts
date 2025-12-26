import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'

/**
 * Handles sprite display logic, shiny toggles, and cry playback for the active Pokémon.
 */
export function usePokemonMedia(pokemon: ComputedRef<PokemonDisplayData>) {
  const showShiny = ref(false)
  const cryAudio = ref<HTMLAudioElement | null>(null)
  const hasUserInteracted = ref(false)

  const isFlyingType = computed(() => pokemon.value.types?.some((type) => type.type.name === 'flying') ?? false)

  const spriteMotion = computed(() => ({
    initial: {
      scale: 0.45,
      opacity: 0,
      y: 60,
      rotate: -8,
      filter: 'blur(12px)',
    },
    enter: {
      scale: isFlyingType.value ? 1.05 : 1,
      opacity: 1,
      y: 0,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 20,
        mass: 0.8,
      },
    },
  }))

  const auraMotion = computed(() => ({
    initial: {
      scale: 0.5,
      opacity: 0,
      y: 40,
    },
    enter: {
      scale: 1,
      opacity: 0.75,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.05,
        ease: 'easeOut',
      },
    },
  }))

  const hasShiny = computed(() => Boolean(pokemon.value.spriteShiny))
  const displaySprite = computed(() =>
    showShiny.value && pokemon.value.spriteShiny ? pokemon.value.spriteShiny : pokemon.value.sprite
  )

  /**
   * Switches between base and shiny sprite, guarded by shiny availability.
   */
  function toggleShiny() {
    if (!hasShiny.value) return
    showShiny.value = !showShiny.value
  }

  /**
   * Resets the shiny toggle whenever a new Pokémon loads.
   */
  function resetShiny() {
    showShiny.value = false
  }

  /**
   * Plays the Pokémon cry once the user has interacted with the page (browser auto-play rule).
   */
  async function playCry(url?: string) {
    if (!url || typeof Audio === 'undefined' || !hasUserInteracted.value) return

    cryAudio.value?.pause()

    const audio = new Audio(url)
    audio.currentTime = 0
    cryAudio.value = audio

    try {
      await audio.play()
    } catch (error) {
      console.warn('No se pudo reproducir el cry del Pokémon.', error)
    }
  }

  watch(
    () => pokemon.value.id,
    () => {
      resetShiny()
      void playCry(pokemon.value.cryUrl)
    },
    { immediate: true }
  )

  onMounted(() => {
    if (typeof window === 'undefined') return
    const enableAudio = () => {
      hasUserInteracted.value = true
      window.removeEventListener('pointerdown', enableAudio)
      window.removeEventListener('keydown', enableAudio)
    }
    window.addEventListener('pointerdown', enableAudio, { once: true })
    window.addEventListener('keydown', enableAudio, { once: true })
  })

  onBeforeUnmount(() => {
    cryAudio.value?.pause()
    cryAudio.value = null
  })

  return {
    auraMotion,
    displaySprite,
    hasShiny,
    showShiny,
    spriteMotion,
    toggleShiny,
  }
}
