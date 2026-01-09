/**
 * i18n - Internationalization Module
 *
 * Simple translation system for the YouthPerformance app.
 *
 * Usage:
 *
 * 1. Import the hook:
 *    import { useTranslation } from '../i18n'
 *
 * 2. Use in components:
 *    const { t } = useTranslation()
 *    return <h1>{t('home.hero.title')}</h1>
 *
 * 3. With interpolation:
 *    t('common.stepOf', { current: 1, total: 5 })
 *    // Returns: "Step 1 of 5"
 *
 * 4. Get nested objects:
 *    const benefits = t('bulletproofAnkles.benefits')
 *    // Returns: ["Stronger foot-ankle connection", ...]
 */

import { createContext, useCallback, useContext, useState } from "react";
import en from "./en.json";

// Available translations
const translations = {
  en,
};

// Default locale
const DEFAULT_LOCALE = "en";

// Context
const I18nContext = createContext(null);

/**
 * Get a nested value from an object using dot notation
 * @param {Object} obj - The object to search
 * @param {string} path - Dot-separated path (e.g., 'home.hero.title')
 * @returns {*} The value at the path, or the path itself if not found
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    if (current === undefined || current === null) return undefined;
    return current[key];
  }, obj);
}

/**
 * Interpolate variables in a string
 * @param {string} str - The string with {{variable}} placeholders
 * @param {Object} values - Object with variable values
 * @returns {string} The interpolated string
 */
function interpolate(str, values = {}) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] !== undefined ? values[key] : match;
  });
}

/**
 * I18n Provider Component
 * Wrap your app with this to enable translations
 */
export function I18nProvider({ children, initialLocale = DEFAULT_LOCALE }) {
  const [locale, setLocale] = useState(initialLocale);

  /**
   * Translation function
   * @param {string} key - The translation key (dot notation)
   * @param {Object} values - Optional interpolation values
   * @returns {*} The translated string or value
   */
  const t = useCallback(
    (key, values = {}) => {
      const translation = translations[locale] || translations[DEFAULT_LOCALE];
      const value = getNestedValue(translation, key);

      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }

      // If it's a string, interpolate values
      if (typeof value === "string") {
        return interpolate(value, values);
      }

      // Return arrays and objects as-is
      return value;
    },
    [locale],
  );

  /**
   * Change the current locale
   * @param {string} newLocale - The locale code (e.g., 'en', 'es')
   */
  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      // Optionally persist to localStorage
      localStorage.setItem("yp_locale", newLocale);
    } else {
      console.warn(`Locale not available: ${newLocale}`);
    }
  }, []);

  /**
   * Get all available locales
   */
  const availableLocales = Object.keys(translations);

  const value = {
    t,
    locale,
    changeLocale,
    availableLocales,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to access translations
 * @returns {{ t: Function, locale: string, changeLocale: Function, availableLocales: string[] }}
 */
export function useTranslation() {
  const context = useContext(I18nContext);

  // Fallback for when used outside provider (e.g., in tests)
  if (!context) {
    const t = (key, values = {}) => {
      const value = getNestedValue(en, key);
      if (value === undefined) return key;
      if (typeof value === "string") return interpolate(value, values);
      return value;
    };
    return {
      t,
      locale: DEFAULT_LOCALE,
      changeLocale: () => {},
      availableLocales: [DEFAULT_LOCALE],
    };
  }

  return context;
}

// Export the raw translations for direct access if needed
export { translations };

// Export default for convenience
export default { I18nProvider, useTranslation, translations };
