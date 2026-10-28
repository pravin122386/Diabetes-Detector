'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types';
import { api } from '@/lib/api';
import { Sparkles, User, Activity, Target, ShieldAlert, Heart, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<UserProfile>({
    name: 'Aarav Sharma',
    age: 25,
    gender: 'male',
    height_cm: 175,
    weight_kg: 70,
    activity_level: 'moderate',
    goal: 'muscle_gain',
    diet_type: 'vegetarian',
    meals_per_day: 4,
    preferred_region: 'South Indian',
    preferred_cuisine: 'South Indian',
    allergies: [],
    disliked_foods: [],
  });

  const [dislikedInput, setDislikedInput] = useState('');

  const allergyOptions = ['Peanuts', 'Tree nuts', 'Dairy', 'Gluten', 'Mustard', 'Eggs', 'Fish', 'Sesame'];

  const handleAllergyToggle = (allergy: string) => {
    setFormData((prev) => {
      const exists = prev.allergies.includes(allergy);
      return {
        ...prev,
        allergies: exists ? prev.allergies.filter((a) => a !== allergy) : [...prev.allergies, allergy],
      };
    });
  };

  const handleAddDisliked = () => {
    if (dislikedInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        disliked_foods: [...prev.disliked_foods, dislikedInput.trim()],
      }));
      setDislikedInput('');
    }
  };

  const handleRemoveDisliked = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      disliked_foods: prev.disliked_foods.filter((d) => d !== item),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRes = await api.createUser(formData);
      if (userRes && userRes.user_id) {
        localStorage.setItem('user_id', String(userRes.user_id));
        localStorage.setItem('user_profile', JSON.stringify(formData));
        router.push('/dashboard');
      } else {
        setError('Failed to create profile. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to API server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-700/60 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Step 1: Personal Profile Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-50">Nutritional Requirement Setup</h1>
        <p className="text-emerald-300 text-sm">Enter your physical parameters to compute your BMR, TDEE, and nutrient targets.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-8 shadow-xl">
        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-100 flex items-center gap-2 border-b border-emerald-800 pb-2">
            <User className="w-5 h-5 text-amber-400" /> Basic Demographics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                required
                min={12}
                max={120}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                required
                min={50}
                max={250}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                required
                min={20}
                max={300}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Activity & Goal */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-100 flex items-center gap-2 border-b border-emerald-800 pb-2">
            <Activity className="w-5 h-5 text-amber-400" /> Activity & Target Goal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Activity Level</label>
              <select
                value={formData.activity_level}
                onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (Heavy training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Primary Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              >
                <option value="weight_loss">Weight Loss (-20% Deficit)</option>
                <option value="weight_maintenance">Weight Maintenance</option>
                <option value="weight_gain">Weight Gain (+15% Surplus)</option>
                <option value="muscle_gain">Muscle Gain (+20% Surplus)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietary Preference & Region */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-100 flex items-center gap-2 border-b border-emerald-800 pb-2">
            <Heart className="w-5 h-5 text-amber-400" /> Dietary Preference & Cuisine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Diet Type</label>
              <select
                value={formData.diet_type}
                onChange={(e) => setFormData({ ...formData, diet_type: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Preferred Cuisine / Region</label>
              <select
                value={formData.preferred_region}
                onChange={(e) => setFormData({ ...formData, preferred_region: e.target.value, preferred_cuisine: e.target.value })}
                className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
              >
                <option value="All India">All Indian Regions</option>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="West Indian">West Indian (Gujarati / Maharashtrian)</option>
                <option value="East Indian">East Indian (Bengali / Odia)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hard Allergies Constraints */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-100 flex items-center gap-2 border-b border-emerald-800 pb-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Allergies (Hard Safety Constraints)
          </h2>
          <p className="text-xs text-emerald-300/80">Recipes containing checked allergens are strictly excluded before ML evaluation.</p>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map((allergy) => {
              const active = formData.allergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => handleAllergyToggle(allergy)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    active
                      ? 'bg-red-900/80 text-red-200 border-red-700 shadow-md'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:border-emerald-700'
                  }`}
                >
                  {active ? `✓ ${allergy}` : `+ ${allergy}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold px-8 py-3.5 rounded-xl text-base shadow-lg transition-all"
          >
            {loading ? (
              <span>Calculating & Generating...</span>
            ) : (
              <>
                <span>Calculate & View Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
