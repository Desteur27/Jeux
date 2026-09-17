import { Gamepad2, Swords, Crosshair, Hand, Trophy, Zap, Tent, Box, Car } from 'lucide-react';
import { CATEGORIES } from '@/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Gamepad2,
  Swords,
  Crosshair,
  Hand,
  Trophy,
  Zap,
  Tent,
  Box,
  Car,
};

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  resultsCount: number;
}

export default function CategoryFilter({ activeCategory, onCategoryChange, resultsCount }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          {activeCategory === 'all' ? 'Tout le catalogue' : CATEGORIES.find(c => c.id === activeCategory)?.label}
        </h2>
        <span className="text-slate-400 text-sm">{resultsCount} jeu{resultsCount !== 1 ? 'x' : ''}</span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Gamepad2;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20 scale-105'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
