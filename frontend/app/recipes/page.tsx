'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Recipe } from '@/types';
import { Search, Filter, Utensils, ChevronRight } from 'lucide-react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('all');
  const [dietType, setDietType] = useState('all');
  const [cuisine, setCuisine] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, [mealType, dietType, cuisine]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await api.getRecipes({
        search: search.trim(),
        meal_type: mealType,
        diet_type: dietType,
        cuisine: cuisine,
      });
      setRecipes(data);
    } catch (err: any) {
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-50">Indian Recipe Catalog</h1>
        <p className="text-emerald-300 text-sm mt-1">
          Explore real Indian dishes with complete nutritional compositions from INDB & IFCT 2017.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 backdrop-blur-sm space-y-4 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-emerald-400" />
            <input
              type="text"
              placeholder="Search recipes by name or ingredients (e.g., Paneer, Rajma, Idli, Fish)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-emerald-800/60">
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-100 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Meal Types</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Diet Type</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-100 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Cuisine / Region</label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-100 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Regions</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="West Indian">West Indian</option>
              <option value="East Indian">East Indian</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recipe Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-emerald-300 text-sm">Loading Indian recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-emerald-900/30 border border-emerald-800 rounded-2xl p-12 text-center text-emerald-300">
          <Utensils className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
          <p className="font-semibold text-lg">No recipes found matching your filters.</p>
          <p className="text-xs text-emerald-400 mt-1">Try clearing your search term or selecting "All" filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className="bg-emerald-900/50 border border-emerald-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-700 transition-all space-y-4 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    {recipe.meal_type || 'General'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {recipe.diet_type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-emerald-100 group-hover:text-amber-300 transition-colors leading-snug">
                  <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.recipe_name}</Link>
                </h3>
                <p className="text-xs text-emerald-400 mt-1">{recipe.region} • {recipe.cuisine}</p>

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

              <div className="pt-3 border-t border-emerald-800/60">
                <Link
                  href={`/recipes/${recipe.recipe_id}`}
                  className="w-full inline-flex items-center justify-center space-x-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 py-2.5 rounded-xl text-xs font-semibold border border-emerald-800 transition-colors"
                >
                  <span>View Details & IFCT Composition</span>
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
