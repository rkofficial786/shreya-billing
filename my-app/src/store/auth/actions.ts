import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const loginAdmin = createAsyncThunk(
  `/loginAdmin`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/user/login", payload);
    return { status, data };
  }
);
export const forgetEmail = createAsyncThunk(
  `/forgetEmail`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/user/forgot", payload);
    return { status, data };
  }
);

export const forgetEmailVerify = createAsyncThunk(
  `/forgetEmailVerify`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/user/forgot-verify", payload);
    return { status, data };
  }
);
