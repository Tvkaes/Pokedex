<script setup lang="ts">
import { computed, watch } from 'vue'
import type { PokemonDisplayData } from '@/types/pokemon.types'
import PokemonInfoPanel from '@pokedex/components/hero/PokemonInfoPanel.vue'
import PokemonSpriteDisplay from '@pokedex/components/hero/PokemonSpriteDisplay.vue'
import PokemonHorizontalNav from '@pokedex/components/navigation/PokemonHorizontalNav.vue'
import PokemonVerticalNav from '@pokedex/components/navigation/PokemonVerticalNav.vue'
import { usePokemonFormatting } from '@/composables/usePokemonFormatting'
import { usePokemonMedia } from '@/composables/usePokemonMedia'
import { usePokemonNavigation } from '@/composables/usePokemonNavigation'
import { getTypeColor } from '@/utils/typeColors'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const props = defineProps<{
  pokemon: PokemonDisplayData
  primaryType: string
}>()

const emit = defineEmits<{
  select: [id: number]
  'theme-change': [{ primary: string; secondary?: string | null }]
}>()

const pokemonRef = computed(() => props.pokemon)

const {
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
} = usePokemonMedia(pokemonRef)

const heroPokemon = computed<PokemonDisplayData>(() => {
  if (!activeMegaForm.value) {
    return pokemonRef.value
  }

  const form = activeMegaForm.value
  return {
    ...pokemonRef.value,
    id: form.id,
    formattedId: form.formattedId,
    name: form.name,
    description: form.description ?? pokemonRef.value.description,
    genus: form.genus ?? pokemonRef.value.genus,
    stats: form.stats ?? pokemonRef.value.stats,
    types: form.types ?? pokemonRef.value.types,
    abilities: form.abilities ?? pokemonRef.value.abilities,
    height: form.height ?? pokemonRef.value.height,
    weight: form.weight ?? pokemonRef.value.weight,
    cryUrl: form.cryUrl ?? pokemonRef.value.cryUrl,
  }
})

const heroPrimaryTypeName = computed(() => heroPokemon.value.types?.[0]?.type?.name ?? props.primaryType)
const heroSecondaryTypeName = computed(() => heroPokemon.value.types?.[1]?.type?.name ?? null)

const heroTypeColor = computed(() => getTypeColor(heroPrimaryTypeName.value))

watch(
  [heroPrimaryTypeName, heroSecondaryTypeName],
  ([primary, secondary]) => {
    emit('theme-change', { primary, secondary: secondary ?? null })
  },
  { immediate: true }
)

const { backgroundLabel, imperialHeight, imperialWeight } = usePokemonFormatting(heroPokemon)
const {
  visibleNavigation,
  setHorizontalButtonRef,
  setNavContainerRef,
  setVerticalButtonRef,
  setVerticalNavContainerRef,
  canPageNext,
  canPagePrev,
  pageNext,
  pagePrev,
} = usePokemonNavigation(
  computed(() => props.pokemon.id)
)

function handleSelect(id: number) {
  emit('select', id)
}
</script>

<template>
  <div class="relative min-h-screen w-full text-surface-50 flex flex-col bg-transparent">
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] text-[25vw] md:text-[18vw] font-black tracking-tight leading-none whitespace-nowrap">
        {{ backgroundLabel }}
      </span>
    </div>

    <div class="relative flex-1 grid gap-6 lg:gap-12 lg:grid-cols-[1.2fr_1fr_0.35fr] p-6 sm:p-8 lg:p-12 xl:p-16 items-center">
      <div class="order-last lg:order-first">
        <PokemonInfoPanel
          :pokemon="heroPokemon"
          :imperial-height="imperialHeight"
          :imperial-weight="imperialWeight"
          :has-mega-evolution="hasMegaEvolution"
          :mega-forms="megaForms"
          :special-form-entries="specialFormEntries"
          :regional-form-entries="regionalFormEntries"
          :active-mega-form-index="activeMegaFormIndex"
          @select-mega-form="selectMegaForm"
        />
      </div>

      <div class="order-first lg:order-none">
        <PokemonSpriteDisplay
          :pokemon="heroPokemon"
          :type-color="heroTypeColor"
          :display-sprite="displaySprite"
          :show-shiny="showShiny"
          :has-shiny="hasShiny"
          :sprite-animation-key="spriteAnimationKey"
          :aura-motion="auraMotion"
          :sprite-motion="spriteMotion"
          @toggle-shiny="toggleShiny"
        />
      </div>

      <div class="hidden lg:flex flex-col items-end gap-1 xl:gap-2 text-right text-xs xl:text-sm uppercase tracking-[0.3em] xl:tracking-[0.4em] max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2 scrollbar-hide">
        <PokemonVerticalNav
          :numbers="visibleNavigation"
          :current-id="pokemon.id"
          :set-container-ref="setVerticalNavContainerRef"
          :set-button-ref="setVerticalButtonRef"
          :can-page-prev="canPagePrev"
          :can-page-next="canPageNext"
          :on-prev="pagePrev"
          :on-next="pageNext"
          @select="handleSelect"
        />
        <div class="mt-4 xl:mt-6 flex flex-col items-center gap-3 xl:gap-4">
          <div class="h-10 w-10 xl:h-12 xl:w-12 rounded-full border border-white/30 flex items-center justify-center">
            <svg class="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M12 3c-1.5 3.5-4 4.5-4 7.5a4 4 0 0 0 8 0c0-3-2.5-4-4-7.5Z" />
              <path d="M12 21c3.5-2 5-5 5-7.5a5 5 0 1 0-10 0c0 2.5 1.5 5.5 5 7.5Z" />
            </svg>
          </div>
          <div class="text-[10px] xl:text-xs text-white/70 tracking-[0.2em] xl:tracking-[0.3em] rotate-180 writing-vertical">
            {{ t('pokedex.allRegions') }}
          </div>
        </div>
      </div>
    </div>

    <PokemonHorizontalNav
      :numbers="visibleNavigation"
      :current-id="pokemon.id"
      :set-container-ref="setNavContainerRef"
      :set-button-ref="setHorizontalButtonRef"
      :can-page-prev="canPagePrev"
      :can-page-next="canPageNext"
      :on-prev="pagePrev"
      :on-next="pageNext"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-transform: uppercase;
}
</style>
