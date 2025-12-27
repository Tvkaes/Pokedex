<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <span class="type-badge">
    {{ props.label.toUpperCase() }}
  </span>
</template>

<style scoped>
.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}

@media (max-width: 640px) {
  .type-badge {
    font-size: 0.625rem;
    padding: 0.25rem 0.75rem;
  }
}
</style>
