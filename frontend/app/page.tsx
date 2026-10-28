'use client';

import Link from 'next/link';
import { Sparkles, Utensils, ShieldCheck, Database, Cpu, ArrowRight, CheckCircle2, Sliders, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900/90 via-emerald-950 to-emerald-950 border-b border-emerald-800/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/60 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Powered by IFCT 2017 & INDB Real Datasets</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-emerald-50 tracking-tight leading-tight max-w-4xl mx-auto">
            Personalized Indian Meal Recommendation System
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-emerald-400 mt-2">
              Using Machine Learning & Real Nutrition Data
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-200/90 max-w-3xl mx-auto font-normal leading-relaxed">
            Scientific, personalized Indian meal planning based on official ICMR-NIN Indian Food Composition Tables.
            Combines BMR estimation, K-Means nutritional clustering, KNN similarity search, and rule-based allergen safety constraints.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-emerald-950 font-bold px-7 py-3.5 rounded-xl text-base shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <span>Setup User Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/recipes"
              className="inline-flex items-center space-x-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-semibold px-6 py-3.5 rounded-xl border border-emerald-700/60 text-base transition-colors"
            >
              <Utensils className="w-5 h-5 text-amber-400" />
              <span>Explore Indian Recipes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-100">Scientific Foundation & System Highlights</h2>
          <p className="text-emerald-400 text-sm mt-1">Real datasets and transparent ML pipeline with safety guarantees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-emerald-100">IFCT 2017 & INDB Datasets</h3>
            <p className="text-sm text-emerald-300/80 leading-relaxed">
              Based on official Indian Food Composition Tables published by ICMR-NIN. Unmodified nutrient values for authentic Indian ingredients and recipes.
            </p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-emerald-100">K-Means + KNN ML Pipeline</h3>
            <p className="text-sm text-emerald-300/80 leading-relaxed">
              Feature extraction, StandardScaler normalization, K-Means cluster analysis, and KNN nearest-neighbor similarity matching for target nutrient profiles.
            </p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-emerald-100">Strict Hard Filtering</h3>
            <p className="text-sm text-emerald-300/80 leading-relaxed">
              Allergens (Peanuts, Dairy, Gluten, Mustard, etc.) and Diet types (Vegetarian, Vegan) are enforced via strict rule-based filters before ML ranking.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-emerald-900/30 border border-emerald-800/50 rounded-3xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-emerald-100">End-to-End Recommendation Architecture</h2>
          <p className="text-sm text-emerald-400">Transparent 10-step recommendation engine</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 1</div>
            <div className="text-sm font-semibold text-emerald-200">User Profile</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 2</div>
            <div className="text-sm font-semibold text-emerald-200">BMR / TDEE Target</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 3</div>
            <div className="text-sm font-semibold text-emerald-200">Candidate Recipes</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-blue-400 mb-1">Step 4</div>
            <div className="text-sm font-semibold text-emerald-200">Hard Filters</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-emerald-400 mb-1">Step 5</div>
            <div className="text-sm font-semibold text-emerald-200">StandardScaler</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-emerald-400 mb-1">Step 6</div>
            <div className="text-sm font-semibold text-emerald-200">KNN Similarity</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 7</div>
            <div className="text-sm font-semibold text-emerald-200">Preference Match</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 8</div>
            <div className="text-sm font-semibold text-emerald-200">Feedback Score</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 9</div>
            <div className="text-sm font-semibold text-emerald-200">Transparent Rank</div>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-amber-400 mb-1">Step 10</div>
            <div className="text-sm font-semibold text-emerald-200">Daily Meal Plan</div>
          </div>
        </div>
      </section>
    </div>
  );
}
