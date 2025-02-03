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
import SaleReturnSlice from "./sale/saleReturn";
import DeliveryChallanSlice from "./sale/deliveryChallan";
import posSlice from "./sale/pos";
import paymentInvoiceSlice from "./sale/paymentIn";
import categorySlice from "./category";

const reducers = combineReducers({
  user: UserSlice,
  party: partySlice,
  auth: AuthSlice,
  items: ItemsSlice,
  saleInvoice: SaleInvoiceSlice,
  quotation: QuotationSlice,
  saleOrder: SaleOrderSlice,
  saleReturn: SaleReturnSlice,
  deliveryChallan: DeliveryChallanSlice,
  pos: posSlice,
  paymentInvoice: paymentInvoiceSlice,
  category: categorySlice,
});

const persistConfig = {
  key: "shreya-sw",
  storage,
  whitelist: ["user", "items", "saleInvoice", "party", "auth"],
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
