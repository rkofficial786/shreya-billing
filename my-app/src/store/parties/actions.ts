import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

export const createParty = createAsyncThunk(`/party`, async (payload: any) => {
  const { status, data } = await api.post("/api/parties", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return { status, data };
});

export const getAllParties = createAsyncThunk(
  `/getlrEntrypendingorder`,
  async () => {
    const { status, data } = await api.get("/api/parties");
    return { status, data };
  }
);

export const deleteParty = createAsyncThunk(
  `/deletelrEntryorder`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/parties/${param}`);
    return { status, data };
  }
);

export const updateParty = createAsyncThunk(
  `/updateQuotedOrder`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/parties/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getPartyById = createAsyncThunk(
  `/getLrOrderById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/parties/${param}`);
    return { status, data };
  }
);

export const getPartyTransactionById = createAsyncThunk(
  `/getPartyTransactionById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/parties/${param}/transaction`);
    return { status, data };
  }
);
