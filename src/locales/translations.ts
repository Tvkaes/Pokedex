export type Locale = 'en' | 'es' | 'ja'

export type TranslationKey =
  | 'height'
  | 'weight'
  | 'section.entry'
  | 'section.stats'
  | 'section.ability'
  | 'section.matchups'
  | 'section.forms'
  | 'matchups.damageTaken'
  | 'matchups.weakTo'
  | 'matchups.damageDealt'
  | 'matchups.strongAgainst'
  | 'matchups.noWeaknesses'
  | 'matchups.noStrengths'
  | 'language.label'

type TranslationMap = Record<TranslationKey, string>

export const translations: Record<Locale, TranslationMap> = {
  en: {
    height: 'Height',
    weight: 'Weight',
    'section.entry': 'Entry',
    'section.stats': 'Stats',
    'section.ability': 'Ability',
    'section.matchups': 'Matchups',
    'section.forms': 'Forms',
    'matchups.damageTaken': 'Damage taken',
    'matchups.weakTo': 'Weak to',
    'matchups.damageDealt': 'Damage dealt',
    'matchups.strongAgainst': 'Strong against',
    'matchups.noWeaknesses': 'No notable weaknesses detected.',
    'matchups.noStrengths': 'No offensive coverage detected.',
    'language.label': 'Language',
  },
  es: {
    height: 'Altura',
    weight: 'Peso',
    'section.entry': 'Entrada',
    'section.stats': 'Estadísticas',
    'section.ability': 'Habilidad',
    'section.matchups': 'Enfrentamientos',
    'section.forms': 'Formas',
    'matchups.damageTaken': 'Daño recibido',
    'matchups.weakTo': 'Débil contra',
    'matchups.damageDealt': 'Daño infligido',
    'matchups.strongAgainst': 'Fuerte contra',
    'matchups.noWeaknesses': 'No se detectaron debilidades notables.',
    'matchups.noStrengths': 'No hay cobertura ofensiva disponible.',
    'language.label': 'Idioma',
  },
  ja: {
    height: '高さ',
    weight: '重さ',
    'section.entry': '図鑑',
    'section.stats': '能力',
    'section.ability': '特性',
    'section.matchups': '相性',
    'section.forms': 'フォルム',
    'matchups.damageTaken': '被ダメージ',
    'matchups.weakTo': '苦手タイプ',
    'matchups.damageDealt': '与ダメージ',
    'matchups.strongAgainst': '得意タイプ',
    'matchups.noWeaknesses': '著しい弱点はありません。',
    'matchups.noStrengths': '有効な攻撃相性がありません。',
    'language.label': '言語',
  },
}
