import { translations } from './translations.js';
import { readPref, writePref } from './storage.js';

const listeners = [];
const saved = readPref('language');
let currentLanguage =
  saved === 'id' || saved === 'en'
    ? saved
    : (navigator.language || '').toLowerCase().startsWith('id')
      ? 'id'
      : 'en';

export const getLanguage = () => currentLanguage;
export const t = (key) => translations[currentLanguage][key] ?? translations.id[key] ?? '';
export const onLanguageChange = (listener) => listeners.push(listener);

// Picks the active language from a {id, en} object or an option array; plain strings pass through.
export function textFor(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value))
    return value.length === 3
      ? value[currentLanguage === 'id' ? 1 : 2]
      : value[currentLanguage === 'id' ? 0 : 1];
  return value?.[currentLanguage] || value?.id || '';
}

export function setLanguage(language) {
  currentLanguage = language;
  writePref('language', language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[language][key];
    if (value === undefined) return;
    if (key.endsWith('Html')) element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nLabel));
  });
  const toggle = document.querySelector('[data-language-toggle]');
  toggle.textContent = language === 'id' ? 'EN' : 'ID';
  listeners.forEach((listener) => listener(language));
}
