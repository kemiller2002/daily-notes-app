import React from "react";

function Setup() {
  return (
    <div className="setup-container">
      <label htmlFor="pat"></label>
      <input type="text" id="pat" className="pat" />
      <label htmlFor="repo"></label>
      <input type="text" id="repo" className="repo" />
    </div>
  );
}
