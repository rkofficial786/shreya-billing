import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  token: null,

  user: {},
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

export const { setInitialState } = AuthSlice.actions;

export {
 
};
export default AuthSlice.reducer;
