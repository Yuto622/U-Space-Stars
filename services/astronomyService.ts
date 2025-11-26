import { Star, CelestialObject } from '../types';

/**
 * Simplified conversion from Equatorial (RA/Dec) to Horizontal (Alt/Az) coordinates.
 * 
 * @param star The star object with RA/Dec
 * @param lat Observer latitude in degrees
 * @param lon Observer longitude in degrees
 * @param date Current Date object
 * @returns { altitude: number, azimuth: number } in degrees
 */
export const calculatePosition = (star: Star, lat: number, lon: number, date: Date) => {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const ra = star.ra; // degrees
  const dec = star.dec; // degrees

  // Calculate Local Sidereal Time (LST) - Simplified approximation
  // Greenwich Mean Sidereal Time (GMST) approximation
  const d = (date.getTime() - new Date(Date.UTC(2000, 0, 1, 12, 0, 0)).getTime()) / 86400000;
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  
  // Local Sidereal Time (LST) in hours
  let lst = gmst + lon / 15;
  if (lst < 0) lst += 24;
  if (lst > 24) lst -= 24;

  const lstDeg = lst * 15; // Convert hours to degrees
  
  // Hour Angle (HA)
  let ha = lstDeg - ra;
  if (ha < 0) ha += 360;

  // Convert to radians for trig functions
  const haRad = ha * toRad;
  const decRad = dec * toRad;
  const latRad = lat * toRad;

  // Calculate Altitude (Alt)
  // sin(Alt) = sin(Dec) * sin(Lat) + cos(Dec) * cos(Lat) * cos(HA)
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(sinAlt);
  const alt = altRad * toDeg;

  // Calculate Azimuth (Az)
  // cos(Az) = (sin(Dec) - sin(Alt) * sin(Lat)) / (cos(Alt) * cos(Lat))
  const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (Math.cos(altRad) * Math.cos(latRad));
  let azRad = Math.acos(Math.min(1, Math.max(-1, cosAz))); // Clamp to -1..1
  let az = azRad * toDeg;

  // Fix azimuth quadrant based on sin(HA)
  // If sin(HA) > 0, then Az is 360 - Az
  if (Math.sin(haRad) > 0) {
    az = 360 - az;
  }

  return { altitude: alt, azimuth: az };
};

export const getSkyObjects = (stars: Star[], lat: number, lon: number, date: Date): CelestialObject[] => {
  return stars.map(star => {
    const pos = calculatePosition(star, lat, lon, date);
    return {
      ...star,
      azimuth: pos.azimuth,
      altitude: pos.altitude,
      visible: pos.altitude > 0 // Only visible if above horizon
    };
  });
};