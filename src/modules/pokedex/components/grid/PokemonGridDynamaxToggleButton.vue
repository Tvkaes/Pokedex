<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  isVisible: boolean
  isActive: boolean
  displayName: string
  iconSprite?: string
}>()

const emit = defineEmits<{
  toggle: []
}>()

const { t } = useTranslation()

const iconSrc = computed(() => props.iconSprite ?? '/dynamax.svg')

function handleClick() {
  if (!props.isVisible) return
  emit('toggle')
}
</script>

<template>
  <button
    v-if="isVisible"
    class="dynamax-toggle"
    :class="{ 'dynamax-toggle--active': isActive }"
    type="button"
    @click.stop="handleClick"
  >
    <span class="sr-only">
      {{
        isActive
          ? `${t('sr.returnFromDynamax')} ${displayName}`
          : `${t('sr.activateDynamax')} ${displayName}`
      }}
    </span>
    <span class="dynamax-toggle__image" aria-hidden="true">
      <img :src="iconSrc" alt="Dynamax icon" loading="lazy" />
    </span>
  </button>
</template>

<style scoped>
.dynamax-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.2s ease;
}

.dynamax-toggle:hover,
.dynamax-toggle:focus-visible {
  background: rgba(255, 255, 255, 0.55);
  outline: none;
}

.dynamax-toggle__image {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dynamax-toggle__image img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(236, 72, 153, 0.45));
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
