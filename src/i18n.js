import i18n from 'i18next';
import {initReactI18next} from "react-i18next";
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from './config';

/**
 *  Note that react-i18next all the functions to load translations auto-suspense the rendering until a
 *  specific translation files is loaded, avoiding to load every single one since the app start.
 *  This avoid slowing down the loading of the site in the first page and it's all managed automatically.
 */

i18n
    .use(Backend) //load translations via xhr from /public/locales
    .use(LanguageDetector) //automatically detect browser language
    .use(initReactI18next) //this will make i18n available from ALL components automatically
    .init({ //standard i18next initialization object
        fallbackLng: 'en',
        debug: config.logging.level === 'debug' ? true : false, //set true to debug

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', //public/locales --- lng = language --- ns = namespace = filename
        },

        interpolation:{
            escapeValue: false, //react escapes by default
        },

        react: {
            wait: true, 
            useSuspense: false, //this at true would force us to create a suspense component in the root of the app, which would be a bit ugly
        }

    });

export default i18n;