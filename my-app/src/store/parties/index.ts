import { createSlice } from "@reduxjs/toolkit";
import {
  createParty,
  deleteParty,
  getAllParties,
  getPartyById,
  updateParty,
} from "./actions";

const initialState = {
  parties: [],
};

export const partySlice = createSlice({
  name: "party",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPartyById.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteParty.fulfilled, (state, { payload }) => {});
    builder.addCase(updateParty.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllParties.fulfilled, (state, { payload }) => {
      if (payload.status == 200) {
        if (payload.data.success) {
          state.parties = payload.data.parties;
        }
        else{
          state.parties=[]
        }
      }
    });
    builder.addCase(createParty.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState } = partySlice.actions;

export { getPartyById, deleteParty, updateParty, getAllParties, createParty };
export default partySlice.reducer;
