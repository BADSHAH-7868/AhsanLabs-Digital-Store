import { CartItem } from '../types/product';

const CART_KEY = 'digital_store_cart';
const RATINGS_KEY = 'digital_store_ratings';
const VISITOR_KEY = 'digital_store_visitor_count';
const COMPARISON_KEY = 'digital_store_comparison';
const THEME_KEY = 'digital_store_theme';

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingIndex = cart.findIndex(i => i.productId === item.productId);

  if (existingIndex >= 0) {
    cart[existingIndex] = item;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
};

export const getRating = (productId: string): number => {
  const ratings = localStorage.getItem(RATINGS_KEY);
  const ratingsObj = ratings ? JSON.parse(ratings) : {};
  return ratingsObj[productId] || 0;
};

export const saveRating = (productId: string, rating: number): void => {
  const ratings = localStorage.getItem(RATINGS_KEY);
  const ratingsObj = ratings ? JSON.parse(ratings) : {};
  ratingsObj[productId] = rating;
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratingsObj));
};

export const getVisitorCount = (): number => {
  const count = localStorage.getItem(VISITOR_KEY);
  return count ? parseInt(count) : Math.floor(Math.random() * 10000) + 5000;
};

export const incrementVisitorCount = (): number => {
  const current = getVisitorCount();
  const newCount = current + 1;
  localStorage.setItem(VISITOR_KEY, newCount.toString());
  return newCount;
};

export const getComparisonList = (): string[] => {
  const list = localStorage.getItem(COMPARISON_KEY);
  return list ? JSON.parse(list) : [];
};

export const addToComparison = (productId: string): void => {
  const list = getComparisonList();
  if (!list.includes(productId) && list.length < 4) {
    list.push(productId);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(list));
  }
};

export const removeFromComparison = (productId: string): void => {
  const list = getComparisonList().filter(id => id !== productId);
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(list));
};

export const clearComparison = (): void => {
  localStorage.setItem(COMPARISON_KEY, JSON.stringify([]));
};

export const getTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(THEME_KEY);
  return (theme as 'light' | 'dark') || 'dark';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};
