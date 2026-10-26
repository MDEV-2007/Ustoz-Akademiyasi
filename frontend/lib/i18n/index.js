'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { uz } from './dictionaries/uz';
import { ru } from './dictionaries/ru';
import { en } from './dictionaries/en';

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALES_INFO } from './config';
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALES_INFO };

const dictionaries = { uz, ru, en };

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  t: uz,
  changeLanguage: () => {},
});

export function I18nProvider({ initialLocale = DEFAULT_LOCALE, children }) {
  const [locale, setLocale] = useState(() => {
    return SUPPORTED_LOCALES.includes(initialLocale) ? initialLocale : DEFAULT_LOCALE;
  });

  const t = getDictionary(locale);

  useEffect(() => {
    if (initialLocale && SUPPORTED_LOCALES.includes(initialLocale) && initialLocale !== locale) {
      setLocale(initialLocale);
    }
  }, [initialLocale]);

  const changeLanguage = (newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    setLocale(newLocale);

    // Save in cookie (1 year expiration)
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
      document.documentElement.lang = newLocale;

      // Update browser URL sub-path seamlessly (/uz -> /ru or /en)
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);

      let newPath;
      if (pathSegments.length > 0 && SUPPORTED_LOCALES.includes(pathSegments[0])) {
        pathSegments[0] = newLocale;
        newPath = '/' + pathSegments.join('/') + window.location.search + window.location.hash;
      } else {
        newPath = `/${newLocale}${currentPath === '/' ? '' : currentPath}` + window.location.search + window.location.hash;
      }

      window.history.pushState(null, '', newPath);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLanguage, locales: LOCALES_INFO }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: DEFAULT_LOCALE,
      t: uz,
      changeLanguage: () => {},
      locales: LOCALES_INFO,
    };
  }
  return context;
}
