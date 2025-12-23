<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonSearch from '@/components/pokemon/PokemonSearch.vue'
import PokemonCard from '@/components/pokemon/PokemonCard.vue'
import { getTypeColor } from '@/utils/typeColors'

const store = usePokemonStore()
const query = ref('')

const accentType = computed(() => store.primaryType)
const heroColor = computed(() => getTypeColor(accentType.value))

function handleSearch(value: string) {
  if (!value) return
  store.loadPokemon(value)
}

function handleRandom() {
  const randomId = Math.floor(Math.random() * 898) + 1
  store.loadPokemon(randomId)
}

onMounted(() => {
  store.loadPokemon()
})
</script>

<template>
  <section
    class="relative min-h-screen w-full text-white transition-colors duration-500"
    :style="{ backgroundColor: heroColor.color || '#B3272C' }"
  >
    <template v-if="store.pokemon">
      <PokemonCard :pokemon="store.pokemon" :primary-type="accentType" />
    </template>

    <template v-else-if="store.isLoading">
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center text-white/80 uppercase tracking-[0.4em] space-y-4">
          <div class="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p>Cargando ficha...</p>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center text-white/80 uppercase tracking-[0.4em]">
          Busca tu primer Pokémon
        </div>
      </div>
    </template>
  </section>
</template>
