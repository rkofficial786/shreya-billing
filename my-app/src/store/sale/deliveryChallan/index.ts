import { createSlice } from "@reduxjs/toolkit";
import {
  createDeliveryChallan,
  deleteDeliveryChallan,
  getAllDeliveryChallan,
  getDeliveryChallanById,
  updateDeliveryChallan,
} from "./actions";

const initialState = {
  editDeliveryChallan: null,
};

export const DeliveryChallanSlice = createSlice({
  name: "deliveryChallan",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditSaleReturn: (state, action) => {
      state.editDeliveryChallan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getDeliveryChallanById.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(
      getAllDeliveryChallan.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(
      deleteDeliveryChallan.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(
      updateDeliveryChallan.fulfilled,
      (state, { payload }) => {}
    );
    builder.addCase(
      createDeliveryChallan.fulfilled,
      (state, { payload }) => {}
    );
  },
});

export const { setInitialState, setEditSaleReturn } =
  DeliveryChallanSlice.actions;

export {
  getDeliveryChallanById,
  getAllDeliveryChallan,
  deleteDeliveryChallan,
  updateDeliveryChallan,
  createDeliveryChallan,
};
export default DeliveryChallanSlice.reducer;
