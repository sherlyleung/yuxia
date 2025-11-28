import { UserConfig, DailyContent } from "../types";

// Helper to map WMO Weather Codes to our app's condition strings
const mapWmoCodeToCondition = (code: number): string => {
  // Codes from Open-Meteo
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Clouds";
  if (code === 45 || code === 48) return "Mist";
  if (code >= 51 && code <= 57) return "Drizzle"; // Drizzle & Freezing Drizzle
  if (code >= 61 && code <= 67) return "Rain";    // Rain & Freezing Rain
  if (code >= 71 && code <= 77) return "Snow";    // Snow fall & grains
  if (code >= 80 && code <= 82) return "Rain";    // Rain showers
  if (code === 85 || code === 86) return "Snow";  // Snow showers
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Clear"; // Default
};

// Weather Tips (Cat Persona - Translated)
const TIPS: Record<string, string[]> = {
  "Clear": [
    "Sun is shining, come sunbathe with me!",
    "Full of energy today, shining like the sun!",
    "A bit hot, remember to drink water, don't turn into a roasted bean!",
    "Great weather, let your mood fly high!"
  ],
  "Clouds": [
    "Grey skies are perfect for a cat nap.",
    "Don't let the clouds fool you, bring an umbrella just in case.",
    "Not too hot, let's sneak out to play!",
    "Cuddle day, come let me hug you."
  ],
  "Rain": [
    "Slippery roads, don't let my dried fish get wet!",
    "Rain sounds are cozy, let's watch a movie at home.",
    "Walk lightly like a cat on this wet floor.",
    "It's raining, remember to turn up the heat a little."
  ],
  "Drizzle": [
    "Misty rain, an umbrella makes it romantic.",
    "Careful not to wet your shoes, squishy is uncomfortable!",
    "Gentle rain, don't forget your raincoat.",
    "It's drizzling, wear an extra layer before going out."
  ],
  "Snow": [
    "Wow! It's snowing outside, hold me tight!",
    "Super cold today, wear extra layers meow.",
    "Want to step in the snow? Paws might get freezing.",
    "Slippery ground, walk slowly, slowly, slowly!"
  ],
  "Thunderstorm": [
    "Thunder! Come comfort me!",
    "Stormy wind and rain, it's safest to stay home.",
    "Close the windows tight, keep the rain out.",
    "Sudden heavy rain, absolutely do not go out today!"
  ],
  "Mist": [
    "The air is a bit thick, wear a mask to protect your nose.",
    "Foggy outside, watch your step carefully.",
    "It's grey out there, let's stay in the room.",
    "Breathe gently, keep the dust out."
  ],
  "Squall": [
    "Woo woo, dangerous outside, hide!",
    "Big wind! Absolutely do not go out today!",
    "Waiting for you to come home safe, be careful.",
    "Put away things outside that might blow away."
  ]
};

// Love Quotes
const LOVE_QUOTES = [
  "Where there is love there is life.",
  "Love matches the soul.",
  "To love and be loved is to feel the sun from both sides.",
  "Love is the whole thing. We are only pieces.",
  "I love you more than I have ever found a way to say to you.",
  "If I know what love is, it is because of you.",
  "Love is being stupid together.",
  "You are my heart, my life, my one and only thought.",
  "There is only one happiness in this life, to love and be loved.",
  "Love serves as a compass."
];

export const generateDailyContent = async (
  userConfig: UserConfig, 
  coords?: { lat: number; lon: number }
): Promise<DailyContent> => {
  
  let temp = 22;
  let condition = "Clear";
  let city = "Cat City";

  // If coordinates are provided, fetch real data
  if (coords) {
    try {
      // 1. Fetch Weather from Open-Meteo (Free, no key)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      
      if (weatherData.current_weather) {
        temp = Math.round(weatherData.current_weather.temperature);
        condition = mapWmoCodeToCondition(weatherData.current_weather.weathercode);
      }

      // 2. Fetch City Name from Nominatim (OpenStreetMap)
      const cityRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=10`
      );
      const cityData = await cityRes.json();
      
      // Try to find the best name
      city = cityData.address?.city || 
             cityData.address?.town || 
             cityData.address?.village || 
             cityData.address?.county || 
             "Local Area";

    } catch (error) {
      console.warn("Failed to fetch real weather/location:", error);
      // Fallback values are already set above
    }
  } else {
    // Fallback simulation if no coords provided (e.g. permission denied)
    const conditions = ["Clear", "Clouds", "Rain"];
    condition = conditions[Math.floor(Math.random() * conditions.length)];
    temp = Math.floor(Math.random() * (28 - 15) + 15);
  }

  // Select Quote
  const quote = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];

  // Select Tip based on Condition
  const specificTips = TIPS[condition] || TIPS["Clear"];
  const weatherTip = specificTips[Math.floor(Math.random() * specificTips.length)];

  // Select Horoscope (Real API Fetch)
  let horoscope = "";
  try {
    const response = await fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${userConfig.zodiac}&day=TODAY`
    );
    const data = await response.json();
    if (data.data && data.data.horoscope_data) {
      horoscope = data.data.horoscope_data;
    } else {
      throw new Error("Horoscope data missing");
    }
  } catch (error) {
    console.warn("Failed to fetch horoscope:", error);
    // Fallback if API fails
    horoscope = "The stars remain mysterious today, but luck is on your side. Trust your instincts!";
  }

  return {
    weatherTip,
    quote,
    horoscope,
    weatherData: {
      temp,
      condition,
      city
    }
  };
};