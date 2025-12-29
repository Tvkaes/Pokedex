<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  primaryColor: string
  secondaryColor?: string | null
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let animationFrame: number | null = null
let startTime = 0

const ribbonMaterials: THREE.ShaderMaterial[] = []
let gridMaterial: THREE.ShaderMaterial | null = null
let particleMaterial: THREE.ShaderMaterial | null = null

const colorState = {
  primary: new THREE.Color(props.primaryColor || '#4338ca'),
  accent: new THREE.Color(props.secondaryColor || props.primaryColor || '#4338ca'),
}

if (!props.secondaryColor) {
  setAccentFromPrimary()
}

function setAccentFromPrimary() {
  const hsl = { h: 0, s: 0, l: 0 }
  colorState.primary.getHSL(hsl)
  colorState.accent.setHSL(hsl.h, Math.min(1, hsl.s + 0.25), Math.min(0.85, hsl.l + 0.12))
}

function initScene() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const { clientWidth, clientHeight } = container

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(clientWidth, clientHeight)
  renderer.setClearColor(0x000000, 0)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(colorState.primary.clone().lerp(new THREE.Color('#010310'), 0.8), 0.14)

  camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 50)
  camera.position.set(0, 0, 8)

  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)

  createRibbons()
  createGridPlane()
  createParticles()

  startTime = performance.now()
  animate()

  window.addEventListener('resize', handleResize)
}

function createRibbons() {
  if (!scene) return
  const group = new THREE.Group()
  const ribbonCount = 3

  for (let index = 0; index < ribbonCount; index += 1) {
    const geometry = new THREE.PlaneGeometry(16, 0.75, 320, 12)
    const uniforms = {
      uTime: { value: 0 },
      uPrimary: { value: colorState.primary },
      uRibbonColor: { value: colorState.accent.clone().offsetHSL(index * 0.015 - 0.02, 0.05 * index, 0.02 * index) },
      uOffset: { value: index * 0.7 },
      uSpeed: { value: 0.4 + index * 0.1 },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOffset;
        uniform float uSpeed;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin((pos.x * 1.5 + uTime * uSpeed) + uOffset) * 0.6;
          float roll = cos((pos.x * 0.8 - uTime * (uSpeed + 0.2)) + uOffset) * 0.35;
          pos.z += wave;
          pos.y += roll + uOffset - 0.9;
          pos.x += sin(uTime * 0.15 + uOffset) * 0.3;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform vec3 uRibbonColor;
        uniform vec3 uPrimary;
        void main() {
          float centerGlow = exp(-pow((vUv.y - 0.5) * 4.0, 2.0));
          float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
          vec3 base = mix(uPrimary * 0.4, uRibbonColor, centerGlow);
          float alpha = centerGlow * 0.8 * edgeFade;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(base, alpha);
        }
      `,
    })

    ribbonMaterials.push(material)

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.y = (index - 1) * 0.18
    mesh.position.z = -index * 0.8
    group.add(mesh)
  }

  scene.add(group)
}

function createGridPlane() {
  if (!scene) return
  const geometry = new THREE.PlaneGeometry(30, 22, 100, 100)
  const uniforms = {
    uTime: { value: 0 },
    uPrimary: { value: colorState.primary.clone() },
  }

  gridMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z += sin((pos.x + uTime * 0.4) * 1.5) * 0.25;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform vec3 uPrimary;

      float grid(vec2 uv, float zoom) {
        vec2 gv = fract(uv * zoom) - 0.5;
        vec2 line = smoothstep(0.45, 0.47, abs(gv));
        return 1.0 - min(line.x, line.y);
      }

      void main() {
        float major = grid(vUv * vec2(1.0, 0.8), 8.0);
        float minor = grid(vUv * vec2(1.0, 0.8), 24.0) * 0.5;
        float fade = smoothstep(0.05, 0.25, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
        float intensity = (major * 0.55 + minor * 0.35) * fade;
        if (intensity <= 0.01) discard;
        vec3 color = mix(vec3(0.02, 0.05, 0.12), uPrimary * 1.35, intensity);
        gl_FragColor = vec4(color, intensity * 0.8);
      }
    `,
  })

  const plane = new THREE.Mesh(geometry, gridMaterial)
  plane.position.set(0, -3.2, -3.5)
  plane.rotation.x = -0.7
  scene.add(plane)
}

function createParticles() {
  if (!scene) return
  const particleCount = 900
  const positions = new Float32Array(particleCount * 3)
  const offsets = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.2) * 10
    positions[i * 3 + 2] = -Math.random() * 6
    offsets[i] = Math.random() * Math.PI * 2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1))

  const uniforms = {
    uTime: { value: 0 },
    uAccent: { value: colorState.accent.clone() },
  }

  particleMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aOffset;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.6 + aOffset) * 0.6;
        pos.x += cos(uTime * 0.2 + aOffset) * 0.2;
        vAlpha = 0.45 + 0.4 * sin(uTime * 1.2 + aOffset * 2.0);
        gl_PointSize = 1.5 + 3.5 * vAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform vec3 uAccent;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(uAccent, alpha);
      }
    `,
  })

  const particles = new THREE.Points(geometry, particleMaterial)
  scene.add(particles)
}

function animate() {
  animationFrame = requestAnimationFrame(animate)
  const elapsed = (performance.now() - startTime) * 0.001

  ribbonMaterials.forEach((material) => {
    const timeUniform = material.uniforms.uTime
    if (timeUniform) {
      timeUniform.value = elapsed
    }
  })

  if (gridMaterial?.uniforms.uTime) {
    gridMaterial.uniforms.uTime.value = elapsed
  }

  if (particleMaterial?.uniforms.uTime) {
    particleMaterial.uniforms.uTime.value = elapsed
  }

  renderer?.render(scene as THREE.Scene, camera as THREE.Camera)
}

function handleResize() {
  if (!renderer || !camera || !containerRef.value) return
  const { clientWidth, clientHeight } = containerRef.value
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(clientWidth, clientHeight)
}

function dispose() {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)
  renderer?.dispose()
  scene?.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
      child.geometry?.dispose()
      const material = child.material
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose?.())
      } else {
        material?.dispose?.()
      }
    }
  })
  ribbonMaterials.length = 0
  gridMaterial = null
  particleMaterial = null
  renderer = null
  scene = null
  camera = null
}

function updateColors(primaryHex?: string, secondaryHex?: string | null) {
  colorState.primary.set(primaryHex || '#4338ca')
  if (secondaryHex) {
    colorState.accent.set(secondaryHex)
  } else {
    setAccentFromPrimary()
  }

  if (scene?.fog) {
    scene.fog.color.copy(colorState.primary.clone().lerp(new THREE.Color('#010310'), 0.8))
  }

  ribbonMaterials.forEach((material, index) => {
    material.uniforms.uPrimary?.value?.copy?.(colorState.primary) ?? (material.uniforms.uPrimary = { value: colorState.primary })
    const ribbonColor = material.uniforms.uRibbonColor?.value
    if (ribbonColor instanceof THREE.Color) {
      ribbonColor
        .copy(colorState.accent)
        .offsetHSL(index * 0.01 - 0.015, 0.015 * index, 0.008 * index)
    }
  })

  if (gridMaterial?.uniforms.uPrimary) {
    gridMaterial.uniforms.uPrimary.value.copy(colorState.primary)
  }

  if (particleMaterial?.uniforms.uAccent) {
    particleMaterial.uniforms.uAccent.value.copy(colorState.accent)
  }
}

onMounted(() => {
  initScene()
})

onBeforeUnmount(() => {
  dispose()
})

watch(
  () => [props.primaryColor, props.secondaryColor] as const,
  ([primary, secondary]) => {
    updateColors(primary, secondary ?? null)
  }
)
</script>

<template>
  <div ref="containerRef" class="stripe-hero-bg">
    <canvas ref="canvasRef" class="h-full w-full"></canvas>
    <div class="stripe-hero-bg__overlay" />
  </div>
</template>

<style scoped>
.stripe-hero-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  z-index: 0;
}

.stripe-hero-bg__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.2), rgba(2, 6, 23, 0.75));
  mix-blend-mode: screen;
  opacity: 0.8;
}
</style>
