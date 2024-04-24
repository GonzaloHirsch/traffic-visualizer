import * as fs from 'fs';
import { ExtendedFlow } from './interfaces';

const CACHE_PATH = '.cache/cache.json';

export const getBaseFlow = (): ExtendedFlow => {
  return {
    flows: {
      city_path: {},
      city_service: {},
      country_path: {},
      country_service: {},
      normal: {}
    },
    countries: new Set(),
    timestamp: new Date()
  };
};

export const loadCache = (): ExtendedFlow | undefined => {
  // Verify if it exists or not.
  if (fs.existsSync(CACHE_PATH)) {
    try {
      // Load it.
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) as ExtendedFlow;
    } catch (err) {
      console.error('Error reading file:', err);
      return undefined;
    }
  } else {
    console.warn(
      `Cache doesn't exist in directory ${CACHE_PATH}. Creating it...`
    );
    // Create cache structure if it doesn't exist.
    let parts = CACHE_PATH.split('/');
    for (let i = 0, target = './'; i < parts.length - 1; i++) {
      target += `${parts[i]}/`;
      if (!fs.existsSync(target)) fs.mkdirSync(target);
    }
    // Create the cache file if it doesn't exist.
    fs.writeFileSync(CACHE_PATH, JSON.stringify({} as ExtendedFlow));
    return undefined;
  }
};

export const initCache = (mode: string): ExtendedFlow => {
  // If no cache, just return an empty Flow.
  if (mode !== 'CACHE') return getBaseFlow();

  // Attempt to load the cache. If it loads, make sure the types are correct.
  let potentialLoad = loadCache();
  if (potentialLoad !== undefined) {
    potentialLoad.countries = new Set(potentialLoad.countries);
  } else {
    potentialLoad = getBaseFlow();
  }

  return potentialLoad;
};
