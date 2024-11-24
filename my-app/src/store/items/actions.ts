import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";
import axios from "axios";


export const createItems = createAsyncThunk(
  `/createItems`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/items", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

export const getAllItems = createAsyncThunk(`/getAllItems`, async () => {
  const { status, data } = await api.get("/api/items");
  return { status, data };
});

export const getAllItemsFromWebsite = createAsyncThunk(`/getAllItemsFrom website`, async () => {
  const { status, data } = await axios.get("https://www.shreyacollection.in/api/products");
  return { status, data };
});


export const getAllItemsBySearch = createAsyncThunk(
  `/getAllItemsBySearch`,
  async (search:any) => {
    const { status, data } = await api.get(`/api/items?search=${search}`);
    return { status, data };
  }
);

export const deleteItems = createAsyncThunk(
  `/deleteItems`,
  async (param: any) => {
    const { status, data } = await api.delete(`/api/items/${param}`);
    return { status, data };
  }
);

export const updateItems = createAsyncThunk(
  `/updateItems`,
  async (param: any) => {
    const { status, data } = await api.put(
      `/api/items/${param.id}`,
      param.data
    );
    return { status, data };
  }
);

export const getItemsById = createAsyncThunk(
  `/getItemsById`,
  async (param: any) => {
    const { status, data } = await api.get(`/api/items/${param}`);
    return { status, data };
  }
);
