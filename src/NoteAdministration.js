import { createRailReducerFunction, reducer } from "./Reducer";

import { logToConsole } from "./Logging";
import { LoginTwoTone } from "@mui/icons-material";

import { createNumericalId } from "./Generators";

import { createNoteStructure, deserializeNote, serializeNote } from "./Note";

const railSystem = createRailReducerFunction(logToConsole);

const railSystemLogStep = (s, i) => {
  logToConsole(s, i);
  return railSystem(s, i);
};

const separator = "!!=======ENTRY SEPARATOR=======!!";

function formatNote(entryDate, note) {
  return [
    (x) => createNoteStructure(x.id, entryDate, x.title, x.categories, x.note),
    serializeNote,
  ].reduce(reducer, note);
}

function calculateFileName(date) {
  return `${date.getFullYear()}-${date.getMonth()}.txt`;
}

function appendData(document, data) {
  return [document, separator, data].filter(Boolean).join("\r\n");
}

/* Error here */
function processNotesFile(path) {
  return [
    this.communicator.getFileOrDefault,
    (x) => x.decodedContent,
    (x) => x.split(separator),
    (x) => x.map((y) => deserializeNote(y)),
  ].reduce(this.reducer, path);
}

export default function NoteAdministration(communicator) {
  const self = this;

  this.reducer = railSystem;

  const bProcessNotesFile = processNotesFile.bind({
    communicator,
    reducer: this.reducer,
  });

  this.getNotes = function ({ categories, yearsAndMonths }) {
    const monthFiles = yearsAndMonths.map((x) => calculateFileName(x));

    return monthFiles.map(bProcessNotesFile);
  };

  this.createNote = function (note) {
    const entryDate = new Date();

    return [
      (x) => ({ ...x, id: createNumericalId(entryDate) }),
      (x) => ({
        path: calculateFileName(entryDate),
        formattedNote: formatNote(entryDate, x),
      }),
      async (x) => ({
        file: await communicator.getFileOrDefault(x.path),
        ...x,
      }),
      (x) => ({ ...x, sha: x.file.sha, currentContent: x.file.content }),
      (x) => ({ ...x, decodedContent: x.file.decodedContent }),
      (x) => ({
        ...x,
        updatedContent: appendData(x.decodedContent, x.formattedNote),
      }),
      communicator.sendData,
    ].reduce(this.reducer || self.reducer, note);
  };
}
