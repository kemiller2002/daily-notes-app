import React from "react";

export default function LocalDatastore() {
  this.getItem = function (name) {
    return { key: name, value: localStorage.getItem(name) };
  };

  this.setItem = function ({ key, value }) {
    localStorage.setItem(key, value);
  };
}
