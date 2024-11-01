import "./App.css";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route match="/">
        <Route index element={<Dashboard></Dashboard>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
