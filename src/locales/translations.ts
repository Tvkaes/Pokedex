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
  | 'pokedex.allRegions'
  | 'loading.entry'
  | 'search.placeholder'
  | 'search.noResults'
  | 'search.eyebrow'
  | 'search.title'
  | 'search.subtitle'
  | 'bio'
  | 'shinyForm'
  | 'baseForm'
  | 'starAbility'
  | 'hiddenAbility'
  | 'signatureMove'
  | 'noAbilityDescription'
  | 'noFeaturedAbility'
  | 'competitiveSets'
  | 'loadingSets'
  | 'noCompetitiveSets'
  | 'sweeper'
  | 'wallbreaker'
  | 'tank'
  | 'support'
  | 'generations.eyebrow'
  | 'generations.title'
  | 'generations.subtitle'
  | 'grid.empty'
  | 'sr.singleView'
  | 'sr.gridView'
  | 'sr.searchView'
  | 'sr.returnBaseForm'
  | 'sr.activateForm'
  | 'sr.returnFromDynamax'
  | 'sr.activateDynamax'
  | 'variant.mega'
  | 'variant.primal'
  | 'variant.dynamax'
  | 'shiny.tooltipBase'
  | 'shiny.tooltipShiny'
  | 'search.label'
  | 'search.suggestions'
  | 'search.submit'
  | 'search.random'
  | 'entry.aliasPrefix'
  | 'entry.aliasSuffix'
  | 'variant.base'
  | 'forms.backToBase'
  | 'forms.otherForms'
  | 'forms.hintPreview'
  | 'forms.primaryType'
  | 'forms.secondaryType'
  | 'forms.none'

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
    'pokedex.allRegions': 'Pokédex · All Regions',
    'loading.entry': 'Loading entry...',
    'search.placeholder': 'Name or number...',
    'search.noResults': 'No results found',
    'search.eyebrow': 'Pokédex',
    'search.title': 'Instantly jump to any species in cinematic view.',
    'search.subtitle': 'Enter a name or National Dex number and we will take you right to the hero experience.',
    bio: 'Bio',
    shinyForm: 'Shiny Form',
    baseForm: 'Base Form',
    starAbility: 'Star Ability',
    hiddenAbility: 'Hidden ability',
    signatureMove: 'Signature move',
    noAbilityDescription: 'No additional description available for this ability.',
    noFeaturedAbility: 'No featured ability available for this Pokémon.',
    competitiveSets: 'Competitive Move Sets',
    loadingSets: 'Loading sets...',
    noCompetitiveSets: 'This Pokémon does not have competitive sets available yet.',
    sweeper: 'Sweeper',
    wallbreaker: 'Wallbreaker',
    tank: 'Tank / Stall',
    support: 'Support',
    'generations.eyebrow': 'Generations',
    'generations.title': 'Explore the eras of the Pokédex',
    'generations.subtitle': 'Pick a region to load its full roster and browse every species.',
    'grid.empty': 'No Pokémon entries loaded for this generation yet.',
    'sr.singleView': 'Single view',
    'sr.gridView': 'Grid view',
    'sr.searchView': 'Search view',
    'sr.returnBaseForm': 'Return to base form for',
    'sr.activateForm': 'Activate form',
    'sr.returnFromDynamax': 'Return from Dynamax form',
    'sr.activateDynamax': 'Activate Dynamax form',
    'variant.mega': 'Mega',
    'variant.primal': 'Primal',
    'variant.dynamax': 'Dynamax',
    'shiny.tooltipBase': 'View base sprite',
    'shiny.tooltipShiny': 'View shiny sprite',
    'search.label': 'Search Pokémon',
    'search.suggestions': 'Suggestions:',
    'search.submit': 'Search',
    'search.random': 'Surprise me',
    'entry.aliasPrefix': 'Also known as',
    'entry.aliasSuffix': 'in its native regions.',
    'variant.base': 'BASE',
    'forms.backToBase': 'Return to base form',
    'forms.otherForms': 'Other forms',
    'forms.hintPreview': 'Preview in hero',
    'forms.primaryType': 'Primary type',
    'forms.secondaryType': 'Secondary type',
    'forms.none': 'No alternate forms available for this Pokémon.',
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
    'pokedex.allRegions': 'Pokédex · Todas las Regiones',
    'loading.entry': 'Cargando entrada...',
    'search.placeholder': 'Nombre o número...',
    'search.noResults': 'Sin resultados',
    'search.eyebrow': 'Pokédex',
    'search.title': 'Salta instantáneamente a cualquier especie en vista cinemática.',
    'search.subtitle': 'Ingresa un nombre o número de la Pokédex Nacional y te llevaremos directo a la experiencia hero.',
    bio: 'Bio',
    shinyForm: 'Forma Shiny',
    baseForm: 'Forma Base',
    starAbility: 'Habilidad Estrella',
    hiddenAbility: 'Habilidad oculta',
    signatureMove: 'Movimiento característico',
    noAbilityDescription: 'No hay descripción adicional disponible para esta habilidad.',
    noFeaturedAbility: 'No hay habilidad destacada disponible para este Pokémon.',
    competitiveSets: 'Sets Competitivos',
    loadingSets: 'Cargando sets...',
    noCompetitiveSets: 'Este Pokémon aún no tiene sets competitivos disponibles.',
    sweeper: 'Sweeper',
    wallbreaker: 'Wallbreaker',
    tank: 'Tanque / Stall',
    support: 'Soporte',
    'generations.eyebrow': 'Generaciones',
    'generations.title': 'Explora las eras de la Pokédex',
    'generations.subtitle': 'Elige una región para cargar su roster completo y explorar cada especie.',
    'grid.empty': 'Aún no hay entradas de esta generación.',
    'sr.singleView': 'Vista individual',
    'sr.gridView': 'Vista en cuadrícula',
    'sr.searchView': 'Vista de búsqueda',
    'sr.returnBaseForm': 'Volver a la forma base de',
    'sr.activateForm': 'Activar forma',
    'sr.returnFromDynamax': 'Volver de la forma Dynamax',
    'sr.activateDynamax': 'Activar forma Dynamax',
    'variant.mega': 'Mega',
    'variant.primal': 'Primal',
    'variant.dynamax': 'Dynamax',
    'shiny.tooltipBase': 'Ver sprite normal',
    'shiny.tooltipShiny': 'Ver sprite shiny',
    'search.label': 'Buscar Pokémon',
    'search.suggestions': 'Sugerencias:',
    'search.submit': 'Buscar',
    'search.random': 'Sorpréndeme',
    'entry.aliasPrefix': 'También conocido como',
    'entry.aliasSuffix': 'en sus regiones nativas.',
    'variant.base': 'BASE',
    'forms.backToBase': 'Volver a la forma base',
    'forms.otherForms': 'Otras formas',
    'forms.hintPreview': 'Ver en héroe',
    'forms.primaryType': 'Tipo principal',
    'forms.secondaryType': 'Tipo secundario',
    'forms.none': 'Este Pokémon no tiene formas alternas disponibles.',
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
    'pokedex.allRegions': 'ポケモン図鑑 · 全地方',
    'loading.entry': '読み込み中...',
    'search.placeholder': '名前または番号...',
    'search.noResults': '結果なし',
    'search.eyebrow': 'ポケモン図鑑',
    'search.title': 'シネマティックビューで任意の種に瞬時にジャンプ。',
    'search.subtitle': '名前または全国図鑑番号を入力すると、ヒーロー体験に直接移動します。',
    bio: 'バイオ',
    shinyForm: '色違い',
    baseForm: '通常フォルム',
    starAbility: 'スター特性',
    hiddenAbility: '隠れ特性',
    signatureMove: '専用技',
    noAbilityDescription: 'この特性の追加説明はありません。',
    noFeaturedAbility: 'このポケモンには注目の特性がありません。',
    competitiveSets: '対戦用セット',
    loadingSets: 'セット読み込み中...',
    noCompetitiveSets: 'このポケモンにはまだ対戦用セットがありません。',
    sweeper: 'スイーパー',
    wallbreaker: 'ウォールブレイカー',
    tank: 'タンク / 耐久',
    support: 'サポート',
    'generations.eyebrow': '世代',
    'generations.title': '図鑑の時代を巡ろう',
    'generations.subtitle': '地方を選んで全てのポケモンを読み込み、一覧できます。',
    'grid.empty': 'この世代のポケモンはまだ読み込まれていません。',
    'sr.singleView': '単体ビュー',
    'sr.gridView': 'グリッドビュー',
    'sr.searchView': '検索ビュー',
    'sr.returnBaseForm': '基本フォルムに戻す：',
    'sr.activateForm': 'フォルムを発動：',
    'sr.returnFromDynamax': 'ダイマックス形態から戻す：',
    'sr.activateDynamax': 'ダイマックス形態を発動：',
    'variant.mega': 'メガ',
    'variant.primal': 'ゲンシ',
    'variant.dynamax': 'ダイマックス',
    'shiny.tooltipBase': '通常の姿を表示',
    'shiny.tooltipShiny': '色違いの姿を表示',
    'search.label': 'ポケモンを検索',
    'search.suggestions': 'おすすめ：',
    'search.submit': '検索',
    'search.random': 'おまかせ',
    'entry.aliasPrefix': '別名',
    'entry.aliasSuffix': 'として知られています。',
    'variant.base': 'ベース',
    'forms.backToBase': '基本フォルムに戻る',
    'forms.otherForms': '別のフォルム',
    'forms.hintPreview': 'ヒーロービューでプレビュー',
    'forms.primaryType': 'メインタイプ',
    'forms.secondaryType': 'サブタイプ',
    'forms.none': 'このポケモンには別のフォルムがありません。',
  },
}
