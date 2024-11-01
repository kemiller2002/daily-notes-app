import React from "react";

function Setup() {
  return (
    <div className="setup-container">
      <label for="pat"></label>
      <input type="text" id="pat" className="pat" />
      <label for="repo"></label>
      <input type="text" id="repo" className="repo" />
    </div>
  );
}
