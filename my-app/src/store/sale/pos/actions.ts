import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

// Create Pos
export const createPos = createAsyncThunk(
  `/createPos`,
  async (payload:any) => {
    const { status, data } = await api.post("/api/pos", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status, data };
  }
);

// Get all Pos entries
export const getAllPos = createAsyncThunk(
  `/api/getAllPos`,
  async (page) => {
    const { status, data } = await api.get(`/api/pos?page=${page}`);
    return { status, data };
  }
);

// Get single Pos by ID
export const getPosById = createAsyncThunk(
  `/getPosById`,
  async (id) => {
    const { status, data } = await api.get(`/api/pos/${id}`);
    return { status, data };
  }
);

// Update Pos
export const updatePos = createAsyncThunk(
  `/updatePos`,
  async ({ id, data: updateData }:any) => {
    const { status, data } = await api.put(`/api/pos/${id}`, updateData);
    return { status, data };
  }
);

// Soft delete Pos
export const deletePos = createAsyncThunk(
  `/deletePos`,
  async (id) => {
    const { status, data } = await api.delete(`/api/pos/${id}`);
    return { status, data };
  }
);
