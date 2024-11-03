import { createSlice } from "@reduxjs/toolkit";
import { createSaleOrder, deleteSaleOrder, getAllSaleOrder, getSaleOrderById, updateSaleOrder } from "./actions";

const initialState = {
  editSaleOrder: null,
};

export const SaleOrderSlice = createSlice({
  name: "saleOrder",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditSaleInvoice: (state, action) => {
      state.editSaleOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSaleOrderById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteSaleOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(updateSaleOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllSaleOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(createSaleOrder.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setEditSaleInvoice } = SaleOrderSlice.actions;

export {
  getSaleOrderById,
  deleteSaleOrder,
  updateSaleOrder,
  getAllSaleOrder,
  createSaleOrder,
};
export default SaleOrderSlice.reducer;
