import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const createQuotedOrder = createAsyncThunk(
  `/createquoteorder`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/purchaseOrder", payload);
    return { status, data };
  }
);

export const getPendingQuotedOrder = createAsyncThunk(
  `/getQuoetedpendingorder`,
  async () => {
    const { status, data } = await api.get("/api/purchaseOrder");
    return { status, data };
  }
);

export const deletePendingOrder = createAsyncThunk(
  `/deletependingorder`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/purchaseOrder/${param}`);
    return { status, data };
  }
);

export const getPendingQuotedOrderById = createAsyncThunk(
  `/getPendingOrderById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/purchaseOrder/${param}`);
    return { status, data };
  }
);

export const updateQuotedOrder = createAsyncThunk(
  `/updateQuotedOrder`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/purchaseOrder/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const updateQuotedOrderStatus = createAsyncThunk(
  `/updateQuotedOrderStatus`,
  async (param: any) => {
    const { status, data } = await api.patch(
      `/api/purchaseOrder/${param.id}/status`,
      param.data
    );
    return { status, data };
  }
);
