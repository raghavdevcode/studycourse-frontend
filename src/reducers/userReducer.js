import { createSlice } from "@reduxjs/toolkit";

const istate = {
  isLoggedIn: false,
  pname: "Guest",
  uname: null,
  utype: null,
  uid: null,
  phone: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: istate,

  reducers: {
    login(state, action) {

      state.isLoggedIn = true;
      state.pname = action.payload.name;
      state.phone = action.payload.phone;
      state.uname = action.payload.username;
      state.utype = action.payload.usertype;
      state.uid = action.payload._id;

    },

    logout(state) {

      state.isLoggedIn = false;
      state.pname = "Guest";
      state.phone = null;
      state.uname = null;
      state.utype = null;
      state.uid = null;

    }
  }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;