<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-gradient-to-b from-surface-900/60 via-surface-950 to-black" />
    <div class="absolute -top-1/3 left-1/4 w-[520px] h-[520px] bg-primary/30 blur-[120px] animate-pulseSoft" />
    <div class="absolute top-1/2 right-0 w-[380px] h-[380px] bg-secondary/20 blur-[120px] animate-float" />
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[780px] h-[780px] rounded-full border border-white/5 opacity-20" />
    <div 
      class="absolute inset-0 opacity-10" 
      style="background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 80px 80px;"
    />
  </div>
</template>
