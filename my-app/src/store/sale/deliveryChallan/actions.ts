import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

export const createDeliveryChallan = createAsyncThunk(
  `/createDeliveryChallan`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/deliveryChallan", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllDeliveryChallan = createAsyncThunk(`/api/getAllDeliveryChallan`, async (payload:any) => {
  const { status, data } = await api.get(`/api/deliveryChallan?page=${payload.page}&search=${payload.search}`);
  return { status, data };
});

export const deleteDeliveryChallan = createAsyncThunk(
  `/deleteDeliveryChallan`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/deliveryChallan/${param}`);
    return { status, data };
  }
);

export const updateDeliveryChallan = createAsyncThunk(
  `/updateDeliveryChallan`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/deliveryChallan/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getDeliveryChallanById = createAsyncThunk(
  `/getDeliveryChallanById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/deliveryChallan/${param}`);
    return { status, data };
  }
);
