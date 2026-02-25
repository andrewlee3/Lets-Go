'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { storage } from '@/utils/storage';
import { useAuth } from './auth-context';
import type { CartItem } from '@/types/cart.types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { menuId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.menuId === action.payload.menuId);
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.menuId === action.payload.menuId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.menuId !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((item) =>
          item.menuId === action.payload.menuId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { items: [] };
    
    case 'LOAD_CART':
      return { items: action.payload };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // localStorage 키: cart_{storeId}_{tableId}
  const getStorageKey = () => {
    if (!auth) return null;
    return `cart_${auth.storeId}_${auth.tableId}`;
  };

  // 장바구니 로드 (localStorage)
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    const savedCart = storage.get<CartItem[]>(storageKey);
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, [auth]);

  // 장바구니 저장 (localStorage)
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    storage.set(storageKey, state.items);
  }, [state.items, auth]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (menuId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuId });
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(menuId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
