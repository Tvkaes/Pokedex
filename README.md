<div align="center">
  <img src="./public/pokemon-logo.png" alt="Pokémon logo" width="180" />
  <h1>Pokedex V1 · Modern Pokémon Explorer</h1>
  <p>A cinematic way to browse Pokémon, blending sleek UI with real Pokédex data.</p>
</div>

---

## 🌐 Live Demo

- **Production:** https://pokedex-ruby-kappa.vercel.app  
- **Status:** Vercel build kept in sync with the `main` branch
- **Compatibility:** Desktop (≥1280px) recommended; mobile verified on iPhone 12 / Pixel 6

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

## 🧩 Project Structure & Data Flow

```
src/
├── modules/
│   └── pokedex/
│       ├── components/
│       │   ├── hero/          # Hero view, info panel, sprite display, navigation
│       │   ├── grid/          # Grid view, cards, mega toggle buttons
│       │   ├── controls/      # View toggle + shared UI
│       │   ├── filters/       # Generation filters and selectors
│       │   └── shared/        # Type badges and reusable atoms
│       ├── data/              # Generation metadata + mega stone mapping
│       ├── styles/            # Gradient layers + glassmorphism tokens
│       └── ...additional module assets
├── composables/
│   ├── usePokemonMedia.ts      # Sprite motion, shiny toggles, cry playback
│   └── usePokemonNavigation.ts # Horizontal + vertical navigation windows
├── services/
│   └── pokemonService.ts       # Fetch + map Pokémon, species, mega/primal info
├── stores/
│   └── pokemon.ts              # Pinia store orchestrating hero/grid state
├── types/
│   └── pokemon.types.ts        # Shared interfaces + mega form contracts
└── utils/
    ├── api.ts                  # Cached PokéAPI client (pokemon/species/items)
    ├── helpers.ts              # Formatting/mapping helpers
    └── typeColors.ts           # Color palettes per Pokémon type
```

**Main flow**

1. `pokemonService` uses `utils/api.ts` (ofetch + in-memory cache) to retrieve `pokemon`, `species`, `items`, and `evolution-chain`.
2. Normalized data flows into the `stores/pokemon.ts` store, which maintains navigation windows and caches all eight generations (1,010 entries).
3. Components in `modules/pokedex` consume the store via composables (`usePokemonMedia`, `usePokemonNavigation`) to keep hero, grid, and forms in sync.
4. Tailwind + VueUse Motion render the visual effects, while DaisyUI provides baseline tokens for the interactive controls.

This pipeline ensures the UI hits PokéAPI only once per Pokémon, reuses cache when switching generations, and keeps interactions smooth for everything from Kanto through Galar.

---

## 🧾 Dataset Coverage & API Strategy

- **Generations:** Full coverage from 1 through 8 (National Dex #001–#1010).
- **Key endpoints:** `/pokemon`, `/pokemon-species`, `/evolution-chain`, `/item` (mega stones), `/type`.
- **Gender differences:** Uses `front_female` sprites when available; otherwise falls back to PokéAPI’s shared official artwork.
- **Special forms:** Mega, Primal, Dynamax, and Gigantamax detected via `pokemonService.classifyVariant`.
- **Rate limiting:** `utils/api.ts` caches responses and throttles to six concurrent requests to respect PokéAPI limits.

> Known constraint: PokéAPI does not expose gender-specific official artwork; the hero info panel documents this limitation.

---

## 📸 Highlights

- **Native name backdrop** – Uses Japanese names (when available) for oversized typographic backgrounds.
- **Aura rendering** – Glow colors adapt to the active type palette for instant visual storytelling.
- **Navigation duality** – Desktop vertical nav + mobile horizontal nav keep the UX cohesive.
- **Shiny toggle & cries** – Media composable manages permissions, motion, and playback seamlessly.
- **Mega / primal / dynamax awareness** – Grid entries detect special forms, surface stone sprites (or Dynamax icons), and animate + play cries when toggling.
- **Multi-stone UX** – Pokémon with more than one mega evolution display a responsive row of stones so each form is one click away.
- **Competitive insights** – Hero details include a stat radar, recommended move categories, and quick ability summaries for instant team-building context.
- **Forms tab parity** – Regional and cosmetic variants render as cards with variant kind/region context while keeping the base form action one tap away.
- **Full dex navigation** – Generation buttons, keyboard shortcuts (`←/→`), and virtualized scrolling let you browse all 1,010 Pokémon without blocking the UI.
- **Matchups intelligence** – New Matchups tab surfaces top five weaknesses and offensive strengths based on live type chart calculations.

---

## 🎭 Use Cases

1. **Casual fan:** Enjoys the cinematic Pokédex with shadows, auras, and shiny toggles.
2. **Competitive trainer:** Checks base stats, abilities, and special forms before finalizing a team.
3. **Collector:** Switches regional variants to compare typing, palette, and narrative context.

---

## 💥 Alternate Forms System

The Pokédex now classifies every non-default form into two explicit buckets so the UI can keep battle-triggered transformations separate from regional/cosmetic variants:

| Bucket | Source | Consumed by | Notes |
|--------|--------|-------------|-------|
| `specialFormEntries` | Mega, Primal, Dynamax & Gigantamax | `PokemonInfoHeader`, `PokemonGridCard`, `PokemonGridMegaToggleButton`, `PokemonGridDynamaxToggleButton` | Buttons render official mega stone sprites or the custom `dynamax.svg` glyph and reuse cry + sprite motion logic via `usePokemonMedia`. |
| `regionalFormEntries` | Regional names (Alola, Hisui, Galar, etc.) + other special keywords | `PokemonInfoDetailPanel`, `PokemonFormsList`, `PokemonFormVariantCard` | Cards keep the base form accessible, hide the active mega index, and show dual-type badges per variant. |
| `typeMatchups` (computed) | Type chart multipliers per Pokémon type combo | `PokemonMatchupPanel` | Displays top 5 weaknesses and strengths by combining defensive multipliers and offensive coverage sources. |

This split is powered by:

1. `pokemonService.classifyVariant` → tags each variety with `variantKind` (mega/primal/dynamax/regional/special).
2. `PokemonFormEntry` (in `pokemon.types.ts`) → shared shape `{ form, index, secondaryType }` so components can reference the same metadata.
3. `usePokemonMedia` → exposes both arrays (`specialFormEntries`, `regionalFormEntries`) alongside sprite/cry management so hero and grid views stay in sync.

---

## 🔄 Recent Enhancements

- **Modular architecture:** All Pokédex-specific UI and data now live under `src/modules/pokedex`, enabling future feature modules to coexist cleanly.
- **Generation-first grid:** Pinia caches grid entries per generation while the service layer parallelizes fetches for smooth scrolling.
- **Mega evolution indicator:** Grid cards show a glassy mega stone button when alternate forms exist, complete with official sprites gathered via PokéAPI items.
- **Interactive mega toggles:** Clicking a stone animates the sprite (enter + exit pulses), swaps stats/name/ID, and replays the Pokémon cry for tactile feedback.
- **Cry + media parity:** Grid interactions reuse the same cry handling as the hero card, so audio feedback is consistent across views.
- **Dynamax-ready hero & grid:** Special form buttons now include a dedicated Dynamax/Gigantamax icon so giant forms sit alongside Mega and Primal states both in the hero header and grid cards.
- **Split alternate-form arrays:** Alternate forms are classified into `specialFormEntries` (Mega/Primal/Dynamax) and `regionalFormEntries`, letting the header focus on battle-triggered forms while the Forms tab restores regionals and other cosmetics.

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

## 🚀 Deployment Notes

- **Node:** 20.19 LTS (or higher per `"engines"`).
- **Environment vars:** No `.env` required; PokéAPI consumption is public. For multi-origin deployments, optionally override `VITE_POKEAPI_BASE`.
- **Build:** `pnpm build` emits `dist/` artifacts ready for Vercel/Netlify. Set `NODE_ENV=production` to enable Vue’s optimizations.

---

## 🗺️ Roadmap Ideas

1. Favorites / recently viewed panel with local persistence  
2. Type filters and predictive search suggestions  
3. Extended accessibility (screen-reader labels, keyboard shortcuts)  
4. Multi-language support (EN / ES / JP copy toggles)  
5. Offline caching using IndexedDB for instant reloads  

---

## ⚠️ Known Limitations & Next Steps

- **Testing:** No unit/e2e coverage yet. Next step: `vitest` + `playwright` for stores and navigation.
- **Accessibility:** Mega/shiny toggles still need full screen-reader support; plan is to add `aria-pressed`, focus states, and extra shortcuts.
- **Official assets:** PokéAPI lacks gender-specific official artwork; the UI documents this gap and shows fallbacks.
- **Localization:** UI is English-only; i18n (EN/ES/JP) is on deck once copy stabilizes.

---

## 🤝 Contributing

Want to elevate the Pokédex further? Fork the repo, open a PR, or start a discussion.  
Ideal areas: UX polish, accessibility, data insights (weaknesses, habitats, encounters).

---

<div align="center">
  <sub>Crafted with care. Gotta fetch ’em all.</sub>
</div>
