export interface UserProfile {
  user_id?: number;
  name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  diet_type: string;
  meals_per_day: number;
  preferred_region?: string;
  preferred_cuisine?: string;
  allergies: string[];
  disliked_foods: string[];
}

export interface NutritionTarget {
  daily_calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  disclaimer: string;
}

export interface Recipe {
  recipe_id: number;
  recipe_name: string;
  region?: string;
  cuisine?: string;
  meal_type?: string;
  diet_type?: string;
  serving_size_g?: number;
  calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g?: number;
  sodium_mg?: number;
  ingredients?: string;
  allergens?: string;
  score?: number;
  cluster?: number;
}

export interface FoodIngredient {
  food_id: string;
  food_name: string;
  scientific_name?: string;
  local_name?: string;
  food_group?: string;
  region?: string;
  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g?: number;
  calcium_mg?: number;
  iron_mg?: number;
  sodium_mg?: number;
  potassium_mg?: number;
}

export interface RecommendationResponse {
  recommendations: Recipe[];
  target_nutrition: NutritionTarget;
  meal_type: string;
}

export interface DailyMealPlan {
  user_id: number;
  target_nutrition: NutritionTarget;
  meals: Record<string, Recipe>;
  total_nutrition: {
    calories: number;
    protein_g: number;
    carbohydrates_g: number;
    fat_g: number;
    fiber_g: number;
  };
}
