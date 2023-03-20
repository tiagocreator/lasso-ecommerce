import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderHistory: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    storeOrders(state, action) {
      state.orderHistory = action.payload;
    },
  },
});

export const { storeOrders } = orderSlice.actions;

export const selectOrderHistory = (state) => state.orders.orderHistory;

export default orderSlice.reducer;
