import { createSlice } from "@reduxjs/toolkit";
import {
  conversionPaymentIn,
  createPaymentInvoice,
  deletePaymentInvoice,
  getAllPaymentInvoices,
  getPaymentInvoiceById,
  updatePaymentInvoice,
} from "./actions";

const initialState = {};

export const paymentInvoiceSlice = createSlice({
  name: "paymentInvoice",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentInvoiceById.fulfilled, (state, { payload }) => {
        // Handle get by ID success
      })
      .addCase(getAllPaymentInvoices.fulfilled, (state, { payload }) => {
        // Handle get all success
      })
      .addCase(deletePaymentInvoice.fulfilled, (state, { payload }) => {
        // Handle delete success
      })
      .addCase(updatePaymentInvoice.fulfilled, (state, { payload }) => {
        // Handle update success
      })
      .addCase(createPaymentInvoice.fulfilled, (state, { payload }) => {
        // Handle create success
      })
      .addCase(conversionPaymentIn.fulfilled, (state, { payload }) => {
        // Handle create success
      });
  },
});

export const { setInitialState } = paymentInvoiceSlice.actions;

export {
  getPaymentInvoiceById,
  getAllPaymentInvoices,
  deletePaymentInvoice,
  updatePaymentInvoice,
  createPaymentInvoice,
  conversionPaymentIn
};

export default paymentInvoiceSlice.reducer;
