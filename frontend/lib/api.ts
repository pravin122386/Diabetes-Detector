import { UserProfile, NutritionTarget, Recipe, FoodIngredient, RecommendationResponse, DailyMealPlan } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Users
  createUser: (profile: UserProfile) =>
    fetchApi<UserProfile>('/api/users', { method: 'POST', body: JSON.stringify(profile) }),

  getUser: (userId: number) =>
    fetchApi<any>(`/api/users/${userId}`),

  getMealPlan: (userId: number) =>
    fetchApi<DailyMealPlan>(`/api/users/${userId}/meal-plan`),

  // Nutrition
  calculateNutrition: (data: {
    age: number;
    gender: string;
    height_cm: number;
    weight_kg: number;
    activity_level: string;
    goal: string;
  }) => fetchApi<NutritionTarget>('/api/nutrition/calculate', { method: 'POST', body: JSON.stringify(data) }),

  // Recipes
  getRecipes: (params?: Record<string, string | number>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    return fetchApi<Recipe[]>(`/api/recipes?${query.toString()}`);
  },

  getRecipeById: (id: number) =>
    fetchApi<Recipe>(`/api/recipes/${id}`),

  getIfctFoods: (foodGroup?: string) =>
    fetchApi<FoodIngredient[]>(`/api/recipes/foods/ifct${foodGroup ? `?food_group=${foodGroup}` : ''}`),

  // Recommendations
  getRecommendations: (data: any) =>
    fetchApi<RecommendationResponse>('/api/recommendations', { method: 'POST', body: JSON.stringify(data) }),

  replaceRecommendation: (data: {
    user_id?: number;
    meal_type: string;
    rejected_recipe_id: number;
    current_recipe_ids: number[];
    diet_type: string;
    allergies: string[];
    disliked_foods: string[];
    preferred_region?: string;
  }) => fetchApi<Recipe>('/api/recommendations/replace', { method: 'POST', body: JSON.stringify(data) }),

  // Feedback & Saved
  submitFeedback: (data: { user_id: number; recipe_id: number; rating?: number; liked?: boolean; replaced?: boolean }) =>
    fetchApi<any>('/api/feedback', { method: 'POST', body: JSON.stringify(data) }),

  saveMeal: (data: { user_id: number; recipe_id: number; meal_type: string }) =>
    fetchApi<any>('/api/saved-meals', { method: 'POST', body: JSON.stringify(data) }),

  getSavedMeals: (userId: number) =>
    fetchApi<Recipe[]>(`/api/users/${userId}/saved-meals`),
};
