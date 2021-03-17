import React from "react";

export const AuthContext = React.createContext({
  state: {},
  updateState: (data) => {},
  getUserDetails: (id, token) => {},
  login: (data) => {},
  logout: () => {},
});
