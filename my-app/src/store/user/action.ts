import { createAsyncThunk } from "@reduxjs/toolkit";
import userApiEndpoints from "../../apis/user/config";
import userApi from "../../apis/user";

export const products = createAsyncThunk(
  `${userApiEndpoints.products}get`,
  async () => {
    const { status, data } = await userApi.products();
    return { status, data };
  }
);
