import Link from 'next/link';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-300 border-t border-emerald-800/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-emerald-100 mb-2">Personalized Indian Meal Recommendation System</h3>
            <p className="text-sm text-emerald-400 mb-4 leading-relaxed">
              Scientific Machine Learning application powered by the Indian Food Composition Tables (IFCT 2017 - ICMR/NIN)
              and the Indian Nutrient Databank (INDB). Combines K-Means clustering, K-Nearest Neighbors (KNN), and rule-based
              hard constraint filtering for transparent meal recommendations.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-amber-400" /> IFCT 2017 & INDB Datasets
              </span>
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> K-Means + KNN ML Pipeline
              </span>
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Hard Allergy Constraint Safety
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-100 uppercase tracking-wider mb-3">System Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/onboarding" className="hover:text-amber-300 transition-colors">User Profile Setup</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-300 transition-colors">Personalized Dashboard</Link></li>
              <li><Link href="/meals" className="hover:text-amber-300 transition-colors">Meal Recommendations</Link></li>
              <li><Link href="/recipes" className="hover:text-amber-300 transition-colors">Search Indian Recipes</Link></li>
              <li><Link href="/history" className="hover:text-amber-300 transition-colors">Recommendation History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-100 uppercase tracking-wider mb-3">Scientific Data</h4>
            <p className="text-xs text-emerald-400 leading-relaxed mb-3">
              National Institute of Nutrition (NIN), ICMR, Hyderabad.<br />
              Raw food values preserved per 100g standards.
            </p>
            <p className="text-[11px] text-amber-300/80 italic">
              * Note: Caloric and nutritional figures are estimated targets for educational/demo purposes and do not replace professional medical advice.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-900/80 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-500">
          <p>© {new Date().getFullYear()} Personalized Indian Meal Recommendation System (ML Project).</p>
          <p className="mt-2 md:mt-0">FastAPI • Next.js • Scikit-learn • PostgreSQL/SQLite</p>
        </div>
      </div>
    </footer>
  );
}
