import { computed, ref, watch, type ComputedRef } from 'vue'
import { getTypeColor } from '@/utils/typeColors'

export type HeroThemePayload = {
  primary: string
  secondary?: string | null
}

export function useHeroTheme(
  primaryType: ComputedRef<string>,
  secondaryType: ComputedRef<string | null>
) {
  const heroPrimaryType = ref(primaryType.value)
  const heroSecondaryType = ref<string | null>(secondaryType.value ?? null)

  watch(
    primaryType,
    (type) => {
      heroPrimaryType.value = type
    },
    { immediate: true }
  )

  watch(
    secondaryType,
    (type) => {
      heroSecondaryType.value = type ?? null
    },
    { immediate: true }
  )

  const heroColor = computed(() => getTypeColor(heroPrimaryType.value ?? primaryType.value))
  const secondaryHeroColor = computed(() =>
    getTypeColor(heroSecondaryType.value ?? heroPrimaryType.value ?? primaryType.value)
  )

  const heroGradientStyle = computed(() => {
    const primaryHex = heroColor.value.color || '#B3272C'
    const secondaryHex = secondaryHeroColor.value.color
    return {
      background: `radial-gradient(circle at 25% 20%, ${primaryHex} 0%, ${secondaryHex} 45%, #020617 100%)`,
      backgroundColor: primaryHex,
    }
  })

  function handleThemeChange(payload: HeroThemePayload) {
    heroPrimaryType.value = payload.primary ?? primaryType.value
    heroSecondaryType.value = payload.secondary ?? null
  }

  return {
    heroPrimaryType,
    heroSecondaryType,
    heroColor,
    secondaryHeroColor,
    heroGradientStyle,
    handleThemeChange,
  }
}
