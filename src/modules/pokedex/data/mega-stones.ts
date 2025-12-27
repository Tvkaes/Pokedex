export const MEGA_STONE_MAP: Record<string, string> = {
  'venusaur-mega': 'venusaurite',
  'charizard-mega-x': 'charizardite-x',
  'charizard-mega-y': 'charizardite-y',
  'blastoise-mega': 'blastoisinite',
  'alakazam-mega': 'alakazite',
  'gengar-mega': 'gengarite',
  'kangaskhan-mega': 'kangaskhanite',
  'pinsir-mega': 'pinsirite',
  'gyarados-mega': 'gyaradosite',
  'aerodactyl-mega': 'aerodactylite',
  'mewtwo-mega-x': 'mewtwonite-x',
  'mewtwo-mega-y': 'mewtwonite-y',
  'ampharos-mega': 'ampharosite',
  'scizor-mega': 'scizorite',
  'heracross-mega': 'heracronite',
  'houndoom-mega': 'houndoominite',
  'tyranitar-mega': 'tyranitarite',
  'blaziken-mega': 'blazikenite',
  'gardevoir-mega': 'gardevoirite',
  'mawile-mega': 'mawilite',
  'aggron-mega': 'aggronite',
  'medicham-mega': 'medichamite',
  'manectric-mega': 'manectite',
  'banette-mega': 'banettite',
  'absol-mega': 'absolite',
  'garchomp-mega': 'garchompite',
  'lucario-mega': 'lucarionite',
  'abomasnow-mega': 'abomasite',
  'beedrill-mega': 'beedrillite',
  'pidgeot-mega': 'pidgeotite',
  'slowbro-mega': 'slowbronite',
  'steelix-mega': 'steelixite',
  'sceptile-mega': 'sceptilite',
  'swampert-mega': 'swampertite',
  'sableye-mega': 'sablenite',
  'sharpedo-mega': 'sharpedonite',
  'camerupt-mega': 'cameruptite',
  'altaria-mega': 'altarianite',
  'glalie-mega': 'glalitite',
  'salamence-mega': 'salamencite',
  'metagross-mega': 'metagrossite',
  'latias-mega': 'latiasite',
  'latios-mega': 'latiosite',
  'lopunny-mega': 'lopunnite',
  'gallade-mega': 'galladite',
  'audino-mega': 'audinite',
  'diancie-mega': 'diancite',
  'rayquaza-mega': 'meteorite',
  'kyogre-primal': 'blue-orb',
  'groudon-primal': 'red-orb',
}

const FALLBACK_ITEM_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items'

export function getMegaStoneSlug(formName: string): string | undefined {
  return MEGA_STONE_MAP[formName.toLowerCase()]
}

export function buildItemSpriteUrl(slug: string): string {
  return `${FALLBACK_ITEM_BASE_URL}/${slug}.png`
}
