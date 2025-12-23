<script setup lang="ts">
import BackgroundEffect from '@/components/effects/BackgroundEffect.vue'
import PokedexShowcase from '@/components/sections/PokedexShowcase.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-surface-950 text-white">
    <BackgroundEffect />

    <main class="relative z-10">
      <PokedexShowcase />
    </main>

    <!-- <AppFooter /> -->
  </div>
</template>
