import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/users/usersSlice";
import listingsReducer from "./features/listings/listingsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    listings: listingsReducer,
  },
});

export default store;
