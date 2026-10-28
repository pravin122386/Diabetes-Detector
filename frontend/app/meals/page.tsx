'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Recipe, RecommendationResponse } from '@/types';
import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown, Bookmark, ArrowRight, Info, Check } from 'lucide-react';

export default function MealsPage() {
  const [mealType, setMealType] = useState('lunch');
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchRecommendations(mealType);
  }, [mealType]);

  const fetchRecommendations = async (type: string) => {
    setLoading(true);
    try {
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const userId = Number(localStorage.getItem('user_id')) || 1;

      const res = await api.getRecommendations({
        user_id: userId,
        meal_type: type,
        diet_type: userProfile.diet_type || 'vegetarian',
        allergies: userProfile.allergies || [],
        disliked_foods: userProfile.disliked_foods || [],
        preferred_region: userProfile.preferred_region || 'All India',
        preferred_cuisine: userProfile.preferred_cuisine || 'All India',
      });

      if (res && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId: number) => {
    const userId = Number(localStorage.getItem('user_id')) || 1;
    await api.submitFeedback({ user_id: userId, recipe_id: recipeId, liked: true });
    setLikedIds((prev) => [...prev, recipeId]);
  };

  const handleSave = async (recipeId: number) => {
    const userId = Number(localStorage.getItem('user_id')) || 1;
    await api.saveMeal({ user_id: userId, recipe_id: recipeId, meal_type: mealType });
    setSavedIds((prev) => [...prev, recipeId]);
  };

  const handleReplace = async (rejectedId: number) => {
    try {
      const userId = Number(localStorage.getItem('user_id')) || 1;
      const currentIds = recommendations.map((r) => r.recipe_id);
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

      const newRec = await api.replaceRecommendation({
        user_id: userId,
        meal_type: mealType,
        rejected_recipe_id: rejectedId,
        current_recipe_ids: currentIds,
        diet_type: userProfile.diet_type || 'vegetarian',
        allergies: userProfile.allergies || [],
        disliked_foods: userProfile.disliked_foods || [],
      });

      if (newRec) {
        setRecommendations((prev) => prev.map((r) => (r.recipe_id === rejectedId ? newRec : r)));
        await api.submitFeedback({ user_id: userId, recipe_id: rejectedId, replaced: true });
      }
    } catch (err: any) {
      alert(`Replacement failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-50">Personalized Meal Recommendations</h1>
        <p className="text-emerald-300 text-sm mt-1">
          ML nearest-neighbor similarity ranked meals filtered by your safety constraints & preferences.
        </p>
      </div>

      {/* Meal Type Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-800/60 pb-4">
        {['breakfast', 'lunch', 'snack', 'dinner'].map((type) => (
          <button
            key={type}
            onClick={() => setMealType(type)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${
              mealType === type
                ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-emerald-900/40 text-emerald-200 border-emerald-800 hover:bg-emerald-800/60'
            }`}
          >
            {type} Recommendations
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-emerald-300 text-sm">Evaluating KNN Euclidean Feature Vectors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recipe, rank) => {
            const isLiked = likedIds.includes(recipe.recipe_id);
            const isSaved = savedIds.includes(recipe.recipe_id);

            return (
              <div
                key={recipe.recipe_id}
                className="bg-emerald-900/50 border border-emerald-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-700 transition-all space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-950 border border-emerald-700 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                      Rank #{rank + 1} Candidate
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-800/60 px-2.5 py-1 rounded-md">
                      Score: {recipe.score ? Math.round(recipe.score * 100) : 85}%
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-emerald-100 leading-snug hover:text-amber-300 transition-colors">
                    <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.recipe_name}</Link>
                  </h2>
                  <p className="text-xs text-emerald-400 mt-1">{recipe.region} • {recipe.cuisine} • {recipe.diet_type}</p>

                  <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                    <div><span className="text-emerald-400 block text-[10px]">Calories</span><span className="font-bold text-amber-400">{recipe.calories}</span></div>
                    <div><span className="text-emerald-400 block text-[10px]">Protein</span><span className="font-semibold text-emerald-100">{recipe.protein_g}g</span></div>
                    <div><span className="text-emerald-400 block text-[10px]">Carbs</span><span className="font-semibold text-emerald-100">{recipe.carbohydrates_g}g</span></div>
                    <div><span className="text-emerald-400 block text-[10px]">Fat</span><span className="font-semibold text-emerald-100">{recipe.fat_g}g</span></div>
                  </div>

                  {recipe.ingredients && (
                    <p className="text-xs text-emerald-300/80 mt-3 line-clamp-2">
                      <span className="font-semibold text-emerald-200">Ingredients:</span> {recipe.ingredients}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-emerald-800/60">
                  <button
                    onClick={() => handleLike(recipe.recipe_id)}
                    className={`flex-1 inline-flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      isLiked ? 'bg-emerald-700 text-emerald-100 border-emerald-600' : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() => handleReplace(recipe.recipe_id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 py-2 rounded-xl text-xs font-medium border border-emerald-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Replace</span>
                  </button>

                  <button
                    onClick={() => handleSave(recipe.recipe_id)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                      isSaved ? 'bg-amber-500 text-emerald-950 border-amber-400' : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-800'
                    }`}
                    title="Save Meal"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
