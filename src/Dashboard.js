import React from "react";
import NoteAdministrationDisplay from "./NoteAdministrationDisplay";

export function Dashboard({
  noteAdministrator,
  categoryAdministrator,
  notify,
}) {
  return (
    <div>
      <div>
        <NoteAdministrationDisplay
          noteAdministrator={noteAdministrator}
          categoryAdministrator={categoryAdministrator}
          notify={notify}
        ></NoteAdministrationDisplay>
      </div>
    </div>
  );
}
