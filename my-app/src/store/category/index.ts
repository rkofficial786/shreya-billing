import { createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./actions";

const initialState = {};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryById.fulfilled, (state, { payload }) => {
        // Handle get by ID success
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        // Handle get all success
      })
      .addCase(deleteCategory.fulfilled, (state, { payload }) => {
        // Handle delete success
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        // Handle update success
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        // Handle create success
      });
  },
});

export const { setInitialState } = categorySlice.actions;

export {
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
};

export default categorySlice.reducer;
