import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GroceryItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  unit?: string;
  discountPrice?: number;
}

export interface GroceryState {
  items: GroceryItem[];
  featuredItems: GroceryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: GroceryState = {
  items: [],
  featuredItems: [],
  loading: false,
  error: null,
};

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<GroceryItem[]>) => {
      state.items = action.payload;
    },
    setFeaturedItems: (state, action: PayloadAction<GroceryItem[]>) => {
      state.featuredItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setItems, setFeaturedItems, setLoading, setError } = grocerySlice.actions;
export default grocerySlice.reducer;
