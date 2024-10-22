import { createSlice } from "@reduxjs/toolkit";
import {
  createQuotedOrder,
  deletePendingOrder,
  getPendingQuotedOrder,
  getPendingQuotedOrderById,
  updateQuotedOrder,
  updateQuotedOrderStatus,
} from "./actions";

const initialState = {
  currentOrder: null,
};

export const QuoteOrderSlice = createSlice({
  name: "quotedOrder",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    saveCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearDraftOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createQuotedOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(
      getPendingQuotedOrder.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(deletePendingOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(updateQuotedOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(
      updateQuotedOrderStatus.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(
      getPendingQuotedOrderById.fulfilled,
      (state, { payload }) => {}
    );
  },
});

export const { setInitialState, saveCurrentOrder, clearDraftOrder } =
  QuoteOrderSlice.actions;

export {
  createQuotedOrder,
  getPendingQuotedOrder,
  getPendingQuotedOrderById,
  deletePendingOrder,
  updateQuotedOrderStatus,
  updateQuotedOrder,
};
export default QuoteOrderSlice.reducer;
