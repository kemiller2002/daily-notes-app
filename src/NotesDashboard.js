import React from "react";
import { useState, useEffect } from "react";

import { reducer } from "./Reducer";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

function createNoteHeadlineDisplay(note) {
  return (
    <section key={note.id}>
      <h2>{note.title}</h2>
      <div>
        <div>{note.date}</div>
        <div>{note.followup}</div>
      </div>
      <div>{(note.categories || []).map((x) => x.name).join(", ")}</div>
      <div>{note.note}</div>
    </section>
  );
}

export default function NotesDashboard({ noteAdministrator }) {
  const [notes, updateNotes] = useState([]);
  const criteria = {
    yearsAndMonths: [new Date()],
  };

  useEffect(() => {
    noteAdministrator
      .getNotes(criteria)
      .then((x) => updateNotes([...notes, ...x]));
  }, []);

  return <div>{notes.map(createNoteHeadlineDisplay)}</div>;
}
