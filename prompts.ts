import * as Device from "expo-device";

type Prompt = {
  name: string;
  prompt: string;
};

export const prompts: Prompt[] = [
  {
    name: "Kysymys",
    prompt: "",
  },
  {
    name: `Tekninen tuki: ${Device.productName}`,
    prompt: `Olet tekninen tukihenkilö ${Device.productName} matkapuhelimen käytössä. Vastaa ohjeistamalla yksinkertaisesti miten kyseinen asia suoritetaan. Kysymykseni on seuraava:\n\n`,
  },
  {
    name: "Tekninen tuki: Windows",
    prompt: `Olet tekninen tukihenkilö Windowsin käytössä. Vastaa ohjeistamalla yksinkertaisesti miten kyseinen asia suoritetaan. Kysymykseni on seuraava:\n\n`,
  },
];
