import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';
import groceryReducer, { GroceryState } from './slices/grocerySlice';
import cartReducer, { CartState } from './slices/cartSlice';

export interface RootState {
  auth: AuthState;
  grocery: GroceryState;
  cart: CartState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    grocery: groceryReducer,
    cart: cartReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
