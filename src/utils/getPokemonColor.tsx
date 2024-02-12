interface Props {
  type?: string;
}

export const TYPE_COLOR = ({ type }: Props): string => {
  const defaultColor = "#ABABAB"; // Color por defecto en caso de que el tipo no coincida

  const typeColors: Record<string, string> = {
    bug: "#A6B91A",
    dragon: "#6F35FC",
    fighting: "#C22E28",
    fire: "#EE8130",
    ghost: "#735797",
    grass: "#7AC74C",
    ground: "#E2BF65",
    ice: "#96D9D6",
    normal: "#A8A77A",
    poison: "#A33EA1",
    psychic: "#F95587",
    rock: "#B6A136",
    water: "#6390F0",
    electric: "#F7D02C",
    flying: "#A98FF3",
    fairy: "#D685AD",
    dark: '#705746',
    steel: '#B7B7CE',
    default: "#ABABAB",
  };

  // Manejar el caso cuando type es undefined
  const lowercaseType = type ? type.toLowerCase() : undefined;
  const color = lowercaseType && typeColors[lowercaseType] ? typeColors[lowercaseType] : defaultColor;

  return color;
};
