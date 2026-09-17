import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, PackageOpen } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import GameCard from '@/components/GameCard';
import GameModal from '@/components/GameModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import { supabase } from '@/lib/supabase';
import type { Game, CartItem } from '@/types';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('id, title, category, genre, price, description, image_url, rating, platform, featured, stock, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching games:', error);
      } else if (data) {
        setGames(data as Game[]);
      }
      setLoading(false);
    };

    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    let result = games;

    if (activeCategory !== 'all') {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.genre.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query) ||
          (g.description?.toLowerCase().includes(query) ?? false) ||
          (g.platform?.toLowerCase().includes(query) ?? false)
      );
    }

    return result;
  }, [games, activeCategory, searchQuery]);

  const addToCart = useCallback((game: Game) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.game.id === game.id);
      if (existing) {
        return prev.map((item) =>
          item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { game, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((gameId: string) => {
    setCart((prev) => prev.filter((item) => item.game.id !== gameId));
  }, []);

  const changeQuantity = useCallback((gameId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.game.id === gameId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isInCart = useCallback((gameId: string) => cart.some((item) => item.game.id === gameId), [cart]);

  const handleOrderComplete = () => {
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero onShopNow={scrollToCatalog} onExplore={scrollToCatalog} />

      {/* Catalog */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultsCount={filteredGames.length}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
            <p className="text-slate-400">Chargement du catalogue...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white/5 rounded-full p-6 mb-4">
              <PackageOpen className="w-12 h-12 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">Aucun jeu trouvé</p>
            <p className="text-slate-600 text-sm">Essayez une autre recherche ou catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onAddToCart={addToCart}
                onViewDetails={setSelectedGame}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Boutique de Desteur Game</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Votre boutique de jeux vidéo en ligne. Achetez, payez, jouez. Sans livraison, sans attente.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-3">Catégories</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Naruto</li>
                <li>Call of Duty</li>
                <li>Injustice</li>
                <li>Sport (FIFA, FC 24, eFootball)</li>
                <li>Minecraft</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-3">Paiement</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="text-emerald-400 font-medium">Wave (compte principal)</li>
                <li>Carte bancaire</li>
                <li>Orange Money</li>
                <li>Moov Money</li>
                <li>Free Money</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-3">Pourquoi nous ?</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Activation instantanée</li>
                <li>Pas de livraison physique</li>
                <li>Paiement sécurisé</li>
                <li>Catalogue varié</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-600 text-sm">
              © 2024 Boutique de Desteur Game. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onAddToCart={(game) => {
          addToCart(game);
          setSelectedGame(null);
        }}
        inCart={selectedGame ? isInCart(selectedGame.id) : false}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onQuantityChange={changeQuantity}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}

export default App;
