import { computed, onBeforeUnmount, onMounted, ref, watch, type ComputedRef } from 'vue'
import type { PokemonDisplayData, PokemonFormEntry } from '@/types/pokemon.types'
import { useAlternateForms } from '@/composables/useAlternateForms'

/**
 * Handles sprite display logic, shiny toggles, and cry playback for the active Pokémon.
 */
type NavigatorWithUserActivation = Navigator & {
  userActivation?: {
    isActive: boolean
  }
}

function hasInitialUserActivation(): boolean {
  if (typeof navigator === 'undefined') return false
  const maybeNavigator = navigator as NavigatorWithUserActivation
  return Boolean(maybeNavigator.userActivation?.isActive)
}

export function usePokemonMedia(pokemon: ComputedRef<PokemonDisplayData>) {
  const showShiny = ref(false)
  const cryAudio = ref<HTMLAudioElement | null>(null)
  const shinyAudio = ref<HTMLAudioElement | null>(null)
  const hasUserInteracted = ref(hasInitialUserActivation())
  const spriteAnimationKey = ref(0)
  const shinySoundUrl = '/sounds/shiny.wav'
  const pendingCryUrl = ref<string | null>(null)

  const isFlyingType = computed(() => pokemon.value.types?.some((type) => type.type.name === 'flying') ?? false)
  const megaForms = computed(() => pokemon.value.alternateForms ?? [])
  const formEntries = computed<PokemonFormEntry[]>(() =>
    megaForms.value.map((form, index) => ({
      form,
      index,
      secondaryType: form.types?.[1]?.type?.name ?? null,
    }))
  )
  const specialFormEntries = computed(() =>
    formEntries.value.filter(({ form }) => form.variantKind === 'mega' || form.variantKind === 'primal' || form.variantKind === 'dynamax')
  )
  const regionalFormEntries = computed(() =>
    formEntries.value.filter(({ form }) => form.variantKind !== 'mega' && form.variantKind !== 'primal' && form.variantKind !== 'dynamax')
  )
  const {
    activeForm: activeMegaForm,
    activeFormIndex: activeMegaFormIndex,
    hasAlternateForms: hasMegaEvolution,
    selectForm: selectMegaFormIndex,
    resetForms: resetMegaForms,
  } = useAlternateForms({ forms: megaForms })

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

  const activeFormShinySprite = computed(() => activeMegaForm.value?.spriteShiny ?? null)
  const hasShiny = computed(() => {
    if (activeMegaForm.value) {
      return Boolean(activeFormShinySprite.value)
    }
    return Boolean(pokemon.value.spriteShiny)
  })
  const displaySprite = computed(() => {
    if (activeMegaForm.value) {
      if (showShiny.value && activeFormShinySprite.value) {
        return activeFormShinySprite.value
      }
      return activeMegaForm.value.sprite
    }

    return showShiny.value && pokemon.value.spriteShiny ? pokemon.value.spriteShiny : pokemon.value.sprite
  })

  function replaySpriteAnimation() {
    spriteAnimationKey.value += 1
  }

  /**
   * Switches between base and shiny sprite, guarded by shiny availability.
   */
  function toggleShiny() {
    const shinySource = activeMegaForm.value?.spriteShiny ?? pokemon.value.spriteShiny
    if (!shinySource) return
    showShiny.value = !showShiny.value
  }

  /**
   * Resets the shiny toggle whenever a new Pokémon loads.
   */
  function resetShiny() {
    showShiny.value = false
  }

  function resetMegaForm() {
    resetMegaForms()
  }

  function selectMegaForm(index: number | null) {
    if (index === null) {
      resetShiny()
      resetMegaForm()
      void playCry(pokemon.value.cryUrl)
      return
    }

    if (!hasMegaEvolution.value) return

    resetShiny()
    selectMegaFormIndex(index)
    replaySpriteAnimation()
    void playCry(megaForms.value[index]?.cryUrl ?? pokemon.value.cryUrl)
  }

  /**
   * Plays the Pokémon cry once the user has interacted with the page (browser auto-play rule).
   */
  async function playCry(url?: string, options: { force?: boolean } = {}) {
    if (!url || typeof Audio === 'undefined') return

    if (!hasUserInteracted.value && !options.force) {
      pendingCryUrl.value = url
      return
    }

    pendingCryUrl.value = null

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

  async function playShinyCue() {
    if (typeof Audio === 'undefined' || !hasUserInteracted.value) return

    shinyAudio.value?.pause()

    const audio = new Audio(shinySoundUrl)
    audio.currentTime = 0
    shinyAudio.value = audio

    try {
      await audio.play()
    } catch (error) {
      console.warn('No se pudo reproducir el sonido shiny.', error)
    }
  }

  watch(
    () => pokemon.value.id,
    () => {
      resetShiny()
      resetMegaForm()
      void playCry(pokemon.value.cryUrl)
      replaySpriteAnimation()
    },
    { immediate: true }
  )

  watch(
    showShiny,
    (isShiny, prev) => {
      replaySpriteAnimation()
      if (isShiny && !prev) {
        void playShinyCue()
      }
    }
  )

  watch(
    () => ({
      activeShiny: activeFormShinySprite.value,
      isUsingForm: activeMegaForm.value !== null,
      baseShiny: pokemon.value.spriteShiny ?? null,
    }),
    ({ activeShiny, isUsingForm, baseShiny }) => {
      const shinySource = isUsingForm ? activeShiny : baseShiny
      if (!shinySource && showShiny.value) {
        showShiny.value = false
      }
    }
  )

  watch(activeMegaFormIndex, () => {
    replaySpriteAnimation()
  })

  onMounted(() => {
    if (typeof window === 'undefined') return

    const enableAudio = () => {
      hasUserInteracted.value = true
      window.removeEventListener('pointerdown', enableAudio)
      window.removeEventListener('keydown', enableAudio)

      if (pendingCryUrl.value) {
        void playCry(pendingCryUrl.value, { force: true })
      }
    }

    window.addEventListener('pointerdown', enableAudio, { once: true })
    window.addEventListener('keydown', enableAudio, { once: true })
  })

  onBeforeUnmount(() => {
    cryAudio.value?.pause()
    cryAudio.value = null
    shinyAudio.value?.pause()
    shinyAudio.value = null
  })

  return {
    auraMotion,
    displaySprite,
    hasShiny,
    hasMegaEvolution,
    megaForms,
    specialFormEntries,
    regionalFormEntries,
    activeMegaFormIndex,
    activeMegaForm,
    showShiny,
    spriteAnimationKey,
    spriteMotion,
    toggleShiny,
    selectMegaForm,
  }
}
