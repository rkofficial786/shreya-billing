import { createSlice } from "@reduxjs/toolkit";
import {
  createSaleReturn,
  deleteSaleReturn,
  getAllSaleReturn,
  getSaleReturnById,
  updateSaleReturn,
} from "./actions";

const initialState = {
  editSaleReturn: null,
};

export const SaleReturnSlice = createSlice({
  name: "saleReturn",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditSaleReturn: (state, action) => {
      state.editSaleReturn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSaleReturnById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteSaleReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(updateSaleReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllSaleReturn.fulfilled, (state, { payload }) => {});
    builder.addCase(createSaleReturn.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setEditSaleReturn } = SaleReturnSlice.actions;

export {
  getSaleReturnById,
  deleteSaleReturn,
  updateSaleReturn,
  getAllSaleReturn,
  createSaleReturn,
};
export default SaleReturnSlice.reducer;
