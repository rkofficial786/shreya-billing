import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  lastOperation: null,
};

export const CounterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
      state.lastOperation = "increment";
    },
    decrement: (state) => {
      state.count -= 1;
      state.lastOperation = "decrement";
    },
    reset: (state) => {
      state.count = 0;
      state.lastOperation = "reset";
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
      state.lastOperation = `increment by ${action.payload}`;
    },
    decrementByAmount: (state, action) => {
      state.count -= action.payload;
      state.lastOperation = `decrement by ${action.payload}`;
    },
    setCount: (state, action) => {
      state.count = action.payload;
      state.lastOperation = `set to ${action.payload}`;
    },
  },
});

export const {
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
  setCount,
} = CounterSlice.actions;

export default CounterSlice.reducer;
