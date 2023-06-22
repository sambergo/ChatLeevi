import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as SecureStore from "expo-secure-store";

import en from "./translations/en.json";
import fi from "./translations/fi.json";

const getLanguagePreference = async () => {
  let preference = await SecureStore.getItemAsync("languagePreference");
  return preference || "en";
};

getLanguagePreference().then((lng) => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources: {
      en: { translation: en },
      fi: { translation: fi },
    },
    lng: lng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
});

// Save language preference to local storage when user changes it
i18n.on("languageChanged", async (lng) => {
  await SecureStore.setItemAsync("languagePreference", lng);
});

export default i18n;
