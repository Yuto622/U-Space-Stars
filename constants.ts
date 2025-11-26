import { Star, AstroEvent } from './types';

// Simplified Star Catalog (Top brightest stars + key constellation stars)
export const BRIGHT_STARS: Star[] = [
  { id: 1, name: "Sirius", constellation: "Canis Major", ra: 101.28, dec: -16.71, mag: -1.46, color: "#A0C8FF" },
  { id: 2, name: "Canopus", constellation: "Carina", ra: 95.98, dec: -52.69, mag: -0.74, color: "#E0E0E0" },
  { id: 3, name: "Rigil Kentaurus", constellation: "Centaurus", ra: 219.90, dec: -60.83, mag: -0.27, color: "#FFFFA0" },
  { id: 4, name: "Arcturus", constellation: "Boötes", ra: 213.91, dec: 19.18, mag: -0.05, color: "#FFD080" },
  { id: 5, name: "Vega", constellation: "Lyra", ra: 279.23, dec: 38.78, mag: 0.03, color: "#A0C8FF" },
  { id: 6, name: "Capella", constellation: "Auriga", ra: 79.17, dec: 45.99, mag: 0.08, color: "#FFFFA0" },
  { id: 7, name: "Rigel", constellation: "Orion", ra: 78.63, dec: -8.2, mag: 0.13, color: "#A0C8FF" },
  { id: 8, name: "Procyon", constellation: "Canis Minor", ra: 114.82, dec: 5.22, mag: 0.34, color: "#FFFFA0" },
  { id: 9, name: "Betelgeuse", constellation: "Orion", ra: 88.79, dec: 7.4, mag: 0.42, color: "#FF8080" },
  { id: 10, name: "Achernar", constellation: "Eridanus", ra: 24.42, dec: -57.23, mag: 0.46, color: "#A0C8FF" },
  { id: 11, name: "Hadar", constellation: "Centaurus", ra: 210.80, dec: -60.37, mag: 0.61, color: "#A0C8FF" },
  { id: 12, name: "Altair", constellation: "Aquila", ra: 297.69, dec: 8.86, mag: 0.76, color: "#FFFFFF" },
  { id: 13, name: "Acrux", constellation: "Crux", ra: 186.64, dec: -63.09, mag: 0.77, color: "#A0C8FF" },
  { id: 14, name: "Aldebaran", constellation: "Taurus", ra: 68.98, dec: 16.5, mag: 0.85, color: "#FFA060" },
  { id: 15, name: "Antares", constellation: "Scorpius", ra: 247.35, dec: -26.43, mag: 0.96, color: "#FF6060" },
  { id: 16, name: "Spica", constellation: "Virgo", ra: 201.29, dec: -11.16, mag: 0.97, color: "#A0C8FF" },
  { id: 17, name: "Pollux", constellation: "Gemini", ra: 116.32, dec: 28.02, mag: 1.14, color: "#FFD080" },
  { id: 18, name: "Fomalhaut", constellation: "Piscis Austrinus", ra: 344.41, dec: -29.62, mag: 1.16, color: "#FFFFFF" },
  { id: 19, name: "Deneb", constellation: "Cygnus", ra: 310.35, dec: 45.28, mag: 1.25, color: "#A0C8FF" },
  { id: 20, name: "Mimosa", constellation: "Crux", ra: 191.93, dec: -59.68, mag: 1.25, color: "#A0C8FF" },
  // Polaris (North Star) - Essential for orientation
  { id: 99, name: "Polaris", constellation: "Ursa Minor", ra: 37.95, dec: 89.26, mag: 1.97, color: "#F0F0F0" },
];

export const MOCK_EVENTS: AstroEvent[] = [
  { id: '1', date: '2023-10-21', title: 'オリオン座流星群 ピーク', type: 'meteor', description: 'ハレー彗星を母天体とする流星群。深夜から明け方が観測のチャンス。', time: '23:00 - 04:00' },
  { id: '2', date: '2023-10-24', title: '金星 西方最大離角', type: 'planet', description: '金星が太陽から最も西に離れ、明け方の東の空で見やすくなります。', time: '04:30 - 06:00' },
  { id: '3', date: '2023-10-29', title: '部分月食', type: 'moon', description: '明け方、西の空に沈む月がわずかに欠けます。', time: '04:35 - 05:53' },
  { id: '4', date: '2023-11-03', title: '木星 衝', type: 'planet', description: '木星が太陽と反対側に位置し、一晩中観測の好機です。非常に明るく輝きます。', time: '18:00 - 05:00' },
  { id: '5', date: 'TODAY', title: 'ISS 日本上空通過', type: 'iss', description: '国際宇宙ステーションが明るく輝きながら空を横切ります。', time: '19:42 - 19:46' },
];

export const CONSTELLATION_LINES: number[][] = [
  // Simplified pairs of Star IDs to draw lines (Mockup logic - in real app, need full graph)
  [7, 9], // Orion: Rigel - Betelgeuse (Approx)
  [9, 14], // Orion to Taurus
  [5, 12], // Vega - Altair
  [5, 19], // Vega - Deneb
  [12, 19], // Altair - Deneb (Summer Triangle)
];