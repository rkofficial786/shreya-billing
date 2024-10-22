import { createSlice } from "@reduxjs/toolkit";
import { createStockInGodown, deleteStockInGodown, getStockInGodown } from "./actions";


const initialState = {
  currentOrder: null,
};

export const StockInGodownSlice = createSlice({
  name: "stockInGodown",
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getStockInGodown.fulfilled, (state, { payload }) => {});
    builder.addCase(createStockInGodown.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteStockInGodown.fulfilled, (state, { payload }) => {});
  
  },
});

export const { setInitialState ,saveCurrentOrder ,clearDraftOrder } = StockInGodownSlice.actions;

export { getStockInGodown, createStockInGodown  ,deleteStockInGodown};
export default StockInGodownSlice.reducer;
