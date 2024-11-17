import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

// Create Category
export const createCategory = createAsyncThunk(
  `/createCategory`,
  async (payload: any) => {
    const { status, data } = await api.post("/api/category", payload);
    return { status, data };
  }
);

// Get all Categories
export const getAllCategories = createAsyncThunk(
  `/getAllCategories`,
  async () => {
    const { status, data } = await api.get(`/api/category`);
    return { status, data };
  }
);

// Get single Category by ID
export const getCategoryById = createAsyncThunk(
  `/getCategoryById`,
  async (id) => {
    const { status, data } = await api.get(`/api/category/${id}`);
    return { status, data };
  }
);

// Update Category
export const updateCategory = createAsyncThunk(
  `/updateCategory`,
  async ({ id, data: updateData }: any) => {
    const { status, data } = await api.put(`/api/category/${id}`, updateData);
    return { status, data };
  }
);

// Soft delete Category
export const deleteCategory = createAsyncThunk(
  `/deleteCategory`,
  async (id) => {
    const { status, data } = await api.delete(`/api/category/${id}`);
    return { status, data };
  }
);
