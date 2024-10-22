import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const createPurchaseReturn = createAsyncThunk(
  `/createPurchaseReturn`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/purchaseReturn", payload);
    return { status, data };
  }
);

export const getPurchaseReturn = createAsyncThunk(
  `/getPurchaseReturn`,
  async () => {
    const { status, data } = await api.get("/api/purchaseReturn");
    return { status, data };
  }
);

export const deletePurchaseReturn = createAsyncThunk(
  `/deletependingPurchaseReturn`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/purchaseReturn/${param}`);
    return { status, data };
  }
);

export const updatePurchaseReturnStatus = createAsyncThunk(
  `/updatePruchaseStatus`,
  async (param: any) => {
    const { status, data } = await api.patch(
      `/api/purchaseReturn/${param.id}/status`,
      param.data
    );
    return { status, data };
  }
);



export const getPurchaseReturnById = createAsyncThunk(
  `/getPurchaseReturnById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/purchaseReturn/${param}`);
    return { status, data };
  }
);