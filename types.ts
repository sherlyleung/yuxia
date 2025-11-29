export interface UserConfig {
  nickname: string;
  zodiac: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string; // e.g., "Sunny", "Cloudy"
  city: string;
  uvIndex?: number;
  aqi?: number;
}

export interface DailyContent {
  weatherTip: string; // Cat persona tip
  quote: string; // English quote
  weatherData: WeatherInfo; // Simulated or retrieved weather data
  horoscope: string; // Daily horoscope text
}

export interface FoodOption {
  suggestion: string;
  mood_text: string;
  category: string;
}