import React from "react";
import { useState, useEffect } from "react";

import { reducer } from "./Reducer";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

export function createNoteHeadlineDisplay(note) {
  console.log(note);
  return (
    <section>
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
      .map((p) => p.then((x) => updateNotes([...notes, x])));
  }, []);

  return <div>{notes.map(createNoteHeadlineDisplay)}</div>;
}
