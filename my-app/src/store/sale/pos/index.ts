import { createSlice } from "@reduxjs/toolkit";
import {
  createPos,
  deletePos,
  getAllPos,
  getPosById,
  updatePos,
} from "./actions";

const initialState = {};

export const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getPosById.fulfilled, (state, { payload }) => {})

      .addCase(getAllPos.fulfilled, (state, { payload }) => {})

      .addCase(deletePos.fulfilled, (state, { payload }) => {})

      .addCase(updatePos.fulfilled, (state, { payload }) => {})

      .addCase(createPos.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState } = posSlice.actions;

export { getPosById, getAllPos, deletePos, updatePos, createPos };

export default posSlice.reducer;
