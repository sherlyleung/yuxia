export enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}

export interface UserConfig {
  nickname: string;
  zodiac: ZodiacSign;
}

export interface WeatherInfo {
  temp: number;
  condition: string; // e.g., "Sunny", "Cloudy"
  city: string;
}

export interface DailyContent {
  weatherTip: string; // Cat persona tip
  quote: string; // English quote
  horoscope: string; // Horoscope text
  weatherData: WeatherInfo; // Simulated or retrieved weather data
}