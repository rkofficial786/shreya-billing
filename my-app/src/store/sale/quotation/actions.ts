import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

export const createQuotation = createAsyncThunk(
  `/createQuotation`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/quotation",payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllQuotation = createAsyncThunk(
  `/api/getAllQuotation `,
  async () => {
    const { status, data } = await api.get("/api/quotation ");
    return { status, data };
  }
);

export const deleteQuotation = createAsyncThunk(
  `/deleteQuotation`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/quotation/${param}`);
    return { status, data };
  }
);

export const updateQuotation = createAsyncThunk(
  `/updateQuotation `,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/quotation/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getQuotationById = createAsyncThunk(
  `/getQuotationById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/quotation/${param}`);
    return { status, data };
  }
);
