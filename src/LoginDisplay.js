import React from "react";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";

export function LoginDisplay({ localDatastore }) {
  const handler = {
    get(target, prop, receiver) {
      if (typeof prop === "string" && !target[prop]) {
        target[prop] = localDatastore.getItem(prop).value || "";
      }

      return target[prop];
    },
  };

  const state = new Proxy({}, handler);

  const [storedData, update] = useState(state);

  function updateState(e) {
    const value = e.target.value;
    const name = e.target.name;

    update({ ...storedData, [name]: value });
  }

  function saveItems(e) {
    e.preventDefault();
    Object.keys(storedData)
      .map((key) => ({ key, value: storedData[key] }))
      .forEach(localDatastore.setItem);
  }

  return (
    <div>
      <h1>Credentials</h1>
      <section>
        <h2>Repo Access</h2>
        <form onSubmit={saveItems}>
          <TextField
            id="username"
            name="username"
            value={storedData.username}
            label="User Name"
            onChange={updateState}
          />
          <TextField
            id="name"
            name="name"
            value={storedData.name}
            label="Name"
            onChange={updateState}
          />{" "}
          <TextField
            id="owner"
            name="owner"
            value={storedData.owner}
            label="Owner"
            onChange={updateState}
          />
          <TextField
            id="repo"
            name="repo"
            value={storedData.repo}
            label="Github Repo"
            onChange={updateState}
          />
          <TextField
            id="email"
            name="email"
            value={storedData.email}
            label="Email"
            onChange={updateState}
          />
          <TextField
            id="pat"
            name="pat"
            value={storedData.token}
            label="Personal Access Token"
            onChange={updateState}
          />
          <Button type="submit">Save</Button>
        </form>
      </section>
    </div>
  );
}
