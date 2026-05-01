import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  isOpen: boolean;
}

const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return { items: [], totalAmount: 0 };
  try {
    const saved = localStorage.getItem('cart');
    if (!saved) return { items: [], totalAmount: 0 };
    const parsed = JSON.parse(saved);
    return {
      items: parsed.items || [],
      totalAmount: Number(parsed.totalAmount) || 0
    };
  } catch (e) {
    return { items: [], totalAmount: 0 };
  }
};

const initialState: CartState = {
  ...loadCartFromStorage(),
  isOpen: false,
};

const saveCartToStorage = (state: { items: CartItem[]; totalAmount: number }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      totalAmount: state.totalAmount
    }));
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        if (existingItem.quantity < action.payload.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = state.items.reduce(
        (total: number, item) => total + item.price * item.quantity,
        0
      );
      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce(
        (total: number, item) => total + item.price * item.quantity,
        0
      );
      saveCartToStorage(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce(
        (total: number, item) => total + item.price * item.quantity,
        0
      );
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveCartToStorage(state);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } =
  cartSlice.actions;
export default cartSlice.reducer;
