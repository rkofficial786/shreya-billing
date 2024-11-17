import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../apis/api";

// Create Payment Invoice
export const createPaymentInvoice = createAsyncThunk(
  `/createPaymentInvoice`,
  async (payload:any) => {
    const { status, data } = await api.post("/api/paymentIn", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status, data };
  }
);

// Get all Payment Invoices
export const getAllPaymentInvoices = createAsyncThunk(
  `/getAllPaymentInvoices`,
  async (payload:any) => {
    const { status, data } = await api.get(`/api/paymentIn?page=${payload.page}`);
    return { status, data };
  }
);

// Get single Payment Invoice by ID
export const getPaymentInvoiceById = createAsyncThunk(
  `/getPaymentInvoiceById`,
  async (id) => {
    const { status, data } = await api.get(`/api/paymentIn/${id}`);
    return { status, data };
  }
);

// Update Payment Invoice
export const updatePaymentInvoice = createAsyncThunk(
  `/updatePaymentInvoice`,
  async ({ id, data: updateData }:any) => {
    const { status, data } = await api.put(`/api/paymentIn/${id}`, updateData);
    return { status, data };
  }
);

// Soft delete Payment Invoice
export const deletePaymentInvoice = createAsyncThunk(
  `/deletePaymentInvoice`,
  async (id) => {
    const { status, data } = await api.delete(`/api/paymentIn/${id}`);
    return { status, data };
  }
);
