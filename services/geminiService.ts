import { UserConfig, DailyContent, FoodOption } from "../types";

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

// --- CAT PERSONA TIPS (English) ---

const WEATHER_TIPS: Record<string, string[]> = {
  "Clear": [
    "Sunbeams everywhere! Perfect time for a nap on the windowsill. ☀️",
    "The sky is blue like a bird's egg. Let's watch birds through the glass! 🐦",
    "It's bright outside! Don't forget your sunglasses, cool cat. 😎",
    "A purr-fect day to chase shadows in the garden. 🐾",
    "Soak up the sun, but don't forget to hydrate! 💧"
  ],
  "Clouds": [
    "The sky is fluffy like my belly. Good napping weather. ☁️",
    "No sunbeams to chase, but plenty of clouds to count.",
    "It's a grey day, let's make our own sunshine with cuddles! ❤️",
    "Soft light outside—I look even more beautiful in photos today. 📸"
  ],
  "Rain": [
    "Water falling from the sky? Yuck! Perfect excuse to stay in bed. ☔",
    "Raindrops on the roof... the best lullaby for a cat nap. 💤",
    "Don't get your fur wet! Take an umbrella if you must leave me. ☂️",
    "Let's stay inside and watch the world get washed clean. 🏠"
  ],
  "Drizzle": [
    "Just a little sprinkle. A raincoat would look cute on you! 🧥",
    "Misty and mysterious... keep your paws dry!",
    "It's drizzling! Don't slip on the wet pavement. 🐾"
  ],
  "Snow": [
    "The world is white and cold! My paws prefer the warm rug. ❄️",
    "It's freezing! Wrap up like a burrito before you go out. 🧣",
    "Snowflakes are dancing! Watch them from the warm window. 🏠",
    "If you go out, walk carefully! Don't slide like a penguin. 🐧"
  ],
  "Thunderstorm": [
    "Boom! That was loud! I'm hiding under the bed, come protect me! ⚡",
    "Stormy weather means extra treats are required for bravery. 🐟",
    "Stay inside! It's too wild for a civilized cat out there. 🚫"
  ],
  "Mist": [
    "It's foggy! I can't see the birds... spooky. 🌫️",
    "Visibility is low, keep your eyes peeled (like mine at 3AM). 👀",
    "A mysterious day. Perfect for reading a book indoors. 📖"
  ]
};

// UV Specific Tips (Triggered when UV is high)
const UV_TIPS = {
  high: [
    "The sun is biting today! Put on your sunscreen, human. 🧴",
    "It's getting hot! Stay in the shade like a smart kitty. 🌳",
    "UV alert! Protect your skin, I need you healthy to open cans. 🥫"
  ],
  extreme: [
    "Whoa, the sun is angry! Stay inside and pet me instead. 🏠",
    "Dangerously bright! Don't go out unless you wrap up tight. 🔥",
    "The floor is lava... I mean, the outside is a toaster! Avoid the sun! ☀️"
  ]
};

// AQI Specific Tips (Triggered when Air Quality is bad)
const AQI_TIPS = {
  poor: [
    "Sniff... the air smells funny. Maybe skip the long run? 🏃‍♀️",
    "It's a bit dusty out there. Let's play indoors today. 😷",
    "Air quality isn't great. Keep those windows closed! 🪟"
  ],
  hazardous: [
    "Yuck! The air is thick. Stay inside with the air purifier! 💨",
    "Hazardous air! Perfect excuse to cancel plans and cuddle. ❤️",
    "Don't go out there! It's not fit for man nor beast. 🛑"
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
  "Love serves as a compass.",
  "My dream wouldn't be complete without you in it.",
  "You're the finest, loveliest, tenderest, and most beautiful person I have ever known.",
  "You are the light by which my heart finds its way.",
  "The best view comes after the hardest climb, and you are my best view.",
  "Every love story is beautiful, but ours is my favorite.",
  "I love the way you love me.",
  "You are my today and all of my tomorrows.",
  "We go together like coffee and donuts.",
  "You make my heart smile.",
  "The only paradise I ever need is you.",
  "In a sea of people, my eyes will always search for you.",
  "I want to be with you till the last page of my life.",
  "Being deeply loved by someone gives you strength.",
  "I knew I loved you when your happiness became mine.",
  "You are my favorite distraction.",
  "Thank you for existing.",
  "Together is a wonderful place to be.",
  "I found my missing piece in you.",
  "You are the reason I believe in magic.",
  "I love you times infinity."
];

// Simulated DB: Food Options
const FOOD_OPTIONS: FoodOption[] = [
  // --- Chinese Food ---
  { suggestion: "Lanzhou Hand-Pulled Beef Noodles (Clear Broth)", mood_text: "Long noodles for a long dog like me! The broth is warm and soothing.", category: "Chinese" },
  { suggestion: "Spicy Cumin Lamb Skewers (Xinjiang Style)", mood_text: "It smells amazing! A little spicy kick, just keep your water ready!", category: "Chinese" },
  { suggestion: "Peking Duck Pancakes (Duck Meat Only)", mood_text: "Crunchy skin! Wrap it up like a little blanket. No pork here, just ducky goodness.", category: "Chinese" },
  { suggestion: "Steamed Prawn Dumplings (Har Gow)", mood_text: "Bouncy shrimp pouches! They are small and cute, just like... well, not me, I'm long.", category: "Chinese" },
  { suggestion: "Sichuan Boiled Beef (Shui Zhu Niu - Mild)", mood_text: "Ask for \"Xiao La\" (little spicy)! It's oily and tender. Don't choke on the chili!", category: "Chinese" },
  { suggestion: "Kung Pao Chicken (Peanuts & Chili)", mood_text: "A classic! A tiny bit spicy and sweet. Don't let me eat the peanuts!", category: "Chinese" },
  { suggestion: "Hainanese Chicken Rice", mood_text: "So soft and fragrant! The ginger sauce is the secret weapon. Simple and yummy.", category: "Chinese" },
  { suggestion: "Beef and Broccoli Stir-fry", mood_text: "Crunchy greens and chewy beef. Even I know broccoli is good for you. Woof!", category: "Chinese" },
  { suggestion: "Tomato and Egg Stir-fry with Rice", mood_text: "The comfort food of champions! The red and yellow colors look so tasty.", category: "Chinese" },
  { suggestion: "Biang Biang Noodles with Beef (Chili Oil)", mood_text: "The noodles are wider than my ears! Spicy, chewy, and delicious.", category: "Chinese" },
  { suggestion: "Cantonese Steamed Fish (Ginger & Shallots)", mood_text: "Fresh and light! I promise not to stare at the fish... too much.", category: "Chinese" },
  { suggestion: "Xinjiang Big Plate Chicken (Da Pan Ji)", mood_text: "Potatoes and chicken in a spicy sauce! It's a big feast, perfect for sharing.", category: "Chinese" },
  { suggestion: "Dry-Fried Green Beans (Minced Beef)", mood_text: "Crunchy beans! Make sure they use beef mince, not the other meat!", category: "Chinese" },
  { suggestion: "Beef Chow Fun (Dry Fried Rice Noodles)", mood_text: "That smoky wok smell! Wide noodles are just the best.", category: "Chinese" },
  { suggestion: "Salt and Pepper Squid", mood_text: "Crispy! Salty! I love the crunch sound it makes when you chew.", category: "Chinese" },
  { suggestion: "Roast Duck with Rice", mood_text: "That glossy skin smells so rich. A special treat for a special human!", category: "Chinese" },
  { suggestion: "Black Pepper Beef Tenderloin", mood_text: "A little peppery kick to wake up your nose! Juicy and bold flavors.", category: "Chinese" },
  { suggestion: "Fried Rice with Shrimp and Egg (No BBQ Pork)", mood_text: "Golden grains of rice! I made sure they didn't put any pink meat in it.", category: "Chinese" },
  { suggestion: "Curry Beef Brisket (Hong Kong Style)", mood_text: "Stewed until it melts! The curry sauce is thick and yummy.", category: "Chinese" },
  { suggestion: "Hotpot (Mushroom & Spicy Beef Tallow Broth)", mood_text: "Dipping time! Pick the spicy broth, but don't cry if it's too hot!", category: "Chinese" },
  { suggestion: "Lamb Hot Pot (Beijing Style)", mood_text: "Thin slices of lamb in boiling water. Simple and warms the belly!", category: "Chinese" },
  { suggestion: "Garlic Butter Prawns (Dairy-Free Butter/Oil)", mood_text: "Garlic protects us from vampires! And it tastes delicious.", category: "Chinese" },
  { suggestion: "Mongolian Beef with Scallions", mood_text: "Savory and rich sauce. The beef is super tender, can I have a bite?", category: "Chinese" },
  { suggestion: "Braised Eggplant in Garlic Sauce (Yu Xiang)", mood_text: "Soft and flavorful. It's spicy and sweet, perfect with white rice.", category: "Chinese" },
  { suggestion: "Teochew Fish Ball Noodle Soup", mood_text: "Bouncy fish balls! A light meal so you don't get a food coma.", category: "Chinese" },

  // --- International Food ---
  { suggestion: "Vietnamese Pho Tai (Rare Beef Noodle Soup)", mood_text: "Liquid gold! Add extra lime and basil. It's warm like a hug.", category: "International" },
  { suggestion: "Thai Green Curry Chicken (Coconut Milk)", mood_text: "Creamy but no dairy! The coconut milk makes the spice gentle enough for you.", category: "International" },
  { suggestion: "Japanese Chicken Ramen (Tori Paitan)", mood_text: "Rich chicken soup! No pork bones here, just creamy chicken love.", category: "International" },
  { suggestion: "Korean Bibimbap (Beef, No Cheese)", mood_text: "Mix it up! The crispy rice at the bottom is the treasure.", category: "International" },
  { suggestion: "Korean Fried Chicken (Soy Garlic Glaze)", mood_text: "Crunchy and sticky! Soy garlic is better than spicy for today, trust me.", category: "International" },
  { suggestion: "Malaysian Laksa (Seafood)", mood_text: "A flavor explosion! It's a bit spicy, so keep a tissue ready for your nose.", category: "International" },
  { suggestion: "Italian Seafood Marinara Pasta (No Cheese)", mood_text: "Tomato base is best! Fresh seafood and no tummy-aching cheese.", category: "International" },
  { suggestion: "Japanese Sashimi Bowl (Chirashi Don)", mood_text: "So much fresh fish! It's like a fancy feast. Healthy fats for a shiny coat!", category: "International" },
  { suggestion: "Thai Pad See Ew (Beef)", mood_text: "Flat, chewy noodles with sweet soy sauce. Not spicy, just yummy.", category: "International" },
  { suggestion: "Lebanese Lamb Kafta Plate (Hummus)", mood_text: "Grilled meat and creamy hummus! Dip the bread. No yogurt sauce!", category: "International" },
  { suggestion: "Indonesian Nasi Goreng (Chicken)", mood_text: "Spicy fried rice with an egg on top. Pop the yolk!", category: "International" },
  { suggestion: "Steak Frites (Grilled Steak and Fries)", mood_text: "Red meat time! My hunter instincts are tingling. Don't forget the fries.", category: "International" },
  { suggestion: "Mexican Tacos (Beef, No Cheese/Sour Cream)", mood_text: "Add extra guacamole instead of cheese! Crunchy and fresh.", category: "International" },
  { suggestion: "Turkish Chicken Shish Kebab (Chili Sauce)", mood_text: "Grilled perfection. Ask for the red sauce, stay away from the white sauce!", category: "International" },
  { suggestion: "Lamb Rogan Josh (Check: Dairy-Free)", mood_text: "Rich tomato and spice gravy. Usually dairy-free, but ask just in case!", category: "International" },

  // --- Sydney Specialties ---
  { suggestion: "Fresh Sydney Rock Oysters", mood_text: "Taste the ocean! Fancy and fresh, just like us.", category: "Sydney" },
  { suggestion: "Smashed Avo on Toast (No Feta Cheese)", mood_text: "The Sydney Brunch classic! Creamy avocado is nature's butter. Skip the cheese!", category: "Sydney" },
  { suggestion: "Barramundi & Chips (Grilled)", mood_text: "Local fish! Grilled is healthier so we can run faster later.", category: "Sydney" },
  { suggestion: "Seafood Platter (Prawns & Bugs)", mood_text: "A feast from the sea! Prawns are my favorite tiny snacks.", category: "Sydney" },
  { suggestion: "Aussie Beef Burger (No Cheese, Add Beetroot)", mood_text: "A big juicy burger! The beetroot makes it messy but sweet.", category: "Sydney" },
  { suggestion: "Oporto Bondi Burger (Chili Sauce)", mood_text: "It's a Sydney classic! The chili sauce has a kick, are you brave today?", category: "Sydney" },

  // --- General/Fast Food ---
  { suggestion: "KFC Wicked Wings (Box Meal)", mood_text: "I can smell the fried chicken from a mile away! Just a cheeky treat.", category: "General" },
  { suggestion: "Subway Roast Beef (No Cheese)", mood_text: "Fresh and fast. Load it up with all the salads!", category: "General" },
  { suggestion: "Sushi Roll Takeaway (Salmon Avocado)", mood_text: "Quick bite! Perfect for eating while walking (or walking me).", category: "General" },
  { suggestion: "McDonald's Quarter Pounder (No Cheese)", mood_text: "Just the beef and pickles! Sometimes you just need a burger.", category: "General" }
];

// Wisdom Answers
const WISDOM_ANSWERS: string[] = [
  "Absolutely! Go for it like I chase a laser dot.",
  "Yes! The sunniest answer for you.",
  "The stars say YES. Woof!",
  "Do it. You deserve a big treat afterwards.",
  "My tail is wagging for this idea!",
  "Definitely! Be as decisive as a cat at mealtime.",
  "A resounding purr of agreement!",
  "I sense a great adventure ahead. Go!",
  "This is a 'zoomies' worthy idea!",
  "All paws point to YES.",
  "Chase that dream! You got this.",
  "Why not? Life's too short for 'maybes.'",
  "Hmm, I think you should nap on it first.",
  "Nope. Too much effort for today.",
  "My kitty intuition says 'Wait.'",
  "Maybe tomorrow, when the weather is warmer.",
  "My little legs say \"Stop!\" Take a break instead.",
  "Don't stress! The answer is no for now.",
  "Not quite. Focus on cuddles instead.",
  "Re-ask when you've had a snack.",
  "Hold that thought. It’s too late to decide.",
  "Ask me again after I finish this nap.",
  "The answer is tangled in a ball of yarn.",
  "I need more information... like treats.",
  "Ask me again when the moon is full.",
  "The signal is weak. Try again later.",
  "Depends on whether the squirrels are out.",
  "Maybe. Did you remember to stretch today?",
  "I'm too distracted by the dust bunny to focus.",
  "The universe is being sneaky.",
  "Look outside. The answer is floating by.",
  "That's a secret only the best dog knows.",
  "Try flipping a coin, human!",
  "Is it about us? Then the answer is always YES.",
  "Follow your happiness; it leads to me.",
  "Let's make a decision that brings you comfort.",
  "Don't overthink it, my love.",
  "When in doubt, choose kindness.",
  "You are my favorite thought.",
  "The answer is as long as my body—it's complicated, but good!",
  "Do whatever makes you smile.",
  "Be brave, like a tiny dog facing a big world.",
  "Choose the option that leads to cozy blankets.",
  "Remember that I love you most.",
  "The best decision is to stay close to me.",
  "Your peace is more important than the solution.",
  "Just knowing you exist is the best answer.",
  "Trust the process, and trust your heart.",
  "We will figure it out together.",
  "Simply choose what feels like home."
];

export const generateDailyContent = async (
  userConfig: UserConfig, 
  coords?: { lat: number; lon: number }
): Promise<DailyContent> => {
  
  let temp = 22;
  let condition = "Clear";
  let city = "Cat City";
  let uvIndex = 0;
  let aqi = 0;

  // If coordinates are provided, fetch real data
  if (coords) {
    try {
      // 1. Fetch Weather (Temp + Daily Max UV) & AQI in parallel
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&daily=uv_index_max&timezone=auto`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=us_aqi`
        )
      ]);

      const weatherData = await weatherRes.json();
      const aqiData = await aqiRes.json();
      
      // Parse Weather
      if (weatherData.current_weather) {
        temp = Math.round(weatherData.current_weather.temperature);
        condition = mapWmoCodeToCondition(weatherData.current_weather.weathercode);
      }
      
      // Parse UV (Daily Max)
      if (weatherData.daily && weatherData.daily.uv_index_max && weatherData.daily.uv_index_max.length > 0) {
        uvIndex = Math.round(weatherData.daily.uv_index_max[0]);
      }

      // Parse AQI
      if (aqiData.current && typeof aqiData.current.us_aqi === 'number') {
        aqi = aqiData.current.us_aqi;
      }

      // 2. Fetch City Name from Nominatim
      const cityRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=10`
      );
      const cityData = await cityRes.json();
      
      city = cityData.address?.city || 
             cityData.address?.town || 
             cityData.address?.village || 
             cityData.address?.county || 
             "Local Area";

    } catch (error) {
      console.warn("Failed to fetch real weather/location:", error);
    }
  } else {
    // Fallback simulation
    const conditions = ["Clear", "Clouds", "Rain"];
    condition = conditions[Math.floor(Math.random() * conditions.length)];
    temp = Math.floor(Math.random() * (28 - 15) + 15);
    uvIndex = Math.floor(Math.random() * 11);
    aqi = Math.floor(Math.random() * 100);
  }

  // Select Quote
  const quote = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];

  // --- Select Tip with Priority Logic ---
  let selectedTip = "";
  
  // Helper to pick random from array
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Priority 1: Hazardous/Poor Air Quality
  if (aqi > 150) {
    selectedTip = pick(AQI_TIPS.hazardous);
  } 
  // Priority 2: Extreme/High UV
  else if (uvIndex >= 8) {
    selectedTip = pick(UV_TIPS.extreme);
  } 
  // Priority 3: Poor Air (Moderate-Poor)
  else if (aqi > 100) {
    selectedTip = pick(AQI_TIPS.poor);
  }
  // Priority 4: High UV (6-7)
  else if (uvIndex >= 6) {
    selectedTip = pick(UV_TIPS.high);
  }
  // Priority 5: Standard Weather Condition
  else {
    const specificTips = WEATHER_TIPS[condition] || WEATHER_TIPS["Clear"];
    selectedTip = pick(specificTips);
  }

  // Horoscope
  let horoscope = "The crystal ball is cloudy today...";
  if (userConfig.zodiac) {
    const signParam = userConfig.zodiac; 
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${signParam}&day=today`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API response not ok: ${response.status}`);
      }
      const data = await response.json();
      if (data.data && data.data.horoscope_data) {
        horoscope = data.data.horoscope_data;
      }
    } catch (error) {
      console.warn("Failed to fetch horoscope:", error);
      horoscope = "The fortune-telling cat is chasing a laser pointer, please try again later! 🐱✨"; 
    }
  }

  return {
    weatherTip: selectedTip,
    quote,
    horoscope,
    weatherData: {
      temp,
      condition,
      city,
      uvIndex,
      aqi
    }
  };
};

// Simulated Cloud Function: get_food_suggestion
export const getFoodSuggestion = async (): Promise<FoodOption> => {
  await new Promise(resolve => setTimeout(resolve, 600)); 
  const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length);
  return FOOD_OPTIONS[randomIndex];
};

// Simulated Cloud Function: get_wisdom_answer
export const getWisdomAnswer = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const randomIndex = Math.floor(Math.random() * WISDOM_ANSWERS.length);
  return WISDOM_ANSWERS[randomIndex];
};