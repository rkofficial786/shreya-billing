import { createSlice } from "@reduxjs/toolkit";
import {
  createItems,
  deleteItems,
  getAllItems,
  getItemsById,
  updateItems,
} from "./actions";

const initialState = {
  editItem: null,
};

export const ItemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setEditItem: (state, action) => {
      state.editItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getItemsById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteItems.fulfilled, (state, { payload }) => {});
    builder.addCase(updateItems.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllItems.fulfilled, (state, { payload }) => {});
    builder.addCase(createItems.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState ,setEditItem } = ItemsSlice.actions;

export { createItems, deleteItems, getAllItems, getItemsById, updateItems , };
export default ItemsSlice.reducer;
