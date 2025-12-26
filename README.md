<div align="center">
  <img src="./public/pokemon-logo.png" alt="Pokémon logo" width="180" />
  <h1>Pokedex V1 · Modern Pokémon Explorer</h1>
  <p>A cinematic way to browse Pokémon, blending sleek UI with real Pokédex data.</p>
</div>

---

## 🌟 Project Vision

Pokedex V1 is a design-forward Vue 3 experience that reimagines traditional Pokédex browsing.  
It delivers **immersive presentation**, **frictionless interactions**, and **accurate data** sourced from PokéAPI—turning every lookup into a hero moment.

---

## 🚀 Tech Stack

| Layer            | Technology                                    | Purpose                                                      |
|------------------|-----------------------------------------------|--------------------------------------------------------------|
| Frontend         | [Vue 3](https://vuejs.org/) + `<script setup>`| Component-driven UI with expressive Composition API patterns |
| Tooling          | [Vite](https://vitejs.dev/)                   | Ultra-fast dev server and optimized production bundles       |
| State Management | [Pinia](https://pinia.vuejs.org/)             | Centralized Pokémon data fetching and caching                |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) + custom gradients | Responsive design, layered backgrounds, glow effects |
| Animations       | [@vueuse/motion](https://motion.vueuse.org/)  | Organic sprite entrances and aura motion                     |
| Utilities        | [@vueuse/core](https://vueuse.org/)           | Composition utilities for media and interaction hooks        |
| API Layer        | [ofetch](https://github.com/unjs/ofetch)      | Typed PokéAPI requests with in-memory caching                |

---

## 🎯 Technical Goals

1. **Reusable architecture** – Services, stores, and composables isolate responsibilities (fetching, formatting, navigation).
2. **Efficient navigation** – Windowed ID lists prevent rendering all 1,010 Pokémon simultaneously.
3. **Immersive media handling** – Cry playback, shiny toggles, and sprite motion are encapsulated and reusable.
4. **Production-ready styling** – Tailwind-driven layout with gradients, glassmorphism, and responsive typography.

---

## 🧩 Project Structure

```
src/
├── components/
│   ├── pokemon/        # Hero card, sprite display, info panel, navigation widgets
│   ├── layout/         # App shell + footer
│   └── ui/             # Reusable primitives
├── composables/
│   ├── usePokemonFormatting.ts
│   ├── usePokemonMedia.ts
│   └── usePokemonNavigation.ts
├── services/
│   └── pokemonService.ts        # Fetch + map Pokémon + species data
├── stores/
│   └── pokemon.ts               # Pinia store orchestrating the hero card state
├── types/
│   └── pokemon.types.ts         # Shared interfaces
└── utils/
    ├── api.ts                   # Cached PokéAPI client
    ├── helpers.ts               # Formatting/mapping helpers
    └── typeColors.ts            # Color palettes per Pokémon type
```

---

## 📸 Highlights

- **Native name backdrop** – Uses Japanese names (when available) for oversized typographic backgrounds.
- **Aura rendering** – Glow colors adapt to the active type palette for instant visual storytelling.
- **Navigation duality** – Desktop vertical nav + mobile horizontal nav keep the UX cohesive.
- **Shiny toggle & cries** – Media composable manages permissions, motion, and playback seamlessly.

---

## 🧪 Development Workflow

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

---

## 🗺️ Roadmap Ideas

1. Favorites / recently viewed panel with local persistence  
2. Type filters and predictive search suggestions  
3. Extended accessibility (screen-reader labels, keyboard shortcuts)  
4. Multi-language support (EN / ES / JP copy toggles)  
5. Offline caching using IndexedDB for instant reloads  

---

## 🤝 Contributing

Want to elevate the Pokédex further? Fork the repo, open a PR, or start a discussion.  
Ideal areas: UX polish, accessibility, data insights (weaknesses, habitats, encounters).

---

<div align="center">
  <sub>Crafted with care. Gotta fetch ’em all.</sub>
</div>
