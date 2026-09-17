import { Sparkles, Zap, ShieldCheck, Download } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export default function Hero({ onShopNow, onExplore }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/13071304/pexels-photo-13071304.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Gaming setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Nouveau catalogue 2024 disponible</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Les meilleurs jeux
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              au meilleur prix
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl mb-8 max-w-xl leading-relaxed animate-fade-in-up animation-delay-200">
            Naruto, Call of Duty, Injustice, FIFA, Minecraft et bien plus.
            Achetez en ligne et recevez vos jeux instantanément. Pas de livraison, pas d'attente.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in-up animation-delay-300">
            <button
              onClick={onShopNow}
              className="group bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/30 flex items-center gap-2"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Acheter maintenant
            </button>
            <button
              onClick={onExplore}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 hover:scale-105"
            >
              Explorer le catalogue
            </button>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-6 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="bg-emerald-400/10 rounded-lg p-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm">Livraison instantanée</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="bg-emerald-400/10 rounded-lg p-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="bg-emerald-400/10 rounded-lg p-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm">Paiement mobile money</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
