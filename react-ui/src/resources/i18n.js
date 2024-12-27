import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationJSON from './translations.json'

i18n.use(initReactI18next).init({
    resources: translationJSON,
    lng: "en",
});