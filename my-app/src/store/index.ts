import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserSlice from "./user";
import  partySlice  from "./parties";
import  AuthSlice  from "./auth";
import  ItemsSlice  from "./items";

const reducers = combineReducers({
 
  user: UserSlice,
  party:partySlice,
  auth:AuthSlice ,
  items:ItemsSlice
});

const persistConfig = {
  key: "shreya-sw",
  storage,
  whitelist: ["user","items"],
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
