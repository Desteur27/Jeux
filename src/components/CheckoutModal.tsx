import { X, CheckCircle2, CreditCard, Smartphone, Wallet, Loader2, ShieldCheck, Download, FileArchive, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CartItem, PaymentMethod, OrderItem, DownloadLink } from '@/types';
import { PAYMENT_METHODS } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  wave: Wallet,
  orange: Smartphone,
  moov: Smartphone,
  free: Smartphone,
};

type Step = 'form' | 'payment' | 'processing' | 'success';

export default function CheckoutModal({ isOpen, onClose, items, onOrderComplete }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [error, setError] = useState('');
  const [downloads, setDownloads] = useState<DownloadLink[]>([]);
  const [paidTotal, setPaidTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
      setError('');
      setDownloads([]);
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  const handleProceedToPayment = () => {
    if (!name.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePayment = async () => {
    setStep('processing');
    setError('');

    const orderItems: OrderItem[] = items.map((item) => ({
      game_id: item.game.id,
      title: item.game.title,
      price: item.game.price,
      qty: item.quantity,
    }));

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = `${supabaseUrl}/functions/v1/process-payment`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim() || undefined,
          items: orderItems,
          total,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Le paiement a échoué');
      }

      setDownloads(data.downloads || []);
      setPaidTotal(data.total || total);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setStep('payment');
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onOrderComplete();
    }
    onClose();
    setName('');
    setPhone('');
    setEmail('');
    setError('');
    setDownloads([]);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />

      <div
        className="relative bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-slate-950/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-slate-950/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step: Form */}
        {step === 'form' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Finaliser la commande</h2>
            <p className="text-slate-400 text-sm mb-6">Vos informations de contact</p>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Nom complet *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Jean Kouassi"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Téléphone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 07 00 00 00 00"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email (optionnel)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: jean@email.com"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-white/5">
              <h3 className="text-slate-300 text-sm font-medium mb-3">Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.game.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate pr-2">{item.game.title} x{item.quantity}</span>
                    <span className="text-white font-medium shrink-0">
                      {(item.game.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-white font-bold">Total</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-4 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleProceedToPayment}
              className="w-full mt-6 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              Continuer vers le paiement
            </button>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Mode de paiement</h2>
            <p className="text-slate-400 text-sm mb-6">Tous les paiements sont sécurisés via Wave</p>

            {/* Wave highlight banner */}
            <div className="mb-4 bg-gradient-to-r from-cyan-500/10 to-emerald-400/10 border border-cyan-400/20 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-cyan-400/20 rounded-lg p-2.5">
                <Wallet className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Compte Wave - Boutique de Desteur Game</p>
                <p className="text-slate-400 text-xs">Tous les revenus sont reversés sur ce compte Wave</p>
              </div>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method, index) => {
                const Icon = PAYMENT_ICONS[method.icon] || CreditCard;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left relative ${
                      isSelected
                        ? 'bg-emerald-400/10 border-emerald-400/50'
                        : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`rounded-lg p-2.5 ${isSelected ? 'bg-emerald-400/20' : 'bg-white/5'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {method.label}
                      </p>
                      <p className="text-slate-500 text-xs">{method.description}</p>
                    </div>
                    {index === 0 && (
                      <span className="absolute -top-2 right-3 bg-cyan-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    )}
                    <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                      isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-full h-full text-slate-950" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Paiement sécurisé. Vos données sont protégées. Téléchargement automatique après validation.
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-4 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setStep('form')}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handlePayment}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
              >
                Payer {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Traitement du paiement</h2>
            <p className="text-slate-400 text-sm">Validation de votre paiement Wave en cours...</p>
            <p className="text-slate-600 text-xs mt-2">Préparation de vos liens de téléchargement</p>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-emerald-400/10 rounded-full p-5 mb-4 animate-scale-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Paiement réussi !</h2>
              <p className="text-slate-400 text-sm max-w-sm">
                Votre paiement a été validé. Tous les revenus sont reversés sur le compte Wave de la Boutique de Desteur Game.
                Vos jeux sont prêts à être téléchargés au format ZIP.
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Montant payé</span>
                <span className="text-emerald-400 font-bold">{paidTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Articles</span>
                <span className="text-white">{items.length} jeu(x)</span>
              </div>
            </div>

            {/* Download links */}
            <div className="mb-6">
              <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                <FileArchive className="w-4 h-4 text-emerald-400" />
                Télécharger vos jeux (ZIP)
              </h3>
              <div className="space-y-2">
                {downloads.map((dl, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-800/50 border border-white/5 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-emerald-400/10 rounded-lg p-2 shrink-0">
                        <FileArchive className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{dl.title}</p>
                        <p className="text-slate-500 text-xs">Format ZIP {dl.quantity > 1 ? `x${dl.quantity}` : ''}</p>
                      </div>
                    </div>
                    {dl.download_url ? (
                      <a
                        href={dl.download_url}
                        download
                        className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs shrink-0">Lien indisponible</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
