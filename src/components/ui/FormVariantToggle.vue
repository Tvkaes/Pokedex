<template>
  <button
    v-if="visible"
    type="button"
    class="variant-toggle"
    :class="[
      `variant-toggle--${variant}`,
      active && 'variant-toggle--active',
      disabled && 'variant-toggle--disabled',
    ]"
    :disabled="disabled"
    @click.stop="emit('toggle')"
  >
    <span class="sr-only">
      <slot name="sr">
        {{ srLabel }}
      </slot>
    </span>

    <span class="variant-toggle__icon" aria-hidden="true" v-if="iconSrc">
      <img :src="iconSrc" :alt="iconAlt" loading="lazy" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = withDefaults(
  defineProps<{
    variant?: 'mega' | 'primal' | 'dynamax'
    label: string
    icon?: string | null
    visible?: boolean
    active?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'mega',
    icon: null,
    visible: true,
    active: false,
    disabled: false,
  }
)

const emit = defineEmits<{ toggle: [] }>()

const { t } = useTranslation()

const iconSrc = computed(() => {
  if (props.icon) return props.icon
  if (props.variant === 'dynamax') return '/dynamax.svg'
  return null
})

const iconAlt = computed(() => `${props.label} ${props.variant} icon`)

const srLabel = computed(() => {
  if (props.variant === 'dynamax') {
    return props.active ? `${t('sr.returnFromDynamax')} ${props.label}` : `${t('sr.activateDynamax')} ${props.label}`
  }
  return props.active ? `${t('sr.returnBaseForm')} ${props.label}` : `${t('sr.activateForm')} ${props.label}`
})
</script>

<style scoped>
.variant-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.15);
  color: rgba(248, 250, 252, 0.85);
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
}

.variant-toggle:hover,
.variant-toggle:focus-visible {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.65);
  color: #0f172a;
  transform: translateY(-2px);
  outline: none;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.45);
}

.variant-toggle--active {
  background: rgba(255, 255, 255, 0.4);
  color: #0f172a;
  border-color: transparent;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.45);
}

.variant-toggle--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.variant-toggle__icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
 
}

.variant-toggle__icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: drop-shadow(0 6px 18px rgba(15, 23, 42, 0.55));
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
