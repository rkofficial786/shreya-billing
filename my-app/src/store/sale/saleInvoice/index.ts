import { createSlice } from "@reduxjs/toolkit";
import {
  conversionSaleInvoice,
  createSaleInvoice,
  deleteSaleInvoice,
  getAllSaleInvoice,
  getSaleInvoiceById,
  updateSaleInvoice,
} from "./actions";

const initialState = {
  editSaleInvoice: null,
};

export const SaleInvoiceSlice = createSlice({
  name: "saleInvoice",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditSaleInvoice: (state, action) => {
      state.editSaleInvoice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSaleInvoiceById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteSaleInvoice.fulfilled, (state, { payload }) => {});
    builder.addCase(updateSaleInvoice.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllSaleInvoice.fulfilled, (state, { payload }) => {});
    builder.addCase(createSaleInvoice.fulfilled, (state, { payload }) => {});
    builder.addCase(conversionSaleInvoice.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setEditSaleInvoice } = SaleInvoiceSlice.actions;

export {
  getSaleInvoiceById,
  deleteSaleInvoice,
  updateSaleInvoice,
  getAllSaleInvoice,
  createSaleInvoice,
  conversionSaleInvoice
};
export default SaleInvoiceSlice.reducer;
