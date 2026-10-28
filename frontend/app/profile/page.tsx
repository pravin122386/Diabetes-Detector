'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { UserProfile, NutritionTarget } from '@/types';
import { User, Activity, Heart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [target, setTarget] = useState<NutritionTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        calculateNutritionTarget(parsed);
      } else {
        const userId = Number(localStorage.getItem('user_id')) || 1;
        const res = await api.getUser(userId);
        if (res) {
          const userProf: UserProfile = {
            name: res.name,
            age: res.age,
            gender: res.gender,
            height_cm: res.height_cm,
            weight_kg: res.weight_kg,
            activity_level: res.activity_level,
            goal: res.goal,
            diet_type: res.diet_type,
            meals_per_day: res.meals_per_day,
            preferred_region: res.preferences?.preferred_region,
            preferred_cuisine: res.preferences?.preferred_cuisine,
            allergies: res.preferences?.allergies || [],
            disliked_foods: res.preferences?.disliked_foods || [],
          };
          setProfile(userProf);
          calculateNutritionTarget(userProf);
        }
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNutritionTarget = async (p: UserProfile) => {
    try {
      const t = await api.calculateNutrition({
        age: p.age,
        gender: p.gender,
        height_cm: p.height_cm,
        weight_kg: p.weight_kg,
        activity_level: p.activity_level,
        goal: p.goal,
      });
      setTarget(t);
    } catch (err) {
      console.error('Failed to calculate nutrition target:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      localStorage.setItem('user_profile', JSON.stringify(profile));
      await calculateNutritionTarget(profile);
      setSavedMsg('Profile and nutritional targets updated successfully!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err: any) {
      alert('Error updating profile.');
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-emerald-300 text-sm">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-50">User Profile & Nutrition Targets</h1>
        <p className="text-emerald-300 text-sm mt-1">
          View and update your physical parameters to recalculate BMR, TDEE, and macronutrient targets.
        </p>
      </div>

      {savedMsg && (
        <div className="bg-emerald-800/80 border border-emerald-600 text-emerald-100 p-4 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Target Requirements Card */}
      {target && (
        <div className="bg-emerald-900/60 border border-emerald-700/80 rounded-2xl p-6 backdrop-blur-sm space-y-3">
          <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Live Estimated Nutritional Targets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="bg-emerald-950/80 p-3 rounded-xl text-center">
              <span className="text-[11px] text-emerald-400 block">Daily Calories</span>
              <span className="text-xl font-bold text-amber-400">{target.daily_calories} kcal</span>
            </div>
            <div className="bg-emerald-950/80 p-3 rounded-xl text-center">
              <span className="text-[11px] text-emerald-400 block">Protein</span>
              <span className="text-xl font-bold text-emerald-100">{target.protein_g}g</span>
            </div>
            <div className="bg-emerald-950/80 p-3 rounded-xl text-center">
              <span className="text-[11px] text-emerald-400 block">Carbs</span>
              <span className="text-xl font-bold text-amber-300">{target.carbohydrates_g}g</span>
            </div>
            <div className="bg-emerald-950/80 p-3 rounded-xl text-center">
              <span className="text-[11px] text-emerald-400 block">Fat</span>
              <span className="text-xl font-bold text-emerald-100">{target.fat_g}g</span>
            </div>
            <div className="bg-emerald-950/80 p-3 rounded-xl text-center">
              <span className="text-[11px] text-emerald-400 block">Fiber</span>
              <span className="text-xl font-bold text-amber-400">{target.fiber_g}g</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
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
              value={profile.height_cm}
              onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={profile.weight_kg}
              onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Activity Level</label>
            <select
              value={profile.activity_level}
              onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">Goal</label>
            <select
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-amber-400"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_maintenance">Weight Maintenance</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
            </select>
          </div>
        </div>

        <div className="pt-4 text-right">
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold px-7 py-3 rounded-xl text-sm transition-all"
          >
            Update Profile & Recalculate
          </button>
        </div>
      </form>
    </div>
  );
}
