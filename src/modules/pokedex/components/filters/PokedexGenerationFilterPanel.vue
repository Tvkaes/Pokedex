<script setup lang="ts">
import { computed } from 'vue'
import { GenerationConfig } from '@/modules/pokedex/data/generations'
import FrostedCard from '@/components/base/FrostedCard.vue'
import HeadingBlock from '@/components/ui/HeadingBlock.vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  generations: GenerationConfig[]
  activeId: string
  loading: boolean
}>()

const { t } = useTranslation()

const emit = defineEmits<{
  select: [id: string]
}>()

const generationOptions = computed(() =>
  props.generations.map((generation) => ({
    id: generation.id,
    label: generation.label,
  }))
)

function handleSelect(id: string) {
  if (props.loading) return
  emit('select', id)
}
</script>

<template>
  <div class="mt-20 px-6 sm:px-10">
    <FrostedCard as="div" class="mx-auto max-w-5xl rounded-[40px] border border-white/20 px-6 py-8 text-center space-y-8">
      <HeadingBlock
        :eyebrow="t('generations.eyebrow')"
        :title="t('generations.title')"
        :subtitle="t('generations.subtitle')"
        align="center"
        size="lg"
      />
      <div class="flex flex-wrap justify-center gap-3">
        <template v-for="generation in generationOptions" :key="generation.id">
          <button
            class="rounded-full border px-5 py-2 type-pill transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :class="
              generation.id === activeId
                ? 'border-white bg-white text-surface-900 shadow-lg shadow-white/30'
                : 'border-white/30 bg-white/5 text-white/70 hover:bg-white/10'
            "
            type="button"
            :disabled="loading"
            @click="handleSelect(generation.id)"
          >
            {{ generation.label }}
          </button>
        </template>
      </div>
    </FrostedCard>
  </div>
</template>

