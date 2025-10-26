export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  offerEndsAt: string;
  inStock: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  productlink: string;
  is_scratch: boolean;
  scratch_disc: number;
  specialcode?: string;
  specialdisc?: number;
  scratch_coupon?: string; // New field
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}
