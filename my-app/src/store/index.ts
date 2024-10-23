import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import CounterSlice from "./test";
import UserSlice from "./user";
import QuoteOrderSlice from "./quotedOrder";
import AuthSlice from "./auth";
import LrEntrySlice from "./lrEntry";
import StockInGodownSlice from "./stocknGodown";
import PurchaseReturnSlice from "./purchaseReturn";

const reducers = combineReducers({
  quotedOrder: QuoteOrderSlice,
  user: UserSlice,
  lrEntry: LrEntrySlice,
  auth: AuthSlice,
  stockInGodown: StockInGodownSlice,
  purchaseReturn: PurchaseReturnSlice,
});

const persistConfig = {
  key: "shreya-sw",
  storage,
  whitelist: ["user"],
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
