<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from '@/composables/useTranslation'
import type { Locale } from '@/locales/translations'

const { locale, availableLocales, setLocale } = useTranslation()

const localeFlags: Record<Locale, string> = {
  en: '/flags/united-states.png',
  es: '/flags/mexico.png',
  ja: '/flags/japan.png',
}

const activeFlag = computed(() => localeFlags[locale.value])
const dropdownRef = ref<HTMLDetailsElement | null>(null)

function handleSelect(loc: Locale) {
  setLocale(loc)
  dropdownRef.value?.removeAttribute('open')
}
</script>

<template>
  <div class="flex items-center gap-2 justify-center">
    <details ref="dropdownRef" class="dropdown dropdown-end locale-toggle">
      <summary class="locale-toggle__trigger">
        <img :src="activeFlag" alt="" class="locale-toggle__flag" />
      </summary>
      <ul class="menu dropdown-content locale-toggle__menu">
        <li v-for="loc in availableLocales" :key="loc">
          <button
            type="button"
            class="locale-toggle__option"
            :class="locale === loc ? 'locale-toggle__option--active' : ''"
            @click="handleSelect(loc)"
          >
            <img :src="localeFlags[loc]" alt="" class="locale-toggle__flag" />
          </button>
        </li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.locale-toggle {
  display: inline-flex;
  padding: 0;
  border-radius: 999px;
  position: relative;
  z-index: 50;
}

.locale-toggle__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.35rem 1rem;
  color: #020617;
  font-weight: 600;
  letter-spacing: 0.2em;
  cursor: pointer;
  min-width: 4rem;
}

.locale-toggle__flag {
  width: 1.75rem;
  height: 1.75rem;
  object-fit: cover;
  border-radius: 50%;
}

.locale-toggle__trigger::-webkit-details-marker {
  display: none;
}

.locale-toggle__menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.6rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(2, 6, 23, 0.9);
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  width: 5rem;
  z-index: 100;
}

.locale-toggle__option {
  width: 100%;
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  transition: background 0.2s ease, color 0.2s ease;
}

.locale-toggle__option:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.locale-toggle__option--active {
  background: rgba(255, 255, 255, 0.95);
  color: #020617;
}
</style>
