import logo from "./logo.svg";
import "./App.css";
import { Dashboard } from "./Dashboard";

import { Routes, Route } from "react-router";

import Header from "./Header";
import Footer from "./Footer";
import Communicator from "./Communicator";
import { LoginDisplay } from "./LoginDisplay";

import LocalDatastore from "./LocalDatastore";
import CategoryAdministrationDisplay from "./CategoryAdministrationDisplay";
import CategoryAdministration from "./CategoryAdministration";
import NoteAdministration from "./NoteAdministration";
import { CircleNotificationsOutlined } from "@mui/icons-material";

import { publish } from "./Events";

import AdministrationDisplay from "./AdministrationDisplay";
import FollowUpDisplay from "./FollowUpDisplay";
import NotesDashboard from "./NotesDashboard";

import NoteDetailsDisplay from "./NoteDetailsDisplay";

function App() {
  const localDatastore = new LocalDatastore();

  const communicator = new Communicator(localDatastore);

  const categoryAdministrator = new CategoryAdministration(communicator);

  const noteAdministrator = new NoteAdministration(communicator);

  const displayMessage = (message) => {
    console.log(message);
  };

  const emitClick = () => {
    publish("globalClick");
  };

  return (
    <div onClick={emitClick}>
      <Header
        localDatastore={localDatastore}
        globalClickEventName={"globalClick"}
      />
      <div className="main">
        <div className="leftMain"></div>
        <div className="centerMain">
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <Dashboard
                    communicator={communicator}
                    categoryAdministrator={categoryAdministrator}
                    noteAdministrator={noteAdministrator}
                    notify={displayMessage}
                  ></Dashboard>
                }
              ></Route>
              <Route
                path="login"
                element={
                  <LoginDisplay localDatastore={localDatastore}></LoginDisplay>
                }
              ></Route>

              <Route
                path="categories"
                element={
                  <CategoryAdministrationDisplay
                    categoryAdministrator={categoryAdministrator}
                    notify={displayMessage}
                  ></CategoryAdministrationDisplay>
                }
                communicator={communicator}
              ></Route>
              <Route
                path="administration"
                element={<AdministrationDisplay></AdministrationDisplay>}
              ></Route>

              <Route
                path="follow-up"
                element={<FollowUpDisplay></FollowUpDisplay>}
              ></Route>
              <Route
                path="note"
                element={
                  <NotesDashboard
                    noteAdministrator={noteAdministrator}
                    categoryAdministrator={categoryAdministrator}
                  ></NotesDashboard>
                }
              ></Route>
              <Route
                path="note/:id"
                element={
                  <NoteDetailsDisplay
                    noteAdministrator={noteAdministrator}
                  ></NoteDetailsDisplay>
                }
              ></Route>
            </Route>
          </Routes>
        </div>
        <div className="rightMain"></div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
