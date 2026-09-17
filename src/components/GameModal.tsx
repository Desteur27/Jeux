import { X, Star, Plus, ShoppingCart, Check, Gamepad2 } from 'lucide-react';
import { useEffect } from 'react';
import type { Game } from '@/types';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onAddToCart: (game: Game) => void;
  inCart: boolean;
}

export default function GameModal({ game, onClose, onAddToCart, inCart }: GameModalProps) {
  useEffect(() => {
    if (game) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [game]);

  if (!game) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      <div
        className="relative bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-950/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-slate-950/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:min-h-full bg-slate-800">
            <img
              src={game.image_url || 'https://images.pexels.com/photos/11216211/pexels-photo-11216211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent md:bg-gradient-to-r" />
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm text-emerald-400 text-sm font-medium px-3 py-1.5 rounded-full border border-emerald-400/20">
              {game.genre}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                {game.rating.toFixed(1)}
              </div>
              {game.platform && (
                <div className="flex items-center gap-1 bg-white/5 text-slate-300 px-3 py-1 rounded-full text-sm">
                  <Gamepad2 className="w-4 h-4" />
                  {game.platform}
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {game.title}
            </h2>

            <p className="text-slate-400 leading-relaxed mb-6 flex-1">
              {game.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-t border-white/5">
                <span className="text-slate-400 text-sm">Stock disponible</span>
                <span className={`text-sm font-medium ${game.stock > 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {game.stock > 0 ? `${game.stock} unités` : 'Rupture de stock'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/5">
                <span className="text-slate-400 text-sm">Prix</span>
                <span className="text-emerald-400 font-bold text-2xl">
                  {game.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>

              <button
                onClick={() => onAddToCart(game)}
                disabled={game.stock === 0}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold transition-all duration-200 ${
                  game.stock === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : inCart
                    ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 hover:scale-[1.02]'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Dans le panier
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
