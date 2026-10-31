// Seasons + holidays driven by today's date and where you live.
// Seasons flip for the southern hemisphere and flatten out near the equator.
import { PAL } from './palette.js';

export const SEASONS = ['spring', 'summer', 'fall', 'winter'];
export const DEFAULT_LOCATION = { name: 'Denver, CO', lat: 39.74, lon: -104.99 };

export function seasonFor(date = new Date(), lat = DEFAULT_LOCATION.lat) {
  if (Math.abs(lat) < 15) return 'summer'; // tropics: no real seasons
  const m = date.getMonth(); // 0 = Jan
  let s = m >= 2 && m <= 4 ? 0 : m >= 5 && m <= 7 ? 1 : m >= 8 && m <= 10 ? 2 : 3;
  if (lat < 0) s = (s + 2) % 4;
  return SEASONS[s];
}

function easterSunday(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}

export const HOLIDAYS = ['halloween', 'thanksgiving', 'christmas', 'valentines', 'easter', 'stpatricks', 'july4'];

// Each holiday decorates for the run-up to it, like a real neighbourhood.
export function holidayFor(date = new Date()) {
  const y = date.getFullYear();
  const day = new Date(y, date.getMonth(), date.getDate());
  const at = (m, d) => new Date(y, m, d);
  const within = (a, b) => day >= a && day <= b;
  const easter = easterSunday(y);
  const thu = new Date(y, 10, 1);
  while (thu.getDay() !== 4) thu.setDate(thu.getDate() + 1);
  thu.setDate(thu.getDate() + 21); // 4th Thursday of November
  if (within(at(9, 12), at(10, 1))) return 'halloween';
  if (within(at(10, 2), thu)) return 'thanksgiving';
  if (within(at(10, 27), at(11, 31)) || within(at(0, 1), at(0, 3))) return 'christmas';
  if (within(at(1, 1), at(1, 14))) return 'valentines';
  if (within(at(2, 8), at(2, 17))) return 'stpatricks';
  if (within(new Date(easter.getTime() - 14 * 864e5), easter)) return 'easter';
  if (within(at(5, 27), at(6, 5))) return 'july4';
  return null;
}

export const HOLIDAY_LABEL = {
  halloween: 'Halloween', thanksgiving: 'Thanksgiving', christmas: 'Christmas', valentines: "Valentine's",
  easter: 'Easter', stpatricks: "St. Patrick's", july4: 'July 4th',
};

const THEMES = {
  spring: {
    grass: '#a9d17f', dirt: '#c9a97c', sand: '#e6d3a0', water: '#8ebbd6',
    leaf: ['#82bd5e', '#8fca69', '#76b157', '#9dd073'], cotton: ['#8fca69', '#9dd073'], aspen: ['#9dd073', '#a9d97f'],
  },
  summer: {
    grass: '#a8c77f', dirt: '#c9a97c', sand: '#e6d3a0', water: '#8ebbd6',
    leaf: ['#5f8f4a', '#6fa055', '#4f8250', '#7aa85b'], cotton: ['#6d9a4a', '#7aa85b', '#5f8f4a'], aspen: ['#7aa85b', '#6fa055'],
  },
  fall: {
    grass: '#b9c27e', dirt: '#c2a074', sand: '#e0cd9a', water: '#86b2c8',
    leaf: ['#d9822b', '#c9622f', '#e0a63a', '#b8472f', '#9aa045'], cotton: ['#d6b840', '#c9a63a', '#e0c85a'], aspen: ['#e8c85a', '#f0d46a', '#d9b440'],
  },
  winter: {
    grass: '#e9eff2', dirt: '#cfc6b8', sand: '#e8e2d2', water: '#b3cfe0',
    leaf: ['#8a7a68', '#7a6a58'], cotton: ['#8a7a68'], aspen: ['#9a8a78'],
  },
};

export const state = { season: 'summer', holiday: null };

// Mutates the shared palette in place so every asset picks up the season on its next draw.
export function applySeason(season, holiday = null) {
  const t = THEMES[season] || THEMES.summer;
  PAL.grass = t.grass; PAL.dirt = t.dirt; PAL.sand = t.sand; PAL.water = t.water;
  PAL.leaf = t.leaf; PAL.cotton = t.cotton; PAL.aspen = t.aspen;
  PAL.winter = season === 'winter';
  PAL.season = season;
  state.season = season;
  state.holiday = holiday;
}

export function loadLocation() {
  try {
    const raw = localStorage.getItem('assetlab.loc');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_LOCATION;
}
export function saveLocation(loc) {
  try { localStorage.setItem('assetlab.loc', JSON.stringify(loc)); } catch {}
}
