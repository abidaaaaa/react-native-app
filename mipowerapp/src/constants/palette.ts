// Paleta Dreamcore Pastel
export const P = {
  // Fondos
  bg: '#F2E9FF',
  bgAlt: '#FFEDF5',
  paper: '#FFFBFF',

  // "Ink" suave en lugar de negro duro
  ink: '#4A3A6B',
  inkSoft: '#7B6BA0',
  inkMute: '#B0A0CC',

  // Lavanda
  lavender: '#E8DDFF',
  lavenderSoft: '#F2E9FF',
  lavenderStrong: '#C9B5FF',
  lavenderDeep: '#8B7BC7',

  // Rosa
  rose: '#FFDCE9',
  roseSoft: '#FFEDF5',
  roseStrong: '#FFB8D1',
  roseInk: '#B84A7B',

  // Verde menta
  mint: '#D4F5E4',
  mintSoft: '#E8FAF0',
  mintStrong: '#A8EBCC',
  mintInk: '#4A9B7B',

  // Amarillo
  yellow: '#FFF4B8',
  yellowSoft: '#FFFBE0',
  yellowStrong: '#FFE585',
  yellowInk: '#B8952B',

  // Durazno / cielo
  peach: '#FFE5D4',
  peachStrong: '#FFCCA8',
  sky: '#D4ECFF',
  skyStrong: '#A8D4FF',
};

// Bloque soñador (bordes suaves + glow)
export const BLOCK = {
  borderWidth: 2,
  borderColor: P.ink,
  borderRadius: 24,
  shadowColor: P.lavenderStrong,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.45,
  shadowRadius: 14,
  elevation: 8,
};

export const MONO = 'monospace';

export const TILES = [
  { bg: P.lavenderStrong },
  { bg: P.roseStrong },
  { bg: P.mintStrong },
  { bg: P.yellowStrong },
  { bg: P.peachStrong },
  { bg: P.skyStrong },
];