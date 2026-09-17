export interface Game {
  id: string;
  title: string;
  category: string;
  genre: string;
  price: number;
  description: string | null;
  image_url: string | null;
  rating: number;
  platform: string | null;
  featured: boolean;
  stock: number;
  download_url: string | null;
  created_at: string;
}

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface OrderItem {
  game_id: string;
  title: string;
  price: number;
  qty: number;
}

export type PaymentMethod = 'card' | 'wave' | 'orange_money' | 'moov_money' | 'free_money';

export interface PaymentMethodInfo {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { id: 'wave', label: 'Wave', description: 'Paiement instantané via Wave (recommandé)', icon: 'wave' },
  { id: 'card', label: 'Carte Bancaire', description: 'Visa, Mastercard, American Express', icon: 'card' },
  { id: 'orange_money', label: 'Orange Money', description: 'Transfert sécurisé Orange Money', icon: 'orange' },
  { id: 'moov_money', label: 'Moov Money', description: 'Paiement via Moov Money', icon: 'moov' },
  { id: 'free_money', label: 'Free Money', description: 'Transfert via Free Money', icon: 'free' },
];

export interface DownloadLink {
  title: string;
  download_url: string | null;
  quantity: number;
}

export interface PaymentResponse {
  success: boolean;
  order_id: string;
  total: number;
  payment_routed_to: string;
  downloads: DownloadLink[];
  error?: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'Tous les jeux', icon: 'Gamepad2' },
  { id: 'naruto', label: 'Naruto', icon: 'Swords' },
  { id: 'call_of_duty', label: 'Call of Duty', icon: 'Crosshair' },
  { id: 'injustice', label: 'Injustice', icon: 'Hand' },
  { id: 'sport', label: 'Sport', icon: 'Trophy' },
  { id: 'action', label: 'Action', icon: 'Zap' },
  { id: 'survival', label: 'Survie', icon: 'Tent' },
  { id: 'minecraft', label: 'Minecraft', icon: 'Box' },
  { id: 'racing', label: 'Course', icon: 'Car' },
] as const;
