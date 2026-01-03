<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  isVisible: boolean
  isMegaActive: boolean
  stoneSprite?: string | null
  displayName: string
  isPokeballIcon?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const { t } = useTranslation()

function handleClick() {
  if (!props.isVisible || !props.stoneSprite) return
  emit('toggle')
}
</script>

<template>
  <button
    v-if="isVisible && stoneSprite"
    class="mega-toggle"
    type="button"
    @click.stop="handleClick"
  >
    <span class="sr-only">
      {{ isMegaActive ? `${t('sr.returnBaseForm')} ${displayName}` : `${t('sr.activateForm')} ${displayName}` }}
    </span>
    <span class="mega-toggle__image" aria-hidden="true">
      <img :src="stoneSprite" :alt="`${displayName} mega stone`" loading="lazy" />
    </span>
  </button>
</template>

<style scoped>
.mega-toggle {
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

.mega-toggle:hover,
.mega-toggle:focus-visible {
  background: rgba(255, 255, 255, 0.6);
  outline: none;
}

.mega-toggle__image {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mega-toggle__image img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.35));
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
