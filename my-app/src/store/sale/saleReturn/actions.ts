import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

export const createSaleReturn = createAsyncThunk(
  `/createSaleReturn`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/salesReturn", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllSaleReturn = createAsyncThunk(
  `/api/getAllSaleReturn`,
  async (payload: any) => {
    const { status, data } = await api.get(
      `/api/salesReturn?page=${payload.page}&search=${payload.search}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );
    return { status, data };
  }
);

export const deleteSaleReturn = createAsyncThunk(
  `/deleteSaleReturn`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/salesReturn/${param}`);
    return { status, data };
  }
);

export const updateSaleReturn = createAsyncThunk(
  `/updateSaleReturn`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/salesReturn/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getSaleReturnById = createAsyncThunk(
  `/getSaleReturnById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/salesReturn/${param}`);
    return { status, data };
  }
);
