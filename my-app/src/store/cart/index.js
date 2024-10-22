import { createSlice } from "@reduxjs/toolkit";
import { TICKET_BUY_TIME } from "../../constants/constants";

const initialState = {
  items: [],
  totalAmount: 0,
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    addToCart: (state, action) => {
      const { title, id, quantity, type, price, data } = action.payload;
      const existingItem = state?.items?.find(
        (item) => item.id === id && item.type === type
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalAmount = existingItem.quantity * existingItem.price;
      } else {
        state?.items?.push({
          title,
          id,
          quantity,
          type,
          price,
          data,
          totalAmount: quantity * price,
          addedTime: Date.now(),
          timeLeft: TICKET_BUY_TIME,
        });
      }
      state.totalAmount = state.items?.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
    },

    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },

    updateTicketTime: (state, action) => {
      const { id, type, timeLeft } = action.payload;
      const ticket = state?.items?.find(
        (item) => item.id === id && item.type === type
      );
      if (ticket) {
        ticket.timeLeft = timeLeft;
      }
    },

    removeFromCart: (state, action) => {
      const { id, type } = action.payload;
      const index = state?.items?.findIndex(
        (item) => item.id === id && item.type === type
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      }
      state.totalAmount = state.items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
    },

    removeAllCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  setInitialState,
  addToCart,
  removeFromCart,
  updateTicketTime,
  setTotalAmount,
  removeAllCart,
} = CartSlice.actions;

export default CartSlice.reducer;
