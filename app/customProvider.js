"use client";
import { store } from "@/feature/store";
import React from "react";
import { Provider } from "react-redux";

export const CustomProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
