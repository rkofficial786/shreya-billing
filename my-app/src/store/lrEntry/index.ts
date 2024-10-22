import { createSlice } from "@reduxjs/toolkit";
import {
  createLrEntry,
  deletePendingLrEntry,
  getLrOrderById,
  getOrderByOrderNo,
  getPendingLrEntry,
  updateLrOrder,
  updateLrOrderStatus,
} from "./actions";

const initialState = {
  currentOrder: null,
};

export const LrEntrySlice = createSlice({
  name: "lrEntry",
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
    builder.addCase(createLrEntry.fulfilled, (state, { payload }) => {});
    builder.addCase(getPendingLrEntry.fulfilled, (state, { payload }) => {});
    builder.addCase(deletePendingLrEntry.fulfilled, (state, { payload }) => {});
    builder.addCase(getOrderByOrderNo.fulfilled, (state, { payload }) => {});
    builder.addCase(updateLrOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(updateLrOrderStatus.fulfilled, (state, { payload }) => {});
    builder.addCase(getLrOrderById.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, saveCurrentOrder, clearDraftOrder } =
  LrEntrySlice.actions;

export {
  createLrEntry,
  getPendingLrEntry,
  deletePendingLrEntry,
  getOrderByOrderNo,
  getLrOrderById,
  updateLrOrderStatus,
  updateLrOrder,
};
export default LrEntrySlice.reducer;
