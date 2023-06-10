/** @format */

import React from "react";
import { homeReducer } from "../reducers/homeReducer";
const HomeStateContext = React.createContext();
const HomeDispatchContext = React.createContext();

function HomeProvider({ children }) {
  const [stateHome, dispatchHome] = React.useReducer(homeReducer, {
    isLoading: false,
    post: [],
    catg: [],
    User: null,
    page: null,
    profilePost: [],
    profilePostPage: null,
    chatUserInfo: [],
    notificationUser: [],
    notificationToggler: false,
    filterEnable: false,
  });

  return (
    <HomeStateContext.Provider value={stateHome}>
      <HomeDispatchContext.Provider value={dispatchHome}>
        {children}
      </HomeDispatchContext.Provider>
    </HomeStateContext.Provider>
  );
}

function useHomeState() {
  const context = React.useContext(HomeStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}

function useHomeDispatch() {
  const context = React.useContext(HomeDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }
  return context;
}

export { HomeProvider, useHomeState, useHomeDispatch };
