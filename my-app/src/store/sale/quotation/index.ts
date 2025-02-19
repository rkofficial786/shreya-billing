import { createSlice } from "@reduxjs/toolkit";
import {
  conversionQuotation,
  createQuotation,
  deleteQuotation,
  getAllQuotation,
  getQuotationById,
  updateQuotation,
} from "./actions";

const initialState = {
  editQuotation: null,
};

export const QuotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditSaleInvoice: (state, action) => {
      state.editQuotation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuotationById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteQuotation.fulfilled, (state, { payload }) => {});
    builder.addCase(updateQuotation.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllQuotation.fulfilled, (state, { payload }) => {});
    builder.addCase(createQuotation.fulfilled, (state, { payload }) => {});
    builder.addCase(conversionQuotation.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setEditSaleInvoice } = QuotationSlice.actions;

export {
  getQuotationById,
  deleteQuotation,
  updateQuotation,
  getAllQuotation,
  createQuotation,
  conversionQuotation
};
export default QuotationSlice.reducer;
