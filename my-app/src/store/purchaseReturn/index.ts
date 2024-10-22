import { createSlice } from "@reduxjs/toolkit";
import {
  createPurchaseReturn,
  deletePurchaseReturn,
  getPurchaseReturn,
  getPurchaseReturnById,
  updatePurchaseReturnStatus,
} from "./actions";

const initialState = {
  currentOrder: null,
};

export const PurchaseReturnSlice = createSlice({
  name: "purchaseReturn",
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
    builder.addCase(getPurchaseReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(createPurchaseReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(deletePurchaseReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(updatePurchaseReturnStatus.fulfilled, (state, { payload }) => {});
    builder.addCase(getPurchaseReturnById.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, saveCurrentOrder, clearDraftOrder } =
PurchaseReturnSlice.actions;

export { getPurchaseReturn, createPurchaseReturn, deletePurchaseReturn ,updatePurchaseReturnStatus ,getPurchaseReturnById};
export default PurchaseReturnSlice.reducer;
