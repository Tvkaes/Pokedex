interface TypeColorConfig {
  color: string
  gradient: string
  glow: string
}

export const TYPE_COLORS: Record<string, TypeColorConfig> = {
  normal: { color: '#9CA3AF', gradient: 'from-gray-400 via-gray-500 to-gray-600', glow: 'rgba(156,163,175,0.35)' },
  fire: { color: '#F97316', gradient: 'from-orange-500 via-red-500 to-pink-500', glow: 'rgba(249,115,22,0.4)' },
  water: { color: '#38BDF8', gradient: 'from-sky-400 via-blue-500 to-indigo-500', glow: 'rgba(56,189,248,0.35)' },
  electric: { color: '#FBBF24', gradient: 'from-amber-300 via-yellow-400 to-orange-500', glow: 'rgba(251,191,36,0.35)' },
  grass: { color: '#34D399', gradient: 'from-emerald-400 via-green-500 to-lime-500', glow: 'rgba(52,211,153,0.35)' },
  ice: { color: '#6EE7B7', gradient: 'from-cyan-300 via-teal-300 to-emerald-300', glow: 'rgba(110,231,183,0.35)' },
  fighting: { color: '#F87171', gradient: 'from-rose-500 via-red-500 to-orange-500', glow: 'rgba(248,113,113,0.4)' },
  poison: { color: '#C084FC', gradient: 'from-purple-400 via-fuchsia-500 to-pink-500', glow: 'rgba(192,132,252,0.4)' },
  ground: { color: '#D97706', gradient: 'from-amber-600 via-orange-600 to-yellow-500', glow: 'rgba(217,119,6,0.35)' },
  flying: { color: '#93C5FD', gradient: 'from-indigo-300 via-sky-400 to-cyan-300', glow: 'rgba(147,197,253,0.35)' },
  psychic: { color: '#EC4899', gradient: 'from-pink-500 via-rose-500 to-purple-500', glow: 'rgba(236,72,153,0.4)' },
  bug: { color: '#A3E635', gradient: 'from-lime-300 via-lime-500 to-green-500', glow: 'rgba(163,230,53,0.35)' },
  rock: { color: '#A8A29E', gradient: 'from-stone-400 via-stone-500 to-stone-600', glow: 'rgba(168,162,158,0.35)' },
  ghost: { color: '#8B5CF6', gradient: 'from-indigo-500 via-purple-500 to-violet-500', glow: 'rgba(139,92,246,0.4)' },
  dragon: { color: '#7C3AED', gradient: 'from-purple-500 via-violet-600 to-indigo-700', glow: 'rgba(124,58,237,0.45)' },
  dark: { color: '#4B5563', gradient: 'from-slate-600 via-slate-700 to-slate-800', glow: 'rgba(75,85,99,0.35)' },
  steel: { color: '#94A3B8', gradient: 'from-slate-300 via-slate-400 to-slate-500', glow: 'rgba(148,163,184,0.35)' },
  fairy: { color: '#F472B6', gradient: 'from-pink-300 via-pink-400 to-rose-400', glow: 'rgba(244,114,182,0.35)' }
}

export function getTypeColor(type?: string): TypeColorConfig {
  if (!type) return TYPE_COLORS.normal
  return TYPE_COLORS[type] ?? TYPE_COLORS.normal
}
