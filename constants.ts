import { ZodiacSign } from './types';

export const ZODIAC_OPTIONS = Object.values(ZodiacSign);

export const APP_NAME = "Meowing Morning";
export const AUTHOR_NAME = "Qiao Xia";

export const DEFAULT_CONTENT = {
  weatherTip: "Sun is shining, come sunbathe with me!",
  quote: "Where there is love there is life.",
  horoscope: "Your luck is great today, perfect for eating treats.",
  weatherData: {
    temp: 22,
    condition: "Clear",
    city: "Cat City"
  }
};