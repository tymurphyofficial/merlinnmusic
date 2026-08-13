"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  coverSrc: string;
  coverAlt: string;
};

type CartContextValue = {
  items: CartItem[];
  isReady: boolean;
  addItem: (item: CartItem) => boolean;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearCart: () => void;
};

const STORAGE_KEY = "merlinn-cart";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).id === "string" &&
        typeof (item as CartItem).title === "string",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const hasItem = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const addItem = useCallback((item: CartItem) => {
    let added = false;
    setItems((current) => {
      if (current.some((existing) => existing.id === item.id)) {
        return current;
      }
      added = true;
      // Digital downloads are unique — never increase quantity.
      return [...current, item];
    });
    return added;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      isReady,
      addItem,
      removeItem,
      hasItem,
      clearCart,
    }),
    [items, isReady, addItem, removeItem, hasItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
