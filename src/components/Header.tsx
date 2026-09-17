import { Search, ShoppingCart, Gamepad2, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, cartCount, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg leading-tight tracking-tight">
                Boutique de Desteur Game
              </h1>
              <p className="text-emerald-400 text-xs font-medium">Votre boutique gaming</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher un jeu (Naruto, FIFA, Call of Duty, Minecraft...)"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-2.5 sm:py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cart button */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 sm:px-4 py-2.5 transition-all duration-200 group shrink-0"
          >
            <ShoppingCart className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-white text-sm font-medium">Panier</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle (for logo) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-md border-t border-white/5 px-4 py-3">
          <h1 className="text-white font-bold text-lg">Boutique de Desteur Game</h1>
          <p className="text-emerald-400 text-xs">Votre boutique gaming</p>
        </div>
      )}
    </header>
  );
}
