import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

export const createSaleInvoice = createAsyncThunk(
  `/createItems`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/salesInvoice", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllSaleInvoice = createAsyncThunk(
  `/api/getAllSaleInvoice`,
  async (payload: any) => {
    const { status, data } = await api.get(
      `/api/salesInvoice?page=${payload.page}&search=${payload.search}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );
    return { status, data };
  }
);

export const deleteSaleInvoice = createAsyncThunk(
  `/deleteSaleInvoice`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/salesInvoice/${param}`);
    return { status, data };
  }
);

export const updateSaleInvoice = createAsyncThunk(
  `/updateSaleInvoice`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/salesInvoice/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getSaleInvoiceById = createAsyncThunk(
  `/getSaleInvoiceById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/salesInvoice/${param}`);
    return { status, data };
  }
);


export const conversionSaleInvoice = createAsyncThunk(
  `/convertionSaleInvoice`,
  async (param: any) => {
    const { status, data } = await api.patch(
      `/api/salesInvoice/status/${param.id}`,
      param.data
    );
    return { status, data };
  }
);
