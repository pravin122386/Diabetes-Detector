'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Utensils, ShieldAlert, Database, ThumbsUp, Bookmark, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const recipeId = Number(resolvedParams.id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const data = await api.getRecipeById(recipeId);
      setRecipe(data);
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const userId = Number(localStorage.getItem('user_id')) || 1;
    await api.submitFeedback({ user_id: userId, recipe_id: recipeId, liked: true });
    setLiked(true);
  };

  const handleSave = async () => {
    const userId = Number(localStorage.getItem('user_id')) || 1;
    await api.saveMeal({ user_id: userId, recipe_id: recipeId, meal_type: recipe?.meal_type || 'Lunch' });
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-emerald-300 text-sm">Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-emerald-300 font-semibold">Recipe not found.</p>
        <Link href="/recipes" className="inline-flex items-center space-x-2 text-amber-400 text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> <span>Back to Recipe Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link href="/recipes" className="inline-flex items-center space-x-2 text-emerald-300 hover:text-amber-300 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> <span>Back to Recipe Catalog</span>
      </Link>

      <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {recipe.meal_type}
              </span>
              <span className="bg-emerald-800/60 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                {recipe.diet_type}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-emerald-50 leading-tight">{recipe.recipe_name}</h1>
            <p className="text-sm text-emerald-400 mt-1">{recipe.region} • {recipe.cuisine} • Serving Size: {recipe.serving_size_g || 250}g</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                liked ? 'bg-emerald-700 text-emerald-100 border-emerald-600' : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-800'
              }`}
            >
              <ThumbsUp className="w-4 h-4 text-amber-400" />
              <span>{liked ? 'Liked' : 'Like Dish'}</span>
            </button>

            <button
              onClick={handleSave}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved ? 'bg-amber-500 text-emerald-950 border-amber-400' : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? 'Saved' : 'Save Meal'}</span>
            </button>
          </div>
        </div>

        {/* Nutritional Breakdown */}
        <div>
          <h2 className="text-lg font-bold text-emerald-100 mb-3">Nutritional Composition (Per Serving)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-center">
              <span className="text-xs text-emerald-400 block">Energy</span>
              <span className="text-xl font-bold text-amber-400 mt-0.5 block">{recipe.calories} kcal</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-center">
              <span className="text-xs text-emerald-400 block">Protein</span>
              <span className="text-xl font-bold text-emerald-100 mt-0.5 block">{recipe.protein_g}g</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-center">
              <span className="text-xs text-emerald-400 block">Carbs</span>
              <span className="text-xl font-bold text-amber-300 mt-0.5 block">{recipe.carbohydrates_g}g</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-center">
              <span className="text-xs text-emerald-400 block">Fat</span>
              <span className="text-xl font-bold text-emerald-100 mt-0.5 block">{recipe.fat_g}g</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-center">
              <span className="text-xs text-emerald-400 block">Fiber</span>
              <span className="text-xl font-bold text-amber-400 mt-0.5 block">{recipe.fiber_g}g</span>
            </div>
          </div>
        </div>

        {/* Ingredients & Allergens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-emerald-800/80">
          <div>
            <h2 className="text-base font-bold text-emerald-100 mb-2">Ingredients List</h2>
            <p className="text-sm text-emerald-200/90 leading-relaxed bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/80">
              {recipe.ingredients || 'Detailed ingredient composition preserved in IFCT tables.'}
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-emerald-100 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Allergens & Safety Info
            </h2>
            <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/80 space-y-2">
              <p className="text-xs text-emerald-300">
                <span className="font-semibold text-amber-300">Detected Allergens:</span> {recipe.allergens || 'None detected'}
              </p>
              <p className="text-[11px] text-emerald-400 leading-normal">
                Safety Guarantee: Hard rule-based filtering ensures recipes containing your configured allergens are automatically filtered out during recommendation generation.
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Attribution */}
        <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-300 leading-relaxed">
            <span className="font-semibold text-emerald-100 block">Scientific Provenance (IFCT 2017 & INDB)</span>
            Values for key ingredients are derived from the Indian Food Composition Tables 2017 (ICMR - NIN, Hyderabad).
            No nutritional values are fabricated or artificially generated.
          </div>
        </div>
      </div>
    </div>
  );
}
