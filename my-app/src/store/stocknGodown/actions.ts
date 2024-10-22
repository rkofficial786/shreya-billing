import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const createStockInGodown= createAsyncThunk(
  `/createstockInGodown`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/stockInGodown", payload);
    return { status, data };
  }
);

export const getStockInGodown = createAsyncThunk(
  `/getstockInGodown`,
  async () => {
    const { status, data } = await api.get("/api/stockInGodown");
    return { status, data };
  }
);

export const deleteStockInGodown = createAsyncThunk(
  `/deletependingstockInGodown`,
  async (param:any) => {
    const { status, data } = await api.delete(`/api/stockInGodown/${param}`);
    return { status, data };
  }
);
