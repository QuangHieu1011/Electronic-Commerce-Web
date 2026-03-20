import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';
import { enToVi, enToViPatterns, viToEn, viToEnPatterns } from '../i18n/phraseMaps';

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = 'en';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const interpolate = (text, params = {}) => {
  return Object.keys(params).reduce((result, key) => {
    return result.replaceAll(`{{${key}}}`, String(params[key]));
  }, text);
};

const replaceByMap = (text, map, patterns = []) => {
  if (!text || typeof text !== 'string') return text;

  const exact = map[text.trim()];
  if (exact) {
    const leading = text.match(/^\s*/)?.[0] || '';
    const trailing = text.match(/\s*$/)?.[0] || '';
    return `${leading}${exact}${trailing}`;
  }

  const replacedByExactMap = Object.keys(map)
    .sort((a, b) => b.length - a.length)
    .reduce((acc, key) => acc.replaceAll(key, map[key]), text);

  return patterns.reduce((acc, pattern) => acc.replace(pattern.regex, pattern.replacement), replacedByExactMap);
};

const translateNode = (node, map, patterns) => {
  if (!node) return;

  if (node.nodeType === Node.TEXT_NODE) {
    const parentTag = node.parentElement?.tagName;
    if (parentTag === 'SCRIPT' || parentTag === 'STYLE') return;

    const nextValue = replaceByMap(node.nodeValue, map, patterns);
    if (nextValue !== node.nodeValue) {
      node.nodeValue = nextValue;
    }
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  ['placeholder', 'title', 'aria-label'].forEach((attr) => {
    const current = node.getAttribute(attr);
    if (!current) return;

    const nextValue = replaceByMap(current, map, patterns);
    if (nextValue !== current) {
      node.setAttribute(attr, nextValue);
    }
  });

  Array.from(node.childNodes).forEach((child) => translateNode(child, map, patterns));
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || DEFAULT_LANGUAGE);

  useEffect(() => {
    if (!translations[language]) {
      setLanguage(DEFAULT_LANGUAGE);
      return;
    }
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const map = language === 'en' ? viToEn : enToVi;
    const patterns = language === 'en' ? viToEnPatterns : enToViPatterns;

    const applyTranslation = () => {
      if (!document?.body) return;
      translateNode(document.body, map, patterns);
    };

    applyTranslation();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((addedNode) => translateNode(addedNode, map, patterns));
        }
        if (mutation.type === 'characterData' && mutation.target) {
          translateNode(mutation.target, map, patterns);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [language]);

  const t = (key, params) => {
    const active = translations[language] || translations[DEFAULT_LANGUAGE];
    const fallback = translations[DEFAULT_LANGUAGE];

    const value = getNestedValue(active, key) ?? getNestedValue(fallback, key) ?? key;
    if (typeof value !== 'string') return key;

    return interpolate(value, params);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'vi' : 'en'));
  };

  const contextValue = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
