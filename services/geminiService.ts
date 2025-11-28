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
// Categories: Chinese (50%), International (30%), Sydney (10%), General (10%)
const FOOD_OPTIONS: FoodOption[] = [
  // --- Chinese Food ---
  { suggestion: "Classic Cantonese Dim Sum (Har Gow & Siu Mai)", mood_text: "My nose says \"yum cha time!\" You must go for the little parcels of happiness.", category: "Chinese" },
  { suggestion: "Spicy Sichuan Dan Dan Noodles", mood_text: "That chili oil kick is the best zoomies fuel! Get it if you need a little fire.", category: "Chinese" },
  { suggestion: "Beef & Black Bean Sauce with Steamed Rice", mood_text: "It smells so good, I might need a sneaky lick of the sauce when you're not looking!", category: "Chinese" },
  { suggestion: "Shanghai Soup Dumplings (Xiao Long Bao)", mood_text: "Don't pop it! Sip the yummy broth first. It's like a warm hug for your tummy.", category: "Chinese" },
  { suggestion: "Authentic Peking Duck Pancakes", mood_text: "Quack! Quack! Oh wait, I mean \"Crunch! Crunch!\" It's a special occasion meal!", category: "Chinese" },
  { suggestion: "Lanzhou Hand-Pulled Beef Noodle Soup", mood_text: "Long noodles for a long dog! It's the perfect comfort food for a chilly day.", category: "Chinese" },
  { suggestion: "Fresh Prawn Wontons in Clear Broth", mood_text: "Tiny little pouches of flavour! Just like the tiny treats I get when I'm good.", category: "Chinese" },
  { suggestion: "Spicy Cumin Lamb Skewers (Xinjiang style)", mood_text: "The spice is calling! These are so good, you'll feel like you're on a grand adventure.", category: "Chinese" },
  { suggestion: "Savoury Chinese Crepes (Jian Bing)", mood_text: "Crunchy, soft, and perfect for breakfast or lunch. It's the ultimate street snack!", category: "Chinese" },
  { suggestion: "Claypot Rice with Chicken and Mushroom", mood_text: "The crispy rice at the bottom is the best part! It's a treasure hunt!", category: "Chinese" },
  { suggestion: "Home-style Garlic Bok Choy and Rice", mood_text: "Even us dogs need our greens! This is light and delicious.", category: "Chinese" },
  { suggestion: "Sticky Char Siu (BBQ Pork)", mood_text: "Sweet, sticky, and makes me want to beg! You deserve this sweetness today.", category: "Chinese" },
  { suggestion: "A Big Bowl of Congee (Rice Porridge)", mood_text: "When you need something gentle and warm, this is my recommendation.", category: "Chinese" },
  { suggestion: "Northern Style Hand-Made Dumplings (Jiaozi)", mood_text: "Boil, steam, or pan-fry! So many options, just like my favourite walks!", category: "Chinese" },
  { suggestion: "Cold Sesame Noodles (Liang Mian)", mood_text: "For a warmer day, this cooling dish is the absolute best.", category: "Chinese" },
  { suggestion: "Spicy Mapo Tofu with Minced Pork", mood_text: "Tofu wiggle! This dish has great texture and a fiery heart.", category: "Chinese" },
  { suggestion: "Beef Chow Fun (Wide Rice Noodles)", mood_text: "Wide and flat! Just like my body after a long nap. It’s perfect!", category: "Chinese" },
  { suggestion: "Sweet and Sour Pork (Gu Lou Rou)", mood_text: "The best of both worlds! Sweet and tangy, just like my playful personality.", category: "Chinese" },
  { suggestion: "Taiwanese Beef Noodle Soup (Niu Rou Mian)", mood_text: "A hearty, flavourful broth that will warm you from your head to my little paws.", category: "Chinese" },
  { suggestion: "Crispy Spring Rolls with Dipping Sauce", mood_text: "Quick and crunchy! It’s the perfect finger food when you’re busy.", category: "Chinese" },
  { suggestion: "Szechuan Boiled Fish (Shui Zhu Yu)", mood_text: "Dive into the fiery red chili oil! This one's for the brave and hungry heart.", category: "Chinese" },
  { suggestion: "Stir-fried Egg and Tomato (Xi Hong Shi Chao Ji Dan)", mood_text: "A simple classic that always feels like home. Comforting and easy.", category: "Chinese" },
  { suggestion: "Fried Rice with Shrimp and Egg (Yangzhou style)", mood_text: "Every grain of rice is perfectly separated! A masterpiece of quick cooking.", category: "Chinese" },
  { suggestion: "Steamed Fish with Ginger and Scallions", mood_text: "Light and fresh! For when you want to feel healthy and elegant.", category: "Chinese" },
  { suggestion: "Braised Pork Belly (Hong Shao Rou)", mood_text: "Melt-in-your-mouth goodness. Take a little break and enjoy this rich treat.", category: "Chinese" },

  // --- International Food ---
  { suggestion: "Fresh Japanese Sushi & Sashimi Platter", mood_text: "For when you need delicate, high-quality fish! Make sure it’s fresh!", category: "International" },
  { suggestion: "Italian Pizza (Margherita or Pepperoni)", mood_text: "Cheesy, bubbly, and easy to share! Just try not to get any on your snout.", category: "International" },
  { suggestion: "Authentic Vietnamese Pho (Beef or Chicken)", mood_text: "That broth is liquid gold! It’s a perfect remedy for feeling a bit blue.", category: "International" },
  { suggestion: "Mexican Tacos (Al Pastor or Carnitas)", mood_text: "Fold, fill, and crunch! It's fun, messy, and totally worth it.", category: "International" },
  { suggestion: "Thai Green Curry with Coconut Milk", mood_text: "A creamy, spicy hug in a bowl! Don't forget the fragrant rice.", category: "International" },
  { suggestion: "Indonesian Nasi Goreng (Fried Rice)", mood_text: "Savoury, slightly sweet, and always satisfying. A total classic!", category: "International" },
  { suggestion: "Greek Lamb Souvlaki Wraps", mood_text: "Loaded with tender meat, salty feta, and creamy tzatziki. Opa!", category: "International" },
  { suggestion: "Korean BBQ (Bulgogi or Samgyeopsal)", mood_text: "Fire up the grill! Sharing K-BBQ is the best bonding activity.", category: "International" },
  { suggestion: "Indian Butter Chicken with Naan Bread", mood_text: "Dip that soft naan right into the rich sauce! It's pure indulgence.", category: "International" },
  { suggestion: "Classic American Hamburger & Fries", mood_text: "Sometimes you just need a big, juicy burger. Go big or go home!", category: "International" },
  { suggestion: "Spanish Paella (Seafood or Chicken)", mood_text: "A feast of flavours! Perfect for when you feel like celebrating something small.", category: "International" },
  { suggestion: "Lebanese Hummus and Falafel Wrap", mood_text: "Earthy, filling, and perfect for a fresh, healthy bite.", category: "International" },
  { suggestion: "French Crêpes (Sweet or Savoury)", mood_text: "Delicate and thin! Just like the careful way I stalk a squirrel.", category: "International" },
  { suggestion: "Turkish Gozleme (Spinach & Feta)", mood_text: "Flat and warm! This delicious flatbread is a great energy booster.", category: "International" },
  { suggestion: "Ethiopian Injera and Wat (Stew)", mood_text: "Use the bread to scoop up the delicious stews! It's a fun way to eat!", category: "International" },

  // --- Sydney Specialties ---
  { suggestion: "Fresh Fish and Chips by the beach (with Chicken Salt)", mood_text: "A true Sydney classic! Take it to the park, but watch out for the seagulls!", category: "Sydney" },
  { suggestion: "A Big Aussie Meat Pie and Sauce", mood_text: "It's what the locals eat! Warm pastry and rich filling, a perfect fuel-up.", category: "Sydney" },
  { suggestion: "Smashed Avocado Toast with Feta", mood_text: "For a glorious start to your day! Get it with a side of strong coffee.", category: "Sydney" },
  { suggestion: "A Balmain Bug Roll (Seafood Roll)", mood_text: "A delicious local delicacy! Treat yourself to something unique today.", category: "Sydney" },

  // --- General ---
  { suggestion: "A Warm, Freshly Baked Bagel", mood_text: "Simple, chewy, and perfect with some cream cheese or salmon.", category: "General" },
  { suggestion: "Fancy Grilled Cheese or Toastie", mood_text: "The ultimate cozy comfort food for a movie night in.", category: "General" },
  { suggestion: "A Bowl of Colourful Poké (Hawaiian)", mood_text: "Fresh, customizable, and totally trendy! You'll feel great after this.", category: "General" },
  { suggestion: "Quick and Healthy Homemade Stir-fry", mood_text: "Skip the takeout and make something fast and fresh at home!", category: "General" },
  { suggestion: "A strong Coffee and a light snack", mood_text: "Sometimes the best fuel is a strong brew and a flaky pastry. Go slow!", category: "General" }
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

  // --------------------------------------------------------------------------
  // Horoscope Logic (Restored)
  // --------------------------------------------------------------------------
  let horoscope = "The crystal ball is cloudy today...";
  
  if (userConfig.zodiac) {
    // Kept the fix: Do NOT convert to lowercase for better API compatibility in some cases,
    // and ensure 'day' is 'today' (lowercase).
    const signParam = userConfig.zodiac; 
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${signParam}&day=today`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API response not ok: ${response.status}`);
      }
      const data = await response.json();
      
      // The Vercel API usually returns structure: { data: { date: "...", horoscope_data: "..." }, ... }
      if (data.data && data.data.horoscope_data) {
        horoscope = data.data.horoscope_data;
      } else {
        console.warn("Unexpected horoscope API structure:", data);
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.warn("Failed to fetch horoscope:", error);
      horoscope = "The fortune-telling cat is on a mouse-catching mission right now, so my crystal ball has no signal!"; // Fallback: Cat fortune teller is away.
    }
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

// Simulated Cloud Function: get_food_suggestion
export const getFoodSuggestion = async (): Promise<FoodOption> => {
  // Simulate network delay for realistic "cloud function" feel
  await new Promise(resolve => setTimeout(resolve, 600)); 
  
  const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length);
  return FOOD_OPTIONS[randomIndex];
};

// Simulated Cloud Function: get_wisdom_answer
export const getWisdomAnswer = async (): Promise<string> => {
  // Simulate network delay and mystery calculation
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const randomIndex = Math.floor(Math.random() * WISDOM_ANSWERS.length);
  return WISDOM_ANSWERS[randomIndex];
};