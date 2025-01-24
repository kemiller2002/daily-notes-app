import React from "react";
import { reducer } from "./Reducer";
const applicationPrefix = "note-today";
function parse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
export default function LocalDatastore() {
  this.dataStoreLoginKey = "login-data-store";

  this.getItem = function (key) {
    return {
      key,
      value: [(x) => localStorage.getItem(x), parse].reduce(
        reducer,
        `${applicationPrefix}-${key}`
      ),
    };
  };

  this.setItem = function ({ key, value }) {
    localStorage.setItem(`${applicationPrefix}-${key}`, JSON.stringify(value));
  };
}
