import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

import translationEN from '../assets/locales/en/translation.json';
import translationVI from '../assets/locales/vi/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'vi', // Set the initial language here
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
