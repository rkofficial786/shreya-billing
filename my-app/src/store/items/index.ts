import { createSlice } from "@reduxjs/toolkit";
import {
  createItems,
  deleteItems,
  getAllItems,
  getAllItemsBySearch,
  getAllItemsFromWebsite,
  getItemsById,
  updateItems,
} from "./actions";

const initialState = {
  editItem: null,
  items: [],
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
    builder.addCase(getAllItemsBySearch.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllItemsFromWebsite.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllItems.fulfilled, (state, { payload }) => {
      if (payload.data && payload.data.success) {
        state.items = payload.data.items;
      }
      else{
        state.items =[]
      }
    });
    builder.addCase(createItems.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setEditItem } = ItemsSlice.actions;

export {
  createItems,
  deleteItems,
  getAllItems,
  getItemsById,
  updateItems,
  getAllItemsBySearch,
  getAllItemsFromWebsite
};
export default ItemsSlice.reducer;
