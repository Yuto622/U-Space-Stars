export interface Star {
  id: number;
  name: string; // Common name (e.g., Sirius)
  constellation: string;
  ra: number; // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to +90)
  mag: number; // Apparent magnitude
  color: string; // CSS color string approx
  description?: string;
}

export interface Planet {
  id: string;
  name: string;
  ra: number;
  dec: number;
  type: 'planet';
}

export interface CelestialObject extends Star {
  azimuth?: number; // Calculated live
  altitude?: number; // Calculated live
  x?: number; // Projected screen X
  y?: number; // Projected screen Y
  visible?: boolean;
}

export interface ObservationLog {
  id: string;
  date: string;
  location: string;
  target: string;
  notes: string;
  rating: number; // 1-5
}

export interface AstroEvent {
  id: string;
  date: string;
  title: string;
  type: 'meteor' | 'planet' | 'moon' | 'iss' | 'other';
  description: string;
  time?: string;
}

export enum AppView {
  HOME = 'HOME',
  SKY_MAP = 'SKY_MAP',
  CALENDAR = 'CALENDAR',
  LOGBOOK = 'LOGBOOK'
}