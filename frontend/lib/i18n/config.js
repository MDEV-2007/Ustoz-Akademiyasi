import { uz } from './dictionaries/uz';
import { ru } from './dictionaries/ru';
import { en } from './dictionaries/en';

export const SUPPORTED_LOCALES = ['uz', 'ru', 'en'];
export const DEFAULT_LOCALE = 'uz';

export const LOCALES_INFO = [
  { code: 'uz', name: 'O‘zbekcha', flag: '🇺🇿', shortLabel: 'UZ' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', shortLabel: 'RU' },
  { code: 'en', name: 'English', flag: '🇬🇧', shortLabel: 'EN' },
];

const dictionaries = { uz, ru, en };

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
