'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Bookmark, History, Utensils, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const [savedMeals, setSavedMeals] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedMeals();
  }, []);

  const fetchSavedMeals = async () => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem('user_id')) || 1;
      const data = await api.getSavedMeals(userId);
      setSavedMeals(data);
    } catch (err: any) {
      console.error('Error fetching saved meals:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-50">Recommendation History & Saved Meals</h1>
        <p className="text-emerald-300 text-sm mt-1">
          Review your bookmarked Indian dishes and saved meal plans.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-emerald-300 text-sm">Loading saved meals...</p>
        </div>
      ) : savedMeals.length === 0 ? (
        <div className="bg-emerald-900/30 border border-emerald-800 rounded-2xl p-12 text-center text-emerald-300 space-y-3">
          <Bookmark className="w-10 h-10 text-amber-400 mx-auto opacity-60" />
          <p className="font-semibold text-lg">No saved meals yet.</p>
          <p className="text-xs text-emerald-400">Save recommended meals from your dashboard or recommendations page.</p>
          <Link
            href="/meals"
            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-500 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Explore Recommendations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedMeals.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className="bg-emerald-900/50 border border-emerald-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    Saved Dish
                  </span>
                  <span className="text-xs text-emerald-400">{recipe.diet_type}</span>
                </div>

                <h3 className="text-xl font-bold text-emerald-100 hover:text-amber-300 transition-colors">
                  <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.recipe_name}</Link>
                </h3>
                <p className="text-xs text-emerald-400 mt-1">{recipe.region} • {recipe.cuisine}</p>

                <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80">
                  <div><span className="text-emerald-400 block text-[10px]">Calories</span><span className="font-bold text-amber-400">{recipe.calories}</span></div>
                  <div><span className="text-emerald-400 block text-[10px]">Protein</span><span className="font-semibold text-emerald-100">{recipe.protein_g}g</span></div>
                  <div><span className="text-emerald-400 block text-[10px]">Carbs</span><span className="font-semibold text-emerald-100">{recipe.carbohydrates_g}g</span></div>
                  <div><span className="text-emerald-400 block text-[10px]">Fat</span><span className="font-semibold text-emerald-100">{recipe.fat_g}g</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/60">
                <Link
                  href={`/recipes/${recipe.recipe_id}`}
                  className="w-full inline-flex items-center justify-center space-x-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 py-2.5 rounded-xl text-xs font-semibold border border-emerald-800 transition-colors"
                >
                  <span>View Recipe & IFCT Info</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
