<template>
  <footer class="relative z-10 border-t border-white/5 bg-surface-950/60 backdrop-blur-xl">
    <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
      <p class="font-medium tracking-wide">© {{ new Date().getFullYear() }} Pokédex Premium · Data by PokéAPI</p>
      <div class="flex flex-wrap gap-4 text-white/50 uppercase text-xs tracking-[0.2em]">
        <span>AAA Accessibility</span>
        <span>Speed <span class="text-primary">> 1.5s FCP</span></span>
        <span>Intelligent Wiki System</span>
      </div>
    </div>
  </footer>
</template>
