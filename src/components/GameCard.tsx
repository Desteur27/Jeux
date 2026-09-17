import { Star, Plus, Eye } from 'lucide-react';
import type { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onAddToCart: (game: Game) => void;
  onViewDetails: (game: Game) => void;
}

export default function GameCard({ game, onAddToCart, onViewDetails }: GameCardProps) {
  return (
    <div className="group relative bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-400/30 hover:shadow-xl hover:shadow-emerald-400/5 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
        <img
          src={game.image_url || 'https://images.pexels.com/photos/11216211/pexels-photo-11216211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-400/20">
          {game.genre}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400" />
          {game.rating.toFixed(1)}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onViewDetails(game)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Voir détails
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
          {game.title}
        </h3>
        {game.platform && (
          <p className="text-slate-500 text-xs mb-3">{game.platform}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-emerald-400 font-bold text-lg">
              {game.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <button
            onClick={() => onAddToCart(game)}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-full p-2.5 transition-all duration-200 hover:scale-110 active:scale-95 group/btn"
            aria-label="Ajouter au panier"
          >
            <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
