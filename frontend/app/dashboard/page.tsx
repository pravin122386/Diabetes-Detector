'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DailyMealPlan, Recipe } from '@/types';
import { Sparkles, Utensils, RefreshCw, Bookmark, User, ChevronRight, AlertCircle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardPage() {
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    setLoading(true);
    setError('');
    try {
      let userId = Number(localStorage.getItem('user_id')) || 1;
      const plan = await api.getMealPlan(userId);
      setMealPlan(plan);
    } catch (err: any) {
      setError(err.message || 'Failed to load personalized meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async (recipe: Recipe, mealType: string) => {
    try {
      const userId = Number(localStorage.getItem('user_id')) || 1;
      await api.saveMeal({ user_id: userId, recipe_id: recipe.recipe_id, meal_type: mealType });
      setSavedIds((prev) => [...prev, recipe.recipe_id]);
    } catch (err: any) {
      console.error('Error saving meal:', err);
    }
  };

  const handleReplaceMeal = async (mealType: string, rejectedId: number) => {
    try {
      const userId = Number(localStorage.getItem('user_id')) || 1;
      const currentIds = mealPlan ? Object.values(mealPlan.meals).map((m) => m.recipe_id) : [];
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

      const newRecipe = await api.replaceRecommendation({
        user_id: userId,
        meal_type: mealType,
        rejected_recipe_id: rejectedId,
        current_recipe_ids: currentIds,
        diet_type: userProfile.diet_type || 'vegetarian',
        allergies: userProfile.allergies || [],
        disliked_foods: userProfile.disliked_foods || [],
      });

      if (mealPlan && newRecipe) {
        setMealPlan((prev) => {
          if (!prev) return null;
          const updatedMeals = { ...prev.meals, [mealType]: newRecipe };

          // Recalculate totals
          let c = 0, p = 0, cb = 0, f = 0, fib = 0;
          Object.values(updatedMeals).forEach((m) => {
            c += m.calories;
            p += m.protein_g;
            cb += m.carbohydrates_g;
            f += m.fat_g;
            fib += m.fiber_g;
          });

          return {
            ...prev,
            meals: updatedMeals,
            total_nutrition: {
              calories: Math.round(c),
              protein_g: Math.round(p),
              carbohydrates_g: Math.round(cb),
              fat_g: Math.round(f),
              fiber_g: Math.round(fib),
            },
          };
        });

        // Submit feedback
        await api.submitFeedback({
          user_id: userId,
          recipe_id: rejectedId,
          replaced: true,
        });
      }
    } catch (err: any) {
      alert(`Replacement failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-emerald-300 text-sm">Running ML KNN Recommendation Engine...</p>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-red-950/80 border border-red-800 p-6 rounded-2xl text-red-200">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="font-semibold text-lg">{error || 'Meal plan unavailable.'}</p>
          <p className="text-xs text-red-300 mt-1">Please configure your profile first.</p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm"
        >
          <span>Go to Profile Setup</span>
        </Link>
      </div>
    );
  }

  const { target_nutrition: target, meals, total_nutrition: actual } = mealPlan;

  // Chart data for Target vs Recommended
  const chartData = [
    { name: 'Calories (kcal/10)', Target: Math.round(target.daily_calories / 10), Recommended: Math.round(actual.calories / 10) },
    { name: 'Protein (g)', Target: target.protein_g, Recommended: actual.protein_g },
    { name: 'Carbs (g)', Target: target.carbohydrates_g, Recommended: actual.carbohydrates_g },
    { name: 'Fat (g)', Target: target.fat_g, Recommended: actual.fat_g },
    { name: 'Fiber (g)', Target: target.fiber_g, Recommended: actual.fiber_g },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-50">Personalized Nutrition Dashboard</h1>
          <p className="text-emerald-300 text-sm mt-1">
            Real Indian Food Composition (IFCT 2017) • KNN Similarity Score Matching
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadMealPlan}
            className="inline-flex items-center space-x-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 px-4 py-2 rounded-xl border border-emerald-700/60 text-sm font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Recalculate Plan</span>
          </button>
          <Link
            href="/meals"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 px-4 py-2 rounded-xl text-sm font-bold shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Meals</span>
          </Link>
        </div>
      </div>

      {/* Target Nutrition Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 font-medium block">Daily Calories</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{target.daily_calories} <span className="text-xs text-emerald-300 font-normal">kcal</span></span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Plan: {actual.calories} kcal</span>
        </div>

        <div className="bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 font-medium block">Protein Target</span>
          <span className="text-2xl font-bold text-emerald-200 mt-1 block">{target.protein_g} <span className="text-xs font-normal">g</span></span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Plan: {actual.protein_g} g</span>
        </div>

        <div className="bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 font-medium block">Carbohydrates</span>
          <span className="text-2xl font-bold text-amber-300 mt-1 block">{target.carbohydrates_g} <span className="text-xs font-normal">g</span></span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Plan: {actual.carbohydrates_g} g</span>
        </div>

        <div className="bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 font-medium block">Fat Target</span>
          <span className="text-2xl font-bold text-emerald-200 mt-1 block">{target.fat_g} <span className="text-xs font-normal">g</span></span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Plan: {actual.fat_g} g</span>
        </div>

        <div className="bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl">
          <span className="text-xs text-emerald-400 font-medium block">Dietary Fiber</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{target.fiber_g} <span className="text-xs font-normal">g</span></span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Plan: {actual.fiber_g} g</span>
        </div>
      </div>

      {/* Target vs Recommended Recharts Chart */}
      <div className="bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-emerald-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Target vs Recommended Nutrition Comparison
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#a7f3d0" fontSize={12} />
              <YAxis stroke="#a7f3d0" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#022c22', borderColor: '#047857', borderRadius: '8px', color: '#ecfdf5' }} />
              <Legend wrapperStyle={{ color: '#ecfdf5', fontSize: '12px' }} />
              <Bar dataKey="Target" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recommended" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Meal Plan Cards */}
      <div>
        <h2 className="text-xl font-bold text-emerald-100 mb-4 flex items-center justify-between">
          <span>Today's Personalized Meal Plan</span>
          <span className="text-xs text-emerald-400 font-normal">4 Meal Split Target</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(meals).map(([mealType, recipe]) => {
            const isSaved = savedIds.includes(recipe.recipe_id);
            return (
              <div
                key={mealType}
                className="bg-emerald-900/50 border border-emerald-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-700 transition-all space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {mealType}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-medium">
                      Match Score: {recipe.score ? Math.round(recipe.score * 100) : 90}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-emerald-100 leading-snug hover:text-amber-300 transition-colors">
                    <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.recipe_name}</Link>
                  </h3>
                  <p className="text-xs text-emerald-400 mt-1">{recipe.cuisine} • {recipe.diet_type}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
                    <div><span className="text-emerald-400 block">Calories</span><span className="font-semibold text-emerald-100">{recipe.calories} kcal</span></div>
                    <div><span className="text-emerald-400 block">Protein</span><span className="font-semibold text-emerald-100">{recipe.protein_g}g</span></div>
                    <div><span className="text-emerald-400 block">Carbs</span><span className="font-semibold text-emerald-100">{recipe.carbohydrates_g}g</span></div>
                    <div><span className="text-emerald-400 block">Fat</span><span className="font-semibold text-emerald-100">{recipe.fat_g}g</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-800/60">
                  <button
                    onClick={() => handleReplaceMeal(mealType, recipe.recipe_id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 text-xs font-medium py-2 rounded-lg border border-emerald-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Replace</span>
                  </button>

                  <button
                    onClick={() => handleSaveMeal(recipe, mealType)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg text-xs font-medium border transition-colors ${
                      isSaved
                        ? 'bg-amber-500 text-emerald-950 border-amber-400'
                        : 'bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border-emerald-800'
                    }`}
                    title="Save Meal"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
