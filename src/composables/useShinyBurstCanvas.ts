import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

interface CanvasParticle {
  angle: number
  distance: number
  duration: number
  delay: number
  color: string
  size: number
  rotation: number
}

interface UseShinyBurstCanvasOptions {
  showShiny: Ref<boolean>
  colors?: readonly string[]
}

const DEFAULT_COLORS = ['#fde047', '#fee2e2', '#f9a8d4', '#bae6fd', '#c4b5fd'] as const

export function useShinyBurstCanvas(options: UseShinyBurstCanvasOptions) {
  const burstContainerRef = ref<HTMLDivElement | null>(null)
  const burstCanvasRef = ref<HTMLCanvasElement | null>(null)
  const spriteSectionRef = ref<HTMLDivElement | null>(null)

  let burstCtx: CanvasRenderingContext2D | null = null
  let burstParticles: CanvasParticle[] = []
  let burstAnimationFrame: number | null = null
  let burstStartTime = 0
  let resizeObserver: ResizeObserver | null = null
  let motionMedia: MediaQueryList | null = null
  let motionListener: ((event: MediaQueryListEvent) => void) | null = null
  let visibilityListener: (() => void) | null = null
  let intersectionObserver: IntersectionObserver | null = null

  const reduceMotion = ref(false)
  const documentVisible = ref(true)
  const sectionVisible = ref(true)
  const colors = options.colors ?? DEFAULT_COLORS

  const canAnimateBurst = computed(() => !reduceMotion.value && documentVisible.value && sectionVisible.value)

  function randomBurstColor() {
    return colors[Math.floor(Math.random() * colors.length)] ?? DEFAULT_COLORS[0]
  }

  function syncCanvasSize() {
    if (typeof window === 'undefined') return
    const canvas = burstCanvasRef.value
    const container = burstContainerRef.value
    if (!canvas || !container) return
    const width = container.clientWidth
    const height = container.clientHeight
    const ratio = window.devicePixelRatio || 1
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio
      canvas.height = height * ratio
    }
    const context = canvas.getContext('2d')
    if (!context) return
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(ratio, ratio)
    burstCtx = context
  }

  function stopBurstAnimation() {
    if (!burstAnimationFrame) return
    cancelAnimationFrame(burstAnimationFrame)
    burstAnimationFrame = null
  }

  function disposeCanvas() {
    stopBurstAnimation()
    burstCtx = null
    burstParticles = []
  }

  function createBurstParticles(): CanvasParticle[] {
    const count = reduceMotion.value ? 10 : 18
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2)
      const distance = 140 + Math.random() * 180
      return {
        angle,
        distance,
        duration: 0.9 + Math.random() * 0.6,
        delay: Math.random() * 0.12,
        color: randomBurstColor(),
        size: 4.5 + Math.random() * 3.5,
        rotation: Math.random() * Math.PI * 2,
      }
    })
  }

  function drawStar(ctx: CanvasRenderingContext2D, outerRadius: number, innerRadius: number, points = 5) {
    ctx.beginPath()
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / points
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
    ctx.closePath()
    ctx.fill()
  }

  function drawParticles(timestamp: number) {
    if (!burstCtx || !burstCanvasRef.value || !burstParticles.length) return
    if (!burstStartTime) {
      burstStartTime = timestamp
    }
    const elapsed = (timestamp - burstStartTime) / 1000
    const canvas = burstCanvasRef.value
    burstCtx.clearRect(0, 0, canvas.width, canvas.height)

    const container = burstContainerRef.value
    const width = container?.clientWidth ?? 0
    const height = container?.clientHeight ?? 0
    const centerX = width / 2
    const centerY = height / 2

    let hasActiveParticle = false

    burstParticles.forEach((particle) => {
      const localTime = elapsed - particle.delay
      if (localTime < 0) {
        hasActiveParticle = true
        return
      }
      const progress = Math.min(localTime / particle.duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const x = centerX + Math.cos(particle.angle) * particle.distance * eased
      const y = centerY + Math.sin(particle.angle) * particle.distance * eased
      const alpha = Math.max(0, 0.9 - progress)
      const size = particle.size * (1 - progress * 0.35)
      const inner = size * 0.45

      burstCtx!.save()
      burstCtx!.translate(x, y)
      burstCtx!.rotate(particle.rotation + progress * 1.2)
      burstCtx!.fillStyle = particle.color
      burstCtx!.globalAlpha = alpha
      burstCtx!.shadowColor = particle.color
      burstCtx!.shadowBlur = size * 2.4
      drawStar(burstCtx!, size, inner, 5)
      burstCtx!.restore()

      if (progress < 1) {
        hasActiveParticle = true
      }
    })

    if (hasActiveParticle) {
      burstAnimationFrame = requestAnimationFrame(drawParticles)
    } else {
      burstAnimationFrame = null
      burstCtx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  function triggerStarBurst() {
    if (!canAnimateBurst.value) return
    syncCanvasSize()
    if (!burstCanvasRef.value) return
    if (!burstCtx) {
      syncCanvasSize()
    }
    if (!burstCtx) return
    stopBurstAnimation()
    burstParticles = createBurstParticles()
    burstStartTime = 0
    burstCtx.clearRect(0, 0, burstCanvasRef.value.width, burstCanvasRef.value.height)
    burstAnimationFrame = requestAnimationFrame(drawParticles)
  }

  function setupMotionPreference() {
    if (typeof window === 'undefined') return
    motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion.value = motionMedia.matches
    motionListener = (event) => {
      reduceMotion.value = event.matches
    }
    motionMedia.addEventListener('change', motionListener)
  }

  function setupVisibilityListener() {
    if (typeof document === 'undefined') return
    visibilityListener = () => {
      documentVisible.value = document.visibilityState !== 'hidden'
      if (!documentVisible.value) {
        stopBurstAnimation()
      } else if (canAnimateBurst.value && burstParticles.length) {
        burstAnimationFrame = requestAnimationFrame(drawParticles)
      }
    }
    document.addEventListener('visibilitychange', visibilityListener)
    documentVisible.value = document.visibilityState !== 'hidden'
  }

  function setupIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        sectionVisible.value = entry?.isIntersecting ?? true
        if (!sectionVisible.value) {
          stopBurstAnimation()
        } else if (canAnimateBurst.value && burstParticles.length) {
          burstAnimationFrame = requestAnimationFrame(drawParticles)
        }
      },
      { threshold: 0.2 }
    )
    if (spriteSectionRef.value) {
      intersectionObserver.observe(spriteSectionRef.value)
    }
  }

  onMounted(() => {
    setupMotionPreference()
    setupVisibilityListener()
    syncCanvasSize()
    if (typeof window !== 'undefined' && burstContainerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncCanvasSize()
      })
      resizeObserver.observe(burstContainerRef.value)
    }
    setupIntersectionObserver()
  })

  onBeforeUnmount(() => {
    disposeCanvas()
    resizeObserver?.disconnect()
    resizeObserver = null
    if (motionMedia && motionListener) {
      motionMedia.removeEventListener('change', motionListener)
    }
    if (visibilityListener) {
      document.removeEventListener('visibilitychange', visibilityListener)
      visibilityListener = null
    }
    intersectionObserver?.disconnect()
    intersectionObserver = null
  })

  watch(
    () => options.showShiny.value,
    (isShiny, prev) => {
      if (isShiny && !prev) {
        triggerStarBurst()
      }
    }
  )

  return {
    spriteSectionRef,
    burstContainerRef,
    burstCanvasRef,
    triggerStarBurst,
    canAnimateBurst,
  }
}
