import { createSlice } from "@reduxjs/toolkit";
import { products } from "./action";

const initialState :any= {
  count: 0,
  theme: "#8344ff",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(products.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setCount, setTheme } = UserSlice.actions;

export { products };
export default UserSlice.reducer;
