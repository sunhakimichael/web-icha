import { SITE } from './config.js';

// localStorage can throw (private mode, blocked storage), so every access is guarded.
// Values saved under the pre-rebrand "jelajahku-" prefix are migrated on first read.
export function readPref(name) {
  try {
    const key = SITE.storagePrefix + name;
    const legacyKey = `jelajahku-${name}`;
    const value = localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
    if (localStorage.getItem(legacyKey) !== null) {
      localStorage.removeItem(legacyKey);
      if (value !== null) localStorage.setItem(key, value);
    }
    return value;
  } catch {
    return null;
  }
}

export function writePref(name, value) {
  try {
    localStorage.setItem(SITE.storagePrefix + name, value);
  } catch {
    // Preference simply won't persist.
  }
}
