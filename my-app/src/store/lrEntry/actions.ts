import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const createLrEntry = createAsyncThunk(
  `/lrEntry`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/lrEntry", payload);
    return { status, data };
  }
);

export const getPendingLrEntry = createAsyncThunk(
  `/getlrEntrypendingorder`,
  async () => {
    const { status, data } = await api.get("/api/lrEntry");
    return { status, data };
  }
);

export const deletePendingLrEntry = createAsyncThunk(
  `/deletelrEntryorder`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/lrEntry/${param}`);
    return { status, data };
  }
);

export const updateLrOrder = createAsyncThunk(
  `/updateQuotedOrder`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/lrEntry/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const updateLrOrderStatus = createAsyncThunk(
  `/updateLROrderStatus`,
  async (param: any) => {
    const { status, data } = await api.patch(
      `/api/lrEntry/${param.id}/status`,
      param.data
    );
    return { status, data };
  }
);

export const getOrderByOrderNo = createAsyncThunk(
  `/getOrderByOrderNo`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/lrEntry/${param}/get`);
    return { status, data };
  }
);


export const getLrOrderById = createAsyncThunk(
  `/getLrOrderById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/lrEntry/${param}`);
    return { status, data };
  }
);