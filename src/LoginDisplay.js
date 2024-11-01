import React from "react";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";

export function LoginDisplay({ localDatastore }) {
  const [repo, updateRepo] = useState(
    localDatastore.getItem("repo").value || ""
  );
  const [username, updateUsername] = useState(
    localDatastore.getItem("username").value || ""
  );
  const [email, updateEmail] = useState(
    localDatastore.getItem("email").value || ""
  );
  const [token, updatePat] = useState(
    localDatastore.getItem("pat").value || ""
  );

  const handler = {
    get(target, prop, receiver) {
      return target[prop] || localDatastore.getItem(prop).value || "";
    },
  };

  const state = new Proxy({}, handler);

  const [storedData, update] = useState(state);

  function saveItems(e) {
    e.preventDefault();
    state.keys
      .map((key) => ({ key, value: state[key] }))
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
            value={username}
            label="User Name"
            onChange={(e) => updateUsername(e.target.value)}
          />
          <TextField
            id="name"
            value={username}
            label="Name"
            onChange={(e) => updateUsername(e.target.value)}
          />{" "}
          <TextField
            id="owner"
            value={state.owner}
            label="Owner"
            onChange={(e) => updateUsername(e.target.value)}
          />
          <TextField
            id="repo"
            value={repo}
            label="Github Repo"
            onChange={(e) => updateRepo(e.target.value)}
          />
          <TextField
            id="email"
            value={email}
            label="Email"
            onChange={(e) => updateEmail(e.target.value)}
          />
          <TextField
            id="pat"
            value={token}
            label="Personal Access Token"
            onChange={(e) => updatePat(e.target.value)}
          />
          <Button type="submit">Save</Button>
        </form>
      </section>
    </div>
  );
}
