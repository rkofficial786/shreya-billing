import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserSlice from "./user";
import partySlice from "./parties";
import AuthSlice from "./auth";
import ItemsSlice from "./items";
import SaleInvoiceSlice from "./sale/saleInvoice";
import QuotationSlice from "./sale/quotation";
import SaleOrderSlice from "./sale/saleOrder";

const reducers = combineReducers({
  user: UserSlice,
  party: partySlice,
  auth: AuthSlice,
  items: ItemsSlice,
  saleInvoice: SaleInvoiceSlice,
  quotation: QuotationSlice,
  saleOrder: SaleOrderSlice,
});

const persistConfig = {
  key: "shreya-sw",
  storage,
  whitelist: ["user", "items", "saleInvoice", "party"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
