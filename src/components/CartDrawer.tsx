import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (gameId: string) => void;
  onQuantityChange: (gameId: string, delta: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove, onQuantityChange, onCheckout }: CartDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const total = items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[55] animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-900 border-l border-white/10 z-[56] transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-bold text-lg">Mon Panier</h2>
            <span className="text-slate-500 text-sm">({items.length})</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-white/5 rounded-full p-6 mb-4">
                <ShoppingBag className="w-12 h-12 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium mb-1">Votre panier est vide</p>
              <p className="text-slate-600 text-sm">Ajoutez des jeux pour commencer</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.game.id}
                className="flex gap-3 bg-slate-800/50 rounded-xl p-3 border border-white/5 animate-fade-in"
              >
                <img
                  src={item.game.image_url || ''}
                  alt={item.game.title}
                  className="w-16 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1">
                    {item.game.title}
                  </h3>
                  <p className="text-emerald-400 text-sm font-bold">
                    {(item.game.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-slate-900 rounded-full px-1">
                      <button
                        onClick={() => onQuantityChange(item.game.id, -1)}
                        className="text-slate-400 hover:text-white p-1 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item.game.id, 1)}
                        className="text-slate-400 hover:text-white p-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.game.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-white font-bold text-2xl">
                {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              Passer la commande
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
