import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgetEmail, forgetEmailVerify, loginAdmin } from "./actions";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialState: () => initialState,
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.token = payload.data.token;
        state.user = payload.data.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      });

    // Forget Email
    builder
      .addCase(forgetEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgetEmail.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(forgetEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Password reset request failed";
      });

    // Email Verification
    builder
      .addCase(forgetEmailVerify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgetEmailVerify.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(forgetEmailVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Email verification failed";
      });
  },
});

export const { setInitialState, logout } = AuthSlice.actions;

export type { AuthState, User };
export default AuthSlice.reducer;
