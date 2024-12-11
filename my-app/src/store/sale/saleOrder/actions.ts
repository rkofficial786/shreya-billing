import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

export const createSaleOrder = createAsyncThunk(
  `/createSaleOrder`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/salesOrder", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllSaleOrder = createAsyncThunk(
  `/api/getAllSaleOrder`,
  async (payload: any) => {
    const { status, data } = await api.get(
      `/api/salesOrder?page=${payload.page}&search=${payload.search}`
    );
    return { status, data };
  }
);

export const deleteSaleOrder = createAsyncThunk(
  `/deleteSaleOrder`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/salesOrder/${param}`);
    return { status, data };
  }
);

export const updateSaleOrder = createAsyncThunk(
  `/updateSaleOrder`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/salesOrder/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getSaleOrderById = createAsyncThunk(
  `/getSaleOrderById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/salesOrder/${param}`);
    return { status, data };
  }
);
